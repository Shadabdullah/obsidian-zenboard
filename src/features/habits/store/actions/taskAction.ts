import { StateCreator } from "zustand";
import { getTodayDate } from "@habits/utils";
import { updateHabitStat } from "@habits/controller";
import {
  HabitStatEntry,
  HabitStateSlice,
  HabitActionSlice,
  TaskActionSlice,
} from "@habits/types";

// Alternative with rollback on error
export const createTaskAction: StateCreator<
  HabitStateSlice & HabitActionSlice,
  [],
  [],
  TaskActionSlice
> = (set, get) => ({
  taskDone: async (id: string): Promise<void> => {
    const today = getTodayDate();
    const { allStats } = get();
    const originalStats = allStats;

    try {
      // Check if already done
      const alreadyDone = allStats?.[id]?.[today]?.v === 1;
      if (alreadyDone) return;

      // Create new stat entry
      const entry: HabitStatEntry = { t: "task", v: 1 };

      // Update stats locally
      const updatedStats = {
        ...allStats,
        [id]: {
          ...(allStats[id] || {}),
          [today]: entry,
        },
      };


      get().setShouldUpdate(get().shouldUpdate + 1);
      set({ allStats: updatedStats });
      get().recomputeDerivedState();

      // Persist to storage
      await updateHabitStat(id, today, entry);
    } catch (error) {
      console.error("Failed to mark task as done:", error);
      // Rollback on error
      set({ allStats: originalStats });
      get().recomputeDerivedState();
      throw error;
    }
  },
});

// Export the type for use in other files
export type { TaskActionSlice };
