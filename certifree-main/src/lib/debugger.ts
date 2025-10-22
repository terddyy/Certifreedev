interface DebugConfig {
  enabled: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  showTimestamps: boolean;
  trackPerformance: boolean;
  logToConsole: boolean;
  logToStorage: boolean;
}

interface DebugLog {
  timestamp: string;
  level: string;
  message: string;
  data?: any;
  stack?: string;
  component?: string;
  action?: string;
}

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

class Debugger {
  private config: DebugConfig;
  private logs: DebugLog[] = [];
  private performanceMetrics: Map<string, PerformanceMetric> = new Map();
  private errorCount = 0;
  private warningCount = 0;

  constructor(config: Partial<DebugConfig> = {}) {
    this.config = {
      enabled: true,
      logLevel: 'debug',
      showTimestamps: true,
      trackPerformance: true,
      logToConsole: true,
      logToStorage: true,
      ...config,
    };

    // Initialize debugger
    this.init();
  }

  private init() {
    if (this.config.enabled) {
      this.log('info', 'Debugger initialized', { config: this.config });
      this.setupGlobalErrorHandler();
      
      if (this.config.trackPerformance) {
        this.setupPerformanceMonitoring();
      }

      if (typeof window !== 'undefined') {
        (window as any).debugger = this;
      }
    }
  }

  private setupGlobalErrorHandler() {
    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', (event) => {
        this.log('error', 'Unhandled Promise Rejection', {
          reason: event.reason,
          stack: event.reason?.stack,
        });
      });

      window.addEventListener('error', (event) => {
        this.log('error', 'Global Error', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error,
        });
      });
    }
  }

  private setupPerformanceMonitoring() {
    if (typeof window !== 'undefined') {
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        const startTime = performance.now();
        const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;
        
        try {
          const response = await originalFetch(...args);
          const endTime = performance.now();
          
          this.log('debug', 'API Call', {
            url,
            method: args[1]?.method || 'GET',
            status: response.status,
            duration: `${(endTime - startTime).toFixed(2)}ms`,
          });
          
          return response;
        } catch (error: any) {
          const endTime = performance.now();
          this.log('error', 'API Call Failed', {
            url,
            method: args[1]?.method || 'GET',
            error: error.message,
            duration: `${(endTime - startTime).toFixed(2)}ms`,
          });
          throw error;
        }
      };
    }
  }

  private shouldLog(level: string): boolean {
    const levels = { error: 0, warn: 1, info: 2, debug: 3 };
    const configLevel = levels[this.config.logLevel];
    const currentLevel = levels[level as keyof typeof levels];
    return currentLevel <= configLevel;
  }

  private formatTimestamp(): string {
    if (!this.config.showTimestamps) return '';
    return new Date().toISOString();
  }

  private createLogEntry(level: string, message: string, data?: any, meta?: any): DebugLog {
    const log: DebugLog = {
      timestamp: this.formatTimestamp(),
      level,
      message,
      data,
      component: meta?.component,
      action: meta?.action,
    };

    if (level === 'error' && data?.stack) {
      log.stack = data.stack;
    }

    return log;
  }

  log(level: string, message: string, data?: any, meta?: any) {
    if (!this.config.enabled || !this.shouldLog(level)) return;

    const logEntry = this.createLogEntry(level, message, data, meta);
    this.logs.push(logEntry);

    if (level === 'error') this.errorCount++;
    if (level === 'warn') this.warningCount++;

    if (this.config.logToConsole) {
      const prefix = this.config.showTimestamps ? `[${logEntry.timestamp}]` : '';
      const component = meta?.component ? `[${meta.component}]` : '';
      const action = meta?.action ? `[${meta.action}]` : '';
      
      const logMessage = `${prefix}${component}${action} ${message}`;
      
      switch (level) {
        case 'error':
          console.error(logMessage, data);
          break;
        case 'warn':
          console.warn(logMessage, data);
          break;
        case 'info':
          console.info(logMessage, data);
          break;
        case 'debug':
          console.debug(logMessage, data);
          break;
      }
    }

    if (this.config.logToStorage) {
      this.saveToStorage(logEntry);
    }
  }

  private saveToStorage(logEntry: DebugLog) {
    try {
      const existingLogs = localStorage.getItem('debugger_logs');
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      logs.push(logEntry);
      
      if (logs.length > 1000) {
        logs.splice(0, logs.length - 1000);
      }
      
      localStorage.setItem('debugger_logs', JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to save debug log to storage:', error);
    }
  }

  startTimer(name: string): void {
    if (!this.config.trackPerformance) return;
    
    this.performanceMetrics.set(name, {
      name,
      startTime: performance.now(),
    });
  }

  endTimer(name: string): number | null {
    if (!this.config.trackPerformance) return null;
    
    const metric = this.performanceMetrics.get(name);
    if (!metric) {
      this.log('warn', `Timer '${name}' not found`);
      return null;
    }

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;

    this.log('debug', `Performance: ${name}`, {
      duration: `${metric.duration.toFixed(2)}ms`,
    });

    this.performanceMetrics.delete(name);
    return metric.duration;
  }

  componentDebug(componentName: string) {
    return {
      log: (message: string, data?: any, action?: string) => {
        this.log('debug', message, data, { component: componentName, action });
      },
      error: (message: string, data?: any, action?: string) => {
        this.log('error', message, data, { component: componentName, action });
      },
      warn: (message: string, data?: any, action?: string) => {
        this.log('warn', message, data, { component: componentName, action });
      },
      info: (message: string, data?: any, action?: string) => {
        this.log('info', message, data, { component: componentName, action });
      },
      startTimer: (name: string) => {
        this.startTimer(`${componentName}:${name}`);
      },
      endTimer: (name: string) => {
        return this.endTimer(`${componentName}:${name}`);
      },
    };
  }

  inspect(data: any, label?: string): void {
    this.log('debug', `🔍 Inspection${label ? `: ${label}` : ''}`, {
      type: typeof data,
      isArray: Array.isArray(data),
      isNull: data === null,
      isUndefined: data === undefined,
      keys: typeof data === 'object' && data !== null ? Object.keys(data) : undefined,
      value: data,
    });
  }

  logState(componentName: string, state: any, action?: string): void {
    this.log('debug', `State Update: ${componentName}`, {
      state,
      action,
      timestamp: new Date().toISOString(),
    });
  }

  logApiCall(url: string, method: string, data?: any, response?: any, error?: any): void {
    if (error) {
      this.log('error', `API Call Failed: ${method} ${url}`, {
        requestData: data,
        error: error.message,
        status: error.status,
      });
    } else {
      this.log('debug', `API Call Success: ${method} ${url}`, {
        requestData: data,
        responseData: response,
      });
    }
  }

  logError(error: Error, errorInfo?: any, componentName?: string): void {
    this.log('error', 'React Error Boundary', {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      errorInfo,
      component: componentName,
    });
  }

  getStats() {
    return {
      totalLogs: this.logs.length,
      errorCount: this.errorCount,
      warningCount: this.warningCount,
      performanceMetrics: Array.from(this.performanceMetrics.values()),
      recentLogs: this.logs.slice(-10),
    };
  }

  clearLogs(): void {
    this.logs = [];
    this.errorCount = 0;
    this.warningCount = 0;
    this.performanceMetrics.clear();
    
    if (this.config.logToStorage) {
      localStorage.removeItem('debugger_logs');
    }
  }

  exportLogs(): string {
    return JSON.stringify({
      config: this.config,
      stats: this.getStats(),
      logs: this.logs,
    }, null, 2);
  }

  loadLogsFromStorage(): DebugLog[] {
    try {
      const logs = localStorage.getItem('debugger_logs');
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      this.log('error', 'Failed to load logs from storage', { error });
      return [];
    }
  }
}

export const devDebugger = new Debugger({
  enabled: import.meta.env.DEV,
  logLevel: 'debug',
  showTimestamps: true,
  trackPerformance: true,
  logToConsole: true,
  logToStorage: true,
});

export const log = devDebugger.log.bind(devDebugger);
export const error = (message: string, data?: any, meta?: any) => devDebugger.log('error', message, data, meta);
export const warn = (message: string, data?: any, meta?: any) => devDebugger.log('warn', message, data, meta);
export const info = (message: string, data?: any, meta?: any) => devDebugger.log('info', message, data, meta);
export const debug = (message: string, data?: any, meta?: any) => devDebugger.log('debug', message, data, meta);

export const startTimer = devDebugger.startTimer.bind(devDebugger);
export const endTimer = devDebugger.endTimer.bind(devDebugger);
export const componentDebug = devDebugger.componentDebug.bind(devDebugger);
export const inspect = devDebugger.inspect.bind(devDebugger);
export const logState = devDebugger.logState.bind(devDebugger);
export const logApiCall = devDebugger.logApiCall.bind(devDebugger);
export const logError = devDebugger.logError.bind(devDebugger);
export const getStats = devDebugger.getStats.bind(devDebugger);
export const clearLogs = devDebugger.clearLogs.bind(devDebugger);
export const exportLogs = devDebugger.exportLogs.bind(devDebugger);
export const loadLogsFromStorage = devDebugger.loadLogsFromStorage.bind(devDebugger);

export default devDebugger;

 