import { useMemo, useState } from 'react';
import { BarChart2, Bug } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/ui/chart';
import { BaseSentryStats, BaseSentrySummary } from '@/shared/api/contracts/sentry/schemas';
import { SolveAllErrorsButton } from '@/widgets/sentry-stats/ui/SolveAllErrorsButton';

const chartConfig = {
  views: {
    label: 'Ошибок',
  },
  launcher: {
    label: 'Лаунчер',
    color: 'hsl(var(--chart-1))',
  },
  backend: {
    label: 'Панель Gml',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

interface SentryStatsProps {
  chartData: BaseSentryStats[];
  summaryData: BaseSentrySummary;
}

export const SentryStats = ({ chartData, summaryData }: SentryStatsProps) => {
  const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>('launcher');

  const getPercent = (num: number) => {
    const roundedNum = Math.round(num);
    if (roundedNum === 0) return `Не изменилось`;
    if (roundedNum > 0) return `На +${roundedNum}% больше обычного`;
    return `На ${roundedNum}% меньше обычного`;
  };

  const total = useMemo(() => {
    if (!chartData) return { launcher: 0, backend: 0 };

    return {
      launcher: chartData.reduce((acc, curr) => acc + (curr.launcher || 0), 0),
      backend: chartData.reduce((acc, curr) => acc + (curr.backend || 0), 0),
    };
  }, [chartData]);

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Количество ошибок</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData && summaryData.totalBugs}</div>
            {/*<p className="text-xs text-muted-foreground">на +20.1% больше обычного</p>*/}
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В этом месяце</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData && summaryData.bugsThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              {summaryData && getPercent(summaryData.percentageChangeMonth)}
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">За сегодня</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData && summaryData.bugsToday}</div>
            <p className="text-xs text-muted-foreground">
              {summaryData && getPercent(summaryData.percentageChangeDay)}
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Исправлено</CardTitle>
            <Bug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData && summaryData.fixBugs}</div>
            <p className="text-xs text-muted-foreground">
              {summaryData && getPercent(summaryData.percentageChangeDayFixBugs)}
            </p>
          </CardContent>
        </Card>

        {/*Graphic*/}
      </div>
      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>Статистика ошибок</CardTitle>
            <CardDescription>Демонстрация количество ошибок за последние 3 месяца</CardDescription>
          </div>
          <div className="flex">
            {['launcher', 'backend'].map((key) => {
              const chart = key as keyof typeof chartConfig;
              return (
                <button
                  key={chart}
                  data-active={activeChart === chart}
                  className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                  onClick={() => setActiveChart(chart)}
                >
                  <span className="text-xs text-muted-foreground">{chartConfig[chart].label}</span>
                  <span className="text-lg font-bold leading-none sm:text-3xl">
                    {total[key as keyof { launcher: string; backend: string }].toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            {/*accessibilityLayer*/}
            <BarChart
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="views"
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
              <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <SolveAllErrorsButton />
    </div>
  );
};
