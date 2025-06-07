import React from 'react';
import Image from 'next/image';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InfoIcon, LinkIcon, ImageIcon, TextIcon } from 'lucide-react';

import { DiscordFormSchemaType, integrationSchema } from '../lib/static';

import { useDiscord, useEditDiscord } from '@/shared/hooks';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Icons } from '@/shared/ui/icons';
import { Input } from '@/shared/ui/input';
import { Separator } from '@/shared/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import discordHint from '@/assets/logos/discord.webp';

interface SignInFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onOpenChange: (open: boolean) => void;
}

export function ConnectDiscordForm({ className, onOpenChange, ...props }: SignInFormProps) {
  const { data } = useDiscord();
  const { mutateAsync, isPending } = useEditDiscord();

  const form = useForm<DiscordFormSchemaType>({
    values: {
      clientId: data?.clientId || '',
      details: data?.details || '',
      largeImageKey: data?.largeImageKey || '',
      largeImageText: data?.largeImageText || '',
      smallImageKey: data?.smallImageKey || '',
      smallImageText: data?.smallImageText || '',
    },
    resolver: zodResolver(integrationSchema),
  });

  const onSubmit: SubmitHandler<DiscordFormSchemaType> = async (data: DiscordFormSchemaType) => {
    await mutateAsync(data).then(() => {
      onOpenChange(false);
    });
  };

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Настройка интеграции с Discord</h2>
        <p className="text-sm text-muted-foreground">
          Подключите ваш Discord сервер для отображения активности пользователей в Rich Presence.
        </p>
      </div>

      <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-900">
        <InfoIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-sm text-blue-600 dark:text-blue-400">
          Для настройки интеграции вам потребуется создать приложение в{" "}
          <a 
            href="https://discord.com/developers/applications" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-blue-700 dark:hover:text-blue-300"
          >
            Discord Developer Portal
          </a>
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="setup">
            <LinkIcon className="mr-2 h-4 w-4" />
            Настройка
          </TabsTrigger>
          <TabsTrigger value="preview">
            <ImageIcon className="mr-2 h-4 w-4" />
            Предпросмотр
          </TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6 pt-4">
          <Form {...form}>
            <form className="flex flex-col space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <Card className="border-l-4 border-l-primary">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Основные настройки</CardTitle>
                  <CardDescription>
                    Настройте основные параметры для подключения к Discord
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client ID</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" placeholder="Введите Client ID вашего Discord приложения" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>
                          ID вашего приложения из Discord Developer Portal
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="details"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Details</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <TextIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" placeholder="Например: Играет на сервере" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Текст, который будет отображаться в статусе пользователя
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Настройки изображений</CardTitle>
                  <CardDescription>
                    Настройте изображения, которые будут отображаться в Rich Presence
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="largeImageKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Large Image Key</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-10" placeholder="Ключ большого изображения" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Ключ для большого изображения в Rich Presence
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="largeImageText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Large Image Text</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <TextIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-10" placeholder="Текст при наведении на большое изображение" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Текст, который появляется при наведении на большое изображение
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="smallImageKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Small Image Key</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-10" placeholder="Ключ маленького изображения" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Ключ для маленького изображения в Rich Presence
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="smallImageText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Small Image Text</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <TextIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-10" placeholder="Текст при наведении на маленькое изображение" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Текст, который появляется при наведении на маленькое изображение
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={isPending || !form.formState.isDirty}
                  >
                    {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                    Сохранить настройки
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="preview" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Предпросмотр Rich Presence</CardTitle>
              <CardDescription>
                Так будет выглядеть ваш статус в Discord
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <Image 
                  src={discordHint} 
                  alt="discord-hint" 
                  className="rounded-md border shadow-sm"
                />
                <div className="mt-6 grid grid-cols-1 gap-2 text-sm">
                  <div className="grid grid-cols-12 items-center">
                    <div className="col-span-1 text-center font-bold">1.</div>
                    <div className="col-span-11">Название бота (Присваивается при создании Discord бота)</div>
                  </div>
                  <div className="grid grid-cols-12 items-center">
                    <div className="col-span-1 text-center font-bold">2.</div>
                    <div className="col-span-11">Поле details (настраивается в форме)</div>
                  </div>
                  <div className="grid grid-cols-12 items-center">
                    <div className="col-span-1 text-center font-bold">3.</div>
                    <div className="col-span-11">Stage (Управляется лаунчером автоматически)</div>
                  </div>
                  <div className="grid grid-cols-12 items-center">
                    <div className="col-span-1 text-center font-bold">4.</div>
                    <div className="col-span-11">Time (Управляется лаунчером автоматически)</div>
                  </div>
                  <div className="grid grid-cols-12 items-center">
                    <div className="col-span-1 text-center font-bold">5.</div>
                    <div className="col-span-11">largeImageText (Текст при наведении на большое изображение)</div>
                  </div>
                  <div className="grid grid-cols-12 items-center">
                    <div className="col-span-1 text-center font-bold">6.</div>
                    <div className="col-span-11">smallImageText (Текст при наведении на маленькое изображение)</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
