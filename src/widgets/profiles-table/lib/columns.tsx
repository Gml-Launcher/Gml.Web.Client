"use client";

import { createColumnHelper } from "@tanstack/table-core";
import { ProfileBaseEntity } from "@/shared/api/contracts";
import Image from "next/image";
import { DataTableColumnHeader } from "@/entities/Table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Edit2Icon, Trash2Icon } from "lucide-react";

enum ColumnHeader {
  ICON = "",
  NAME = "Название",
  CREATED_AT = "Дата создания",
  VERSION_LAUNCHER = "Версия",
}

interface UseColumnsProps {
  onProfileDeleteModalToggle: () => void;
}

export const columnsHelper = createColumnHelper<ProfileBaseEntity>();
export const useColumns = (props: UseColumnsProps) => {
  const { onProfileDeleteModalToggle } = props;

  const columns = [
    columnsHelper.display({
      id: "checkbox",
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
      header: ColumnHeader.ICON,
      cell: ({ row }) => (
        <Image
          src={`data:text/plain;base64,${row.original.iconBase64}`}
          alt={row.original.name}
          width={32}
          height={32}
        />
      ),
    }),
    columnsHelper.accessor("name", {
      header: ({ column }) => <DataTableColumnHeader column={column} title={ColumnHeader.NAME} />,
      cell: ({ getValue }) => getValue(),
    }),
    columnsHelper.accessor("launchVersion", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={ColumnHeader.VERSION_LAUNCHER} />
      ),
      cell: ({ getValue }) => getValue(),
    }),
    columnsHelper.accessor("createDate", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={ColumnHeader.CREATED_AT} />
      ),
      cell: ({ getValue }) => getValue(),
    }),
    columnsHelper.display({
      id: "edit",
      cell: () => (
        <Button variant={"ghost"} size={"icon"}>
          <Edit2Icon size={16} />
        </Button>
      ),
    }),
    columnsHelper.display({
      id: "delete",
      cell: () => (
        <Button variant={"destructive"} size={"icon"} onClick={onProfileDeleteModalToggle}>
          <Trash2Icon size={16} />
        </Button>
      ),
    }),
  ];

  return { columns };
};
