'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { useEffect } from 'react';

import { SentryGraphic } from '@/shared/api/contracts/sentry/schemas';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/ui/chart';
import { getFormatDate } from '@/shared/lib/getFormatDate/getFormatDate';

interface SentryChartParams {
  graphics: SentryGraphic[];
}

const chartData = [
  { month: 'January', desktop: 0 },
  { month: 'February', desktop: 0 },
  { month: 'March', desktop: 0 },
  { month: 'April', desktop: 0 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 214 },
];
const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export const SentryChart = ({ graphics }: SentryChartParams) => {
  useEffect(() => {
    graphics.map(({ month, count }) =>
      console.log(getFormatDate(month).replace(', 00:00:00', '').replaceAll('.', '-')),
    );
  });
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" hideLabel />} />
        <Area
          dataKey="desktop"
          type="linear"
          fill="var(--color-desktop)"
          fillOpacity={0.4}
          stroke="var(--color-desktop)"
        />
      </AreaChart>
    </ChartContainer>
  );
};
