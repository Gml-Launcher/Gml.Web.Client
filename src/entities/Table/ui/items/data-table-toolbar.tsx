'use client';

import React from 'react';

import { RowSelectionState, Table } from '@tanstack/react-table';

import { MixerHorizontalIcon } from '@radix-ui/react-icons';

import { DataTableViewOptions } from '@/entities/Table/ui/items/data-table-view-options';
import { Button } from '@/shared/ui/button';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  rowSelection: RowSelectionState;
  onOpenChange?: () => void;
}

export function DataTableToolbar<TData>({
  table,
  rowSelection,
  onOpenChange,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      {!!Object.keys(rowSelection).length && (
        <Button variant="outline" size="sm" className="h-8" onClick={onOpenChange}>
          <MixerHorizontalIcon className="mr-2 h-4 w-4" />
          Управлять профилями
        </Button>
      )}
      <DataTableViewOptions table={table} />
    </div>
  );
}
