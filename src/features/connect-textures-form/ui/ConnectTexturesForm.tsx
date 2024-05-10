"use client";

import React from "react";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { TexturesServiceType } from "@/shared/enums";
import { useEditConnectTextures } from "@/shared/hooks";
import { Icons } from "@/shared/ui/icons";

import { ConnectTexturesFormSchemaType, ConnectTexturesSchema } from "../lib/static";
import { TextureServiceBaseEntity } from "@/shared/api/contracts";

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
      url_skins: skins?.url || "",
      url_cloaks: cloaks?.url || "",
    },
    resolver: zodResolver(ConnectTexturesSchema),
  });

  const onSubmit = async (data: ConnectTexturesFormSchemaType) => {
    if (form.formState.dirtyFields.url_skins) {
      await mutateAsync({
        type: TexturesServiceType.TEXTURES_SERVICE_SKINS,
        url: data.url_skins,
      }).then(() => {
        onOpenChange(false);
      });
    }

    if (form.formState.dirtyFields.url_cloaks) {
      await mutateAsync({
        type: TexturesServiceType.TEXTURES_SERVICE_CLOAKS,
        url: data.url_cloaks,
      }).then(() => {
        onOpenChange(false);
      });
    }
  };

  return (
    <div className="grid gap-4" {...props}>
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
