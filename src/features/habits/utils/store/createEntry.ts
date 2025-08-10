import { HabitData } from "@habits/types"; // Adjust the path if needed

export function createInitialStatEntry(habit: HabitData) {
  switch (habit.trackingType) {
    case "task":
      return { t: "task", v: 0 } as const;
    case "time":
      return { t: "time", v: 0 } as const;
    case "amount":
      return { t: "amount", v: 0 } as const;
  }
}
