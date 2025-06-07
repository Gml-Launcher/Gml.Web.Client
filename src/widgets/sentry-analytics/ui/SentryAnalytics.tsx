import React, { useEffect, useState } from 'react';
import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subMinutes,
} from 'date-fns';
import { DateRange } from 'react-day-picker';
import { CopyIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';
import { MemoryStick, Monitor, ReceiptText } from 'lucide-react';

import { Progress } from '@/shared/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Separator } from '@/shared/ui/separator';
import { useSentryFilterErrorsList } from '@/shared/hooks';
import { AnalyticsInterval, ProjectTypeEnum, ProjectTypeOption } from '@/shared/enums';
import { cn, enumValues } from '@/shared/lib/utils';
import { DatePickerWithRange } from '@/shared/ui/data-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Skeleton } from '@/shared/ui/skeleton';
import { Button } from '@/shared/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';

export const SentryAnalytics = () => {
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const [projectType, setProjectType] = useState<ProjectTypeEnum>(ProjectTypeEnum.All);

  const { data, mutate, isPending } = useSentryFilterErrorsList();

  const [tab, setTab] = useState<AnalyticsInterval>(
    AnalyticsInterval.ANALYTICS_INTERVAL_FIVE_MINUTES,
  );
  const handleChangeTab = (currentTab: string) => setTab(currentTab as AnalyticsInterval);

  useEffect(() => {
    const todayDate = new Date();

    const dataFromWeak = startOfWeek(todayDate, { weekStartsOn: 1 });
    const dataToWeak = endOfWeek(todayDate, { weekStartsOn: 1 });

    const dataFromMonth = startOfMonth(todayDate);
    const dataToMonth = endOfMonth(todayDate);

    const dataFromYear = startOfYear(todayDate);
    const dataToYear = endOfYear(todayDate);

    switch (tab) {
      case AnalyticsInterval.ANALYTICS_INTERVAL_FIVE_MINUTES: {
        const dateFrom = format(subMinutes(new Date(), 5), "yyyy-MM-dd'T'HH:mm:ss");
        const dateTo = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
        console.log(dateFrom, dateTo);
        mutate({
          projectType: Number(projectType) as ProjectTypeEnum,
          dateFrom,
          dateTo,
        });
        break;
      }
      case AnalyticsInterval.ANALYTICS_INTERVAL_THIRTY_MINUTES: {
        const dateFrom = format(subMinutes(new Date(), 30), "yyyy-MM-dd'T'HH:mm:ss");
        const dateTo = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
        mutate({
          projectType: Number(projectType) as ProjectTypeEnum,
          dateFrom,
          dateTo,
        });
        break;
      }
      case AnalyticsInterval.ANALYTICS_INTERVAL_HOUR: {
        const dateFrom = format(subMinutes(new Date(), 60), "yyyy-MM-dd'T'HH:mm:ss");
        const dateTo = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
        mutate({
          projectType: Number(projectType) as ProjectTypeEnum,
          dateFrom,
          dateTo,
        });
        break;
      }
      case AnalyticsInterval.ANALYTICS_INTERVAL_WEAK: {
        const dateFrom = format(dataFromWeak, 'yyyy-MM-dd');
        const dateTo = format(dataToWeak, 'yyyy-MM-dd');
        mutate({
          projectType: Number(projectType) as ProjectTypeEnum,
          dateFrom,
          dateTo,
        });
        break;
      }
      case AnalyticsInterval.ANALYTICS_INTERVAL_MONTH: {
        const dateFrom = format(dataFromMonth, 'yyyy-MM-dd');
        const dateTo = format(dataToMonth, 'yyyy-MM-dd');
        mutate({
          projectType: Number(projectType) as ProjectTypeEnum,
          dateFrom,
          dateTo,
        });
        break;
      }
      case AnalyticsInterval.ANALYTICS_INTERVAL_YEAR: {
        const dateFrom = format(dataFromYear, 'yyyy-MM-dd');
        const dateTo = format(dataToYear, 'yyyy-MM-dd');
        mutate({
          projectType: Number(projectType) as ProjectTypeEnum,
          dateFrom,
          dateTo,
        });
        break;
      }
      case AnalyticsInterval.ANALYTICS_INTERVAL_GAP: {
        if (date?.from && date.to) {
          const dateFrom = format(date.from, 'yyyy-MM-dd');
          const dateTo = format(date.to, 'yyyy-MM-dd');
          mutate({
            projectType: Number(projectType) as ProjectTypeEnum,
            dateFrom,
            dateTo,
          });
        }
        break;
      }
      default:
        console.error('Unknown tab:', tab);
    }
  }, [mutate, tab, date, projectType]);

  const copyText = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast('Текст успешно скопирован', {
        duration: 500,
        onAutoClose: () => true,
      });
    } catch (error) {
      console.error(error);
      toast('Ошибка копирования. Подробности в консоли браузера', {
        duration: 2000,
      });
    }
  };

  return (
    <>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <Tabs defaultValue={tab} onValueChange={handleChangeTab}>
          <div className="flex justify-between">
            <div className="flex items-center mb-4">
              <TabsList>
                <TabsTrigger value={AnalyticsInterval.ANALYTICS_INTERVAL_FIVE_MINUTES}>
                  За 5 минут
                </TabsTrigger>
                <TabsTrigger value={AnalyticsInterval.ANALYTICS_INTERVAL_THIRTY_MINUTES}>
                  За полчаса
                </TabsTrigger>
                <TabsTrigger value={AnalyticsInterval.ANALYTICS_INTERVAL_HOUR}>За час</TabsTrigger>
                <TabsTrigger value={AnalyticsInterval.ANALYTICS_INTERVAL_WEAK}>Неделя</TabsTrigger>
                <TabsTrigger value={AnalyticsInterval.ANALYTICS_INTERVAL_MONTH}>Месяц</TabsTrigger>
                <TabsTrigger value={AnalyticsInterval.ANALYTICS_INTERVAL_YEAR}>Год</TabsTrigger>
                <Separator orientation="vertical" className="mx-3 bg-primary h-1/2" />
                <TabsTrigger className="relative" value={AnalyticsInterval.ANALYTICS_INTERVAL_GAP}>
                  Промежуток
                  <DatePickerWithRange
                    className={cn('absolute left-32', {
                      hidden: tab !== AnalyticsInterval.ANALYTICS_INTERVAL_GAP,
                    })}
                    date={date}
                    setDate={setDate}
                  />
                </TabsTrigger>
              </TabsList>
            </div>

            <Select
              defaultValue={projectType.toString()}
              onValueChange={(type) => setProjectType(type as unknown as ProjectTypeEnum)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                {enumValues(ProjectTypeEnum).map(([type, value]) => (
                  <SelectItem key={type} value={String(value)}>
                    {ProjectTypeOption[`OPTION_${value}` as keyof typeof ProjectTypeOption]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isPending && <Skeleton className="w-full h-32" />}

          {data && !data.data.data.length && (
            <Card>
              <CardHeader className="px-7">
                <CardTitle>Нет данных</CardTitle>
                <CardDescription>Данных нет, либо нет данных по указанным фильтрам</CardDescription>
              </CardHeader>
            </Card>
          )}

          {data && data.data.data && data.data.data.length > 0 && (
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
                      <TableHead>Количество повторений</TableHead>
                      {/*<TableHead>График</TableHead>*/}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data &&
                      data.data.data.map((bug) => {
                        // @ts-ignore
                        return (
                          <TableRow key={bug.exception}>
                            <TableCell>
                              <Accordion type="single" collapsible>
                                <AccordionItem value="item-1" className="border-none">
                                  <AccordionTrigger className="relative">
                                    <div className="flex gap-3">
                                      <Button
                                        className="p-0 min-h-[35px] min-w-[35px] h-[35px] w-[35px]"
                                        onClick={() => void copyText(bug.stackTrace.split('\n')[0])}
                                        variant="ghost"
                                      >
                                        <CopyIcon />
                                      </Button>

                                      <div className="flex flex-col">
                                        {bug.exception}
                                        <p className="text-sm relative text-gray-700 rounded-lg dark:text-gray-400 text-wrap">
                                          {bug.stackTrace.split('\n')[0]}
                                        </p>
                                      </div>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="flex flex-col md:flex-row gap-3 ml-[45px]">
                                      <Card className="w-full md:w-[50%]">
                                        <CardHeader className="pb-0 text-gray-700 dark:text-gray-400">
                                          <Monitor size={24} className="mb-3" />
                                          Имя устройства
                                        </CardHeader>
                                        <CardFooter>
                                          {bug.bugInfo.username} / {bug.bugInfo.pcName} -{' '}
                                          {bug.bugInfo.osIdentifier} {bug.bugInfo.osVersion}
                                        </CardFooter>
                                      </Card>
                                      <Card className="w-full md:w-[50%]">
                                        <CardHeader className="pb-0 text-gray-700 dark:text-gray-400">
                                          <MemoryStick size={24} className="mb-3" />
                                          Зарезервированная память
                                        </CardHeader>
                                        <CardFooter className="gap-3">
                                          {(bug.bugInfo.memoryInfo.totalAvailableMemoryBytes === 0
                                            ? 0
                                            : (bug.bugInfo.memoryInfo.allocatedBytes /
                                                bug.bugInfo.memoryInfo.totalAvailableMemoryBytes) *
                                              100
                                          ).toFixed(2)}
                                          %
                                          <div className="relative h-2 mt-1 w-full">
                                            <Progress
                                              value={
                                                (bug.bugInfo.memoryInfo.allocatedBytes /
                                                  bug.bugInfo.memoryInfo
                                                    .totalAvailableMemoryBytes) *
                                                100
                                              }
                                              className={`w-full h-1 ${
                                                (bug.bugInfo.memoryInfo.allocatedBytes /
                                                  bug.bugInfo.memoryInfo
                                                    .totalAvailableMemoryBytes) *
                                                  100 >
                                                80
                                                  ? 'bg-red-500'
                                                  : (bug.bugInfo.memoryInfo.allocatedBytes /
                                                        bug.bugInfo.memoryInfo
                                                          .totalAvailableMemoryBytes) *
                                                        100 >
                                                      60
                                                    ? 'bg-yellow-500'
                                                    : 'bg-green-500'
                                              }`}
                                            />
                                          </div>
                                        </CardFooter>
                                      </Card>
                                      <Card className="w-full md:w-[50%]">
                                        <CardHeader className="pb-0 text-gray-700 dark:text-gray-400">
                                          <ReceiptText size={24} className="mb-3" />
                                          Детали
                                        </CardHeader>
                                        <CardFooter>
                                          <div className="flex flex-col gap-2">
                                            <p>
                                              Адрес:
                                              {bug.bugInfo.ipAddress}
                                            </p>
                                            <p>
                                              Вызвало краш:
                                              <span
                                                className={`text-lg ${!bug.bugInfo.exceptions[0].crashed ? 'text-red-500' : 'text-green-500'}`}
                                              >
                                                {!bug.bugInfo.exceptions[0].crashed ? '✗' : '✓'}
                                              </span>
                                            </p>
                                            <p>
                                              Текущее приложение:
                                              <span
                                                className={`text-lg ${bug.bugInfo.exceptions[0].current ? 'text-red-500' : 'text-green-500'}`}
                                              >
                                                {bug.bugInfo.exceptions[0].current ? '✗' : '✓'}
                                              </span>
                                            </p>
                                          </div>
                                        </CardFooter>
                                      </Card>
                                    </div>
                                    <Button
                                      className="mt-3 ml-[45px]"
                                      onClick={() => void copyText(bug.stackTrace)}
                                      variant="secondary"
                                    >
                                      <CopyIcon />
                                      Копировать всё
                                    </Button>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </TableCell>
                            <TableCell width="110">{bug.countUsers}</TableCell>
                            <TableCell width="110">{bug.count}</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </Tabs>
      </div>
    </>
  );
};
