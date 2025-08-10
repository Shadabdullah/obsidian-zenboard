import { HabitStats, AnalyticsData } from "@habits/types";
import { StoredHabit } from "@habits/types";
import {
  generateMonthlyRawData,
  generateYearlyRawData,
  calculateStreaks,
  calculateCompletionStats,
} from "@habits/utils/analytics";

/**
 * Main function to generate analytics data for all habits
 */
export const generateAnalyticsData = (
  habits: StoredHabit[],
  stats: HabitStats,
): AnalyticsData => {
  const data: AnalyticsData = {};

  habits.forEach((habit) => {
    const monthlyRawData = generateMonthlyRawData(habit, stats);
    const overallRawData = generateYearlyRawData(habit, stats);

    // Calculate stats for monthly data
    const monthlyFlatData = monthlyRawData.flat();
    const monthlyStats = calculateCompletionStats(monthlyFlatData);
    const monthlyStreaks = calculateStreaks(monthlyFlatData);

    // Calculate stats for overall data
    const overallStats = calculateCompletionStats(overallRawData);
    const overallStreaks = calculateStreaks(overallRawData);

    data[habit.id] = {
      monthly: {
        habit,
        dataPeriod: { monthlyData: monthlyRawData },
        completedDays: monthlyStats.completedDays,
        totalDays: monthlyStats.totalDays,
        percentage: monthlyStats.percentage,
        currentStreak: monthlyStreaks.current,
        longestStreak: monthlyStreaks.longest,
      },
      overall: {
        habit,
        dataPeriod: { overallData: overallRawData },
        completedDays: overallStats.completedDays,
        totalDays: overallStats.totalDays,
        percentage: overallStats.percentage,
        currentStreak: overallStreaks.current,
        longestStreak: overallStreaks.longest,
      },
    };
  });

  return data;
};
