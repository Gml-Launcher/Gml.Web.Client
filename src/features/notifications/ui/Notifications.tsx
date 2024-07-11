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

export const Notifications = () => {
  const router = useRouter();
  useConnectionHub();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full relative">
          <BellIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <BellIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Уведомления</span>
          <Badge
            variant="default"
            className="absolute py-1 px-2 font-semibold top-[-3px] right-[-8px]"
          >
            0
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-96">
        <div className="px-3 py-3 text-sm font-normal">
          <div className="flex flex-col space-y-2">
            <p className="flex items-center gap-x-2 text-sm font-medium leading-none">
              Уведомления
              <Badge variant="secondary">0</Badge>
            </p>
            <p className="text-sm leading-none text-muted-foreground">Список уведомлений системы</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="flex p-5">
          <p className="text-sm text-center leading-none text-muted-foreground">
            У вас нет уведомлений
          </p>
        </div>
        <DropdownMenuSeparator />
        <Button className="w-full" onClick={() => router.push(DASHBOARD_PAGES.NOTIFICATION)}>
          Все уведомления
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
