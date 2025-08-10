import { StoredHabit } from "@habits/types";

// Types of calendar data

export interface DayData {
  date: Date;
  taskCount: number;
  isToday: boolean;
  completedTasks: number;
}

// Data types for analytics

export interface monthlyData {
  monthlyData: number[][];
}

export interface overallData {
  overallData: number[];
}

export interface ProcessedHabitData {
  habit: StoredHabit;
  dataPeriod: monthlyData | overallData;
  completedDays: number;
  totalDays: number;
  percentage: number;
  currentStreak: number;
  longestStreak: number;
}

export interface AnalyticsData {
  [habitId: string]: {
    monthly: ProcessedHabitData;
    overall: ProcessedHabitData;
  };
}
