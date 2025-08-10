// src/types/habitTypes.ts

// Shared base fields
interface BaseHabitData {
  name: string;
  selectedDays: string[];
  repeatability: string;
  repeatInterval?: number;
  startDate: string;
  endDate: string;
  color: string;
  icon?: string;
}

// Time-based habit
export interface TimeHabit extends BaseHabitData {
  trackingType: "time";
  timeValue: number;
  timerElapsed: number;
  isTimerRunning: boolean;
}

// Amount-based habit
export interface AmountHabit extends BaseHabitData {
  trackingType: "amount";
  targetCount: number;
  counterValue: number;
}

// Task-based habit (optional for now)
export interface TaskHabit extends BaseHabitData {
  trackingType: "task";
}

// Final discriminated union
export type HabitData = TimeHabit | AmountHabit | TaskHabit;

// Stored version (with ID and timestamp)
export type StoredHabit = HabitData & {
  id: string;
  createdAt: string;
};

export type HabitStatEntry =
  | { t: "task"; v: 0 | 1 }
  | { t: "time"; v: number }
  | { t: "amount"; v: number };

export type HabitStats = {
  [habitId: string]: {
    [date: string]: HabitStatEntry;
  };
};
