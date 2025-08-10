export const calculateStreaks = (
  completionData: number[],
): { current: number; longest: number } => {
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Calculate current streak from the end
  for (let i = completionData.length - 1; i >= 0; i--) {
    const day = completionData[i];

    if (day === 1) {
      currentStreak++;
    } else if (day === 0) {
      break; // streak ends on first missed habit
    } else if (day < 0) {
      continue; // ignore -1, -2, -3
    }
  }

  // Calculate longest streak overall
  for (const day of completionData) {
    if (day === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else if (day === 0) {
      tempStreak = 0;
    } else if (day < 0) {
      // ignore
      continue;
    }
  }

  return { current: currentStreak, longest: longestStreak };
};
