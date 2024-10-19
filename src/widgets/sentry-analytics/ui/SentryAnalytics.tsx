import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Separator } from "@/shared/ui/separator";
import { useSentryFilterErrorsList } from "@/shared/hooks";
import { useEffect, useState } from "react";
import { AnalyticsInterval, ProjectTypeEnum } from "@/shared/enums";
import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/shared/lib/utils";
import { DatePickerWithRange } from "@/shared/ui/data-range-picker";

export const SentryAnalytics = () => {
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const { data, mutate, isPending } = useSentryFilterErrorsList();

  const [tab, setTab] = useState<AnalyticsInterval>(AnalyticsInterval.ANALYTICS_INTERVAL_WEAK);
  const handleChangeTab = (currentTab: string) => setTab(currentTab as AnalyticsInterval);

  useEffect(() => {
    const todayDate = new Date();

    const year = todayDate.getFullYear();
    const month = todayDate.getMonth();

    const dataFromWeak = startOfWeek(todayDate, { weekStartsOn: 1 });
    const dataToWeak = endOfWeek(todayDate, { weekStartsOn: 1 });

    const dataFromMonth = startOfMonth(todayDate);
    const dataToMonth = endOfMonth(todayDate);

    const dataFromYear = startOfYear(todayDate);
    const dataToYear = endOfYear(todayDate);

    switch (tab) {
      case AnalyticsInterval.ANALYTICS_INTERVAL_WEAK:
        mutate({
          projectType: ProjectTypeEnum.All,
          dateFrom: format(dataFromWeak, "yyyy-MM-dd"),
          dateTo: format(dataToWeak, "yyyy-MM-dd"),
        });
        break;
      case AnalyticsInterval.ANALYTICS_INTERVAL_MONTH:
        mutate({
          projectType: ProjectTypeEnum.All,
          dateFrom: format(dataFromMonth, "yyyy-MM-dd"),
          dateTo: format(dataToMonth, "yyyy-MM-dd"),
        });
        break;
      case AnalyticsInterval.ANALYTICS_INTERVAL_YEAR:
        mutate({
          projectType: ProjectTypeEnum.All,
          dateFrom: format(dataFromYear, "yyyy-MM-dd"),
          dateTo: format(dataToYear, "yyyy-MM-dd"),
        });
        break;
      case AnalyticsInterval.ANALYTICS_INTERVAL_GAP:
        if (date?.from && date.to) {
          mutate({
            projectType: ProjectTypeEnum.All,
            dateFrom: format(date.from, "yyyy-MM-dd"),
            dateTo: format(date.to, "yyyy-MM-dd"),
          });
        }
        break;
    }
  }, [mutate, tab, date]);

  return (
    <>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <Tabs defaultValue={tab} onValueChange={handleChangeTab}>
          <div className="flex items-center mb-4">
            <TabsList>
              <TabsTrigger value={AnalyticsInterval.ANALYTICS_INTERVAL_WEAK}>Неделя</TabsTrigger>
              <TabsTrigger value={AnalyticsInterval.ANALYTICS_INTERVAL_MONTH}>Месяц</TabsTrigger>
              <TabsTrigger value={AnalyticsInterval.ANALYTICS_INTERVAL_YEAR}>Год</TabsTrigger>
              <Separator orientation="vertical" className="mx-3 bg-primary h-1/2" />
              <TabsTrigger className="relative" value={AnalyticsInterval.ANALYTICS_INTERVAL_GAP}>
                Промежуток
                <DatePickerWithRange
                  className={cn("absolute left-32", {
                    hidden: tab !== AnalyticsInterval.ANALYTICS_INTERVAL_GAP,
                  })}
                  date={date}
                  setDate={setDate}
                />
              </TabsTrigger>
            </TabsList>
          </div>

          {data && !data.data.data.length && (
            <Card>
              <CardHeader className="px-7">
                <CardTitle>Нет данных</CardTitle>
                <CardDescription>Данных нет, либо нет данных по указанным фильтрам</CardDescription>
              </CardHeader>
            </Card>
          )}

          <Card>
            <CardHeader className="px-7">
              <CardTitle>Проблемы</CardTitle>
              <CardDescription>
                На данной странице представлены самые популярные проблемы
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ошибка</TableHead>
                    <TableHead>У скольки пользователей</TableHead>
                    <TableHead>Сколько данных ошибок</TableHead>
                    {/*<TableHead>График</TableHead>*/}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data &&
                    data.data.data.map((bug) => {
                      return (
                        <TableRow key={bug.exception} className="bg-accent">
                          <TableCell>{bug.exception}</TableCell>
                          <TableCell>{bug.countUsers}</TableCell>
                          <TableCell>{bug.count}</TableCell>
                          {/*<TableCell>*/}
                          {/*  <SentryAnalyticsChart bug={bug} />*/}
                          {/*</TableCell>*/}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </>
  );
};
