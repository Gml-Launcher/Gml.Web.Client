'use client';

import { useRouter } from 'next/navigation';
import { CircleUser } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { getStorageProfile, removeStorageProfile, removeStorageTokens, removeStorageRecloudIDAccessToken } from '@/shared/services';
import { AUTH_PAGES } from '@/shared/routes';

export const AccountNavigation = () => {
  const router = useRouter();
  const profile = getStorageProfile();

  const destroySession = () => {
    removeStorageProfile();
    removeStorageTokens();
    removeStorageRecloudIDAccessToken();
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
      <DropdownMenuContent align="end" className="min-w-48">
        <div className="px-2 py-1.5 text-sm font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profile?.login}</p>
            <p className="text-xs leading-none text-muted-foreground">{profile?.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={destroySession}>Выход</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
