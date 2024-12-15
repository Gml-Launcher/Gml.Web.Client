import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis } from 'recharts';

import { chartConfig } from './sentry-analytics-chart.config';
import { getChartData } from './sentry-analytics-chart.utils';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/ui/chart';
import { BaseSentryError } from '@/shared/api/contracts/sentry/schemas';

interface SentryAnalyticsChartProps {
  bug: BaseSentryError;
}

export const SentryAnalyticsChart = ({ bug }: SentryAnalyticsChartProps) => {
  return (
    <ResponsiveContainer height={72}>
      <ChartContainer config={chartConfig}>
        <AreaChart
          accessibilityLayer
          data={getChartData(bug.graphic)}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tick={false}
            tickLine={false}
            axisLine={false}
            tickFormatter={(data: string) => data.slice(0, 4)}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                }}
              />
            }
          />
          <defs>
            <linearGradient id="count" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(220 70% 50%)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(220 70% 50%)" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            dataKey="count"
            fill="url(#count)"
            fillOpacity={0.4}
            stroke="hsl(220 70% 50%)"
            stackId="a"
            legendType="none"
          />
        </AreaChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
};
