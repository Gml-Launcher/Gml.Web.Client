"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { StorageType, StorageTypeOption } from "@/shared/enums";
import { useEditSettingsPlatform, useSettingsPlatform } from "@/shared/hooks/useSettings";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/shared/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Button } from "@/shared/ui/button";
import { Icons } from "@/shared/ui/icons";
import { Switch } from "@/shared/ui/switch";
import { Input } from "@/shared/ui/input";

import { EditSettingsPlatformSchema, EditSettingsPlatformSchemaType } from "../lib/zod";

export const EditSettingsPlatformForm = () => {
  const { data: platform, isLoading } = useSettingsPlatform();
  const { mutateAsync, isPending } = useEditSettingsPlatform();

  const form = useForm<EditSettingsPlatformSchemaType>({
    disabled: isLoading,
    values: {
      registrationIsEnabled: platform?.registrationIsEnabled || false,
      storageType: platform?.storageType || StorageType.STORAGE_TYPE_LOCALSTORAGE,
      storageHost: platform?.storageHost || "",
      storageLogin: platform?.storageLogin || "",
      storagePassword: "",
    },
    resolver: zodResolver(EditSettingsPlatformSchema),
  });

  const watchRegistration = form.watch("registrationIsEnabled");
  const watchStorageType = form.watch("storageType");
  const isFormS3Storage = Number(watchStorageType) === StorageType.STORAGE_TYPE_S3;

  const onSubmit: SubmitHandler<EditSettingsPlatformSchemaType> = async (
    body: EditSettingsPlatformSchemaType,
  ) => {
    await mutateAsync(body);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-8 w-full lg:w-[58rem]">
          <div className="flex gap-x-8 mb-8">
            <FormField
              control={form.control}
              name="registrationIsEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between w-full rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <h6 className="text-sm font-bold">
                      Регистрация новых пользователей (
                      {watchRegistration ? "Разрешена" : "Запрещена"})
                    </h6>
                    <p className="text-sm text-gray-700">
                      Позволяет регистрироваться новым пользователям на сайте
                    </p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-x-8">
            <div className="flex flex-col gap-y-1 w-1/2">
              <h6 className="text-sm font-bold">Хранилище</h6>
              <p className="text-sm text-gray-700">Текущее хранилище, где хранится лаунчер</p>
            </div>
            <div className="flex flex-col w-1/2">
              <FormField
                control={form.control}
                name="storageType"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={String(StorageType.STORAGE_TYPE_LOCALSTORAGE)}
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
                          <Input type="text" placeholder="Введите хост хранилища" {...field} />
                        </FormControl>
                        {form.formState.errors.storageHost && (
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
                          <Input
                            type="text"
                            placeholder="Введите Access Key хранилища"
                            {...field}
                          />
                        </FormControl>
                        {form.formState.errors.storageLogin && (
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
                          <Input
                            type="text"
                            placeholder="Введите Secret Key хранилища"
                            {...field}
                          />
                        </FormControl>
                        {form.formState.errors.storagePassword && (
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

          <div className="flex justify-end">
            <Button disabled={isPending || form.formState.disabled || !form.formState.isDirty}>
              {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Сохранить
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
