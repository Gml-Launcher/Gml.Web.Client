'use client';

import { RowSelectionState } from '@tanstack/react-table';
import { MixerHorizontalIcon } from '@radix-ui/react-icons';

import { Button } from '@/shared/ui/button';

interface DataTableToolbarProps<TData> {
  rowSelection: RowSelectionState;
  onOpenChange?: () => void;
}

export function DataTableToolbar<TData>({
  rowSelection,
  onOpenChange,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        size="sm"
        className="h-8"
        onClick={onOpenChange}
        disabled={!Object.keys(rowSelection).length}
      >
        <MixerHorizontalIcon className="mr-2 h-4 w-4" />
        Управление выбранными профилями
      </Button>
    </div>
  );
}
