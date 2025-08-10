// store/habitStore.ts
import { create } from "zustand";
import { HabitActionSlice, HabitStateSlice } from "@habits/types";
import { createHabitActionSlice, createHabitStateSlice } from "@habits/store";

export const HabitStore = create<HabitStateSlice & HabitActionSlice>()(
  (...args) => ({
    ...createHabitStateSlice(...args),
    ...createHabitActionSlice(...args),
  }),
);
