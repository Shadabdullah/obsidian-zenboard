import { generateCalendarData, getEarliestHabitStartDate } from "@habits/utils";
import { DayData, HabitStats, StoredHabit } from "@habits/types";

export function getCalendarFromHabits(
  habits: StoredHabit[],
  stats: HabitStats,
): DayData[] {
  const startDate = getEarliestHabitStartDate(habits);
  return generateCalendarData(startDate, habits, stats);
}
