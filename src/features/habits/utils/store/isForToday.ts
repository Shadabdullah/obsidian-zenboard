import { StoredHabit } from "@habits/types";
import { getDayOfWeek } from "@habits/utils";

// Check if today's date is within the habit's active range
const isInValidDateRange = (
  startDate: string,
  forDate: string,
  endDate?: string,
): boolean => {
  const today = new Date(forDate);
  const start = new Date(startDate);
  
  if (isNaN(start.getTime())) return false; // invalid start date
  
  if (endDate?.toLowerCase() === "never") return today >= start;
  if (!endDate) return today >= start;
  
  const end = new Date(endDate);
  if (isNaN(end.getTime())) return false; // invalid end date
  
  return today >= start && today <= end;
};

// Calculate days since start date (inclusive - start date = 0 days)
const calculateDaysSinceStart = (start: string, current: string): number => {
  const startDate = new Date(start);
  const currentDate = new Date(current);
  
  if (isNaN(startDate.getTime()) || isNaN(currentDate.getTime())) return -1;
  
  const diffTime = currentDate.getTime() - startDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export const isHabitScheduledForToday = (
  habit: StoredHabit,
  dateStr: string,
): boolean => {
  // Check if date is in valid range first
  const isInRange = isInValidDateRange(
    habit.startDate,
    dateStr,
    habit.endDate,
  );
  if (!isInRange) return false;

  // Get day of week for the target date (not current date)
  const dayOfWeek = getDayOfWeek(dateStr); // Fixed: pass dateStr instead of using current date

  // Handle different repeatability types
  switch (habit.repeatability) {
    case "daily":
      return true;

    case "weekly":
      // Check if today's day of week is in selectedDays
      return habit.selectedDays?.includes(dayOfWeek) ?? false;

    case "every_few_days": {
      const interval = habit.repeatInterval ?? 1;
      if (interval <= 0) return false;
      
      const daysSinceStart = calculateDaysSinceStart(habit.startDate, dateStr);
      if (daysSinceStart < 0) return false; // Invalid dates
      
      return daysSinceStart % interval === 0;
    }

    case "monthly": {
      const interval = habit.repeatInterval ?? 1;
      if (interval <= 0) return false;
      
      const startDate = new Date(habit.startDate);
      const targetDate = new Date(dateStr);
      
      if (isNaN(startDate.getTime()) || isNaN(targetDate.getTime())) return false;
      
      // Check if it's the same day of month
      const sameDayOfMonth = targetDate.getDate() === startDate.getDate();
      if (!sameDayOfMonth) return false;
      
      // Calculate month difference
      const monthDiff =
        targetDate.getFullYear() * 12 +
        targetDate.getMonth() -
        (startDate.getFullYear() * 12 + startDate.getMonth());
      
      return monthDiff >= 0 && monthDiff % interval === 0;
    }

    default:
      // For custom schedules or other types, check selectedDays
      return habit.selectedDays?.includes(dayOfWeek) ?? false;
  }
};
