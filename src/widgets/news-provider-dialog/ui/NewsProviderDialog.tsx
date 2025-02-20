'use client';

import React, { useState } from 'react';
import { PlugIcon } from 'lucide-react';

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Section } from '@/entities/Section';
import { useNewsProviders } from '@/shared/hooks';
import vkLogo from '@/assets/logos/vk.svg';
import telegramLogo from '@/assets/logos/telegram.svg';
import websiteLogo from '@/assets/logos/website.svg';
import unicoreLogo from '@/assets/logos/unicore.svg';
import azuriomLogo from '@/assets/logos/azuriom.svg';
import {
  SocialNetwork,
  SocialNetworkComponent,
} from '@/widgets/news-provider-dialog/ui/SocialNetworkComponent';
import { NewsTypeEnum } from '@/shared/enums/news-type';

export function NewsProviderDialog() {
  const [open, setOpen] = useState(false);
  const onOpenChange = () => setOpen((prev) => !prev);
  const { data: newsProviders, isLoading: isLoadingNewsProviders } = useNewsProviders();

  const socialNetworks: SocialNetwork[] = [
    {
      name: 'Вконтакте',
      logo: vkLogo,
      enabled: false,
      visible: true,
      type: NewsTypeEnum.VK,
      token: '',
      description: 'Импорт новостей из социальной сети Вконтакте',
      descriptionToken: 'Введите токен VK',
      descriptionUrl: 'Введите ссылку на сообщество',
      tokenGenerateUrl:
        'https://oauth.vk.com/authorize?client_id=6121396&scope=327680&redirect_uri=https://oauth.vk.com/blank.html&display=page&response_type=token&revoke=1',
      instructionLink: '',
    },
    {
      name: 'UnicoreCMS',
      logo: unicoreLogo,
      enabled: false,
      visible: true,
      type: NewsTypeEnum.UnicoreCMS,
      token: '',
      description: 'Импорт новостей из социальной сети Вконтакте',
      descriptionToken: 'Введите ссылку на сайт',
      instructionLink: '',
    },
    {
      name: 'Azuriom',
      logo: azuriomLogo,
      enabled: false,
      visible: true,
      type: NewsTypeEnum.Azuriom,
      token: '',
      description: 'Импорт новостей из социальной сети Вконтакте',
      descriptionToken: 'Введите ссылку на сайт',
      instructionLink: '',
    },
    {
      name: 'Telegram',
      logo: telegramLogo,
      type: NewsTypeEnum.Telegram,
      enabled: false,
      visible: false,
      token: '',
      description: 'Импорт новостей из социальной сети Telegram',
      descriptionToken: 'Токен Telegram бота',
      descriptionUrl: 'Ссылка на Telegram канал',
      instructionLink: '',
    },
    {
      name: 'Своя служба',
      logo: websiteLogo,
      type: NewsTypeEnum.Custom,
      enabled: false,
      visible: true,
      token: '',
      description: 'Собственная система новостей',
      descriptionToken: 'Введите токен Telegram бота',
      instructionLink: '',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="w-fit">
          <PlugIcon className="mr-2" size={16} />
          Подключить
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogTitle></DialogTitle>
        <Section title="Новостные провайдеры" subtitle="Настройте поставщики данных ваших новостей">
          <Tabs defaultValue="connect">
            <TabsList className="mb-2">
              <TabsTrigger value="connect">Подключение</TabsTrigger>
              <TabsTrigger value="view">Предпросмотр</TabsTrigger>
            </TabsList>
            <TabsContent value="connect">
              {isLoadingNewsProviders ? (
                <div>Loading...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {socialNetworks &&
                    socialNetworks.map((social) => (
                      <SocialNetworkComponent
                        social={social}
                        providers={newsProviders ?? []}
                        key={social.name}
                      />
                    ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="view"></TabsContent>
          </Tabs>
        </Section>
      </DialogContent>
    </Dialog>
  );
}
