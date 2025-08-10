export const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const isValidDateRange = (startStr: string, endStr: string): boolean => {
  const start = parseLocalDate(startStr);
  const end = parseLocalDate(endStr);
  return end >= start;
};
