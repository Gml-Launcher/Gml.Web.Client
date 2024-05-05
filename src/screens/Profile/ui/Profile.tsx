"use client";

import { useEffect } from "react";
import { OsArchitectureEnum, OsTypeEnum } from "@/shared/enums";
import { useProfile } from "@/shared/hooks";
import { getStorageAccessToken, getStorageProfile } from "@/shared/services/AuthTokenService";
import { DownloadClientHub } from "@/widgets/client-hub";
import Image from "next/image";
import { Section } from "@/entities/Section";
import { ProfileLoading } from "@/screens/Profile";
import { EditProfileForm } from "@/features/edit-profile-form/ui/EditProfileForm";
import { DASHBOARD_PAGES } from "@/shared/routes";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/ui/Breadcrumbs";

export const ProfilePage = ({ params }: { params: { name: string } }) => {
  const account = getStorageProfile();
  const accessToken = getStorageAccessToken();
  const { data, mutate, isPending } = useProfile();
  const profile = data?.data;

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
    </>
  );
};
