import React from 'react';

import { EditSettingsPlatformForm } from '@/features/edit-settings-platform-form';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { DASHBOARD_PAGES } from '@/shared/routes';

export const SettingsPage = () => {
  return (
    <>
      <Breadcrumbs
        current="Настройки"
        breadcrumbs={[{ value: 'Главная', path: DASHBOARD_PAGES.HOME }]}
      />
      <div className="mx-auto grid w-full gap-2">
        <h1 className="text-3xl font-semibold">Настройки</h1>
      </div>
      <div className="mx-auto grid w-full items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <Tabs
          className="flex flex-col md:flex-row gap-6 items-start"
          defaultValue="settings"
          aria-orientation="vertical"
          orientation="vertical"
        >
          <TabsList className="flex-col h-auto items-start min-w-44" defaultValue="main">
            <TabsTrigger className="w-full h-10" value="settings">
              Основные
            </TabsTrigger>
          </TabsList>
          <TabsContent className="w-full" value="settings">
            <EditSettingsPlatformForm />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
