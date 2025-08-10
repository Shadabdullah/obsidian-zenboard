import { StateCreator } from "zustand";
import { HabitStateSlice, HabitActionSlice } from "@habits/types";

export const createHabitStateSlice: StateCreator<
  HabitStateSlice & HabitActionSlice,
  [],
  [],
  HabitStateSlice
> = (set, get) => ({
  loading: true,
  hasFetched: false,
  shouldUpdate: 0,
  allHabits: [],
  allStats: {},
  todayHabits: [],
  completedHabits: [],
  pendingHabits: [],
  setLoading: (loading) => set({ loading }),
  setHasFetched: (val) => set({ hasFetched: val }),
  setShouldUpdate: (value) => set({ shouldUpdate: value }),
  setAllHabits: (habits) => {
    set((state) => ({
      allHabits:
        typeof habits === "function" ? habits(state.allHabits) : habits,
    }));
    // This will work now because the full store includes HabitActionSlice
    get().recomputeDerivedState();
  },
  setAllStats: (stats) => {
    set((state) => ({
      allStats: typeof stats === "function" ? stats(state.allStats) : stats,
    }));
    get().recomputeDerivedState();
  },
});
