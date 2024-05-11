import { EditSettingsPlatformForm } from "@/features/edit-settings-platform-form";

import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { DASHBOARD_PAGES } from "@/shared/routes";

export const SettingsPage = () => {
  return (
    <>
      <Breadcrumbs
        current="Настройки платформы"
        breadcrumbs={[{ value: "Главная", path: DASHBOARD_PAGES.HOME }]}
      />
      <div className="flex flex-col items-start py-4">
        <div className="flex justify-between w-full">
          <h1 className="text-xl font-bold mb-8">Настройки платформы</h1>
        </div>
        <div className="flex flex-col gap-y-6 w-full">
          <EditSettingsPlatformForm />
        </div>
      </div>
    </>
  );
};
