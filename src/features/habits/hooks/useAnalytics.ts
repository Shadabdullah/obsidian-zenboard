import { useState, useEffect } from "react";
import { HabitStore, fetchHabitsAndStats } from "@habits/store";
import { AnalyticsData } from "@habits/types";
import { generateAnalyticsData } from "@habits/utils";

export const useAnalytics = () => {
  const { loading, allHabits, allStats, shouldUpdate } = HabitStore();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  // Fetch data once on mount
  useEffect(() => {
    fetchHabitsAndStats();
  }, []);

  // Recalculate analytics when shouldUpdate changes
  useEffect(() => {
    if (!allHabits?.length || !allStats) return;

    const analytics = generateAnalyticsData(allHabits, allStats);
    setAnalyticsData(analytics);
  }, [shouldUpdate]); // Back to just shouldUpdate dependency

  return { analyticsData, loading };
};

export default useAnalytics;
