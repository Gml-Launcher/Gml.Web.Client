'use client';

import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InfoIcon, CheckIcon, CopyIcon } from 'lucide-react';

import { ConnectTexturesFormSchemaType, ConnectTexturesSchema } from '../lib/static';

import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { TexturesServiceType } from '@/shared/enums';
import { useEditConnectTextures } from '@/shared/hooks';
import { Icons } from '@/shared/ui/icons';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { TextureServiceBaseEntity } from '@/shared/api/contracts';

interface ConnectTexturesFormProps extends React.HTMLAttributes<HTMLDivElement> {
  skins?: TextureServiceBaseEntity;
  cloaks?: TextureServiceBaseEntity;
  onOpenChange: (open: boolean) => void;
}

export function ConnectTexturesForm({
  skins,
  cloaks,
  onOpenChange,
  ...props
}: ConnectTexturesFormProps) {
  const { mutateAsync, isPending } = useEditConnectTextures();

  const form = useForm<ConnectTexturesFormSchemaType>({
    values: {
      url_skins: skins?.url || '',
      url_cloaks: cloaks?.url || '',
    },
    resolver: zodResolver(ConnectTexturesSchema),
  });

  const onSubmit = async (data: ConnectTexturesFormSchemaType) => {
    if (form.getFieldState('url_skins').isDirty) {
      await mutateAsync({
        type: TexturesServiceType.TEXTURES_SERVICE_SKINS,
        url: data.url_skins,
      });
    }

    if (form.getFieldState('url_cloaks').isDirty) {
      await mutateAsync({
        type: TexturesServiceType.TEXTURES_SERVICE_CLOAKS,
        url: data.url_cloaks,
      });
    }

    onOpenChange(false);
  };

  const textureServices = [
    {
      key: 'danielraybone',
      label: 'Danielraybone',
      skinsUrl: 'https://skins.danielraybone.com/v1/skin/{userName}',
      cloaksUrl: 'https://skins.danielraybone.com/v1/cape/{userName}',
    },
    {
      key: 'auroralauncher',
      label: 'AuroraLauncher',
      skinsUrl: 'https://api.aurora-launcher.ru/mojang/username/skin/{userName}',
      cloaksUrl: 'https://api.aurora-launcher.ru/mojang/username/cape/{userName}',
    },
    {
      key: 'tlauncher',
      label: 'TLauncher',
      skinsUrl: 'https://tlauncher.org/upload/all/nickname/{userName}.png',
      cloaksUrl: 'https://tlauncher.org/upload/all/cloaks/{userName}.png',
    },
    {
      key: 'tmonitoring',
      label: 'T-Мониторинг',
      skinsUrl: 'https://tmonitoring.com/uploads/catalog/skins/nickname/{userName}.png',
      cloaksUrl: 'https://tmonitoring.com/uploads/catalog/capes/{userName}.png',
    },
  ];

  const handleButtonClick = (skinsUrl: string, cloaksUrl: string) => {
    form.setValue('url_skins', skinsUrl, { shouldDirty: true });
    form.setValue('url_cloaks', cloaksUrl, { shouldDirty: true });
  };

  return (
    <div className="grid gap-6" {...props}>
      <Form {...form}>
        <form className="flex flex-col space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs defaultValue="custom" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="presets">Готовые настройки</TabsTrigger>
              <TabsTrigger value="custom">Ручная настройка</TabsTrigger>
            </TabsList>

            <TabsContent value="presets" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {textureServices.map((service) => (
                  <Card
                    key={service.key}
                    className="border border-muted hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => handleButtonClick(service.skinsUrl, service.cloaksUrl)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        {service.label}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-auto h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleButtonClick(service.skinsUrl, service.cloaksUrl);
                          }}
                        >
                          <CheckIcon className="h-4 w-4" />
                          <span className="sr-only">Выбрать</span>
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3 text-xs text-muted-foreground">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Скины:</span>
                          <code className="text-xs bg-muted px-1 py-0.5 rounded">
                            {service.skinsUrl}
                          </code>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Плащи:</span>
                          <code className="text-xs bg-muted px-1 py-0.5 rounded">
                            {service.cloaksUrl}
                          </code>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Настройка URL-адресов</CardTitle>
                  <CardDescription>Укажите URL-адреса для сервисов скинов и плащей</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Controller
                    control={form.control}
                    name="url_skins"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>URL сервиса скинов</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input placeholder="Введите URL к сервису скинов" {...field} />
                          </div>
                        </FormControl>
                        {form.formState.errors.url_skins && (
                          <FormMessage>{form.formState.errors.url_skins.message}</FormMessage>
                        )}
                      </FormItem>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="url_cloaks"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>URL сервиса плащей</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input placeholder="Введите URL к сервису плащей" {...field} />
                          </div>
                        </FormControl>
                        {form.formState.errors.url_cloaks && (
                          <FormMessage>{form.formState.errors.url_cloaks.message}</FormMessage>
                        )}
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Alert
                variant="default"
                className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950"
              >
                <InfoIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertTitle>Доступные переменные</AlertTitle>
                <AlertDescription className="mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-md border border-gray-200 dark:border-gray-700">
                      <code className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {'{userName}'}
                      </code>
                      <span className="text-sm">Ник пользователя</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-auto h-6 w-6 p-0"
                        onClick={() => {
                          navigator.clipboard.writeText('{userName}');
                        }}
                      >
                        <CopyIcon className="h-3 w-3" />
                        <span className="sr-only">Копировать</span>
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-md border border-gray-200 dark:border-gray-700">
                      <code className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {'{userUuid}'}
                      </code>
                      <span className="text-sm">UUID пользователя</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-auto h-6 w-6 p-0"
                        onClick={() => {
                          navigator.clipboard.writeText('{userUuid}');
                        }}
                      >
                        <CopyIcon className="h-3 w-3" />
                        <span className="sr-only">Копировать</span>
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end items-center pt-4 border-t">
            <Button type="submit" className="w-fit" disabled={isPending || !form.formState.isDirty}>
              {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Сохранить
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
