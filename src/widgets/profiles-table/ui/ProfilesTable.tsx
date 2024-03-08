"use client";

import { DataTableToolbar } from "@/entities/Table";
import { useColumns } from "../lib/columns";
import { useProfiles } from "@/shared/hooks";
import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { flexRender, RowSelectionState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTable } from "../lib/table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/entities/Table/ui/items/data-table-pagination";
import { ProfilesTableSkeleton } from "@/widgets/profiles-table";
import { useCurrentProfile, useDeleteProfile } from "@/shared/hooks/useProfiles";

export const ProfilesTable = () => {
  const { data: profiles, isLoading } = useProfiles();
  const currentProfile = useCurrentProfile();
  const deleteMutation = useDeleteProfile();

  const [isProfilesDrawerOpen, setIsProfilesDrawerOpen] = useState(false);
  const onProfilesDrawerToggle = () => setIsProfilesDrawerOpen((prev) => !prev);

  const [isProfileDeleteModalOpen, setIsProfileDeleteModalOpen] = useState(false);
  const onProfileDeleteModalToggle = () => setIsProfileDeleteModalOpen((prev) => !prev);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { columns } = useColumns({
    onProfileDeleteModalToggle,
    isPendingDelete: deleteMutation.isPending,
  });
  const { table } = useTable({ data: profiles, columns, rowSelection, setRowSelection });

  const onProfileDelete = (profileName: string) => async () => {
    await deleteMutation.mutateAsync(profileName);
  };

  return (
    <>
      {isLoading && <ProfilesTableSkeleton />}
      {profiles && (
        <>
          <DataTableToolbar
            table={table}
            rowSelection={rowSelection}
            onOpenChange={onProfilesDrawerToggle}
          />
          <div className="rounded-md border w-full">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(
                      ({ id: headerId, column, isPlaceholder, getContext, getSize }) => {
                        return (
                          <TableHead key={headerId} style={{ width: getSize() }}>
                            {isPlaceholder
                              ? null
                              : flexRender(column.columnDef.header, getContext())}
                          </TableHead>
                        );
                      },
                    )}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
          <DataTablePagination table={table} />
        </>
      )}

      <Sheet open={isProfilesDrawerOpen} onOpenChange={onProfilesDrawerToggle}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Групповое действие над профилями</SheetTitle>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Удаление профилей</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-y-4">
                <CardDescription>
                  Вы можете безвозвратно удалить профили, если они вам не нужны
                </CardDescription>
                <CardDescription>
                  Безвозвратно будут удалены: {Object.keys(rowSelection).join(", ")}
                </CardDescription>
                <Button variant="destructive" className="w-fit">
                  Удалить профили
                </Button>
              </CardContent>
            </Card>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <AlertDialog open={isProfileDeleteModalOpen} onOpenChange={onProfileDeleteModalToggle}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удаление профиля</AlertDialogTitle>
            <AlertDialogDescription>
              {`Вы уверены что хотите безвозвратно удалить профиль "${currentProfile?.name}"?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={onProfileDelete(currentProfile?.name || "")}>
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
