'use client';

import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InfoIcon } from 'lucide-react';

import { ConnectTexturesFormSchemaType, ConnectTexturesSchema } from '../lib/static';

import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { TexturesServiceType } from '@/shared/enums';
import { useEditConnectTextures } from '@/shared/hooks';
import { Icons } from '@/shared/ui/icons';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
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
    <div className="grid gap-4" {...props}>
      <div className="flex gap-2">
        {textureServices.map((service) => (
          <Button
            key={service.key}
            variant="outline"
            className="rounded-full h-8"
            onClick={() => handleButtonClick(service.skinsUrl, service.cloaksUrl)}
          >
            {service.label}
          </Button>
        ))}
      </div>

      <Form {...form}>
        <form className="flex flex-col space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            control={form.control}
            name="url_skins"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Введите URL к сервису скинов</FormLabel>
                <FormControl>
                  <Input placeholder="Введите URL к сервису скинов" {...field} />
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
                <FormLabel>Введите URL к сервису плащей</FormLabel>
                <FormControl>
                  <Input placeholder="Введите URL к сервису плащей" {...field} />
                </FormControl>
                {form.formState.errors.url_cloaks && (
                  <FormMessage>{form.formState.errors.url_cloaks.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <Alert variant="warning">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Обратите внимание!</AlertTitle>
            <AlertDescription className="mb-2">
              Вы можете использовать переменные, которые заменятся на соответствующие значения с
              нашей стороны
              <div className="grid">
                <b className="py-1">{'{userName}'} - Ник пользователя</b>
                <b className="py-1">{'{userUuid}'} - Uuid пользователя</b>
              </div>
            </AlertDescription>
            <AlertDescription>
              Пример: https://textures.recloud.tech/cloaks/<b>{'{userName}'}</b> будет заменено на
              https://textures.recloud.tech/cloaks/<b>{'GamerVII'}</b>
              <div className="py-2">
                https://textures.recloud.tech/cloaks/<b>{'{userUuid}'}</b> будет заменено на
                https://textures.recloud.tech/cloaks/<b>{'c07a9841-2275-4ba0-8f1c-2e1599a1f22f'}</b>
              </div>
            </AlertDescription>
          </Alert>

          <div className="flex justify-between items-center">
            <Button className="w-fit ml-auto" disabled={isPending || !form.formState.isDirty}>
              {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Сохранить
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
