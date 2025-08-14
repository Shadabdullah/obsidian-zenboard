import { StoredHabit, HabitStats } from "@habits/types";
import {
	formatToYYMMDD,
	isHabitCompleted,
	isHabitScheduledForToday,
} from "@habits/utils";

/**
 * Generates yearly data starting from habit.startDate with minimum 100 grids for nice analytics display
 */
export const generateYearlyRawData = (
	habit: StoredHabit,
	stats?: HabitStats,
): number[] => {
	const yearData: number[] = [];
	const currentDate = new Date();
	const habitStartDate = new Date(habit.startDate);
	const habitStats = stats?.[habit.id];

	// Calculate the number of days from habit start date to current date
	const daysSinceStart = Math.floor(
		(currentDate.getTime() - habitStartDate.getTime()) / (1000 * 60 * 60 * 24),
	);

	// Ensure we show at least 100 grids for better visual appeal
	// But cap at 365 days maximum
	const minGrids = 100;
	const maxGrids = 365;
	const actualDays = daysSinceStart + 1; // +1 to include the start date

	const totalGrids = Math.min(Math.max(actualDays, minGrids), maxGrids);

	for (let day = 0; day < totalGrids; day++) {
		const date = new Date(habitStartDate);
		date.setDate(habitStartDate.getDate() + day);

		const dateKey = formatToYYMMDD(date);
		const statEntry = habitStats?.[dateKey];
		const isSchedule = isHabitScheduledForToday(habit, dateKey);

		if (date > currentDate) {
			// Future dates - show as empty/no data (-1)
			yearData.push(-1);
		} else {
			if (isSchedule) {
				if (statEntry) {
					// Past/current dates with data
					yearData.push(isHabitCompleted(habit, statEntry));
				} else {
					// Past/current dates without data - treat as not completed
					yearData.push(0);
				}
			} else {
				yearData.push(-2);
			}
		}
	}

	return yearData;
};
