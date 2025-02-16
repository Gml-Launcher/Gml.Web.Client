'use client';

import React from 'react';
import Link from 'next/link';
import { BellIcon } from 'lucide-react';

import { useConnectionHub } from '@/widgets/notifications-hub';
import { ClearNotificationModel } from '@/widgets/clear-notifications';
import { useNotificationsState } from '@/views/notification';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Separator } from '@/shared/ui/separator';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { NotificationStatus } from '@/shared/enums';
import { DASHBOARD_PAGES } from '@/shared/routes';
import { getFormatDate, timeAgo } from '@/shared/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';

const statusColor: Record<NotificationStatus, string> = {
  [NotificationStatus.TRACE]: 'bg-neutral-200',
  [NotificationStatus.DEBUG]: 'bg-white border-solid border-1 border-neutral-200',
  [NotificationStatus.INFORMATION]: 'bg-sky-500',
  [NotificationStatus.WARNING]: 'bg-amber-500',
  [NotificationStatus.ERROR]: 'bg-red-600',
  [NotificationStatus.FATAL]: 'bg-red-900',
};

export const Notifications = () => {
  useConnectionHub();

  const { notifications, count } = useNotificationsState();

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
            {count}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[450px] max-w-[450px]">
        <div className="flex items-center">
          <div className="px-3 py-3 text-sm font-normal">
            <div className="flex flex-col space-y-2">
              <p className="flex items-center gap-x-2 text-sm font-medium leading-none">
                Уведомления
                <Badge variant="secondary">{count}</Badge>
              </p>
              <p className="text-sm leading-none text-muted-foreground">
                Список уведомлений системы
              </p>
            </div>
          </div>
          <div className="absolute top-auto right-4">
            <ClearNotificationModel description={'Прочитать все'} />
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="flex flex-col max-h-96 overflow-y-auto overscroll-y-none overflow-x-hidden">
          {count !== 0 ? (
            notifications
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 10)
              .map(({ message, details, date, type }, index) => (
                <Link href={DASHBOARD_PAGES.NOTIFICATION} key={`${message}-${index}`}>
                  <div className="flex flex-col items-start gap-y-1 px-3 transition hover:dark:bg-neutral-900 hover:bg-gray-100 rounded-md py-3">
                    <div className="flex items-center gap-x-3">
                      <span
                        className={`min-w-2 min-h-2 w-2 h-2 ${statusColor[type]} rounded-full`}
                      />
                      <span className="text-base font-semibold">{message}</span>
                    </div>
                    <span className="text-sm text-gray-400 truncate max-h-10 text-wrap w-[calc(100%-24px)]">
                      {details ? details : 'Детали отсутствуют'}
                    </span>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="text-sm text-muted-foreground">{timeAgo(date)}</span>
                      </TooltipTrigger>
                      <TooltipContent className="p-3">
                        <span className="text-sm text-muted-foreground">{getFormatDate(date)}</span>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Separator />
                </Link>
              ))
          ) : (
            <p className="text-sm text-center leading-none text-muted-foreground">
              У вас нет уведомлений
            </p>
          )}
        </div>
        <Link
          className="flex items-center justify-center w-full min-h-14 underline dark:text-gray-300 text-gray-600"
          href={DASHBOARD_PAGES.NOTIFICATION}
        >
          Показать все
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
