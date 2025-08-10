// src/controllers/habitController.ts
//import {} from '../types/habitTypes';
import {
  createInitialStatEntry,
  getFromStorage,
  setToStorage,
} from "@habits/utils";

import {
  HabitData,
  StoredHabit,
  HabitStats,
  HabitStatEntry,
} from "@habits/types";

const HABITS_KEY = "habits";
const STATS_KEY = "stats";

export const getAllHabits = async (): Promise<StoredHabit[]> => {
  const habits = await getFromStorage<StoredHabit[]>(HABITS_KEY);
  return habits || [];
};

export const saveHabit = async (
  habit: HabitData,
): Promise<{
  habit: StoredHabit;
  stat: { [date: string]: HabitStatEntry };
}> => {
  const habits = await getAllHabits();

  const newHabit: StoredHabit = {
    ...habit,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  const cleanedHabit = Object.fromEntries(
    Object.entries(newHabit).filter(([_, v]) => v !== undefined),
  );

  await setToStorage(HABITS_KEY, [...habits, cleanedHabit]);

  // Initialize stats
  const stats = (await getFromStorage<HabitStats>(STATS_KEY)) || {};
  const entry = createInitialStatEntry(newHabit);

  stats[newHabit.id] = {
    [newHabit.startDate]: entry,
  };

  await setToStorage(STATS_KEY, stats);

  return {
    habit: newHabit,
    stat: {
      [newHabit.startDate]: entry,
    },
  };
};

export const updateHabit = async (
  id: string,
  updatedData: HabitData,
): Promise<void> => {
  const habits = await getAllHabits();
  const updated = habits.map((h) =>
    h.id === id ? { ...h, ...updatedData } : h,
  );
  await setToStorage(HABITS_KEY, updated);
};

export const deleteHabitStats = async (habitId: string): Promise<void> => {
  const stats = await getFromStorage<HabitStats>(STATS_KEY);
  if (!stats || !stats[habitId]) return;

  delete stats[habitId];

  await setToStorage(STATS_KEY, stats);
};

export const deleteHabitFromStorage = async (id: string): Promise<void> => {
  const habits = await getAllHabits();
  const filtered = habits.filter((h) => h.id !== id);
  await setToStorage(HABITS_KEY, filtered);

  await deleteHabitStats(id);
};

export async function updateHabitStat(
  habitId: string,
  date: string,
  entry: HabitStatEntry,
) {
  const stats = (await getFromStorage<HabitStats>(STATS_KEY)) || {};
  const habitStats = stats[habitId] || {};
  habitStats[date] = entry;
  stats[habitId] = habitStats;
  await setToStorage(STATS_KEY, stats);
}

export const getAllStats = async (): Promise<HabitStats> => {
  const stats = await getFromStorage<HabitStats>(STATS_KEY);
  return stats || {};
};
