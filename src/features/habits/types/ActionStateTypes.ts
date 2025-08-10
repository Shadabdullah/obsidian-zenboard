import { StoredHabit, HabitStats, HabitData } from "@habits/types";

export type HabitStateSlice = {
  loading: boolean;
  hasFetched: boolean;
  shouldUpdate: number;
  allHabits: StoredHabit[];
  allStats: HabitStats;
  todayHabits: StoredHabit[];
  completedHabits: StoredHabit[];
  pendingHabits: StoredHabit[];
  setLoading: (loading: boolean) => void;
  setHasFetched: (value: boolean) => void;
  setShouldUpdate: (value: number) => void;
  setAllHabits: (
    habits: StoredHabit[] | ((prev: StoredHabit[]) => StoredHabit[]),
  ) => void;
  setAllStats: (stats: HabitStats | ((prev: HabitStats) => HabitStats)) => void;
};

// store/habit/actions/types.ts
export type HabitActionSlice = {
  recomputeDerivedState: () => void;
  incrementHabit: (id: string) => Promise<void>;
  taskDone: (id: string) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  addHabit: (habit: HabitData) => Promise<void>;
  //timerStart: (id: string) => void;
  // Add more as needed
  //
  resetTimer: (taskId: string) => void;
  toggleTimer: (taskId: string) => void;
};

export interface CoreHabitActionSlice {
  addHabit: (habitData: HabitData) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
}

export interface TaskActionSlice {
  taskDone: (id: string) => Promise<void>;
}

export interface AmountActionSlice {
  incrementHabit: (taskId: string) => Promise<void>;
}

export interface TimeActionSlice {
  initializeTimerElapsed: (taskId: string) => Promise<void>;
  resetTimer: (taskId: string) => Promise<void>;
  toggleTimer: (taskId: string) => Promise<void>;
  syncAllRunningTimers: () => Promise<void>;
}
