'use client';

import React from 'react';

import { RolesPermissionsTab } from './RolesPermissionsTab';
import { ApplicationsTab } from './ApplicationsTab';
import { ApiKeysTab } from './ApiKeysTab';
import { AuditSystemTab } from './AuditSystemTab';

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
            <TabsTrigger
              className="w-full h-10 flex items-center gap-2"
              value="roles"
            >
              <span>Роли и права</span>
            </TabsTrigger>
            <TabsTrigger
              className="w-full h-10 flex items-center gap-2"
              value="applications"
            >
              <span>Приложения</span>
            </TabsTrigger>
            <TabsTrigger
              className="w-full h-10 flex items-center gap-2"
              value="audit"
            >
              <span>Аудит системы</span>
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
          <TabsContent className="w-full" value="applications">
            <ApplicationsTab />
          </TabsContent>
          <TabsContent className="w-full" value="audit">
            <AuditSystemTab />
          </TabsContent>
          <TabsContent className="w-full" value="api-keys">
            <ApiKeysTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
