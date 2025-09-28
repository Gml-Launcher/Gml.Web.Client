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
import { Cpu, Filter, Fingerprint, Hash, SearchIcon, User as UserIcon, X } from 'lucide-react';

import { useColumns } from '../lib/columns';

import { PlayersTableSkeleton } from './PlayersTableSkeleton';

import { usePlayers } from '@/shared/hooks/usePlayers';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

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
    findName: undefined as string | undefined,
    findUuid: undefined as string | undefined,
    findIp: undefined as string | undefined,
    findHwid: undefined as string | undefined,
    onlyBlocked: false,
    onlyDeviceBlocked: false,
    sortBy: undefined as 0 | 1 | 2 | undefined,
    sortDesc: false,
    take: 20,
  });

  const {
    data: players,
    isPending,
    isError,
    error,
    fetchNextPage,
    refetch,
  } = usePlayers(debouncedFilters);

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
      {/* Keep filters always mounted to preserve focus */}
      {isError && <span>Error: {error.message}</span>}
      <div className="flex flex-col gap-4" style={{ opacity: isPending ? 0.6 : 1 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Filter size={16} /> Фильтры игроков
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Ник"
                      aria-label="Поиск по нику"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="UUID"
                      aria-label="Поиск по UUID"
                      value={uuid}
                      onChange={(e) => setUuid(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="relative">
                    <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="IP"
                      aria-label="Поиск по IP"
                      value={ip}
                      onChange={(e) => setIp(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="relative">
                    <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="HWID"
                      aria-label="Поиск по HWID"
                      value={hwid}
                      onChange={(e) => setHwid(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 items-center">
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={onlyBlocked}
                        onCheckedChange={(v: any) => setOnlyBlocked(!!v)}
                      />
                      Только заблокированные
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={onlyDeviceBlocked}
                        onCheckedChange={(v: any) => setOnlyDeviceBlocked(!!v)}
                      />
                      Только заблокированные по устройству
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Сортировать по</span>
                    <Select
                      value={sortBy === undefined ? undefined : String(sortBy)}
                      onValueChange={(val) =>
                        setSortBy(
                          val === undefined || val === '' ? undefined : (Number(val) as 0 | 1 | 2),
                        )
                      }
                    >
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
                      <Checkbox checked={sortDesc} onCheckedChange={(v: any) => setSortDesc(!!v)} />
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
                  <div className="col-span-full flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-muted-foreground"
                      onClick={() => {
                        setSearch('');
                        setUuid('');
                        setIp('');
                        setHwid('');
                        setOnlyBlocked(false);
                        setOnlyDeviceBlocked(false);
                        setSortBy(undefined);
                        setSortDesc(false);
                        setTake(20);
                      }}
                    >
                      <X size={16} /> Сбросить
                    </Button>
                    <Button type="submit" variant="outline" className="gap-2" disabled={isPending}>
                      <SearchIcon size={16} />
                      {isPending ? 'Поиск…' : 'Найти'}
                    </Button>
                  </div>
                </div>

                {/* Active filters summary */}
                {(search ||
                  uuid ||
                  ip ||
                  hwid ||
                  onlyBlocked ||
                  onlyDeviceBlocked ||
                  sortBy !== undefined ||
                  sortDesc) && (
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {search && (
                      <span className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground flex items-center gap-1">
                        Ник: {search}
                        <button
                          type="button"
                          className="ml-1 opacity-70 hover:opacity-100"
                          onClick={() => setSearch('')}
                          aria-label="Очистить фильтр нику"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {uuid && (
                      <span className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground flex items-center gap-1">
                        UUID: {uuid}
                        <button
                          type="button"
                          className="ml-1 opacity-70 hover:opacity-100"
                          onClick={() => setUuid('')}
                          aria-label="Очистить фильтр UUID"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {ip && (
                      <span className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground flex items-center gap-1">
                        IP: {ip}
                        <button
                          type="button"
                          className="ml-1 opacity-70 hover:opacity-100"
                          onClick={() => setIp('')}
                          aria-label="Очистить фильтр IP"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {hwid && (
                      <span className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground flex items-center gap-1">
                        HWID: {hwid}
                        <button
                          type="button"
                          className="ml-1 opacity-70 hover:opacity-100"
                          onClick={() => setHwid('')}
                          aria-label="Очистить фильтр HWID"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {onlyBlocked && (
                      <span className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground">
                        Только заблокированные
                      </span>
                    )}
                    {onlyDeviceBlocked && (
                      <span className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground">
                        Только по устройству
                      </span>
                    )}
                    {sortBy !== undefined && (
                      <span className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground">
                        Сортировка: {sortBy === 0 ? 'Имя' : sortBy === 1 ? 'Авторизации' : 'Сессия'}
                      </span>
                    )}
                    {sortDesc && (
                      <span className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground">
                        По убыванию
                      </span>
                    )}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
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
    </>
  );
}
