import { useEffect, useRef } from 'react';
import { componentDebug, inspect } from '@/lib/debugger';

export const useDebug = (componentName: string) => {
  const debug = componentDebug(componentName);
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    debug.log(`Component rendered (${renderCount.current} times)`);
  });

  return {
    debug,
    inspect: (data: any, label?: string) => inspect(data, label),
    logState: (state: any, action?: string) => debug.log('State update', state, action),
    logProps: (props: any) => debug.log('Props received', props),
    logError: (error: any, context?: string) => debug.error('Error occurred', error, context),
    logInfo: (message: string, data?: any) => debug.info(message, data),
    startTimer: (name: string) => debug.startTimer(name),
    endTimer: (name: string) => debug.endTimer(name),
  };
}; 