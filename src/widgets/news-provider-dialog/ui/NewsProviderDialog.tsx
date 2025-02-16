'use client';

import React, { useState } from 'react';
import { PlugIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Dialog, DialogContent, DialogTrigger } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Section } from '@/entities/Section';
import { useActiveAuthIntegrations } from '@/shared/hooks';
import vkLogo from '@/assets/logos/vk.svg';
import telegramLogo from '@/assets/logos/telegram.svg';
import websiteLogo from '@/assets/logos/website.svg';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { AuthenticationType } from '@/shared/enums';
import { Switch } from '@/shared/ui/switch';

export function NewsProviderDialog() {
  const [open, setOpen] = useState(false);
  const onOpenChange = () => setOpen((prev) => !prev);
  const { data: activeIntegrations, isLoading: isLoadingActiveIntegration } =
    useActiveAuthIntegrations();

  const includedNewsProvidersForCMS = [
    AuthenticationType.AUTHENTICATION_TYPE_AZURIOM,
    AuthenticationType.AUTHENTICATION_TYPE_UNICORECMS,
    AuthenticationType.AUTHENTICATION_TYPE_DATALIFE_ENGINE,
  ];

  const socialNetworks = [
    {
      name: 'Вконтакте',
      logo: vkLogo,
      description: 'Импорт новостей из социальной сети Вконтакте',
      instructionLink: '/instructions/vk',
    },
    {
      name: 'Telegram',
      logo: telegramLogo,
      description: 'Импорт новостей из социальной сети Telegram',
      instructionLink: '/instructions/facebook',
    },
  ];

  const newsContent = [
    {
      name: 'Вконтакте',
      logo: vkLogo,
      description: 'Импорт новостей из социальной сети Вконтакте',
      instructionLink: '/instructions/vk',
    },
    {
      name: 'Telegram',
      logo: telegramLogo,
      description: 'Импорт новостей из социальной сети Telegram',
      instructionLink: '/instructions/facebook',
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
        <Section title="Новостные провайдеры" subtitle="Настройте поставщики данных ваших новостей">
          <Tabs defaultValue="connect">
            <TabsList className="mb-2">
              <TabsTrigger value="connect">Подключение</TabsTrigger>
              <TabsTrigger value="view">Предпросмотр</TabsTrigger>
            </TabsList>
            <TabsContent value="connect">
              {isLoadingActiveIntegration && <div>Loading...</div>}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {socialNetworks &&
                  socialNetworks.map((social) => (
                    <Card key={social.name}>
                      <CardHeader className="flex flex-row items-center gap-5">
                        <div className="flex items-center rounded-xl justify-center border min-h-12 min-w-12 h-12 w-12 p-3">
                          <Image src={social.logo} className="w-full" alt={`${social.name} logo`} />
                        </div>
                        <div className="flex flex-col gap-2">
                          <CardTitle>{social.name}</CardTitle>
                          <CardDescription>{social.description}</CardDescription>
                        </div>
                      </CardHeader>
                      <hr />
                      <CardFooter className="flex justify-between p-3">
                        <hr />
                        <div className="flex gap-5">
                          <Link className="text-sm" target="_blank" href={social.instructionLink}>
                            Инструкция
                          </Link>
                          <Switch />
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                {activeIntegrations &&
                  includedNewsProvidersForCMS.includes(activeIntegrations?.authType) && (
                    <Card>
                      <CardHeader className="flex flex-row items-center gap-5">
                        <div className="flex items-center rounded-xl justify-center border min-h-12 min-w-12 h-12 w-12 p-3">
                          <Image src={websiteLogo} className="w-full" alt={'vk logo'} />
                        </div>
                        <div className="flex flex-col gap-2">
                          <CardTitle>Сайт</CardTitle>
                          <CardDescription>Импорт новостей из вашего сайта</CardDescription>
                        </div>
                      </CardHeader>
                      <hr />
                      <CardFooter className="flex justify-between p-3">
                        <hr />
                        <div className="flex gap-5">
                          <Switch />
                        </div>
                      </CardFooter>
                    </Card>
                  )}
              </div>
            </TabsContent>
            <TabsContent value="view"></TabsContent>
          </Tabs>
        </Section>
      </DialogContent>
    </Dialog>
  );
}
