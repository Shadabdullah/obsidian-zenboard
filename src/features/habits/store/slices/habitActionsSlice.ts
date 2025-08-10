import { StateCreator } from "zustand";
import {
  createAmountAction,
  createTaskAction,
  createCoreHabitAction,
  createTimeAction,
} from "@habits/store/actions";
import { recomputeDerivedState } from "../helpers/recompute";
import { HabitActionSlice, HabitStateSlice } from "@habits/types";

export const createHabitActionSlice: StateCreator<
  HabitStateSlice & HabitActionSlice,
  [],
  [],
  HabitActionSlice
> = (set, get, store) => {
  // Get all the individual action slices
  const amountActions = createAmountAction(set, get, store);
  const taskActions = createTaskAction(set, get, store);
  const timeActions = createTimeAction(set, get, store);
  const coreActions = createCoreHabitAction(set, get, store);

  return {
    // Add the central recomputeDerivedState method
    recomputeDerivedState: () => {
      const { allHabits, allStats } = get();
      recomputeDerivedState(allHabits, allStats, set);
    },

    // Spread all the action creators
    ...amountActions,
    ...taskActions,
    ...timeActions,
    ...coreActions,
  };
};
