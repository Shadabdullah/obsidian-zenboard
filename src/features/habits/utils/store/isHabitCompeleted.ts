import {} from "@habits/utils";

import { StoredHabit, HabitStatEntry } from "@habits/types";

/**
 * Determines if a habit is completed based on its tracking type and stats
 */
export const isHabitCompleted = (
  habit: StoredHabit,
  statEntry: HabitStatEntry,
): number => {
  if (!statEntry) return 0;

  switch (habit.trackingType) {
    case "task":
      return statEntry.t === "task" ? statEntry.v : 0;

    case "time":
      if (statEntry.t === "time" && "timeValue" in habit) {
        return statEntry.v >= habit.timeValue ? 1 : 0;
      }
      return 0;

    case "amount":
      if (statEntry.t === "amount" && "targetCount" in habit) {
        return statEntry.v >= habit.targetCount ? 1 : 0;
      }
      return 0;

    default:
      return 0;
  }
};
