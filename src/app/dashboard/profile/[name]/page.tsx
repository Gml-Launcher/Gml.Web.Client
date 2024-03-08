"use client";

import { CreateProfileForm } from "@/feature/create-profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect } from "react";
import { useProfile } from "@/shared/hooks";
import { OsArchitectureEnum, OsTypeEnum } from "@/shared/enums";
import { getStorageAccessToken, getStorageProfile } from "@/shared/services/AuthTokenService";
import { DownloadClientHub } from "@/widgets/client-hub";

export default function ProfilePage({ params }: { params: { name: string } }) {
  const profile = getStorageProfile();
  const accessToken = getStorageAccessToken();
  const { data, mutate } = useProfile();

  useEffect(() => {
    if (profile && accessToken) {
      mutate({
        UserName: profile.login,
        ProfileName: params.name,
        UserAccessToken: accessToken,
        UserUuid: "uuid",
        OsArchitecture: OsArchitectureEnum.X64,
        OsType: OsTypeEnum.WINDOWS.toString(),
      });
    }
  }, []);

  return (
    <div className="flex flex-col items-start py-4">
      <h1 className="text-xl font-bold mb-8">Профиль {params.name}</h1>
      <div className="flex flex-col gap-y-6 w-full">
        <Card className="w-[700px]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Редактирование профиля</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-y-6">
            <CreateProfileForm profile={data?.data} isEditing />
          </CardContent>
        </Card>

        <DownloadClientHub key="DownloadClientHub" profileName={params.name} />
      </div>
    </div>
  );
}
