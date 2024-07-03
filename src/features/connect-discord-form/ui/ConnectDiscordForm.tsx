import React from "react";

import Image from "next/image";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useDiscord, useEditDiscord } from "@/shared/hooks";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Card, CardContent, CardDescription, CardHeader } from "@/shared/ui/card";
import { Icons } from "@/shared/ui/icons";
import { Input } from "@/shared/ui/input";

import discordHint from "@/assets/logos/discord.webp";

import { DiscordFormSchemaType, integrationSchema } from "../lib/static";

interface SignInFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onOpenChange: (open: boolean) => void;
}

export function ConnectDiscordForm({ className, onOpenChange, ...props }: SignInFormProps) {
  const { data } = useDiscord();
  const { mutateAsync, isPending } = useEditDiscord();

  const form = useForm<DiscordFormSchemaType>({
    values: {
      clientId: data?.clientId || "",
      details: data?.details || "",
      largeImageKey: data?.largeImageKey || "",
      largeImageText: data?.largeImageText || "",
      smallImageKey: data?.smallImageKey || "",
      smallImageText: data?.smallImageText || "",
    },
    resolver: zodResolver(integrationSchema),
  });

  const onSubmit: SubmitHandler<DiscordFormSchemaType> = async (data: DiscordFormSchemaType) => {
    await mutateAsync(data).then(() => {
      onOpenChange(false);
    });
  };

  return (
    <div className={cn("grid gap-4", className)} {...props}>
      <Form {...form}>
        <form className="flex flex-col space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Введите clientId приложения</FormLabel>
                <FormControl>
                  <Input placeholder="Введите clientId приложения" {...field} />
                </FormControl>
                {form.formState.errors.clientId && (
                  <FormMessage>{form.formState.errors.clientId.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Введите details</FormLabel>
                <FormControl>
                  <Input placeholder="Введите details" {...field} />
                </FormControl>
                {form.formState.errors.details && (
                  <FormMessage>{form.formState.errors.details.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <div className="flex gap-x-4">
            <FormField
              control={form.control}
              name="largeImageKey"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Введите largeImageKey</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите largeImageKey" {...field} />
                  </FormControl>
                  {form.formState.errors.largeImageKey && (
                    <FormMessage>{form.formState.errors.largeImageKey.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="largeImageText"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Введите largeImageText</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите largeImageText" {...field} />
                  </FormControl>
                  <FormDescription>Текст при наведении на большое изображение</FormDescription>
                  {form.formState.errors.largeImageText && (
                    <FormMessage>{form.formState.errors.largeImageText.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-x-4">
            <FormField
              control={form.control}
              name="smallImageKey"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Введите smallImageKey</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите smallImageKey" {...field} />
                  </FormControl>
                  {form.formState.errors.smallImageKey && (
                    <FormMessage>{form.formState.errors.smallImageKey.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="smallImageText"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Введите smallImageText</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите smallImageText" {...field} />
                  </FormControl>
                  <FormDescription>Текст при наведении на маленькое изображение</FormDescription>
                  {form.formState.errors.smallImageText && (
                    <FormMessage>{form.formState.errors.smallImageText.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
          </div>

          <Card>
            <CardHeader>
              <CardDescription>
                <Image src={discordHint} alt="discord-hint" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul>
                <li>1. Название бота (Присваивается при создании дискорд бота)</li>
                <li>2. Поле details</li>
                <li>3. Stage (Управляется лаунчером)</li>
                <li>4. Time (Управляется лаунчером)</li>
                <li>5. largeImageText (Текст при наведении на большое изображение)</li>
                <li>6. smallImageText (Текст при наведении на маленькое изображение)</li>
              </ul>
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-fit ml-auto"
            disabled={isPending || !form.formState.isDirty}
          >
            {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Сохранить
          </Button>
        </form>
      </Form>
    </div>
  );
}
