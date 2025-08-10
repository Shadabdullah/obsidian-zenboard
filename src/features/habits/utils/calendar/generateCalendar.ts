import { DayData, HabitStats, StoredHabit } from "@habits/types";
import { isHabitScheduledForToday, formatToYYMMDD } from "@habits/utils";

export const generateCalendarData = (
  startDate: Date,
  allHabits: StoredHabit[],
  allStats: HabitStats,
): DayData[] => {
  const today = new Date();
  const rangeEnd = new Date();
  rangeEnd.setFullYear(today.getFullYear() + 1);

  const days: DayData[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= rangeEnd) {
    const formattedDate = formatToYYMMDD(currentDate);

    let taskCount = 0;
    let completedTasks = 0;

    for (const habit of allHabits) {
      const isScheduled = isHabitScheduledForToday(habit, formattedDate);

      if (!isScheduled) continue;

      taskCount++;

      const statEntry = allStats?.[habit.id]?.[formattedDate];

      if (!statEntry) continue;

      let isCompleted = false;

      switch (habit.trackingType) {
        case "task":
          isCompleted = statEntry.v >= 1;
          break;
        case "amount":
          isCompleted = statEntry.v >= habit.targetCount;
          break;
        case "time":
          isCompleted = statEntry.v >= habit.timeValue;
          break;
      }

      if (isCompleted) {
        completedTasks++;
      }
    }

    days.push({
      date: new Date(currentDate),
      taskCount,
      completedTasks,
      isToday: currentDate.toDateString() === today.toDateString(),
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
};
