// store/habit/actions/amountAction.ts
import { StateCreator } from "zustand";
import {
  HabitStateSlice,
  HabitActionSlice,
  HabitData,
  CoreHabitActionSlice,
} from "@habits/types";

import { saveHabit, deleteHabitFromStorage } from "@habits/controller";

export const createCoreHabitAction: StateCreator<
  HabitStateSlice & HabitActionSlice,
  [],
  [],
  CoreHabitActionSlice
> = (set, get) => ({
  addHabit: async (habitData: HabitData): Promise<void> => {
    const { allHabits, allStats } = get();
    const originalHabits = allHabits;

    try {
      const { habit: newHabit, stat: newStat } = await saveHabit(habitData);

      set({
        allHabits: [...allHabits, newHabit],
        allStats: {
          ...allStats,
          [newHabit.id]: newStat, // only update one habit's stat
        },
      });

      get().recomputeDerivedState();
    } catch (error) {
      console.error("Failed to add habit:", error);
      // Rollback on error
      set({ allHabits: originalHabits });
      get().recomputeDerivedState();
      throw error;
    }
  },

  deleteHabit: async (id: string): Promise<void> => {
    const { allHabits, allStats } = get();
    const originalHabits = allHabits;
    const originalStats = allStats;

    try {
      // Update local state first
      const updatedHabits = allHabits.filter((habit) => habit.id !== id);
      const updatedStats = { ...allStats };
      delete updatedStats[id];

      set({ allHabits: updatedHabits, allStats: updatedStats });
      get().recomputeDerivedState();

      // Then delete from storage
      await deleteHabitFromStorage(id);
    } catch (error) {
      console.error("Failed to delete habit:", error);
      // Rollback on error
      set({ allHabits: originalHabits, allStats: originalStats });
      get().recomputeDerivedState();
      throw error;
    }
  },
});

// Export the type for use in other files
export type { CoreHabitActionSlice };
