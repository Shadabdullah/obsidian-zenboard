// store/habit/actions/amountAction.ts
import { StateCreator } from "zustand";
import { getTodayDate } from "@habits/utils";
import { updateHabitStat } from "@habits/controller";
import {
  HabitStatEntry,
  HabitActionSlice,
  HabitStateSlice,
  AmountActionSlice,
} from "@habits/types";

// Define the interface for amount actions

export const createAmountAction: StateCreator<
  HabitStateSlice & HabitActionSlice,
  [],
  [],
  AmountActionSlice // Specify what this slice returns
> = (set, get) => ({
  incrementHabit: async (taskId: string) => {
    const today = getTodayDate();
    const { allHabits, allStats, shouldUpdate } = get();



    let completedNow = false;

    // 1. Update allHabits with type safety
    const updatedHabits = allHabits.map((h) => {
      if (h.id === taskId) {
        // Type guard to check if habit has counterValue property
        if ("counterValue" in h) {

          const newValue = (h.counterValue || 0) + 1;

          // ✅ Check completion right here
          if (h.trackingType === "amount" && newValue >= h.targetCount) {
            completedNow = true;
          }

          return { ...h, counterValue: newValue };
        }
        // If it doesn't have counterValue, add it
        return { ...h, counterValue: 1 } as typeof h & { counterValue: number };
      }
      return h;
    });

    set({ allHabits: updatedHabits });

    // 2. Get previous stat value
    const prevEntry = allStats?.[taskId]?.[today];
    const prevValue = typeof prevEntry?.v === "number" ? prevEntry.v : 0;

    // 3. Create new stat entry
    const updatedStatEntry: HabitStatEntry = {
      t: "amount",
      v: prevValue + 1,
    };

    // 4. Update stats locally
    const updatedStats = {
      ...allStats,
      [taskId]: {
        ...(allStats[taskId] || {}),
        [today]: updatedStatEntry,
      },
    };

    set({ allStats: updatedStats });

    if (completedNow) {

      get().setShouldUpdate(get().shouldUpdate + 1);
    }
    // 5. Recompute derived state
    get().recomputeDerivedState();

    // 6. Persist to storage
    try {
      await updateHabitStat(taskId, today, updatedStatEntry);
    } catch (error) {
      console.error("Failed to update habit stat:", error);
      // Optionally revert the local changes on error
    }
  },
});
