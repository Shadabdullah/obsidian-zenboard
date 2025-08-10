/**
 * Generates monthly calendar data for current month
 */
import { StoredHabit, HabitStats } from "@habits/types";
import {
  formatToYYMMDD,
  isHabitScheduledForToday,
  isHabitCompleted,
  isStrictlyGreaterDateYYMMDD,
  getTodayDate,
} from "@habits/utils";
/**
 * Generates monthly calendar data for current month
 */
export const generateMonthlyRawData = (
  habit: StoredHabit,
  stats: HabitStats,
): number[][] => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const monthlyData: number[][] = [];
  let dayIndex = 0;

  // Generate 6 weeks to cover any month layout
  for (let week = 0; week < 6; week++) {
    const weekData: number[] = [];

    for (let day = 0; day < 7; day++) {
      if (week === 0 && day < firstDayOfMonth) {
        // Empty cells before month starts
        weekData.push(-1);
      } else if (dayIndex >= daysInMonth) {
        // Empty cells after month ends
        weekData.push(-1);
      } else {
        // Actual day - use real data if available
        const actualDay = dayIndex + 1;
        const dateKey = formatToYYMMDD(new Date(year, month, actualDay));



        const isSchedule = isHabitScheduledForToday(habit, dateKey);

        if (isSchedule) {
          const habitStats = stats?.[habit.id];
          const statEntry = habitStats?.[dateKey];

          if (statEntry) {
            weekData.push(isHabitCompleted(habit, statEntry));
          } else {
            // No data for this date - treat as not completed
            const isFuture = isStrictlyGreaterDateYYMMDD(
              dateKey,
              getTodayDate(),
            );

            if (isFuture) {
              weekData.push(-3);
            } else {
              weekData.push(1);
            }
          }
        } else {
          weekData.push(-2);
        }

        dayIndex++;
      }
    }
    monthlyData.push(weekData);

    // Break if we've covered all days in month
    if (dayIndex >= daysInMonth) break;
  }

  return monthlyData;
};
