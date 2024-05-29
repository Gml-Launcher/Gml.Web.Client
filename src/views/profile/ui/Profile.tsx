"use client";

import React, { useEffect } from "react";

import Image from "next/image";

import { RowSelectionState } from "@tanstack/react-table";

import { DownloadClientHub } from "@/widgets/client-hub";
import { AddingFilesWhitelistDialog } from "@/widgets/adding-files-whitelist-dialog";
import { FilesTable } from "@/widgets/files-table";

import { EditProfileForm } from "@/features/edit-profile-form";

import { Section } from "@/entities/Section";

import { DASHBOARD_PAGES } from "@/shared/routes";
import { OsArchitectureEnum, OsTypeEnum } from "@/shared/enums";
import { useProfile } from "@/shared/hooks";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { getStorageAccessToken, getStorageProfile } from "@/shared/services";

import { ProfileLoading } from "./ProfileLoading";
import { WhitelistFileBaseEntity } from "@/shared/api/contracts";
import { useDeleteFilesWhitelist } from "@/shared/hooks/useWhitelist";
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
import { Button } from "@/shared/ui/button";

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
        ProfileName: params.name,
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
      <div className="flex gap-x-8 items-center">
        <div className={"flex justify-center items-center h-24 w-24 bg-gray-50 rounded-lg"}>
          <Image
            className="min-w-12 min-h-12"
            src={`data:text/plain;base64,${profile.iconBase64}`}
            alt={profile.profileName}
            width={32}
            height={32}
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <h2 className="text-4xl font-bold">Профиль {profile.profileName}</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">{profile.clientVersion}</p>
        </div>
      </div>

      <Section
        title="Настройки профиля"
        subtitle="Обновите фотографию профиля и подробную информацию здесь"
      >
        <EditProfileForm profile={profile} />
      </Section>

      <Section title="Загрузка клиента" subtitle="Необходимо для генерации клиента Minecraft">
        <DownloadClientHub key="DownloadClientHub" profile={profile} />
      </Section>

      <Section title="Белый список файлов">
        <div className="flex items-center gap-x-4 ml-auto">
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

      <div className="min-h-4" />
    </>
  );
};
