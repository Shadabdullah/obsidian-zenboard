// src/utils/dateUtils.ts
export const getTodayDate = (): string => {
  return new Date().toISOString().split("T")[0]; // "2025-07-20"
};

// export const getDayOfWeek = (): string => {
//   const day = new Date().toLocaleDateString("en-US", { weekday: "short" }); // e.g. "Sun"
//   return day.slice(0, 2).toUpperCase(); // "SU"
// };



export const getDayOfWeek = (date?: Date | string): string => {
  let targetDate: Date;
  
  if (!date) {
    targetDate = new Date(); // Use current date if no parameter
  } else if (typeof date === 'string') {
    targetDate = new Date(date);
  } else {
    targetDate = date;
  }
  
  // Validate the date
  if (isNaN(targetDate.getTime())) {
    throw new Error('Invalid date provided to getDayOfWeek');
  }
  
  // Return 3-letter day abbreviation (Sun, Mon, Tue, etc.)
  return targetDate.toLocaleDateString("en-US", { weekday: "short" }).slice(0,2).toUpperCase();
};






// utils/timeUtils.ts
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export const formatToYYMMDD = (date: Date | null): string => {
  if (!date) return "Never";
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatLocalDate = (
  startDate: string | Date,
  endDate: string | Date | null,
): { formattedStart: string; formattedEnd: string } => {
  const parse = (input: string | Date | null): Date | null => {
    if (!input) return null;
    if (typeof input === "string") {
      if (input.toLowerCase() === "never") return null;
      const parsed = new Date(input);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    return input instanceof Date && !isNaN(input.getTime()) ? input : null;
  };

  const parsedStart = parse(startDate);
  const parsedEnd = parse(endDate);

  return {
    formattedStart: formatToYYMMDD(parsedStart),
    formattedEnd: formatToYYMMDD(parsedEnd),
  };
};

export function isStrictlyGreaterDateYYMMDD(a: string, b: string): boolean {
  const parse = (str: string) => {
    const [year, month, day] = str.split("-").map(Number);
    return new Date(year, month - 1, day); // month is 0-based
  };

  const dateA = parse(a);
  const dateB = parse(b);

  return dateA.getTime() > dateB.getTime();
}
