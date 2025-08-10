import { StoredHabit } from "@habits/types";

export function getEarliestHabitStartDate(habits: StoredHabit[]): Date {
  if (habits.length === 0) return new Date(); // fallback to today

  const dates = habits
    .map((h) => new Date(h.startDate))
    .filter((d) => !isNaN(d.getTime())); // filter out invalid dates

  return new Date(Math.min(...dates.map((d) => d.getTime())));
}
