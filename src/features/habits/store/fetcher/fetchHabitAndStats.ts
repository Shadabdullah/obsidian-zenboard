import { getAllHabits, getAllStats } from "@habits/controller";
import { HabitStore } from "@habits/store";

export const fetchHabitsAndStats = async () => {
  const set = HabitStore.getState();
  set.setLoading(true);

  if (set.hasFetched) return;
  set.setHasFetched(true);

  try {
    const [habits, stats] = await Promise.all([getAllHabits(), getAllStats()]);
    set.setAllHabits(habits);
    set.setAllStats(stats);

    // Increment shouldUpdate to trigger analytics calculation
    set.setShouldUpdate(set.shouldUpdate + 1);

  } catch (e) {
    console.error("Error in fetchHabitsAndStats", e);
  } finally {
    set.setLoading(false);
  }
};
