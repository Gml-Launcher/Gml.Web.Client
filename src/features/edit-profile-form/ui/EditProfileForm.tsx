import React from "react";

import { useRouter } from "next/navigation";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEditProfile } from "@/shared/hooks";
import {
  EditProfileFormSchemaType,
  EditProfileSchema,
  ProfileExtendedBaseEntity,
} from "@/shared/api/contracts";
import { Form, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";
import { Icons } from "@/shared/ui/icons";
import { DASHBOARD_PAGES } from "@/shared/routes";

interface EditProfileFormProps {
  profile?: ProfileExtendedBaseEntity;
}

export const EditProfileForm = (props: EditProfileFormProps) => {
  const { profile } = props;

  const { push } = useRouter();

  const { mutateAsync, isPending } = useEditProfile();
  const form = useForm<EditProfileFormSchemaType>({
    values: {
      name: profile?.profileName || "",
      description: profile?.description || "",
      jvmArguments: profile?.jvmArguments || "",
      icon: profile?.iconBase64 || "",
      background: profile?.background || "",
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

    if (form.formState.dirtyFields.name) {
      return push(`${DASHBOARD_PAGES.PROFILE}/${body.name}`);
    }
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
