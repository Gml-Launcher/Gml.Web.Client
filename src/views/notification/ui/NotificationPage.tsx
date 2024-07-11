"use client";

import { DASHBOARD_PAGES } from "@/shared/routes";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { useNotifications } from "@/shared/hooks";
import { NotificationLoadingPage } from "@/views/notification/ui/NotificationLoadingPage";
import { Card } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";
import { NotificationStatus, NotificationTextOption } from "@/shared/enums/notificationType";
import { Button } from "@/shared/ui/button";
import { toast as sonner } from "sonner";

interface NotificationPage {}

const notificationColor: Record<NotificationStatus, string> = {
  [NotificationStatus.FATAL]: "bg-red-500",
  [NotificationStatus.ERROR]: "bg-red-700",
  [NotificationStatus.WARNING]: "bg-orange-400",
  [NotificationStatus.INFORMATION]: "bg-blue-500",
  [NotificationStatus.DEBUG]: "bg-stone-50",
  [NotificationStatus.TRACE]: "bg-stone-500",
};

export const NotificationPage = ({}: NotificationPage) => {
  const { data, isLoading } = useNotifications();

  if (isLoading) return <NotificationLoadingPage />;

  return (
    <>
      <Breadcrumbs
        current={"Уведомления"}
        breadcrumbs={[{ value: "Главная", path: DASHBOARD_PAGES.HOME }]}
      />
      <div className="grid items-start py-4 gap-y-2">
        {data &&
          data.notifications.map((data, i) => (
            <Card
              key={i}
              className={cn("flex flex-row items-center justify-between gap-y-4 p-3 pr-8")}
            >
              <div className="grid gap-x-5 gap-y-2 max-w-[700px] items-center">
                <span>{data.message}</span>
                <span className="text-[12px]">{data.details}</span>
              </div>
              <div className="grid ">
                <Button
                  onClick={async () => {
                    await navigator.clipboard.writeText(data.details);
                    sonner("Текст успешно скопирован", {
                      duration: 1500,
                      onAutoClose: () => true,
                    });
                  }}
                >
                  Скопировать ошибку
                </Button>
                <div className="flex items-center space-x-1">
                  <span>
                    Статус:{" "}
                    {
                      NotificationTextOption[
                        `OPTION_${data.type}` as keyof typeof NotificationTextOption
                      ]
                    }
                  </span>
                  <div className="grid">
                    <span
                      className={`flex items-center justify-center w-3 h-3 rounded-full after:flex after:rounded-full after:min-w-5 after:min-h-5 ${
                        notificationColor[data.type]
                      } after:opacity-30 after:${notificationColor[data.type]}`}
                    ></span>
                    <span
                      className={`absolute items-center justify-center w-3 h-3 rounded-full after:flex after:rounded-full after:min-w-5 after:min-h-5 ${
                        notificationColor[data.type]
                      } animate-ping after:opacity-30 after:${notificationColor[data.type]}`}
                    ></span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </>
  );
};
