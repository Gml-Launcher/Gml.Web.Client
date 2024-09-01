"use client";

import { useEffect, useState } from "react";

import { RowSelectionState } from "@tanstack/react-table";

import { ProfileLoading } from "@/views/profile";

import { FilesTable } from "@/widgets/files-table";
import { DownloadClientHub } from "@/widgets/client-hub";
import { AddingFilesWhitelistDialog } from "@/widgets/adding-files-whitelist-dialog";
import { AddingFoldersWhitelistDialog } from "@/widgets/adding-folders-whitelist-dialog";
import { GameServers } from "@/widgets/game-servers";

import { EditProfileForm } from "@/features/edit-profile-form";

import { Section } from "@/entities/Section";
import { ProfileCard } from "@/entities/ProfileCard";

import { DASHBOARD_PAGES } from "@/shared/routes";
import { OsArchitectureEnum, OsTypeEnum } from "@/shared/enums";
import { useProfile } from "@/shared/hooks";
import { getStorageAccessToken, getStorageProfile } from "@/shared/services";
import { WhitelistFileBaseEntity, WhitelistFolderBaseEntity } from "@/shared/api/contracts";
import { useDeleteFilesWhitelist, useDeleteFolderWhitelist } from "@/shared/hooks/useWhitelist";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { Button } from "@/shared/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
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
} from "@/shared/ui/alert-dialog";

import classes from "./styles.module.css";
import { FolderTable } from "@/widgets/folder-table";

export const ProfilePage = ({ params }: { params: { name: string } }) => {
  const account = getStorageProfile();
  const accessToken = getStorageAccessToken();
  const { data, mutate, isPending } = useProfile();
  const profile = data?.data;

  const { mutate: mutateDeleteFilesWhitelist } = useDeleteFilesWhitelist();
  const { mutate: mutateDeleteFoldersWhitelist } = useDeleteFolderWhitelist();

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  useEffect(() => {
    if (account && accessToken) {
      mutate({
        UserName: account.login,
        ProfileName: decodeURIComponent(params.name),
        UserAccessToken: accessToken,
        UserUuid: "uuid",
        OsArchitecture: OsArchitectureEnum.X64,
        OsType: OsTypeEnum.WINDOWS.toString(),
      });
    }
  }, []);

  if (isPending || !profile) return <ProfileLoading />;

  const onSubmitDeleteFiles = () => {
    const hashFiles = Object.entries(rowSelection).map(([hash, _]) => ({
      profileName: profile.profileName,
      hash,
    })) as WhitelistFileBaseEntity[];

    mutateDeleteFilesWhitelist(hashFiles);
  };

  const onSubmitDeleteFolders = () => {
    const folders = Object.entries(rowSelection).map(([path, _]) => ({
      profileName: profile.profileName,
      path,
    })) as WhitelistFolderBaseEntity[];

    mutateDeleteFoldersWhitelist(folders);
  };

  return (
    <>
      <Breadcrumbs
        current={profile.profileName}
        breadcrumbs={[
          { value: "Главная", path: DASHBOARD_PAGES.HOME },
          {
            value: "Профили",
            path: DASHBOARD_PAGES.PROFILES,
          },
        ]}
      />

      <div className={classes.profile}>
        <ProfileCard profile={profile} />
      </div>

      <Tabs
        defaultValue="main"
        aria-orientation="vertical"
        orientation="vertical"
        className={classes.tabs}
      >
        <TabsList defaultValue="main" className={classes.tabs__list}>
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
            <div className={classes.tabs__whitelist}>
              <AddingFilesWhitelistDialog profileName={profile.profileName} files={profile.files} />
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
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
            />
          </Section>
        </TabsContent>
        <TabsContent value="folders" className={classes.tabs__content}>
          <Section
            title="Белый список папок"
            subtitle="Белый список необходим для того чтобы исключить выбранные папки из автоматического удаления"
          >
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
                      <AlertDialogAction onClick={onSubmitDeleteFolders}>Удалить</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
            <FolderTable
              folders={profile.whiteListFolders}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
            />
          </Section>
        </TabsContent>
        <TabsContent value="servers" className={classes.tabs__content}>
          <Section title="Сервера" subtitle="Управление серверами">
            <GameServers profile={profile} />
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
};
