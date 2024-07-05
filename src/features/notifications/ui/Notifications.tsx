"use client";

import { useTheme } from "next-themes";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Button } from "@/shared/ui/button";
import { BellIcon } from "lucide-react";
import { Badge } from "@/shared/ui/badge";

export const Notifications = () => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full relative">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <BellIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Уведомления</span>
          <Badge
            variant="default"
            className="absolute py-1 px-2 font-semibold"
            style={{ top: "-3px", right: "-8px" }}
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
