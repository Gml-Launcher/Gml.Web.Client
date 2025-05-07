'use client';

import React, { useState } from 'react';
import { PlugIcon, Trash2Icon } from 'lucide-react';
import Image, { StaticImageData } from 'next/image';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Section } from '@/entities/Section';
import { useAddNewsProvider, useDeleteNewsProvider, useNewsProviders } from '@/shared/hooks';
import vkLogo from '@/assets/logos/vk.svg';
import telegramLogo from '@/assets/logos/telegram.svg';
import websiteLogo from '@/assets/logos/website.svg';
import unicoreLogo from '@/assets/logos/unicore.svg';
import azuriomLogo from '@/assets/logos/azuriom.svg';
import { NewsTypeEnum, NewsTypeOption } from '@/shared/enums/news-type';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { enumValues } from '@/shared/lib/utils';
import { Icons } from '@/shared/ui/icons';
import { NewsListComponent } from '@/widgets/news-provider-dialog/ui/NewsListComponent';

export const socialNetworkLogos: Record<NewsTypeEnum, StaticImageData> = {
  [NewsTypeEnum.VK]: vkLogo,
  [NewsTypeEnum.UnicoreCMS]: unicoreLogo,
  [NewsTypeEnum.Azuriom]: azuriomLogo,
  [NewsTypeEnum.Telegram]: telegramLogo,
  [NewsTypeEnum.Custom]: websiteLogo,
};

export function NewsProviderDialog() {
  const [open, setOpen] = useState(false);
  const onOpenChange = () => setOpen((prev) => !prev);
  const {
    data: newsProviders,
    isLoading: isLoadingNewsProviders,
    refetch: getNewsProvidersRefetch,
  } = useNewsProviders();
  const { mutateAsync, isPending } = useAddNewsProvider();
  const { mutateAsync: deleteMutateAsync, isPending: isDeletePending } = useDeleteNewsProvider();

  const formSchema = z.object({
    url: z.string().min(2, {
      message: 'Ссылка обязательна для заполнения.',
    }),
    type: z.number(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      type: NewsTypeEnum.Custom,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await mutateAsync({ ...values });
    await getNewsProvidersRefetch();
  }

  async function onRemove(type: NewsTypeEnum) {
    await deleteMutateAsync(type);
    await getNewsProvidersRefetch();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="w-fit">
          <PlugIcon className="mr-2" size={16} />
          Подключить
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-full sm:max-w-[1000px]">
        <DialogTitle></DialogTitle>
        <Section title="Новостные провайдеры" subtitle="Настройте поставщики данных ваших новостей">
          <Tabs defaultValue="connect">
            <TabsList className="mb-2">
              <TabsTrigger value="connect">Подключение</TabsTrigger>
              <TabsTrigger value="view">Предпросмотр новостей</TabsTrigger>
            </TabsList>
            <TabsContent value="connect">
              <div className="flex flex-col md:flex-row gap-12">
                <div className="flex flex-col gap-3 w-full">
                  {isLoadingNewsProviders ? (
                    <div>Loading...</div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 h-[300px] overflow-auto md:h-full">
                      {Array.isArray(newsProviders) && newsProviders.length > 0 ? (
                        newsProviders.map((social) => (
                          <Card key={social.type} className="relative">
                            <CardHeader className="flex flex-row items-center gap-5">
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-4 right-4 w-7 h-7"
                                onClick={() => onRemove(social.type)}
                              >
                                <Trash2Icon size={16} />
                              </Button>
                              <div className="flex items-center rounded-xl justify-center border min-h-12 min-w-12 h-12 w-12 p-3">
                                <Image
                                  src={socialNetworkLogos[social.type]}
                                  className="w-full"
                                  alt={`${social.name} logo`}
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <CardTitle>{social.name}</CardTitle>
                                <CardDescription>Импорт новостей из {social.name}</CardDescription>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <FormItem>
                                <FormControl>
                                  <Input type="text" value={social.url ?? ''} />
                                </FormControl>
                                <FormDescription>Адрес, откуда берутся новости</FormDescription>
                              </FormItem>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="flex h-full gap-x-2 py-12 px-2 items-center justify-center">
                          <p className="text-sm text-muted-foreground">Список провайдеров пуст</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col w-full">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Социальная сеть</FormLabel>
                            <Select
                              onValueChange={(value) => field.onChange(Number(value))}
                              defaultValue={String(NewsTypeEnum.Custom)}
                              value={String(field.value)}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Тип новостей" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {enumValues(NewsTypeEnum).map(([protocol, value]) => (
                                  <SelectItem key={protocol} value={String(value)}>
                                    <div className="flex items-center gap-3">
                                      <Image
                                        src={socialNetworkLogos[value as NewsTypeEnum]}
                                        className="w-4"
                                        alt={`${value} logo`}
                                      />
                                      {
                                        NewsTypeOption[
                                          `OPTION_${value}` as keyof typeof NewsTypeOption
                                        ]
                                      }
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ссылка на страницу/сайт</FormLabel>
                            <FormControl>
                              <Input placeholder="https://blog.tecloud.tech" {...field} />
                            </FormControl>
                            <FormDescription>
                              Не знаете какую ссылку вводить? Ознакомьтесь с документацией.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={isPending || !form.formState.isDirty}>
                        {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                        Создать
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>

              {/*{isLoadingNewsProviders ? (*/}
              {/*  <div>Loading...</div>*/}
              {/*) : (*/}
              {/*  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">*/}
              {/*    {socialNetworks &&*/}
              {/*      socialNetworks.map((social) => (*/}
              {/*        <SocialNetworkComponent*/}
              {/*          social={social}*/}
              {/*          providers={newsProviders ?? []}*/}
              {/*          key={social.name}*/}
              {/*        />*/}
              {/*      ))}*/}
              {/*  </div>*/}
              {/*)}*/}
            </TabsContent>
            <TabsContent value="view">
              <NewsListComponent />
            </TabsContent>
          </Tabs>
        </Section>
      </DialogContent>
    </Dialog>
  );
}
