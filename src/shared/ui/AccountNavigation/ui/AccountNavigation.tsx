"use client";

import { useRouter } from "next/navigation";

import { CircleUser } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { removeStorageProfile, removeStorageTokens } from "@/shared/services";
import { AUTH_PAGES } from "@/shared/routes";

export const AccountNavigation = () => {
  const router = useRouter();

  const destroySession = () => {
    removeStorageProfile();
    removeStorageTokens();
    router.push(AUTH_PAGES.SIGN_IN);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <CircleUser className="h-5 w-5" />
          <span className="sr-only">Открыть меню пользователя</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={destroySession}>Выход</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
