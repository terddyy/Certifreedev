import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bug, 
  X, 
  Trash2, 
  Download, 
  Activity, 
  AlertTriangle, 
  Info,
  Clock,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { 
  devDebugger, 
  getStats, 
  clearLogs, 
  exportLogs, 
  loadLogsFromStorage 
} from '@/lib/debugger';

interface DebugPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('logs');
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      loadLogs();
      updateStats();
      
      // Refresh every 2 seconds when open
      const interval = setInterval(() => {
        loadLogs();
        updateStats();
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const loadLogs = () => {
    const storedLogs = loadLogsFromStorage();
    setLogs(storedLogs);
  };

  const updateStats = () => {
    const currentStats = getStats();
    setStats(currentStats);
  };

  const handleClearLogs = () => {
    clearLogs();
    loadLogs();
    updateStats();
  };

  const handleExportLogs = () => {
    const exportData = exportLogs();
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-logs-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-destructive text-destructive-foreground';
      case 'warn': return 'bg-warning text-warning-foreground';
      case 'info': return 'bg-primary text-primary-foreground';
      case 'debug': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertTriangle className="h-3 w-3" />;
      case 'warn': return <AlertTriangle className="h-3 w-3" />;
      case 'info': return <Info className="h-3 w-3" />;
      case 'debug': return <Bug className="h-3 w-3" />;
      default: return <Info className="h-3 w-3" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            <CardTitle>Debug Panel</CardTitle>
            {stats && (
              <div className="flex gap-2">
                <Badge variant="destructive" className="text-xs">
                  {stats.errorCount} Errors
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {stats.warningCount} Warnings
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {stats.totalLogs} Total
                </Badge>
              </div>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="logs" className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                Logs
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-1">
                <BarChart3 className="h-3 w-3" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-1">
                <Info className="h-3 w-3" />
                Stats
              </TabsTrigger>
              <TabsTrigger value="actions" className="flex items-center gap-1">
                <Bug className="h-3 w-3" />
                Actions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="logs" className="h-full mt-4 flex flex-col">
              <div className="flex justify-between items-center mb-4 flex-shrink-0 px-6">
                <h3 className="text-sm font-medium">Recent Logs</h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleClearLogs}>
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleExportLogs}>
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="flex-1 max-h-full px-6">
                <div className="space-y-2 pb-4">
                  {logs.slice(-50).reverse().map((log, index) => (
                    <div key={index} className="p-3 border rounded-lg text-xs">
                      <div className="flex items-center gap-2 mb-1">
                        {getLogIcon(log.level)}
                        <Badge className={getLogLevelColor(log.level)}>
                          {log.level.toUpperCase()}
                        </Badge>
                        <span className="text-muted-foreground">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        {log.component && (
                          <Badge variant="outline" className="text-xs">
                            {log.component}
                          </Badge>
                        )}
                      </div>
                      <p className="font-medium mb-1">{log.message}</p>
                      {log.data && (
                        <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="performance" className="h-full mt-4 p-6 overflow-auto">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Performance Metrics</h3>
                {stats?.performanceMetrics?.length > 0 ? (
                  <div className="space-y-2">
                    {stats.performanceMetrics.map((metric: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{metric.name}</span>
                          <Badge variant="outline">
                            {metric.duration ? `${metric.duration.toFixed(2)}ms` : 'Running...'}
                          </Badge>
                        </div>
                        {metric.startTime && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Started: {new Date(metric.startTime).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No performance metrics available
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="stats" className="h-full mt-4 p-6 overflow-auto">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Debug Statistics</h3>
                {stats && (
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                          <span className="text-sm font-medium">Errors</span>
                        </div>
                        <p className="text-2xl font-bold text-destructive">
                          {stats.errorCount}
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-warning" />
                          <span className="text-sm font-medium">Warnings</span>
                        </div>
                        <p className="text-2xl font-bold text-warning">
                          {stats.warningCount}
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Total Logs</span>
                        </div>
                        <p className="text-2xl font-bold text-primary">
                          {stats.totalLogs}
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-secondary" />
                          <span className="text-sm font-medium">Active Timers</span>
                        </div>
                        <p className="text-2xl font-bold text-secondary">
                          {stats.performanceMetrics?.length || 0}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="actions" className="h-full mt-4 p-6 overflow-auto">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Debug Actions</h3>
                
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      console.log('Debug Info:', {
                        userAgent: navigator.userAgent,
                        viewport: { width: window.innerWidth, height: window.innerHeight },
                        url: window.location.href,
                        timestamp: new Date().toISOString(),
                      });
                    }}
                  >
                    <Info className="h-4 w-4 mr-2" />
                    Log Browser Info
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      console.log('Environment Variables:', {
                        NODE_ENV: import.meta.env.MODE,
                        VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Not Set',
                        VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not Set',
                      });
                    }}
                  >
                    <Info className="h-4 w-4 mr-2" />
                    Log Environment
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      localStorage.clear();
                      sessionStorage.clear();
                      console.log('Storage cleared');
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Storage
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      window.location.reload();
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reload Page
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}; 