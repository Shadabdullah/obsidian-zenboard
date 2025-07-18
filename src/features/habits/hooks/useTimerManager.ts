// hooks/useTimerManager.ts
import { useEffect, useRef } from 'react';

export const useTimerManager = () => {
  const timerIntervals = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      timerIntervals.current.forEach(clearInterval);
    };
  }, []);

  return {
    get: () => timerIntervals.current,
    set: (taskId: string, interval: NodeJS.Timeout) => {
      timerIntervals.current.set(taskId, interval);
    },
    clear: (taskId: string) => {
      const interval = timerIntervals.current.get(taskId);
      if (interval) {
        clearInterval(interval);
        timerIntervals.current.delete(taskId);
      }
    }
  };
};
