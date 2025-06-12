'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { RowSelectionState } from '@tanstack/react-table';
import { Edit2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useColumns } from '../lib/columns';

import { ProfilesTableSkeleton } from './ProfilesTableSkeleton';

import { DataTableToolbar } from '@/entities/Table';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Label } from '@/shared/ui/label';
import { Switch } from '@/shared/ui/switch';
import { Separator } from '@/shared/ui/separator';
import { convertApiGameLoaderImage } from '@/shared/converters';
import { ClientState } from '@/widgets/client-hub';
import { Button } from '@/shared/ui/button';
import { DASHBOARD_PAGES } from '@/shared/routes';

export function ProfilesCard() {
  const { data: profiles, isLoading } = useProfiles();
  const { data: currentProfile } = useCurrentProfile();
  const router = useRouter();
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

  const onRedirectEditProfile = (profileName: string) => () => {
    router.push(`${DASHBOARD_PAGES.PROFILE}/${profileName}`);
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {profiles.map((profile) => (
              <Card key={profile.name} className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-4">
                    {profile.iconBase64 ? (
                      <Image
                        className="min-w-12 min-h-12 h-12 w-12"
                        src={`data:image/png;base64,${profile.iconBase64}`}
                        alt={profile.name || 'Profile Icon'}
                        width={48}
                        height={48}
                      />
                    ) : (
                      <div className="flex items-center justify-center min-w-12 min-h-12 h-12 w-12 bg-gray-200/5 rounded-xl">
                        {profile.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div className="flex flex-col gap-1">
                      <div className="flex flex-col gap-2">
                        <h3>{profile.displayName}</h3>
                        <p className="text-sm text-muted-foreground">{profile.name}</p>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="flex">
                        {convertApiGameLoaderImage(profile.state) || 'Не загружен'}
                        {profile.launchVersion}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Дата создания:</span>
                      <span>{new Date(profile.createDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Приоритет:</span>
                      <span>{profile.priority}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Статус:</span>
                      <ClientState state={profile.state} />
                    </div>

                    <Button
                      variant="secondary"
                      className="gap-3 w-full"
                      onClick={onRedirectEditProfile(profile.name)}
                    >
                      <Edit2Icon size={16} />
                      Изменить
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

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
