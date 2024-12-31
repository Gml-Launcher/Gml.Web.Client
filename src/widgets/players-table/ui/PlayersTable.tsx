'use client';

import React, { useEffect, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useInView } from 'react-intersection-observer';
import { SearchIcon } from 'lucide-react';

import { useColumns } from '../lib/columns';

import { PlayersTableSkeleton } from './PlayersTableSkeleton';

import { usePlayers } from '@/shared/hooks/usePlayers';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';

export function PlayersTable() {
  const { ref, inView } = useInView();
  const [search, setSearch] = useState('');
  const { data: players, status, error, fetchNextPage, refetch } = usePlayers(search);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { columns } = useColumns();

  const table = useReactTable({
    data: players || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
      pagination: {
        pageSize: players?.length || 20,
        pageIndex: 0,
      },
      columnVisibility,
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    refetch();
  };

  return (
    <>
      {status === 'pending' ? (
        <PlayersTableSkeleton />
      ) : status === 'error' ? (
        <span>Error: {error.message}</span>
      ) : (
        <div className="flex flex-col gap-4">
          <form onSubmit={onSubmit} className="flex gap-4">
            <Input
              type="text"
              placeholder="Поиск по нику"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit" variant="outline" className="gap-2">
              <SearchIcon size={16} />
              Найти
            </Button>
          </form>
          {players && (
            <div className="rounded-md border w-full">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} style={{ width: header.getSize() }}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        Нет данных.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          <div ref={ref} style={{ height: '10px' }} />
        </div>
      )}
    </>
  );
}
