const colorRanges = [
  { max: 10, color: 'bg-green-600' },
  { max: 20, color: 'bg-green-500' },
  { max: 30, color: 'bg-green-400' },
  { max: 40, color: 'bg-yellow-600' },
  { max: 50, color: 'bg-yellow-500' },
  { max: 60, color: 'bg-yellow-400' },
  { max: 70, color: 'bg-orange-600' },
  { max: 80, color: 'bg-orange-500' },
  { max: 90, color: 'bg-red-600' },
  { max: 100, color: 'bg-red-500' },
];

export const getProgressColor = (value: number) => {
  for (let range of colorRanges) {
    if (value < range.max) {
      return range.color;
    }
  }
};
