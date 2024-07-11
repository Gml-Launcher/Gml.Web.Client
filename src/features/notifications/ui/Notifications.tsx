"use client";

import { BellIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { useConnectionHub } from "@/widgets/notifications-hub/lib/useConnectionHub";
import { useRouter } from "next/navigation";
import { DASHBOARD_PAGES } from "@/shared/routes";
import { useNotifications } from "@/shared/hooks";
import { Card } from "@/shared/ui/card";
import { getFormatDate } from "@/shared/lib/getFormatDate/getFormatDate";
import { Icons } from "@/shared/ui/icons";
import React from "react";

export const Notifications = () => {
  const router = useRouter();
  useConnectionHub();
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
              <Badge variant="secondary">{data?.amount}</Badge>
            </p>
            <p className="text-sm leading-none text-muted-foreground">Список уведомлений системы</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="flex flex-col gap-y-4 p-5">
          {data && data.notifications ? (
            data.notifications.slice(0, 3).map(({ message, details, date }, index) => (
              <Card key={`${message}-${index}`} className="flex flex-col items-start gap-y-4 p-3">
                <span className="text-lg font-semibold">{message}</span>
                <span className="truncate h-12 text-wrap w-[calc(100%-24px)]">{details}</span>
                <span className="text-sm text-muted-foreground">{getFormatDate(date)}</span>
              </Card>
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
