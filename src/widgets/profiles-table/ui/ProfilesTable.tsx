"use client";

import { DataTable, DataTableToolbar } from "@/entities/Table";
import { useColumns } from "../lib/columns";
import { useCurrentProfile, useDeleteProfile, useProfiles } from "@/shared/hooks";
import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { RowSelectionState } from "@tanstack/react-table";
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
import { ProfilesTableSkeleton } from "@/widgets/profiles-table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const ProfilesTable = () => {
  const { data: profiles, isLoading } = useProfiles();
  const currentProfile = useCurrentProfile();
  const deleteMutation = useDeleteProfile();

  const [isRemoveFilesSwitch, setIsRemoveFilesSwitch] = useState(true);
  const onRemoveFilesSwitchToggle = () => setIsRemoveFilesSwitch((prev) => !prev);

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

  const onProfileDelete =
    ({ profileName, removeFiles }: { profileName: string; removeFiles: boolean }) =>
    async () => {
      await deleteMutation.mutateAsync({ profileName, removeFiles });
      onRemoveFilesSwitchToggle();
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
          <DataTable
            data={profiles}
            columns={columns}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
          />
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
          <div className="flex items-center space-x-2">
            <Switch
              id="remove-files"
              checked={isRemoveFilesSwitch}
              onClick={onRemoveFilesSwitchToggle}
            />
            <Label htmlFor="remove-files">Удалить файлы</Label>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={onProfileDelete({
                profileName: currentProfile?.name || "",
                removeFiles: isRemoveFilesSwitch,
              })}
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
