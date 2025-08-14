import { getAllHabits, getAllStats } from "@habits/controller";
import { HabitStore } from "@habits/store";

export const fetchHabitsAndStats = async () => {
	const set = HabitStore.getState();

	if (set.hasFetched) return;

	set.setLoading(true);
	set.setHasFetched(true);

	try {
		const [habits, stats] = await Promise.all([getAllHabits(), getAllStats()]);
		set.setAllHabits(habits);
		set.setAllStats(stats);
		set.setShouldUpdate(set.shouldUpdate + 1);
	} catch (e) {
		console.error("Error in fetchHabitsAndStats", e);
	} finally {
		set.setLoading(false);
	}
};
