import {
  StoredHabit,
  HabitStats,
  HabitStateSlice,
  HabitStatEntry,
} from "@habits/types";
import {
  getTodayDate,
  isHabitScheduledForToday,
  createInitialStatEntry,
} from "@habits/utils";

import { updateHabitStat } from "@habits/controller";

function isHabitCompleted(habit: StoredHabit, stat?: HabitStatEntry): boolean {
  if (!stat) return false;

  switch (stat.t) {
    case "task":
      return stat.v === 1;
    case "amount":
      return habit.trackingType === "amount" && stat.v >= habit.targetCount;
    case "time":
      return habit.trackingType === "time" && stat.v >= habit.timeValue;
    default:
      return false;
  }
}

export const recomputeDerivedState = (
  allHabits: StoredHabit[],
  allStats: HabitStats,
  set: (partial: Partial<HabitStateSlice>) => void,
) => {
  const today = getTodayDate();
  const todayHabits = allHabits.filter((h) =>
    isHabitScheduledForToday(h, today),
  );
  const completed: StoredHabit[] = [];
  const pending: StoredHabit[] = [];

  if (!Array.isArray(allHabits) || allHabits.length === 0) {
    return;
  }

  if (
    !allStats ||
    typeof allStats !== "object" ||
    Object.keys(allStats).length === 0
  ) {
    return;
  }

  todayHabits.forEach((habit) => {
    let statEntry = allStats?.[habit.id]?.[today];

    // 🟡 If statEntry is undefined, initialize it
    if (!statEntry) {
      const defaultEntry = createInitialStatEntry(habit);
      statEntry = defaultEntry;

      if (!allStats[habit.id]) {
        allStats[habit.id] = {};
      }

      // ✅ Update local allStats object
      allStats[habit.id][today] = defaultEntry;
      // ✅ Save to DB (optional: debounce or throttle outside)
      updateHabitStat(habit.id, today, defaultEntry); // or createHabitStat()
    }

    const isCompleted = isHabitCompleted(habit, statEntry);

    (isCompleted ? completed : pending).push(habit);
  });


  set({
    todayHabits: todayHabits,
    completedHabits: completed,
    pendingHabits: pending,
  });
};
