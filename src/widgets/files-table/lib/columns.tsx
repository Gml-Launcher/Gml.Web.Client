"use client";

import { createColumnHelper } from "@tanstack/table-core";

import { DataTableColumnHeader } from "@/entities/Table";
import { ProfileFileBaseEntity } from "@/shared/api/contracts";
import { Checkbox } from "@/shared/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

enum ColumnHeader {
  NAME = "Название",
  DIRECTORY = "Директория",
  FILE_SIZE = "Размер файла",
}

export const columnsHelper = createColumnHelper<ProfileFileBaseEntity>();
export const useColumns = () => {
  const columns: ColumnDef<ProfileFileBaseEntity, any>[] = [
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
    columnsHelper.accessor("name", {
      size: 500,
      header: ({ column }) => <DataTableColumnHeader column={column} title={ColumnHeader.NAME} />,
      cell: ({ getValue }) => getValue(),
    }),
    columnsHelper.accessor("directory", {
      size: 500,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={ColumnHeader.DIRECTORY} />
      ),
      cell: ({ getValue }) => getValue(),
    }),
    columnsHelper.accessor("size", {
      size: 500,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={ColumnHeader.FILE_SIZE} />
      ),
      cell: ({ getValue }) => getValue(),
      enableColumnFilter: false,
    }),
  ];

  return { columns };
};
