import { Input, InputFile } from "@/shared/ui/input";
import React from "react";
import { useEditProfile } from "@/shared/hooks";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  EditProfileFormSchemaType,
  EditProfileSchema,
  ProfileExtendedBaseEntity,
} from "@/shared/api/contracts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormMessage } from "@/shared/ui/form";
import { Button } from "@/shared/ui/button";
import { Icons } from "@/shared/ui/icons";
import Image from "next/image";
import { Textarea } from "@/shared/ui/textarea";
import { Skeleton } from "@/shared/ui/skeleton";

interface EditProfileFormProps {
  profile?: ProfileExtendedBaseEntity;
  isLoading?: boolean;
}

export const EditProfileForm = (props: EditProfileFormProps) => {
  const { profile, isLoading } = props;

  const { mutateAsync, isPending } = useEditProfile();
  const form = useForm<EditProfileFormSchemaType>({
    disabled: isLoading,
    values: {
      name: profile?.profileName || "",
      description: profile?.description || "",
      jvmArguments: profile?.jvmArguments || "",
    },
    resolver: zodResolver(EditProfileSchema),
  });

  const onSubmit: SubmitHandler<EditProfileFormSchemaType> = async (
    body: EditProfileFormSchemaType,
  ) => {
    const formUpdate = new FormData();
    formUpdate.append("name", body.name);
    formUpdate.append("originalName", profile?.profileName || "");
    formUpdate.append("description", body.description);
    formUpdate.append("icon", body.icon?.[0]);

    if (body.background && body.background[0]) {
      formUpdate.append("background", body.background[0]);
    }

    if (body.jvmArguments) {
      formUpdate.append("jvmArguments", body.jvmArguments);
    }

    await mutateAsync(formUpdate);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-8 w-full lg:w-[58rem]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
            <div className="flex flex-col gap-y-1 min-w-96 mb-2 lg:mb-0">
              <h6 className="text-sm font-bold">Название</h6>
              <p className="text-sm text-gray-700 dark:text-gray-300">Отображается на клиенте</p>
            </div>
            <div className="flex flex-col gap-y-1 min-w-96 mb-2 lg:mb-0">
              <Input
                type="text"
                placeholder="Введите название профиля"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <FormMessage>{form.formState.errors.name.message?.toString()}</FormMessage>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
            <div className="flex flex-col gap-y-1 min-w-96 mb-2 lg:mb-0">
              <h6 className="text-sm font-bold">Описание</h6>
              <p className="text-sm text-gray-700 dark:text-gray-300">Отображается в лаунчере</p>
            </div>
            <div className="flex flex-col gap-y-1 min-w-96 mb-2 lg:mb-0">
              <Textarea placeholder="Введите описание сервера" {...form.register("description")} />
              {form.formState.errors.description && (
                <FormMessage>{form.formState.errors.description.message?.toString()}</FormMessage>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
            <div className="flex flex-col gap-y-1 min-w-96 mb-2 lg:mb-0">
              <h6 className="text-sm font-bold">Jvm Аргументы</h6>
              <p className="text-sm text-gray-700 dark:text-gray-300">Параметры запуска клиента</p>
            </div>
            <div className="flex flex-col gap-y-1 min-w-96 mb-2 lg:mb-0">
              <Input
                type="text"
                placeholder="Введите ваши jvm аргументы"
                {...form.register("jvmArguments")}
              />
              {form.formState.errors.jvmArguments && (
                <FormMessage>{form.formState.errors.jvmArguments.message?.toString()}</FormMessage>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
            <div className="flex flex-col gap-y-1 min-w-96 mb-2 lg:mb-0">
              <h6 className="text-sm font-bold">Иконка</h6>
              <p className="text-sm text-gray-700 dark:text-gray-300">Отображается в лаунчере</p>
              {profile ? (
                <Image
                  className="w-16 h-16 mt-2"
                  src={`data:text/plain;base64,${profile.iconBase64}`}
                  alt={profile.profileName}
                  width={32}
                  height={32}
                />
              ) : (
                <Skeleton className="min-w-16 min-h-16 w-16 h-16 mt-2" />
              )}
            </div>
            <div className="flex flex-col gap-y-1 min-w-96 mb-2 lg:mb-0">
              <InputFile fileTypes={["PNG"]} {...form.register("icon")} />
              {form.formState.errors.icon && (
                <FormMessage>{form.formState.errors.icon.message?.toString()}</FormMessage>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
            <div className="flex flex-col gap-y-1 min-w-96 mb-2 lg:mb-0">
              <h6 className="text-sm font-bold">Задний фон</h6>
              <p className="text-sm text-gray-700 dark:text-gray-300">Отображается в лаунчере</p>
              {profile ? (
                <img
                  className="w-[600px] h-[300px] mt-2 rounded-md"
                  src={profile.background}
                  alt={profile.profileName}
                />
              ) : (
                <Skeleton className="min-w-16 min-h-16 w-16 h-16 mt-2" />
              )}
            </div>
            <div className="flex flex-col gap-y-1 min-w-96 mb-2 lg:mb-0">
              <InputFile fileTypes={["PNG"]} {...form.register("background")} />
              {form.formState.errors.background && (
                <FormMessage>{form.formState.errors.background.message?.toString()}</FormMessage>
              )}
            </div>
          </div>
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
