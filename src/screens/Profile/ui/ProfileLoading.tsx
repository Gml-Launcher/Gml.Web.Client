"use client";

import { Skeleton } from "@/shared/ui/skeleton";
import { DownloadClientHub } from "@/widgets/client-hub";
import { EditProfileForm } from "@/features/edit-profile-form";
import { DASHBOARD_PAGES } from "@/shared/routes";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs/ui/Breadcrumbs";

export const ProfileLoading = () => {
  return (
    <>
      <Breadcrumbs
        current={"..."}
        breadcrumbs={[
          { value: "Главная", path: DASHBOARD_PAGES.HOME },
          {
            value: "Профили",
            path: DASHBOARD_PAGES.PROFILES,
          },
        ]}
      />
      <div className="flex gap-x-8 items-center">
        <Skeleton className="h-24 w-24" />
        <div className="flex flex-col gap-y-2">
          <Skeleton className="h-10 w-96" />
          <Skeleton className="h-5 w-48" />
        </div>
      </div>
      <section className="flex flex-col gap-y-4 mb-8">
        <div className="flex flex-col gap-y-1">
          <h5 className="text-xl font-bold">Настройки профиля</h5>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Обновите фотографию профиля и подробную информацию здесь
          </p>
        </div>
        <hr />
        <EditProfileForm isLoading />
      </section>
      <section className="flex flex-col gap-y-4 mb-8">
        <div className="flex flex-col gap-y-1">
          <h5 className="text-xl font-bold">Загрузка клиента</h5>
          <p className="text-sm text-gray-700 dark:text-gray-300">Необходимо для генерации клиента Minecraft</p>
        </div>
        <hr />
        <DownloadClientHub key="DownloadClientHub" isLoading />
      </section>
    </>
  );
};
