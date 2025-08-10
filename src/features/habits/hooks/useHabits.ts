// src/hooks/useHabits.ts
import { HabitStore, fetchHabitsAndStats } from "@habits/store";
import { useEffect } from "react";

export const useHabits = () => {
  const {
    shouldUpdate,
    loading,
    todayHabits,
    completedHabits,
    pendingHabits,
    allStats,
    allHabits,
  } = HabitStore();

  useEffect(() => {
    fetchHabitsAndStats(); // now calling the external action
  }, []);

  return {
    shouldUpdate,
    loading,
    todayHabits,
    completedHabits,
    pendingHabits,
    allStats,
    allHabits,
  };
};
