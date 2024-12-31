'use client';

import { ClearNotificationModel } from '@/widgets/clear-notifications';
import { NotificationCard } from '@/entities/NotificationCard';
import { DASHBOARD_PAGES } from '@/shared/routes';
import { NotificationStatus } from '@/shared/enums';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Badge } from '@/shared/ui/badge';
import { useNotifications } from '@/shared/hooks';

export const NotificationPage = () => {
  const { data } = useNotifications();

  const notificationsFatal =
    data && data.notifications.filter(({ type }) => type === NotificationStatus.FATAL);
  const notificationsError =
    data && data.notifications.filter(({ type }) => type === NotificationStatus.ERROR);
  const notificationsWarning =
    data && data.notifications.filter(({ type }) => type === NotificationStatus.WARNING);
  const notificationsInformation =
    data && data.notifications.filter(({ type }) => type === NotificationStatus.INFORMATION);
  const notificationsDebug =
    data && data.notifications.filter(({ type }) => type === NotificationStatus.DEBUG);
  const notificationsTrace =
    data && data.notifications.filter(({ type }) => type === NotificationStatus.TRACE);

  return (
    <>
      <Breadcrumbs
        current={'Уведомления'}
        breadcrumbs={[{ value: 'Главная', path: DASHBOARD_PAGES.HOME }]}
      />
      <Tabs
        className="flex gap-6 items-start"
        defaultValue="fatal"
        aria-orientation="vertical"
        orientation="vertical"
      >
        <TabsList
          defaultValue="fatal"
          className="sticky top-5 flex-col h-auto items-start min-w-64"
        >
          <h3 className="p-2 pb-1 text-sm font-bold">Логи</h3>
          <TabsTrigger
            className="flex justify-between items-center gap-x-2 w-full h-10"
            value="fatal"
          >
            <span>Фатальные</span>
            <Badge variant="secondary">{notificationsFatal && notificationsFatal.length}</Badge>
          </TabsTrigger>
          <TabsTrigger
            className="flex justify-between items-center gap-x-2 w-full h-10"
            value="error"
          >
            <span>Ошибки</span>
            <Badge variant="secondary">{notificationsError && notificationsError.length}</Badge>
          </TabsTrigger>
          <TabsTrigger
            className="flex justify-between items-center gap-x-2 w-full h-10"
            value="warning"
          >
            <span>Предупреждения</span>
            <Badge variant="secondary">{notificationsWarning && notificationsWarning.length}</Badge>
          </TabsTrigger>
          <TabsTrigger
            className="flex justify-between items-center gap-x-2 w-full h-10"
            value="information"
          >
            <span>Информационные</span>
            <Badge variant="secondary">
              {notificationsInformation && notificationsInformation.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            className="flex justify-between items-center gap-x-2 w-full h-10"
            value="debug"
          >
            <span>Дебаг</span>
            <Badge variant="secondary">{notificationsDebug && notificationsDebug.length}</Badge>
          </TabsTrigger>
          <TabsTrigger
            className="flex justify-between items-center gap-x-2 w-full h-10"
            value="trace"
          >
            <span>Трейс</span>
            <Badge variant="secondary">{notificationsTrace && notificationsTrace.length}</Badge>
          </TabsTrigger>
          <ClearNotificationModel className="w-full" description="Очистить все" />
        </TabsList>
        <TabsContent value="fatal" className="w-full">
          {notificationsFatal && !notificationsFatal.length && (
            <section className="flex flex-col justify-center items-center gap-y-2 bg-muted/80 min-h-[300px] rounded-md">
              <h3 className="text-xl font-bold">Ошибки типа: Fatal не найдены</h3>
            </section>
          )}

          <div className="flex flex-col gap-y-4">
            {notificationsFatal &&
              Boolean(notificationsFatal.length) &&
              notificationsFatal.map((card, index) => (
                <NotificationCard key={`${card.date}-${index}`} card={card} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="error" className="w-full">
          {notificationsError && !notificationsError.length && (
            <section className="flex flex-col justify-center items-center gap-y-2 bg-muted/80 min-h-[300px] rounded-md">
              <h3 className="text-xl font-bold">Ошибки типа: Error не найдены</h3>
            </section>
          )}

          <div className="flex flex-col gap-y-4">
            {notificationsError &&
              Boolean(notificationsError.length) &&
              notificationsError.map((card, index) => (
                <NotificationCard key={`${card.date}-${index}`} card={card} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="warning" className="w-full">
          {notificationsWarning && !notificationsWarning.length && (
            <section className="flex flex-col justify-center items-center gap-y-2 bg-muted/80 min-h-[300px] rounded-md">
              <h3 className="text-xl font-bold">Ошибки типа: Warning не найдены</h3>
            </section>
          )}

          <div className="flex flex-col gap-y-4">
            {notificationsWarning &&
              Boolean(notificationsWarning.length) &&
              notificationsWarning.map((card, index) => (
                <NotificationCard key={`${card.date}-${index}`} card={card} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="information" className="w-full">
          {notificationsInformation && !notificationsInformation.length && (
            <section className="flex flex-col justify-center items-center gap-y-2 bg-muted/80 min-h-[300px] rounded-md">
              <h3 className="text-xl font-bold">Ошибки типа: Information не найдены</h3>
            </section>
          )}

          <div className="flex flex-col gap-y-4">
            {notificationsInformation &&
              Boolean(notificationsInformation.length) &&
              notificationsInformation.map((card, index) => (
                <NotificationCard key={`${card.date}-${index}`} card={card} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="debug" className="w-full">
          {notificationsDebug && !notificationsDebug.length && (
            <section className="flex flex-col justify-center items-center gap-y-2 bg-muted/80 min-h-[300px] rounded-md">
              <h3 className="text-xl font-bold">Ошибки типа: Debug не найдены</h3>
            </section>
          )}

          <div className="flex flex-col gap-y-4">
            {notificationsDebug &&
              Boolean(notificationsDebug.length) &&
              notificationsDebug.map((card, index) => (
                <NotificationCard key={`${card.date}-${index}`} card={card} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="trace" className="w-full">
          {notificationsTrace && !notificationsTrace.length && (
            <section className="flex flex-col justify-center items-center gap-y-2 bg-muted/80 min-h-[300px] rounded-md">
              <h3 className="text-xl font-bold">Ошибки типа: Trace не найдены</h3>
            </section>
          )}

          <div className="flex flex-col gap-y-4">
            {notificationsTrace &&
              Boolean(notificationsTrace.length) &&
              notificationsTrace.map((card, index) => (
                <NotificationCard key={`${card.date}-${index}`} card={card} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};
