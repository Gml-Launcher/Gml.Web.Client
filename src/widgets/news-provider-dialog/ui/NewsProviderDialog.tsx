'use client';

import React, { useState } from 'react';
import { PlugIcon, Trash2Icon, EyeIcon, LinkIcon, Loader2Icon } from 'lucide-react';
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
        <DialogTitle className="text-2xl font-bold">Новостные провайдеры</DialogTitle>
        <p className="text-muted-foreground mb-4">Настройте поставщики данных ваших новостей</p>
        <Section>
          <Tabs defaultValue="connect" className="w-full">
            <TabsList className="mb-4 w-full grid grid-cols-2 h-auto">
              <TabsTrigger value="connect" className="py-3">
                <PlugIcon className="mr-2 h-4 w-4" />
                Подключение
              </TabsTrigger>
              <TabsTrigger value="view" className="py-3">
                <EyeIcon className="mr-2 h-4 w-4" />
                Предпросмотр новостей
              </TabsTrigger>
            </TabsList>
            <TabsContent value="connect">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col gap-4 w-full md:w-1/2">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Подключенные провайдеры</h3>
                  </div>
                  {isLoadingNewsProviders ? (
                    <div className="flex h-[300px] items-center justify-center">
                      <Loader2Icon className="h-6 w-6 animate-spin text-primary" />
                      <span className="ml-2 text-sm text-muted-foreground">Загрузка...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 h-[300px] overflow-auto pr-2">
                      {Array.isArray(newsProviders) && newsProviders.length > 0 ? (
                        newsProviders.map((social) => (
                          <Card
                            key={social.type}
                            className="relative border-l-4 border-l-primary shadow-sm hover:shadow transition-all "
                          >
                            <CardHeader className="flex flex-row items-center gap-5 pb-2">
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-3 right-3 w-7 h-7 opacity-80 hover:opacity-100"
                                onClick={() => onRemove(social.type)}
                              >
                                <Trash2Icon size={16} />
                              </Button>
                              <div className="flex items-center rounded-xl justify-center border min-h-12 min-w-12 h-12 w-12 p-2 bg-muted">
                                <Image
                                  src={socialNetworkLogos[social.type]}
                                  className="w-full"
                                  alt={`${social.name} logo`}
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <CardTitle className="text-base">{social.name}</CardTitle>
                                <CardDescription className="text-xs">
                                  Импорт новостей из {social.name}
                                </CardDescription>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <LinkIcon size={14} />
                                <span className="truncate">{social.url ?? 'Нет ссылки'}</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="flex flex-col h-full gap-4 py-12 px-4 items-center justify-center bg-muted/50 rounded-lg border border-dashed">
                          <div className="rounded-full bg-muted p-3">
                            <PlugIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">Список провайдеров пуст</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Добавьте провайдер новостей с помощью формы справа
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col w-full md:w-1/2">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Добавить новый провайдер</h3>
                  </div>
                  <Card className="border-t-4 border-t-primary">
                    <CardContent className="pt-6">
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base">Социальная сеть</FormLabel>
                                <Select
                                  onValueChange={(value) => field.onChange(Number(value))}
                                  defaultValue={String(NewsTypeEnum.Custom)}
                                  value={String(field.value)}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-10">
                                      <SelectValue placeholder="Выберите тип новостей" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {enumValues(NewsTypeEnum).map(([protocol, value]) => (
                                      <SelectItem key={protocol} value={String(value)}>
                                        <div className="flex items-center gap-3">
                                          <div className="flex items-center justify-center w-6 h-6">
                                            <Image
                                              src={socialNetworkLogos[value as NewsTypeEnum]}
                                              className="w-5"
                                              alt={`${value} logo`}
                                            />
                                          </div>
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
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base">Ссылка на страницу/сайт</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      placeholder="https://blog.tecloud.tech"
                                      className="pl-10 h-10"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription className="text-xs">
                                  Не знаете какую ссылку вводить?{' '}
                                  <a href="#" className="text-primary hover:underline">
                                    Ознакомьтесь с документацией
                                  </a>
                                  .
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="pt-2">
                            <Button
                              type="submit"
                              className="w-full"
                              size="lg"
                              disabled={isPending || !form.formState.isDirty}
                            >
                              {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                              Создать
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
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
