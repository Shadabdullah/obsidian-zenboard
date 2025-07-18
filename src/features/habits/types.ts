
// types/types.ts
export interface Task {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  completed: boolean;
  type: 'checkbox' | 'counter' | 'timer';
  counterValue?: number;
  targetCount?: number;
  timerDuration?: number;
  timerElapsed?: number;
  isTimerRunning?: boolean;
}

export interface DayData {
  date: Date;
  taskCount: number;
  isToday: boolean;
  completedTasks: number;
}
