"use client";

import React from "react";

import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  CreateProfileFormSchemaType,
  CreateProfileSchema,
  GameLoaderOption,
  GameLoaderType,
  ProfileExtendedBaseEntity,
} from "@/shared/api/contracts";
import { useCreateProfile } from "@/shared/hooks";
import { cn, enumValues } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Icons } from "@/shared/ui/icons";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

interface CreateProfileFormProps extends React.HTMLAttributes<HTMLDivElement> {
  profile?: ProfileExtendedBaseEntity;
  onModalToggle: () => void;
}

const versions = [
  "1.5.2",
  "1.6.4",
  "1.7.2",
  "1.7.10",
  "1.8",
  "1.9",
  "1.9.1",
  "1.9.2",
  "1.9.3",
  "1.9.4",
  "1.10",
  "1.10.1",
  "1.10.2",
  "1.12",
  "1.12.1",
  "1.12.2",
  "1.18",
  "1.18.1",
  "1.18.2",
  "1.19",
  "1.19.1",
  "1.19.2",
  "1.19.3",
  "1.19.4",
  "1.20",
  "1.20.1",
  "1.20.2",
  "1.20.3",
  "1.20.4",
];

export function CreateProfileForm(props: CreateProfileFormProps) {
  const { profile, className, onModalToggle, ...rest } = props;

  const { mutateAsync, isPending } = useCreateProfile();

  const form = useForm<CreateProfileFormSchemaType>({
    values: {
      name: profile?.profileName || "",
      description: profile?.description || "",
      gameLoader: profile?.minecraftVersion || "",
      version: profile?.clientVersion || "",
    },
    resolver: zodResolver(CreateProfileSchema),
  });

  const onSubmit: SubmitHandler<CreateProfileFormSchemaType> = async (
    data: CreateProfileFormSchemaType,
  ) => {
    const formCreate = new FormData();
    formCreate.append("name", data.name);
    formCreate.append("description", data.description);
    formCreate.append("version", data.version);
    formCreate.append("gameLoader", data.gameLoader);
    formCreate.append("icon", data.icon[0]);

    await mutateAsync(formCreate).then(() => {
      onModalToggle();
    });
  };

  return (
    <div className={cn("grid gap-4", className)} {...rest}>
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
                      {versions.map((version) => (
                        <SelectItem key={version} value={version}>
                          {version}
                        </SelectItem>
                      ))}
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

          <div className="flex justify-end">
            <Button disabled={isPending}>
              {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Создать
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
