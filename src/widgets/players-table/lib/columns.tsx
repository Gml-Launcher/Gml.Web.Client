'use client';

import React, { useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/table-core';
import { format } from 'date-fns';
import { GavelIcon, UserXIcon, MoreVertical, Ban as BanIcon, ShieldCheck } from 'lucide-react';

import { DataTableColumnHeader } from '@/entities/Table';
import { PlayerBaseEntity } from '@/shared/api/contracts';
import { $api } from '@/services/api.service';
import { Button } from '@/shared/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
import { useBanPlayer, useBanPlayerHardware, usePardonPlayer, usePardonPlayerHardware, useRemoveUser } from '@/shared/hooks/usePlayers';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { timeAgo } from '@/shared/lib/getFormatDate/getFormatDate';

enum ColumnHeader {
  ICON = '',
  NAME = 'Игрок',
  SIGN_IN = 'Авторизаций',
  SESSION_END_DATE = 'Дата завершения сессии',
  UUID = 'UUID',
  BANNED = 'Заблокирован',
  BANNED_HARDWARE = 'Заблокирован по железу',
  IP_ADDRESS = 'IP Адрес',
  ACTIONS = 'Действия',
}

export const columnsHelper = createColumnHelper<PlayerBaseEntity>();

function AvatarCell({ name, uuid }: { name?: string; uuid: string }) {
  const [error, setError] = useState(false);
  const initials = useMemo(() => {
    const n = (name || '').trim();
    if (!n) return '?';
    // Use first 2 symbols to match the example; uppercase
    return n.substring(0, 2).toUpperCase();
  }, [name]);

  if (error) {
    return (
      <div
        className="flex items-center justify-center min-w-10 min-h-10 h-10 w-10 bg-gray-200/5 rounded-lg text-sm font-medium select-none"
        aria-label="avatar-fallback"
        title={name}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={$api.getUri() + `/integrations/texture/head/${uuid}`}
      alt="skin"
      className="w-10 h-10 rounded-lg flex-shrink-0"
      onError={() => setError(true)}
    />
  );
}
export const useColumns = () => {
  const banPlayer = useBanPlayer();
  const banPlayerHardware = useBanPlayerHardware();
  const removePlayer = useRemoveUser();
  const pardonPlayer = usePardonPlayer();
  const pardonPlayerHardware = usePardonPlayerHardware();

  const banUser = async (data: string) => {
    await banPlayer.mutateAsync([data]);
  };
  const banUserHardware = async (data: string) => {
    await banPlayerHardware.mutateAsync([data]);
  };
  const removeUser = async (data: string) => {
    await removePlayer.mutateAsync([data]);
  };

  const pardonUser = async (data: string) => {
    await pardonPlayer.mutateAsync([data]);
  };

  const pardonUserHardware = async (data: string) => {
    await pardonPlayerHardware.mutateAsync([data]);
  };

  const columns: any = [
    // Compact: move UUID into the name cell (shown below) to save a column
    // Keeping data visible via tooltip in name cell; remove standalone UUID column
    // If table requires an accessor for sorting by uuid, we can keep hidden, but here we remove to save space.
    columnsHelper.display({
      id: 'skin',
      size: 160,
      header: ({ column }) => <DataTableColumnHeader column={column} title={ColumnHeader.NAME} />,
      cell: ({ row }) => {
        const authCount = row.original.authHistory?.length ?? 0;
        const banned = row.original.isBanned;
        const uuid = row.original.uuid;
        return (
          <div className="flex flex-row items-center gap-3 min-w-0">
            {/* Avatar with fallback to initials if image is missing or fails to load */}
            <AvatarCell name={row.original.name} uuid={uuid} />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <p className="font-medium truncate" title={row.original.name}>{row.original.name}</p>
                {banned ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span aria-label="Заблокирован" className="text-red-500 inline-flex"><BanIcon size={14} /></span>
                    </TooltipTrigger>
                    <TooltipContent>Заблокирован</TooltipContent>
                  </Tooltip>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span aria-label="Не заблокирован" className="text-emerald-500 inline-flex"><ShieldCheck size={14} /></span>
                    </TooltipTrigger>
                    <TooltipContent>Не заблокирован</TooltipContent>
                  </Tooltip>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground select-none">{authCount}</span>
                  </TooltipTrigger>
                  <TooltipContent>Авторизаций: {authCount}</TooltipContent>
                </Tooltip>
              </div>
              <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                <span className="opacity-70">UUID:</span>
                <span title={uuid}>{uuid}</span>
              </div>
            </div>
          </div>
        );
      },
    }),
    // Compact: sign-in count moved into name cell badge above.
    // Keep column very narrow for sorting but hide content textually.
    columnsHelper.accessor('authHistory', {
      size: 60,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={ColumnHeader.SIGN_IN} />
      ),
      cell: ({ getValue }) => (getValue()?.length ?? 0),
    }),
    columnsHelper.accessor('expiredDate', {
      size: 160,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={ColumnHeader.SESSION_END_DATE} />
      ),
      cell: ({ getValue }) => {
        const raw = getValue() as unknown as string | Date | number | null | undefined;
        const dateObj = raw ? new Date(raw as any) : null;
        const isValid = !!(dateObj && !isNaN(dateObj.getTime()));
        const full = isValid ? format(dateObj as Date, 'dd.MM.yyyy в HH:mm:ss') : '-';
        return <span className="whitespace-nowrap">{full}</span>;
      },
    }),
    // Merged status column: combines regular ban and hardware ban into one cell
    columnsHelper.display({
      id: 'status',
      size: 120,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Статус" />
      ),
      sortingFn: (a, b) => {
        const getHw = (r: any) => {
          if (r?.isBannedPermanent) return 2;
          const legacy = (r?.isDeviceBanned ?? r?.deviceBlocked ?? r?.isHardwareBanned ?? r?.isBannedByHardware ?? r?.bannedByHardware) ? 1 : 0;
          return legacy;
        };
        const getBan = (r: any) => (r?.isBanned ? 1 : 0);
        // Priority: permanent hardware ban (2) > regular hardware ban (1) > regular ban (1) > none (0)
        const rankA = getHw(a.original) + getBan(a.original);
        const rankB = getHw(b.original) + getBan(b.original);
        return rankB - rankA;
      },
      cell: ({ row }) => {
        const anyRow: any = row.original as any;
        const isBanned = !!anyRow?.isBanned;
        const isHwPermanent = !!anyRow?.isBannedPermanent;
        const isHwLegacy = !!(
          anyRow?.isDeviceBanned ??
          anyRow?.deviceBlocked ??
          anyRow?.isHardwareBanned ??
          anyRow?.isBannedByHardware ??
          anyRow?.bannedByHardware
        );
        const isHw = isHwPermanent || isHwLegacy;

        if (!isBanned && !isHw) {
          return (
            <div className="flex items-center gap-2">
              <span className="text-emerald-500" title="Не заблокирован">
                <ShieldCheck size={14} />
              </span>
              <span className="text-emerald-600">Нет</span>
            </div>
          );
        }

        return (
          <div className="flex items-center gap-2">
            {isBanned && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span aria-label="Бан" className="text-red-500 inline-flex"><BanIcon size={14} /></span>
                </TooltipTrigger>
                <TooltipContent>Блокировка аккаунта</TooltipContent>
              </Tooltip>
            )}
            {isHw && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span aria-label="Бан по железу" className={`inline-flex ${isHwPermanent ? 'text-red-600' : 'text-red-500'}`}><GavelIcon size={14} /></span>
                </TooltipTrigger>
                <TooltipContent>{isHwPermanent ? 'Перманентная блокировка по железу' : 'Блокировка по железу'}</TooltipContent>
              </Tooltip>
            )}
            <span className="text-red-600">
              {isHw && isBanned ? (isHwPermanent ? 'Бан + Железо (перманентно)' : 'Бан + Железо') : isHw ? (isHwPermanent ? 'Железо (перманентно)' : 'Железо') : 'Бан'}
            </span>
          </div>
        );
      },
    }),
    columnsHelper.display({
      id: 'address',
      size: 120,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={ColumnHeader.IP_ADDRESS} />
      ),
      cell: ({ row }) => {
        const distinctAddresses = Array.from(
          new Set((row.original.authHistory || []).map((c) => c.address)),
        );
        const distinctDevices = row.original.authHistory || [];
        const first = distinctAddresses[0];
        const more = Math.max(0, distinctAddresses.length - 1);

        return (
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-1">
                <span className="truncate max-w-[180px]">{first ?? '-'}</span>
                {more > 0 && (
                  <span className="text-xs text-muted-foreground">+{more}</span>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent className="p-3">
              <div className="flex flex-col overflow-y-auto gap-5 h-[300px]">
                {distinctDevices.map((device, index) => (
                  <Card key={index} className="p-0 border-none w-[300px] pt-4">
                    <CardHeader className="p-0">
                      <CardTitle className="text-base">{device.device}</CardTitle>
                      <CardDescription>
                        {device.address} / {timeAgo(device.date)}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        );
      },
    }),
    columnsHelper.display({
      id: 'actions',
      size: 64,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={ColumnHeader.ACTIONS} />
      ),
      cell: ({ row }) => {
        const anyRow: any = row.original as any;
        const isHwPermanent = !!anyRow?.isBannedPermanent;
        const isHwLegacy = !!(
          anyRow?.isDeviceBanned ??
          anyRow?.deviceBlocked ??
          anyRow?.isHardwareBanned ??
          anyRow?.isBannedByHardware ??
          anyRow?.bannedByHardware
        );
        const isHw = isHwPermanent || isHwLegacy;
        const isBanned = !!anyRow?.isBanned;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-full h-8 w-8 p-0 flex items-center justify-center" aria-label="Действия">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isBanned ? (
                <DropdownMenuItem onClick={() => pardonUser(row.original.uuid)}>
                  Разбанить
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => banUser(row.original.uuid)}>
                  Забанить
                </DropdownMenuItem>
              )}
              {isHwPermanent && (
                <DropdownMenuItem onClick={() => pardonUserHardware(row.original.uuid)}>
                  Разбанить по железу
                </DropdownMenuItem>
              )}
              {!isHwPermanent && (
                <DropdownMenuItem onClick={() => banUserHardware(row.original.uuid)}>
                  Забанить по железу
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => removeUser(row.original.uuid)}>
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];

  return { columns };
};
