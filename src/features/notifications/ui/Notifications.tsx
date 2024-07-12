"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { BellIcon } from "lucide-react";

import { useConnectionHub } from "@/widgets/notifications-hub";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { DASHBOARD_PAGES } from "@/shared/routes";
import { useNotifications } from "@/shared/hooks";
import { getFormatDate } from "@/shared/lib/utils";
import { Icons } from "@/shared/ui/icons";
import { NotificationStatus } from "@/shared/enums";

const statusColor: Record<NotificationStatus, string> = {
  [NotificationStatus.TRACE]: "bg-neutral-200",
  [NotificationStatus.DEBUG]: "bg-white border-solid border-1 border-neutral-200",
  [NotificationStatus.INFORMATION]: "bg-sky-500",
  [NotificationStatus.WARNING]: "bg-amber-500",
  [NotificationStatus.ERROR]: "bg-red-600",
  [NotificationStatus.FATAL]: "bg-red-900",
};

export const Notifications = () => {
  useConnectionHub();

  const router = useRouter();

  const { data, isLoading } = useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full relative">
          <BellIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <BellIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Уведомления</span>
          <Badge
            variant="default"
            className="absolute py-1 px-2 font-semibold top-[-3px] right-[-8px] min-h-[26px]"
          >
            {isLoading && <Icons.spinner className="h-3 w-3 animate-spin" />}
            {data && data.amount}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-[450px]">
        <div className="px-3 py-3 text-sm font-normal">
          <div className="flex flex-col space-y-2">
            <p className="flex items-center gap-x-2 text-sm font-medium leading-none">
              Уведомления
              <Badge variant="secondary">{data && data.amount}</Badge>
            </p>
            <p className="text-sm leading-none text-muted-foreground">Список уведомлений системы</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="flex flex-col gap-y-4 p-5">
          {data && data.notifications ? (
            data.notifications.slice(0, 3).map(({ message, details, date, type }, index) => (
              <div key={`${message}-${index}`} className="flex flex-col items-start gap-y-1">
                <div className="flex items-center gap-x-2">
                  <span className={`w-2 h-2 ${statusColor[type]} rounded-full`} />
                  <span className="text-base font-semibold">{message}</span>
                </div>
                <span className="text-sm truncate h-10 text-wrap w-[calc(100%-24px)]">
                  {details ? details : "Детали отсутствуют"}
                </span>
                <span className="text-sm text-muted-foreground">{getFormatDate(date)}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-center leading-none text-muted-foreground">
              У вас нет уведомлений
            </p>
          )}
        </div>
        <DropdownMenuSeparator />
        <Button className="w-full" onClick={() => router.push(DASHBOARD_PAGES.NOTIFICATION)}>
          Все уведомления
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
