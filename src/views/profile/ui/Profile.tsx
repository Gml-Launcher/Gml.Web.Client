'use client';

import React, { useEffect, useState } from 'react';
import { RowSelectionState } from '@tanstack/react-table';
import { Laptop2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import classes from './styles.module.css';

import { ProfileLoading } from '@/views/profile';
import { FilesTable } from '@/widgets/files-table';
import { DownloadClientHub } from '@/widgets/client-hub';
import { AddingFilesWhitelistDialog } from '@/widgets/adding-files-whitelist-dialog';
import { AddingFoldersWhitelistDialog } from '@/widgets/adding-folders-whitelist-dialog';
import { GameServers } from '@/widgets/game-servers';
import { EditProfileForm } from '@/features/edit-profile-form';
import { Section } from '@/entities/Section';
import { ProfileCard } from '@/entities/ProfileCard';
import { DASHBOARD_PAGES } from '@/shared/routes';
import { OsArchitectureEnum, OsTypeEnum } from '@/shared/enums';
import { useDeleteFilesWhitelist, useDeleteFolderWhitelist, useProfile } from '@/shared/hooks';
import { getStorageAccessToken, getStorageProfile } from '@/shared/services';
import { FileListBaseEntity, FileListFolderBaseEntity } from '@/shared/api/contracts';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog';
import { FolderTable } from '@/widgets/folder-table';
import { GamePlayers } from '@/widgets/game-players';
import { useGamePlayerStore } from '@/widgets/game-players/lib/store';
import { GameMods } from '@/widgets/game-mods';

export const ProfilePage = ({ params }: { params: { name: string } }) => {
  const account = getStorageProfile();
  const accessToken = getStorageAccessToken();
  const { data, mutate, isPending } = useProfile();
  const { setPlayers } = useGamePlayerStore();
  const profile = data?.data.data;
  const router = useRouter();
  const searchParams = useSearchParams();

  const { mutate: mutateDeleteFilesWhitelist } = useDeleteFilesWhitelist();
  const { mutate: mutateDeleteFoldersWhitelist } = useDeleteFolderWhitelist();

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') || 'main');

  useEffect(() => {
    if (account && accessToken) {
      mutate({
        UserName: account.login,
        ProfileName: decodeURIComponent(params.name),
        UserAccessToken: accessToken,
        UserUuid: 'uuid',
        OsArchitecture: OsArchitectureEnum.X64,
        OsType: OsTypeEnum.WINDOWS.toString(),
      });
    }
  }, []);

  useEffect(() => {
    if (profile !== undefined) {
      setPlayers(profile?.usersWhiteList);
    }
  }, [profile, setPlayers]);

  if (isPending || !profile) return <ProfileLoading />;

  const onSubmitDeleteFiles = () => {
    const hashFiles = Object.entries(rowSelection).map(([directory, _]) => ({
      profileName: profile.profileName,
      directory,
    })) as FileListBaseEntity[];

    mutateDeleteFilesWhitelist(hashFiles);
  };

  const onSubmitDeleteFolders = () => {
    const folders = Object.entries(rowSelection).map(([path, _]) => ({
      profileName: profile.profileName,
      path,
    })) as FileListFolderBaseEntity[];

    mutateDeleteFoldersWhitelist(folders);
  };

  return (
    <>
      <Breadcrumbs
        current={profile.profileName}
        breadcrumbs={[
          { value: 'Главная', path: DASHBOARD_PAGES.HOME },
          {
            value: 'Профили',
            path: DASHBOARD_PAGES.PROFILES,
          },
        ]}
      />

      <div className={classes.profile}>
        <ProfileCard profile={profile} />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          router.push(`/dashboard/profile/${params.name}?tab=${value}`, { scroll: false });
        }}
        aria-orientation="vertical"
        orientation="vertical"
        className="flex flex-col md:flex-row gap-6 items-start"
      >
        <TabsList className={classes.tabs__list}>
          <TabsTrigger className="w-full h-10" value="main">
            Основные
          </TabsTrigger>
          <TabsTrigger className="w-full h-10" value="client">
            Клиент
          </TabsTrigger>
          <TabsTrigger className="w-full h-10" value="files">
            Файлы
          </TabsTrigger>
          <TabsTrigger className="w-full h-10" value="folders">
            Папки
          </TabsTrigger>
          <TabsTrigger className="w-full h-10" value="servers">
            Сервера
          </TabsTrigger>
          <TabsTrigger className="w-full h-10" value="players">
            Игроки
          </TabsTrigger>
          <TabsTrigger className="w-full h-10" value="mods">
            Моды
          </TabsTrigger>
        </TabsList>
        <TabsContent value="main" className={classes.tabs__content}>
          <Section
            title="Настройки профиля"
            subtitle="Обновите фотографию профиля и подробную информацию здесь"
          >
            <EditProfileForm profile={profile} />
          </Section>
        </TabsContent>
        <TabsContent value="client" className={classes.tabs__content}>
          <Section title="Загрузка клиента" subtitle="Необходимо для генерации клиента Minecraft">
            <DownloadClientHub key="DownloadClientHub" profile={profile} />
          </Section>
        </TabsContent>
        <TabsContent value="files" className={classes.tabs__content}>
          <Section
            title="Белый список файлов"
            subtitle="Белый список необходим для того чтобы исключить выбранные файлы из автоматического удаления"
          >
            <div className="hidden md:flex flex-col gap-3">
              <div className={classes.tabs__whitelist}>
                <AddingFilesWhitelistDialog
                  profile={profile}
                  profileName={profile.profileName}
                  files={profile.files}
                />
                {!!Object.keys(rowSelection).length && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">Удалить выбранные файлы</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Удаление файлов из белого списка</AlertDialogTitle>
                        <AlertDialogDescription>
                          {`Вы уверены что хотите удалить ${Object.keys(rowSelection).length} файлы(ов) из белого списка?`}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction onClick={onSubmitDeleteFiles}>Удалить</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
              <FilesTable
                files={profile.whiteListFiles}
                profile={profile}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
              />
            </div>
            <div className="block md:hidden">
              <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-card">
                <div className="mb-4">
                  <Laptop2 />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Доступно только на компьютерах</h3>
                <p className="text-sm text-muted-foreground">
                  Пожалуйста, используйте десктопную версию для управления файлами
                </p>
              </div>
            </div>
          </Section>
        </TabsContent>
        <TabsContent value="folders" className={classes.tabs__content}>
          <Section
            title="Белый список папок"
            subtitle="Белый список необходим для того чтобы исключить выбранные папки из автоматического удаления"
          >
            <div className="hidden md:flex flex-col gap-3">
              <div className={classes.tabs__whitelist}>
                <AddingFoldersWhitelistDialog profileName={profile.profileName} />
                {!!Object.keys(rowSelection).length && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">Удалить выбранные папки</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Удаление папок из белого списка</AlertDialogTitle>
                        <AlertDialogDescription>
                          {`Вы уверены что хотите удалить ${Object.keys(rowSelection).length} папку(и) из белого списка?`}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction onClick={onSubmitDeleteFolders}>
                          Удалить
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
              <FolderTable
                folders={profile.whiteListFolders}
                profile={profile}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
              />
            </div>

            <div className="block md:hidden">
              <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-card">
                <div className="mb-4">
                  <Laptop2 />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Доступно только на компьютерах</h3>
                <p className="text-sm text-muted-foreground">
                  Пожалуйста, используйте десктопную версию для управления файлами
                </p>
              </div>
            </div>
          </Section>
        </TabsContent>
        <TabsContent value="servers" className={classes.tabs__content}>
          <Section
            title="Сервера"
            subtitle="Добавление серверов, для вывода онлайна в лаунчере, можно использовать домены, srv записи и IP адреса"
          >
            <GameServers profile={profile} />
          </Section>
        </TabsContent>
        <TabsContent value="players" className={classes.tabs__content}>
          <Section
            title="Игроки"
            subtitle="Управление игроками, которые могут заходить в игровой клиент, даже если он выключен или недоступен"
          >
            <GamePlayers profile={profile} />
          </Section>
        </TabsContent>
        <TabsContent value="mods" className={classes.tabs__content}>
          <Section title="Моды" subtitle="Управление игровыми модификациями">
            <GameMods profile={profile} />
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
};
