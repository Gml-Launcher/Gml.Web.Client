'use client';

import React, { useState } from 'react';
import { RowSelectionState } from '@tanstack/react-table';

import { useColumns } from '../lib/columns';

import { ProfilesTableSkeleton } from './ProfilesTableSkeleton';

import { DataTable, DataTableToolbar } from '@/entities/Table';
import {
  useCurrentProfile,
  useDeleteProfile,
  useDeleteProfiles,
  useProfiles,
} from '@/shared/hooks';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Label } from '@/shared/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/ui/sheet';
import { Switch } from '@/shared/ui/switch';
import { Icons } from '@/shared/ui/icons';

export function ProfilesTable() {
  const { data: profiles, isLoading } = useProfiles();
  const { data: currentProfile } = useCurrentProfile();
  const deleteMutation = useDeleteProfile();
  const deleteAllMutation = useDeleteProfiles();

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

  //console.log(profiles);

  const onProfileDelete =
    ({ profileName, removeFiles }: { profileName: string; removeFiles: boolean }) =>
    async () => {
      await deleteMutation.mutateAsync({ profileName, removeFiles });
      onRemoveFilesSwitchToggle();
    };

  const onProfilesDelete =
    ({ profiles, removeFiles }: { profiles: string[]; removeFiles: boolean }) =>
    async () => {
      await deleteAllMutation.mutateAsync({ profileNames: profiles.join(','), removeFiles });
      onProfilesDrawerToggle();
    };

  return (
    <>
      {isLoading && <ProfilesTableSkeleton />}
      {profiles && (
        <>
          <DataTableToolbar rowSelection={rowSelection} onOpenChange={onProfilesDrawerToggle} />
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
                  Безвозвратно будут удалены: {Object.keys(rowSelection).join(', ')}
                </CardDescription>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="remove-files"
                    checked={isRemoveFilesSwitch}
                    onClick={onRemoveFilesSwitchToggle}
                  />
                  <Label htmlFor="remove-files">Удалить файлы</Label>
                </div>
                <Button
                  variant="destructive"
                  className="w-fit"
                  onClick={onProfilesDelete({
                    profiles: Object.keys(rowSelection),
                    removeFiles: isRemoveFilesSwitch,
                  })}
                  disabled={deleteAllMutation.isPending}
                >
                  {deleteAllMutation.isPending && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
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
                profileName: currentProfile?.name || '',
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
}
