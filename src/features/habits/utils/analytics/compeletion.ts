/**
 * Calculates completion statistics from data array
 */
export const calculateCompletionStats = (
  data: number[],
): {
  completedDays: number;
  totalDays: number;
  percentage: number;
} => {
  const flatData = data.flat();
  const completedDays = flatData.filter((day) => day === 1).length;
  const totalDays = flatData.filter(
    (day) => day !== -1 && day !== -2 && day !== -3,
  ).length;
  const percentage =
    totalDays > 0 ? Math.floor((completedDays / totalDays) * 100) : 0;

  return { completedDays, totalDays, percentage };
};
