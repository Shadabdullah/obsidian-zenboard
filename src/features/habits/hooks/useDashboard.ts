import { useState, useEffect } from "react";
import { DashboardData } from "@habits/types";
import { generateDashboardData } from "@habits/utils";
import useAnalytics from "./useAnalytics";

export const useDashboard = () => {
  const { loading, analyticsData } = useAnalytics();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );

  useEffect(() => {
    if (!analyticsData) return;
    const dashboard = generateDashboardData(analyticsData);
    setDashboardData(dashboard);
  }, [analyticsData]);

  return { dashboardData, loading };
};
