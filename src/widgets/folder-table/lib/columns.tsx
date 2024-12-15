import { createColumnHelper } from '@tanstack/table-core';
import { ColumnDef } from '@tanstack/react-table';

import { ProfileFolderBaseEntity } from '@/shared/api/contracts';
import { Checkbox } from '@/shared/ui/checkbox';
import { DataTableColumnHeader } from '@/entities/Table';

enum ColumnHeader {
  PATH = 'Путь к папке',
}

export const columnsHelper = createColumnHelper<ProfileFolderBaseEntity>();
export const useColumns = () => {
  const columns: ColumnDef<ProfileFolderBaseEntity, any>[] = [
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
    columnsHelper.accessor('path', {
      size: 500,
      header: ({ column }) => <DataTableColumnHeader column={column} title={ColumnHeader.PATH} />,
      cell: ({ getValue }) => getValue(),
    }),
  ];

  return { columns };
};
