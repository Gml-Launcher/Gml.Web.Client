import { Graphic } from '@/shared/api/contracts/sentry/schemas';

export const getChartData = (graphic: Graphic[]) =>
  graphic.map((item) => ({
    month: item.month,
    count: item.count,
  }));
