"use client";

import React from "react";

import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CreateProfileFormSchemaType,
  createProfileSchema,
  GameLoaderOption,
  GameLoaderType,
  ProfileExtendedBaseEntity,
} from "@/shared/api/contracts";
import { useCreateProfile, useEditProfile } from "@/shared/hooks";
import { cn, enumValues } from "@/shared/lib/utils";
import { Icons } from "@/shared/ui/icons";

interface CreateProfileFormProps extends React.HTMLAttributes<HTMLDivElement> {
  profile?: ProfileExtendedBaseEntity;
  isEditing?: boolean;
}

export function CreateProfileForm({
  profile,
  isEditing,
  className,
  ...props
}: CreateProfileFormProps) {
  const { mutateAsync: mutateAsyncCreate, isPending: isPendingCreate } = useCreateProfile();
  const { mutateAsync: mutateAsyncEdit, isPending: isPendingEdit } = useEditProfile();

  const form = useForm<CreateProfileFormSchemaType>({
    values: {
      name: profile?.profileName || "",
      description: profile?.description || "",
      gameLoader: profile?.minecraftVersion || "",
      version: profile?.clientVersion || "",
    },
    resolver: zodResolver(createProfileSchema),
  });

  const onSubmit: SubmitHandler<CreateProfileFormSchemaType> = async (
    data: CreateProfileFormSchemaType,
  ) => {
    if (isEditing) {
      const formUpdate = new FormData();
      formUpdate.append("name", data.name);
      formUpdate.append("originalName", profile?.profileName || "");
      formUpdate.append("description", data.description);
      formUpdate.append("icon", data.icon[0]);

      await mutateAsyncEdit(formUpdate);

      return;
    }

    const formCreate = new FormData();
    formCreate.append("name", data.name);
    formCreate.append("description", data.description);
    formCreate.append("version", data.version);
    formCreate.append("gameLoader", data.gameLoader);
    formCreate.append("icon", data.icon[0]);

    return await mutateAsyncCreate(formCreate);
  };

  return (
    <div className={cn("grid gap-4", className)} {...props}>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormItem>
            <FormLabel>Иконка сервера</FormLabel>
            <FormControl>
              <Input type="file" placeholder="Выберите иконку сервера" {...form.register("icon")} />
            </FormControl>
            {form.formState.errors.icon && (
              <FormMessage>{form.formState.errors.icon.message?.toString()}</FormMessage>
            )}
          </FormItem>

          <FormItem>
            <FormLabel>Введите название сервера</FormLabel>
            <FormControl>
              <Input placeholder="Введите название сервера" {...form.register("name")} />
            </FormControl>
            {form.formState.errors.name && (
              <FormMessage>{form.formState.errors.name.message}</FormMessage>
            )}
          </FormItem>

          <FormItem>
            <FormLabel>Введите описание сервера</FormLabel>
            <FormControl>
              <Textarea placeholder="Введите описание сервера" {...form.register("description")} />
            </FormControl>
            {form.formState.errors.description && (
              <FormMessage>{form.formState.errors.description.message}</FormMessage>
            )}
          </FormItem>

          {!isEditing && !profile && (
            <>
              <Controller
                name="version"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Выберите версию игры</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите версию игры" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1.5.2">1.5.2</SelectItem>
                          <SelectItem value="1.6.4">1.6.4</SelectItem>
                          <SelectItem value="1.7.10">1.7.10</SelectItem>
                          <SelectItem value="1.12.2">1.12.2</SelectItem>
                          <SelectItem value="1.19.4">1.19.4</SelectItem>
                          <SelectItem value="1.20.1">1.20.1</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {form.formState.errors.version && (
                      <FormMessage>{form.formState.errors.version.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <Controller
                name="gameLoader"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Выберите игровой загрузчик</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите игровой загрузчик" />
                        </SelectTrigger>
                        <SelectContent>
                          {enumValues(GameLoaderType).map(([loader, value]) => (
                            <SelectItem key={loader} value={String(value)}>
                              {GameLoaderOption[loader as keyof typeof GameLoaderOption]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {form.formState.errors.gameLoader && (
                      <FormMessage>{form.formState.errors.gameLoader.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
            </>
          )}

          <div className="flex justify-end">
            <Button disabled={isPendingCreate || isPendingEdit}>
              {(isPendingCreate || isPendingEdit) && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditing || profile ? "Сохранить" : "Создать"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
