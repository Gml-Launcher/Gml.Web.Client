'use client';

import { useSentryStats, useSentrySummary } from '@/shared/hooks';
import { DASHBOARD_PAGES } from '@/shared/routes';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { SentryStats } from '@/widgets/sentry-stats';
import { SentryAnalytics } from '@/widgets/sentry-analytics';

export const SentryPage = () => {
  const { data: chartData, isLoading } = useSentryStats();

  const { data: summaryData, isLoading: summaryIsLoading } = useSentrySummary();

  return (
    <>
      <Breadcrumbs
        current={'Sentry'}
        breadcrumbs={[{ value: 'Главная', path: DASHBOARD_PAGES.HOME }]}
      />

      <Tabs defaultValue="stats">
        <TabsList className="grid grid-cols-2 w-fit">
          <TabsTrigger value="stats">Статистика</TabsTrigger>
          <TabsTrigger value="details">Аналитика</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <SentryStats chartData={chartData!} summaryData={summaryData!} />
        </TabsContent>
        <TabsContent value="details">
          <SentryAnalytics />
        </TabsContent>
      </Tabs>

      {/*<div className="flex gap-6 items-start">*/}
      {/*  {data &&*/}
      {/*    data.bugs.map(({ graphics, exception }) => (*/}
      {/*      <div key={exception}>*/}
      {/*        <SentryChart graphics={graphics} />*/}
      {/*      </div>*/}
      {/*    ))}*/}
      {/*</div>*/}
    </>
  );
};
