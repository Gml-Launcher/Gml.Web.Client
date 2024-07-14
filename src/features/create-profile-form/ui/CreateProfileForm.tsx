"use client";

import React, { ReactElement, useEffect } from "react";

import Image from "next/image";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  CreateProfileFormSchemaType,
  CreateProfileSchema,
  GameLoaderOption,
  ProfileExtendedBaseEntity,
} from "@/shared/api/contracts";
import { useCreateProfile, useGetGameVersions } from "@/shared/hooks";
import { cn, enumValues } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Icons } from "@/shared/ui/icons";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

import loaderMinecraft from "@/assets/logos/minecraft.png";
import loaderForge from "@/assets/logos/forge.png";
import loaderFabric from "@/assets/logos/fabric.png";
import loaderLiteLoader from "@/assets/logos/liteloader.png";
import neoForgeLoader from "@/assets/logos/neoforge.png";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Command, CommandEmpty, CommandInput } from "@/shared/ui/command";
import { CommandGroup, CommandItem } from "cmdk";
import { FormCombobox } from "@/shared/ui/FormCombobox";
import { isError } from "node:util";

interface CreateProfileFormProps extends React.HTMLAttributes<HTMLDivElement> {
  profile?: ProfileExtendedBaseEntity;
  onModalToggle: () => void;
}

const logoGameLoader: Record<GameLoaderOption, ReactElement> = {
  [GameLoaderOption.VANILLA]: (
    <Image src={loaderMinecraft} alt="Logotype Minecraft" width={24} height={24} />
  ),
  [GameLoaderOption.FORGE]: <Image src={loaderForge} alt="Logotype Forge" width={24} height={24} />,
  [GameLoaderOption.FABRIC]: (
    <Image src={loaderFabric} alt="Logotype Fabric" width={24} height={24} />
  ),
  [GameLoaderOption.LITELOADER]: (
    <Image src={loaderLiteLoader} alt="Logotype Liteloader" width={24} height={24} />
  ),
  [GameLoaderOption.NEOFORGE]: (
    <Image src={neoForgeLoader} alt="Logotype NeoForge" width={18} height={18} />
  ),
};

export function CreateProfileForm(props: CreateProfileFormProps) {
  const { profile, className, onModalToggle, ...rest } = props;

  const { mutateAsync, isPending } = useCreateProfile();

  const form = useForm<CreateProfileFormSchemaType>({
    defaultValues: {
      name: profile?.profileName || "",
      description: profile?.description || "",
      gameLoader: profile?.minecraftVersion || GameLoaderOption.VANILLA.toString(),
      loaderVersion: "",
      version: profile?.clientVersion || "",
    },
    resolver: zodResolver(CreateProfileSchema),
  });

  const versions = useGetGameVersions({
    gameLoader: GameLoaderOption.VANILLA,
    minecraftVersion: "0",
  });

  const loaderVersion = useGetGameVersions(
    {
      gameLoader: form.watch("gameLoader") as GameLoaderOption,
      minecraftVersion: form.watch("version"),
    },
    {
      enabled:
        form.watch("gameLoader") === GameLoaderOption.FORGE.toString() ||
        form.watch("gameLoader") === GameLoaderOption.LITELOADER.toString() ||
        form.watch("gameLoader") === GameLoaderOption.FABRIC.toString() ||
        form.watch("gameLoader") === GameLoaderOption.NEOFORGE.toString(),
    },
  );

  useEffect(() => {
    form.setValue("loaderVersion", loaderVersion.data?.[0]);
  }, [loaderVersion.data]);

  const onSubmit: SubmitHandler<CreateProfileFormSchemaType> = async (
    data: CreateProfileFormSchemaType,
  ) => {
    const formCreate = new FormData();
    formCreate.append("name", data.name);
    formCreate.append("description", data.description);
    formCreate.append("version", data.version);
    formCreate.append("gameLoader", data.gameLoader);
    formCreate.append("icon", data.icon[0]);

    if (data.loaderVersion) {
      formCreate.append("loaderVersion", data.loaderVersion);
    }

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
                <FormCombobox
                  name={field.name}
                  value={field.value}
                  placeholder="Выберите версию игры"
                  placeholderInputSearch="Поиск версий"
                  options={versions && versions.data}
                  isLoading={versions.isLoading}
                  setValue={form.setValue}
                />
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!form.getFieldState("version").isDirty || loaderVersion.isFetching}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите игровой загрузчик" />
                    </SelectTrigger>
                    <SelectContent>
                      {enumValues(GameLoaderOption).map(([loader, value]) => (
                        <SelectItem key={loader} value={String(value)}>
                          {logoGameLoader[value as GameLoaderOption]}
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

          {(form.watch("gameLoader") === GameLoaderOption.FORGE.toString() ||
            form.watch("gameLoader") === GameLoaderOption.NEOFORGE.toString() ||
            form.watch("gameLoader") === GameLoaderOption.FABRIC.toString() ||
            form.watch("gameLoader") === GameLoaderOption.LITELOADER.toString()) && (
            <Controller
              name="loaderVersion"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Выберите версию загрузчика</FormLabel>
                  <FormCombobox
                    name={field.name}
                    value={field.value}
                    placeholder="Выберите версию загрузчика"
                    placeholderInputSearch="Поиск версии загрузчика"
                    options={loaderVersion && loaderVersion.data}
                    description="Данная версия игры не поддерживается загрузчиком"
                    isError={loaderVersion.isError}
                    isLoading={!form.getFieldState("version").isDirty || loaderVersion.isFetching}
                    setValue={form.setValue}
                  />
                  {form.formState.errors.gameLoader && (
                    <FormMessage>{form.formState.errors.gameLoader.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
          )}

          <div className="flex justify-end">
            <Button disabled={isPending || !form.formState.isDirty || loaderVersion.isError}>
              {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Создать
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
