
export type TimerMessage =
  | { type: "START_TIMER"; taskId: string; pausedElapsed?: number; targetTime?: number }
  | { type: "STOP_TIMER"; taskId: string }
  | { type: "RESET_TIMER"; taskId: string };
