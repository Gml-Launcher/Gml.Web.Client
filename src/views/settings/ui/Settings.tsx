'use client';

import React from 'react';

import { RolesPermissionsTab } from './RolesPermissionsTab';
import { ApiKeysTab } from './ApiKeysTab';

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
      <div className="mx-auto grid w-full items-start gap-6">
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
            <TabsTrigger className="w-full h-10 flex items-center justify-between gap-2" value="roles">
              <span>Роли и права</span>
              <span className="ml-2">
                <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30">Beta</span>
              </span>
            </TabsTrigger>
            {/*<TabsTrigger className="w-full h-10" value="api-keys">*/}
            {/*  Api ключи*/}
            {/*</TabsTrigger>*/}
          </TabsList>
          <TabsContent className="w-full" value="settings">
            <EditSettingsPlatformForm />
          </TabsContent>
          <TabsContent className="w-full" value="roles">
            <RolesPermissionsTab />
          </TabsContent>
          <TabsContent className="w-full" value="api-keys">
            <ApiKeysTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
