// store/habit/actions/timeAction.ts
import { StateCreator } from "zustand";
import {
	HabitActionSlice,
	HabitStateSlice,
	TimeActionSlice,
	HabitStatEntry,
} from "@habits/types";

import { updateHabitStat } from "@habits/controller";
import { getTodayDate } from "@habits/utils";

// Global maps
const timerIntervals = new Map<string, NodeJS.Timeout>();
const lastSyncedTimestamps = new Map<string, number>();

export const createTimeAction: StateCreator<
	HabitStateSlice & HabitActionSlice,
	[],
	[],
	TimeActionSlice
> = (set, get) => ({
	// Initialize timer elapsed from saved stats (call this after loading habits/stats)
	initializeTimerElapsed: async (taskId: string) => {
		const { allStats, setAllHabits } = get();
		const today = getTodayDate();
		const savedElapsed = allStats?.[taskId]?.[today]?.v || 0;

		if (typeof savedElapsed === "number" && savedElapsed > 0) {
			setAllHabits((prev) =>
				prev.map((h) =>
					h.id === taskId && h.trackingType === "time"
						? { ...h, timerElapsed: savedElapsed }
						: h,
				),
			);
		}
	},

	toggleTimer: async (taskId: string) => {
		const {
			setAllStats,
			todayHabits,
			setAllHabits,
			recomputeDerivedState,
			allStats,
		} = get();

		const habit = todayHabits.find((h) => h.id === taskId);
		if (!habit || habit.trackingType !== "time") return;

		const isRunning = habit.isTimerRunning;
		const today = getTodayDate();

		if (isRunning) {
			// ⏸ Pause Timer
			const runningInterval = timerIntervals.get(taskId);
			if (runningInterval) {
				clearInterval(runningInterval);
				timerIntervals.delete(taskId);
			}

			// Get current habit state for final sync
			const currentState = get();
			const habitToPause = currentState.todayHabits.find(
				(h) => h.id === taskId,
			);

			if (habitToPause?.trackingType === "time") {
				const newElapsed = habitToPause.timerElapsed || 0;

				// Sync final time to database
				if (newElapsed > 0) {
					const updatedStat: HabitStatEntry = { t: "time", v: newElapsed };
					updateHabitStat(taskId, today, updatedStat);
					lastSyncedTimestamps.set(taskId, Date.now());
				}
			}

			// Update habit state to paused
			setAllHabits((prev) =>
				prev.map((h) =>
					h.id === taskId ? { ...h, isTimerRunning: false } : h,
				),
			);
		} else {
			// ▶️ Start Timer
			// First, get the last saved elapsed time from stats
			const savedElapsed = allStats?.[taskId]?.[today]?.v || 0;
			const currentElapsed = habit.timerElapsed || 0;

			// If the saved time is greater than current, sync the habit state first
			if (typeof savedElapsed === "number" && savedElapsed > currentElapsed) {
				setAllHabits((prev) =>
					prev.map((h) =>
						h.id === taskId ? { ...h, timerElapsed: savedElapsed } : h,
					),
				);
			}

			const interval = setInterval(() => {
				const currentState = get();
				const currentHabit = currentState.allHabits.find(
					(h) => h.id === taskId,
				);

				if (
					!currentHabit ||
					currentHabit.trackingType !== "time" ||
					!currentHabit.isTimerRunning
				) {
					// Timer was stopped externally, clean up
					const runningInterval = timerIntervals.get(taskId);
					if (runningInterval) {
						clearInterval(runningInterval);
						timerIntervals.delete(taskId);
					}
					return;
				}

				const newElapsed = (currentHabit.timerElapsed || 0) + 1;
				const targetTime = currentHabit.timeValue || 0;
				const shouldStop = targetTime > 0 && newElapsed >= targetTime;
				const now = Date.now();
				const lastSynced = lastSyncedTimestamps.get(taskId) || 0;

				// Update habit state first
				setAllHabits((prev) =>
					prev.map((h) => {
						if (h.id !== taskId || h.trackingType !== "time") return h;
						return {
							...h,
							timerElapsed: newElapsed,
							isTimerRunning: !shouldStop,
						};
					}),
				);

				// Update local stats state
				const updatedStat: HabitStatEntry = {
					t: "time",
					v: newElapsed,
				};

				setAllStats((prev) => ({
					...prev,
					[taskId]: {
						...(prev[taskId] || {}),
						[today]: updatedStat,
					},
				}));

				// Sync to database periodically or when stopping
				if (shouldStop || now - lastSynced >= 15000) {
					updateHabitStat(taskId, today, updatedStat);
					lastSyncedTimestamps.set(taskId, now);
				}

				// Stop timer if target reached
				if (shouldStop) {
					const runningInterval = timerIntervals.get(taskId);
					if (runningInterval) {
						clearInterval(runningInterval);
						timerIntervals.delete(taskId);
					}
				}
			}, 1000);

			// Store interval and start timer
			timerIntervals.set(taskId, interval);

			setAllHabits((prev) =>
				prev.map((h) => (h.id === taskId ? { ...h, isTimerRunning: true } : h)),
			);
		}

		recomputeDerivedState();
	},

	resetTimer: async (taskId: string) => {
		const { setAllStats, setAllHabits, recomputeDerivedState } = get();
		const today = getTodayDate();

		// Clear any running interval
		const runningInterval = timerIntervals.get(taskId);
		if (runningInterval) {
			clearInterval(runningInterval);
			timerIntervals.delete(taskId);
		}

		// Remove last synced timestamp
		lastSyncedTimestamps.delete(taskId);

		// Reset local habit state
		setAllHabits((prev) =>
			prev.map((h) =>
				h.id === taskId
					? {
						...h,
						isTimerRunning: false,
						timerElapsed: 0,
					}
					: h,
			),
		);

		// Reset local stats state
		const updatedStat: HabitStatEntry = {
			t: "time",
			v: 0,
		};

		setAllStats((prev) => ({
			...prev,
			[taskId]: {
				...(prev[taskId] || {}),
				[today]: updatedStat,
			},
		}));

		// Sync reset to database
		updateHabitStat(taskId, today, updatedStat);

		recomputeDerivedState();
	},
});

// Cleanup on logout/unload
export const clearAllTimers = () => {
	for (const interval of timerIntervals.values()) {
		clearInterval(interval);
	}
	timerIntervals.clear();
	lastSyncedTimestamps.clear();
};

// Export types - you'll need to add initializeTimerElapsed to your TimeActionSlice type
export type { TimeActionSlice };
