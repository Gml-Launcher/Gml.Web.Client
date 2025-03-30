'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/table-core';
import { Edit2Icon, Trash2Icon } from 'lucide-react';

import { ClientState } from '@/widgets/client-hub';
import { DataTableColumnHeader } from '@/entities/Table';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { ProfileBaseEntity } from '@/shared/api/contracts';
import { DASHBOARD_PAGES } from '@/shared/routes';
import { Icons } from '@/shared/ui/icons';
import { getFormatDate } from '@/shared/lib/utils';
import { profileKeys } from '@/shared/hooks';
import { convertApiGameLoaderImage } from '@/shared/converters';

enum ColumnHeader {
  ICON = '',
  NAME = 'Название',
  CREATED_AT = 'Дата создания',
  VERSION_LAUNCHER = 'Запускаемая версия',
  LOADER_LAUNCHER = '',
  GAME_VERSION = 'Версия',
  PRIORITY = 'Приоритет',
  PROFILE_STATE = 'Статус',
}

interface UseColumnsProps {
  isPendingDelete: boolean;
  onProfileDeleteModalToggle: () => void;
}

export const columnsHelper = createColumnHelper<ProfileBaseEntity>();
export const useColumns = (props: UseColumnsProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { onProfileDeleteModalToggle } = props;

  const onRedirectEditProfile = (profileName: string) => () => {
    router.push(`${DASHBOARD_PAGES.PROFILE}/${profileName}`);
  };

  const columns: any = [
    columnsHelper.display({
      id: 'checkbox',
      size: 48,
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Выбрать все строки"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Выбрать строку"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }),
    columnsHelper.accessor('iconBase64', {
      size: 64,
      header: ColumnHeader.ICON,
      cell: ({ row }) =>
        row.original.iconBase64 ? (
          <Image
            className="min-w-12 min-h-12 h-12 w-12"
            src={`data:image/png;base64,${row.original.iconBase64}`}
            alt={row.original.name || 'Profile Icon'}
            width={48}
            height={48}
          />
        ) : (
          <div className="flex items-center justify-center min-w-12 min-h-12 h-12 w-12 bg-gray-200/5 rounded-xl">
            {row.original.name.substring(0, 2).toUpperCase()}
          </div>
        ),
    }),

    columnsHelper.display({
      size: 400,
      id: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title={ColumnHeader.NAME} />,
      cell: ({ row }) => (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">{row.original.name}</p>
          <h3>{row.original.displayName}</h3>
        </div>
      ),
    }),
    columnsHelper.accessor('loader', {
      size: 70,
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={ColumnHeader.LOADER_LAUNCHER} />
      ),
      cell: ({ getValue }) => (getValue() ? convertApiGameLoaderImage(getValue()) : 'Не загружен'),
    }),
    columnsHelper.accessor('launchVersion', {
      size: 500,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={ColumnHeader.VERSION_LAUNCHER} />
      ),
      cell: ({ getValue }) => (getValue() ? getValue() : 'Не загружен'),
    }),
    columnsHelper.accessor('gameVersion', {
      size: 100,

      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={ColumnHeader.GAME_VERSION} />
      ),
      cell: ({ getValue }) => getValue(),
    }),
    columnsHelper.accessor('createDate', {
      size: 500,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={ColumnHeader.CREATED_AT} />
      ),
      cell: ({ getValue }) => getFormatDate(getValue()),
    }),
    columnsHelper.accessor('priority', {
      size: 150,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={ColumnHeader.PRIORITY} />
      ),
      cell: ({ getValue }) => getValue(),
    }),
    columnsHelper.accessor('state', {
      size: 270,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={ColumnHeader.PROFILE_STATE} />
      ),
      cell: ({ getValue }) => <ClientState state={getValue()} />,
    }),
    columnsHelper.display({
      size: 48,
      id: 'edit',
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" onClick={onRedirectEditProfile(row.original.name)}>
          <Edit2Icon size={16} />
        </Button>
      ),
    }),
    columnsHelper.display({
      size: 48,
      id: 'delete',
      cell: ({ row }) => {
        const onClickDeleteProfile = () => {
          queryClient.setQueryData(profileKeys.reading(), () => row.original);
          onProfileDeleteModalToggle();
        };

        return (
          <Button
            variant="destructive"
            size="icon"
            onClick={onClickDeleteProfile}
            disabled={props.isPendingDelete}
          >
            {props.isPendingDelete ? (
              <Icons.spinner className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2Icon size={16} />
            )}
          </Button>
        );
      },
    }),
  ];

  return { columns };
};
