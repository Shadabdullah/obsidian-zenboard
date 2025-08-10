import { AnalyticsData, DashboardData } from "@habits/types";

export const generateDashboardData = (
  analyticsData: AnalyticsData,
): DashboardData => {
  const data: DashboardData = { maxStreak: 0 };

  Object.values(analyticsData).forEach((habitData) => {
    const monthlyStreak = habitData.monthly?.currentStreak || 0;
    const overallStreak = habitData.overall?.currentStreak || 0;

    const bestStreak = Math.max(monthlyStreak, overallStreak);

    if (bestStreak > data.maxStreak) {
      data.maxStreak = bestStreak;
    }
  });

  return data;
};
