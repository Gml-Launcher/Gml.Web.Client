export const getSortDate = (dates: string[]) => {
  return dates.sort((a, b) => a.localeCompare(b));
};
