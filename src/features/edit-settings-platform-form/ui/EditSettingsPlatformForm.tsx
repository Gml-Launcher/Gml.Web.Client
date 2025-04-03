'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { DatabaseIcon, ImagesIcon, UsersIcon } from 'lucide-react';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import Image from 'next/image';

import { EditSettingsPlatformSchema, EditSettingsPlatformSchemaType } from '../lib/zod';
import { extractProtocol } from '../lib/utils';

import { Protocol, ProtocolOption, StorageType, StorageTypeOption } from '@/shared/enums';
import { useEditSettingsPlatform, useSettingsPlatform } from '@/shared/hooks';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Button } from '@/shared/ui/button';
import { Icons } from '@/shared/ui/icons';
import { Switch } from '@/shared/ui/switch';
import { Input } from '@/shared/ui/input';
import { enumValues } from '@/shared/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Skeleton } from '@/shared/ui/skeleton';
import curseforge from '@/assets/logos/curseforge.ico';
import vk from '@/assets/logos/vk.svg';

export const EditSettingsPlatformForm = () => {
  const { data: platform, isLoading } = useSettingsPlatform();
  const { mutateAsync, isPending } = useEditSettingsPlatform();

  const form = useForm<EditSettingsPlatformSchemaType>({
    disabled: isLoading,
    resolver: zodResolver(EditSettingsPlatformSchema),
    defaultValues: {
      registrationIsEnabled: false,
      storageType: StorageType.STORAGE_TYPE_LOCALSTORAGE,
      textureProtocol: Protocol.HTTPS,
      curseForgeKey: '',
      vkKey: '',
      storageHost: '',
      storageLogin: '',
      storagePassword: '',
    },
  });

  React.useEffect(() => {
    if (platform && !isLoading) {
      form.reset({
        registrationIsEnabled: platform.registrationIsEnabled || false,
        storageType: platform.storageType || StorageType.STORAGE_TYPE_LOCALSTORAGE,
        curseForgeKey: platform.curseForgeKey || '',
        vkKey: platform.vkKey || '',
        storageHost: platform.storageHost || '',
        storageLogin: platform.storageLogin || '',
        storagePassword: '',
        textureProtocol: platform.textureProtocol,
      });
    }
  }, [platform, isLoading, form]);

  const currentProtocol = extractProtocol(process.env.NEXT_PUBLIC_BACKEND_URL);

  const watchRegistration = form.watch('registrationIsEnabled');
  const watchStorageType = form.watch('storageType');
  const isFormS3Storage = Number(watchStorageType) === StorageType.STORAGE_TYPE_S3;

  const onSubmit: SubmitHandler<EditSettingsPlatformSchemaType> = async (
    body: EditSettingsPlatformSchemaType,
  ) => {
    await mutateAsync(body);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-4 w-full lg:w-[58rem]">
          <div className="flex flex-col gap-y-4 gap-x-8">
            <FormField
              control={form.control}
              name="registrationIsEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between w-full rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="flex flex-row items-center gap-x-1 mb-2">
                      <UsersIcon className="mr-2 h-4 w-4" />
                      <h6 className="text-sm font-bold">
                        Регистрация новых пользователей (
                        {watchRegistration ? 'Разрешена' : 'Запрещена'})
                      </h6>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Позволяет регистрироваться новым пользователям на сайте
                    </p>
                  </div>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="w-12 h-6" />
                    ) : (
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-6 w-full rounded-lg border p-4">
              <FormField
                control={form.control}
                name="textureProtocol"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex flex-row items-center gap-x-1 mb-2">
                        <ImagesIcon className="mr-2 h-4 w-4" />
                        <h6 className="text-sm font-bold">Тип HTTP для сервиса скинов</h6>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Протокол передачи текстур для Minecraft клиента
                      </p>
                    </div>
                    {isLoading ? (
                      <Skeleton className="w-32 h-10" />
                    ) : (
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={String(field.value)}
                      >
                        <FormControl className="max-w-32">
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите протокол" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {enumValues(Protocol).map(([protocol, value]) => (
                            <SelectItem key={protocol} value={String(value)}>
                              {ProtocolOption[`OPTION_${value}` as keyof typeof ProtocolOption]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </FormItem>
                )}
              />
              {currentProtocol !== form.watch('textureProtocol') && !isLoading && (
                <Alert variant="destructive">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertTitle>Внимание!</AlertTitle>
                  <AlertDescription>
                    Протоколы передачи данных текстур и бэкенда <strong>не совпадают</strong>.
                    Возможны ошибки при загрузке текстур или их полное отсутствие.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
          <div className="flex flex-row items-center justify-between w-full rounded-lg border p-4">
            <div className="flex flex-col gap-y-1 w-1/2">
              <div className="flex flex-row items-center gap-x-1 mb-2">
                <DatabaseIcon className="mr-2 h-4 w-4" />
                <h6 className="text-sm font-bold">Хранилище</h6>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Текущее хранилище, где хранится лаунчер
              </p>
            </div>
            <div className="flex flex-col w-1/2">
              <FormField
                control={form.control}
                name="storageType"
                render={({ field }) => (
                  <FormItem>
                    {isLoading ? (
                      <Skeleton className="w-full h-10" />
                    ) : (
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите хранилище" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={String(StorageType.STORAGE_TYPE_LOCALSTORAGE)}>
                            {StorageTypeOption.STORAGE_TYPE_LOCALSTORAGE}
                          </SelectItem>
                          <SelectItem value={String(StorageType.STORAGE_TYPE_S3)}>
                            {StorageTypeOption.STORAGE_TYPE_S3}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {isFormS3Storage && (
            <div className="flex flex-col gap-y-4 mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                <div className="flex flex-col gap-y-1 min-w-96 mb-2 lg:mb-0">
                  <h6 className="text-sm font-bold">Хост хранилища S3</h6>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Укажите хост-адрес вашего хранилища S3
                  </p>
                </div>
                <div className="flex flex-col gap-y-1 min-w-96 mb-2 lg:mb-0">
                  <FormField
                    control={form.control}
                    name="storageHost"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          {isLoading ? (
                            <Skeleton className="w-full h-10" />
                          ) : (
                            <Input type="text" placeholder="Введите хост хранилища" {...field} />
                          )}
                        </FormControl>
                        {form.formState.errors.storageHost && !isLoading && (
                          <FormMessage>
                            {form.formState.errors.storageHost.message?.toString()}
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                <div className="flex flex-col gap-y-1 min-w-96 mb-2 lg:mb-0">
                  <h6 className="text-sm font-bold">Access Key</h6>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Укажите access key для доступа к вашему хранилищу S3
                  </p>
                </div>
                <div className="flex flex-col gap-y-1 min-w-96 mb-2 lg:mb-0">
                  <FormField
                    control={form.control}
                    name="storageLogin"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          {isLoading ? (
                            <Skeleton className="w-full h-10" />
                          ) : (
                            <Input
                              type="text"
                              placeholder="Введите Access Key хранилища"
                              {...field}
                            />
                          )}
                        </FormControl>
                        {form.formState.errors.storageLogin && !isLoading && (
                          <FormMessage>
                            {form.formState.errors.storageLogin.message?.toString()}
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                <div className="flex flex-col gap-y-1 min-w-96 mb-2 lg:mb-0">
                  <h6 className="text-sm font-bold">Secret Key</h6>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Укажите secret key для доступа к вашему хранилищу S3
                  </p>
                </div>
                <div className="flex flex-col gap-y-1 min-w-96 mb-2 lg:mb-0">
                  <FormField
                    control={form.control}
                    name="storagePassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          {isLoading ? (
                            <Skeleton className="w-full h-10" />
                          ) : (
                            <Input
                              type="text"
                              placeholder="Введите Secret Key хранилища"
                              {...field}
                            />
                          )}
                        </FormControl>
                        {form.formState.errors.storagePassword && !isLoading && (
                          <FormMessage>
                            {form.formState.errors.storagePassword.message?.toString()}
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-row items-center justify-between w-full rounded-lg border p-4">
            <div className="flex flex-col gap-y-1 w-1/2">
              <div className="flex flex-row items-center gap-x-1 mb-2">
                <Image src={curseforge} alt="Curseforge" className="w-4 h-4" />
                <h6 className="text-sm font-bold">CurseForge Api Key</h6>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Для автоматической загрузки модов из CurseForge.
              </p>
            </div>
            <div className="flex flex-col w-1/2">
              <FormField
                control={form.control}
                name="curseForgeKey"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      {isLoading ? (
                        <Skeleton className="w-full h-[88px]" />
                      ) : (
                        <Input type="text" placeholder="Введите API Key" {...field} />
                      )}
                    </FormControl>
                    {!isLoading && (
                      <>
                        <FormMessage />
                        <Button variant="link" asChild className="p-0">
                          <a
                            href="https://console.curseforge.com/?#/api-keys"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Получить Api Key
                          </a>
                        </Button>
                      </>
                    )}
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex flex-row items-center justify-between w-full rounded-lg border p-4">
            <div className="flex flex-col gap-y-1 w-1/2">
              <div className="flex flex-row items-center gap-x-1 mb-2">
                <Image src={vk} alt="VK" className="w-4 h-4" />
                <h6 className="text-sm font-bold">Вконтакте Api Key</h6>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Для автоматической загрузки новостей из VK.
              </p>
            </div>
            <div className="flex flex-col w-1/2">
              <FormField
                control={form.control}
                name="vkKey"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      {isLoading ? (
                        <Skeleton className="w-full h-[88px]" />
                      ) : (
                        <Input type="text" placeholder="Введите API Key" {...field} />
                      )}
                    </FormControl>
                    {!isLoading && (
                      <>
                        <FormMessage />
                        <Button variant="link" asChild className="p-0">
                          <a
                            href="https://dev.vk.com/ru/admin/apps-list"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Получить Api Key
                          </a>
                        </Button>
                      </>
                    )}
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end">
            {isLoading ? (
              <Skeleton className="w-24 h-10" />
            ) : (
              <Button disabled={isPending || form.formState.disabled || !form.formState.isDirty}>
                {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Сохранить
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
};
