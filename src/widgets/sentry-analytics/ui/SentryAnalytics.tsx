import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Progress } from "@/shared/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Calendar } from "@/shared/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Copy, CreditCard, ListFilter, MoreVertical, Truck } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import { CalendarDateRangePicker } from "@/shared/ui/data-range-picker";
import { useSentryErrors } from "@/shared/hooks";

export const SentryAnalytics = () => {
  const { mutateAsync, isPending } = useSentryErrors();

  return (
    <>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <Tabs defaultValue="week">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="week">Неделя</TabsTrigger>
              <TabsTrigger value="month">Месяц</TabsTrigger>
              <TabsTrigger value="year">Год</TabsTrigger>
              <Separator orientation="vertical" className="mx-3 bg-primary h-1/2" />
              <TabsTrigger value="gap">Промежуток</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="week">
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
          </TabsContent>

          <TabsContent value="gap">
            <CalendarDateRangePicker fromDate={new Date()} toDate={new Date(2024, 9, 10)} />
            <Calendar mode="range" className="rounded-md border" />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
