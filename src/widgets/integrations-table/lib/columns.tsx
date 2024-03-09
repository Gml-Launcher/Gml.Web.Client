"use client";

import { createColumnHelper } from "@tanstack/table-core";
import { AuthIntegrationBaseEntity } from "@/shared/api/contracts";
import { DataTableColumnHeader } from "@/entities/Table";
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit2Icon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

enum ColumnHeader {
  NAME = "Название",
  AUTH_TYPE = "Тип авторизации",
  ENDPOINT = "Эндпоинт",
}

interface UseColumnsProps {
  onIntegrationEditDialogToggle: () => void;
}

export const columnsHelper = createColumnHelper<AuthIntegrationBaseEntity>();
export const useColumns = (props: UseColumnsProps) => {
  const { onIntegrationEditDialogToggle } = props;

  const queryClient = useQueryClient();

  const columns: any = [
    columnsHelper.accessor("name", {
      size: 500,
      header: ({ column }) => <DataTableColumnHeader column={column} title={ColumnHeader.NAME} />,
      cell: ({ getValue }) => getValue(),
    }),
    columnsHelper.accessor("authType", {
      size: 500,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={ColumnHeader.AUTH_TYPE} />
      ),
      cell: ({ getValue }) => getValue(),
    }),
    columnsHelper.accessor("endpoint", {
      size: 500,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={ColumnHeader.ENDPOINT} />
      ),
      cell: ({ getValue }) => getValue(),
    }),
    columnsHelper.display({
      size: 48,
      id: "edit",
      cell: ({ row }) => {
        const onClickEditIntegration = () => {
          queryClient.setQueryData(["integration"], () => row.original);
          onIntegrationEditDialogToggle();
        };

        return (
          <Button variant={"ghost"} size={"icon"} onClick={onClickEditIntegration}>
            <Edit2Icon size={16} />
          </Button>
        );
      },
    }),
  ];

  return { columns };
};
