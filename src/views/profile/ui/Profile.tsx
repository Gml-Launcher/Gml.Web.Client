"use client";

import React, { useEffect } from "react";

import { RowSelectionState } from "@tanstack/react-table";

import { ProfileLoading } from "@/views/profile";

import { FilesTable } from "@/widgets/files-table";
import { DownloadClientHub } from "@/widgets/client-hub";
import { AddingFilesWhitelistDialog } from "@/widgets/adding-files-whitelist-dialog";

import { EditProfileForm } from "@/features/edit-profile-form";

import { Section } from "@/entities/Section";
import { ProfileCard } from "@/entities/ProfileCard";

import { DASHBOARD_PAGES } from "@/shared/routes";
import { OsArchitectureEnum, OsTypeEnum } from "@/shared/enums";
import { useProfile } from "@/shared/hooks";
import { getStorageAccessToken, getStorageProfile } from "@/shared/services";
import { WhitelistFileBaseEntity } from "@/shared/api/contracts";
import { useDeleteFilesWhitelist } from "@/shared/hooks/useWhitelist";

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

export const ProfilePage = ({ params }: { params: { name: string } }) => {
  const account = getStorageProfile();
  const accessToken = getStorageAccessToken();
  const { data, mutate, isPending } = useProfile();
  const profile = data?.data;
  const { mutate: mutateDeleteFilesWhitelist } = useDeleteFilesWhitelist();

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

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

  const onSubmit = () => {
    const hashFiles = Object.entries(rowSelection).map(([hash, _]) => ({
      profileName: profile.profileName,
      hash,
    })) as WhitelistFileBaseEntity[];

    mutateDeleteFilesWhitelist(hashFiles);
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
                      <AlertDialogAction onClick={onSubmit}>Удалить</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <AddingFilesWhitelistDialog profileName={profile.profileName} files={profile.files} />
            </div>
            <FilesTable
              files={profile.whiteListFiles}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
            />
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
};
