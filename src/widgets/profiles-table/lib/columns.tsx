"use client";

import React from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/table-core";

import { Edit2Icon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/entities/Table";
import { ProfileBaseEntity } from "@/shared/api/contracts";
import { DASHBOARD_PAGES } from "@/shared/routes";
import { Icons } from "@/shared/ui/icons";

enum ColumnHeader {
  ICON = "",
  NAME = "Название",
  CREATED_AT = "Дата создания",
  VERSION_LAUNCHER = "Версия",
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

  const columns = [
    columnsHelper.display({
      id: "checkbox",
      size: 48,
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
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
    columnsHelper.accessor("iconBase64", {
      size: 64,
      header: ColumnHeader.ICON,
      cell: ({ row }) => (
        <Image
          className="min-w-8 min-h-8"
          src={`data:text/plain;base64,${row.original.iconBase64}`}
          alt={row.original.name}
          width={32}
          height={32}
        />
      ),
    }),
    columnsHelper.accessor("name", {
      size: 500,
      header: ({ column }) => <DataTableColumnHeader column={column} title={ColumnHeader.NAME} />,
      cell: ({ getValue }) => getValue(),
    }),
    columnsHelper.accessor("launchVersion", {
      size: 500,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={ColumnHeader.VERSION_LAUNCHER} />
      ),
      cell: ({ getValue }) => getValue(),
    }),
    columnsHelper.accessor("createDate", {
      size: 500,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={ColumnHeader.CREATED_AT} />
      ),
      cell: ({ getValue }) => getValue(),
    }),
    columnsHelper.display({
      size: 48,
      id: "edit",
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" onClick={onRedirectEditProfile(row.original.name)}>
          <Edit2Icon size={16} />
        </Button>
      ),
    }),
    columnsHelper.display({
      size: 48,
      id: "delete",
      cell: ({ row }) => {
        const onClickDeleteProfile = () => {
          queryClient.setQueryData(["profile"], () => row.original);
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
