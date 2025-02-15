'use client';

import React from 'react';
import { createColumnHelper } from '@tanstack/table-core';
import { format } from 'date-fns';
import { GavelIcon, UserXIcon } from 'lucide-react';

import { DataTableColumnHeader } from '@/entities/Table';
import { PlayerBaseEntity } from '@/shared/api/contracts';
import { $api } from '@/services/api.service';
import { Button } from '@/shared/ui/button';
import { useBanPlayer, usePardonPlayer, useRemoveUser } from '@/shared/hooks/usePlayers';
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
  IP_ADDRESS = 'IP Адрес',
  ACTIONS = 'Действия',
}

export const columnsHelper = createColumnHelper<PlayerBaseEntity>();
export const useColumns = () => {
  const banPlayer = useBanPlayer();
  const removePlayer = useRemoveUser();
  const pardonPlayer = usePardonPlayer();

  const banUser = async (data: string) => {
    await banPlayer.mutateAsync([data]);
  };
  const removeUser = async (data: string) => {
    await removePlayer.mutateAsync([data]);
  };

  const pardonUser = async (data: string) => {
    await pardonPlayer.mutateAsync([data]);
  };

  const columns: any = [
    columnsHelper.accessor('uuid', {
      size: 190,
      header: ({ column }) => <DataTableColumnHeader column={column} title={ColumnHeader.UUID} />,
      cell: ({ getValue }) => getValue(),
    }),
    columnsHelper.display({
      id: 'skin',
      size: 100,
      header: ({ column }) => <DataTableColumnHeader column={column} title={ColumnHeader.NAME} />,
      cell: ({ row }) => {
        return (
          <div className="flex flex-row items-center gap-3">
            <img
              src={$api.getUri() + `/integrations/texture/head/${row.original.uuid}`}
              alt="skin"
              className="w-10 rounded-lg"
            />
            <p className="font-medium">{row.original.name}</p>
          </div>
        );
      },
    }),
    columnsHelper.accessor('authHistory', {
      size: 100,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={ColumnHeader.SIGN_IN} />
      ),
      cell: ({ getValue }) => getValue()?.length,
    }),
    columnsHelper.accessor('expiredDate', {
      size: 300,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={ColumnHeader.SESSION_END_DATE} />
      ),
      cell: ({ getValue }) => format(getValue(), 'dd.MM.yyyy в HH:mm:ss'),
    }),
    columnsHelper.accessor('isBanned', {
      size: 100,
      header: ({ column }) => <DataTableColumnHeader column={column} title={ColumnHeader.BANNED} />,
      cell: ({ getValue }) => (getValue() ? 'Да' : 'Нет'),
    }),
    columnsHelper.display({
      id: 'address',
      size: 100,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={ColumnHeader.IP_ADDRESS} />
      ),
      cell: ({ row }) => {
        const distinctAddresses = Array.from(
          new Set(row.original.authHistory.map((c) => c.address)),
        );
        const distinctDevices = row.original.authHistory;

        return (
          <Tooltip>
            <TooltipTrigger>
              <div className="flex flex-col">{distinctAddresses.join(', ')}</div>
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
      size: 100,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={ColumnHeader.ACTIONS} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            {row.original.isBanned ? (
              <Button
                variant="outline"
                className="bg-green-600 hover:bg-green-700 rounded-full h-8 gap-2"
                onClick={() => pardonUser(row.original.uuid)}
              >
                <GavelIcon size="12" />
                Разбанить
              </Button>
            ) : (
              <Button
                variant="outline"
                className="rounded-full h-8 gap-2"
                onClick={() => banUser(row.original.uuid)}
              >
                <GavelIcon size="12" />
                Забанить
              </Button>
            )}

            <Button
              variant="outline"
              className="rounded-full h-8 gap-2"
              onClick={() => removeUser(row.original.uuid)}
            >
              <UserXIcon size="12" />
              Удалить
            </Button>
          </div>
        );
      },
    }),
  ];

  return { columns };
};
