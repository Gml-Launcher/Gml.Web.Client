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
import { Checkbox } from '@/shared/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

export function PlayersTable() {
  const { ref, inView } = useInView();
  const [search, setSearch] = useState('');
  const [uuid, setUuid] = useState('');
  const [ip, setIp] = useState('');
  const [hwid, setHwid] = useState('');
  const [onlyBlocked, setOnlyBlocked] = useState(false);
  const [onlyDeviceBlocked, setOnlyDeviceBlocked] = useState(false);
  const [sortBy, setSortBy] = useState<0 | 1 | 2 | undefined>(undefined);
  const [sortDesc, setSortDesc] = useState(false);
  const [take, setTake] = useState(20);

  const [debouncedFilters, setDebouncedFilters] = useState({
    findName: '',
    findUuid: '',
    findIp: '',
    findHwid: '',
    onlyBlocked: false,
    onlyDeviceBlocked: false,
    sortBy: undefined as 0 | 1 | 2 | undefined,
    sortDesc: false,
    take: 20,
  });

  const { data: players, status, error, fetchNextPage, refetch } = usePlayers(debouncedFilters);

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

  // Auto-search when user stops typing (debounce)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters({
        findName: search.trim() || undefined,
        findUuid: uuid.trim() || undefined,
        findIp: ip.trim() || undefined,
        findHwid: hwid.trim() || undefined,
        onlyBlocked,
        onlyDeviceBlocked,
        sortBy,
        sortDesc,
        take,
      } as any);
    }, 500);
    return () => clearTimeout(handler);
  }, [search, uuid, ip, hwid, onlyBlocked, onlyDeviceBlocked, sortBy, sortDesc, take]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDebouncedFilters({
      findName: search.trim() || undefined,
      findUuid: uuid.trim() || undefined,
      findIp: ip.trim() || undefined,
      findHwid: hwid.trim() || undefined,
      onlyBlocked,
      onlyDeviceBlocked,
      sortBy,
      sortDesc,
      take,
    } as any);
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
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input
                type="text"
                placeholder="Поиск по нику"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Поиск по UUID"
                value={uuid}
                onChange={(e) => setUuid(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Поиск по IP"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Поиск по HWID"
                value={hwid}
                onChange={(e) => setHwid(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <label className="inline-flex items-center gap-2 text-sm">
                <Checkbox checked={onlyBlocked} onCheckedChange={(v:any) => setOnlyBlocked(!!v)} />
                Только заблокированные
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <Checkbox checked={onlyDeviceBlocked} onCheckedChange={(v:any) => setOnlyDeviceBlocked(!!v)} />
                Только заблокированные по устройству
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Сортировать по</span>
                <Select value={sortBy === undefined ? undefined : String(sortBy)} onValueChange={(val) => setSortBy((val === undefined || val === '' ? undefined : (Number(val) as 0|1|2)))}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Не выбрано" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Имя</SelectItem>
                    <SelectItem value="1">Количество авторизаций</SelectItem>
                    <SelectItem value="2">Окончание сессии</SelectItem>
                  </SelectContent>
                </Select>
                <label className="inline-flex items-center gap-2 text-sm">
                  <Checkbox checked={sortDesc} onCheckedChange={(v:any) => setSortDesc(!!v)} />
                  По убыванию
                </label>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">На страницу</span>
                <Select value={String(take)} onValueChange={(val) => setTake(Number(val))}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="ml-auto">
                <Button type="submit" variant="outline" className="gap-2">
                  <SearchIcon size={16} />
                  Найти
                </Button>
              </div>
            </div>
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
