import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Calendar } from "@/shared/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import { CalendarDateRangePicker } from "@/shared/ui/data-range-picker";
import { useSentryFilterErrors, useSentryFilterErrorsList } from "@/shared/hooks";
import { useEffect, useState } from "react";

export const SentryAnalytics = () => {
  const { data, mutate, isPending } = useSentryFilterErrorsList();

  const [tab, SetTab] = useState<string>("week");

  useEffect(() => {
    const date = new Date(Date.now());

    switch (tab) {
      case "week":
        mutate({ projectType: 7, dataFrom: Date.now.toString(), dataTo: Date.now().toString() });
        break;
      case "month":
        mutate({
          projectType: 7,
          dataFrom: `${date.getFullYear()}-${date.getMonth()}-01`,
          dataTo: `${date.getFullYear()}-${date.getMonth() + 1}-01`,
        });
        break;
      case "year":
        mutate({
          projectType: 7,
          dataFrom: `${date.getFullYear() - 1}-01-01`,
          dataTo: `${date.getFullYear()}-01-01`,
        });
        break;
    }
  }, [mutate, tab]);

  return (
    <>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <Tabs defaultValue={tab} onValueChange={SetTab}>
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="week">Неделя</TabsTrigger>
              <TabsTrigger value="month">Месяц</TabsTrigger>
              <TabsTrigger value="year">Год</TabsTrigger>
              <Separator orientation="vertical" className="mx-3 bg-primary h-1/2" />
              <TabsTrigger value="gap">Промежуток</TabsTrigger>
            </TabsList>
          </div>
          {tab === ("week" | "month" | "year") && (
            <Card x-chunk="dashboard-05-chunk-3">
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
                      <TableHead className="hidden sm:table-cell">
                        У скольки пользователей
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">Сколько данных ошибок</TableHead>
                      <TableHead className="hidden sm:table-cell">График</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-accent">
                      <TableCell>
                        <div className="font-medium">Liam Johnson</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          liam@example.com
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">Sale</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge className="text-xs" variant="secondary">
                          Fulfilled
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          <TabsContent value="gap">
            <CalendarDateRangePicker fromDate={new Date()} toDate={new Date(2024, 9, 10)} />
            <Calendar mode="range" className="rounded-md border" />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
