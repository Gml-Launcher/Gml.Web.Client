"use client";

import React from "react";
import { createColumnHelper } from "@tanstack/table-core";
import { format } from "date-fns";

import { DataTableColumnHeader } from "@/entities/Table";
import { PlayerBaseEntity } from "@/shared/api/contracts";

enum ColumnHeader {
  ICON = "",
  NAME = "Игрок",
  SIGN_IN = "Авторизаций",
  SESSION_END_DATE = "Дата завершения сессии",
  UUID = "UUID",
  BANNED = "Заблокирован",
  IP_ADDRESS = "IP Адрес",
}

export const columnsHelper = createColumnHelper<PlayerBaseEntity>();
export const useColumns = () => {
  const columns: any = [
    columnsHelper.accessor("uuid", {
      size: 190,
      header: ({ column }) => <DataTableColumnHeader column={column} title={ColumnHeader.UUID} />,
      cell: ({ getValue }) => getValue(),
    }),
    columnsHelper.accessor("name", {
      size: 150,
      header: ({ column }) => <DataTableColumnHeader column={column} title={ColumnHeader.NAME} />,
      cell: ({ getValue }) => getValue(),
    }),
    columnsHelper.accessor("authHistory", {
      size: 100,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={ColumnHeader.SIGN_IN} />
      ),
      cell: ({ getValue }) => getValue().length,
    }),
    columnsHelper.accessor("expiredDate", {
      size: 300,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={ColumnHeader.SESSION_END_DATE} />
      ),
      cell: ({ getValue }) => format(getValue(), "dd.MM.yyyy в HH:mm:ss"),
    }),
    columnsHelper.accessor("isBanned", {
      size: 100,
      header: ({ column }) => <DataTableColumnHeader column={column} title={ColumnHeader.BANNED} />,
      cell: ({ getValue }) => (getValue() ? "Да" : "Нет"),
    }),
    columnsHelper.display({
      id: "address",
      size: 100,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={ColumnHeader.IP_ADDRESS} />
      ),
      cell: ({ row }) => {
        const distinctAddresses = Array.from(
          new Set(row.original.authHistory.map((c) => c.address)),
        );

        return <div className="flex flex-col">{distinctAddresses.join(", ")}</div>;
      },
    }),
  ];

  return { columns };
};
