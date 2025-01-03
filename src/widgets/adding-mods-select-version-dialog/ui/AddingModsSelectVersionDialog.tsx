import React from 'react';
import { ArrowDownIcon, DownloadIcon, FileIcon } from '@radix-ui/react-icons';

import { Button } from '@/shared/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/ui/drawer';
import { ProfileExtendedBaseEntity } from '@/shared/api/contracts';
import { ModEntity } from '@/shared/api/contracts/mods/schemas';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Separator } from '@/shared/ui/separator';
import { useModInfo } from '@/shared/hooks/useMods';
import { Card } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';

interface ProfileModDialog {
  profile?: ProfileExtendedBaseEntity;
  modType?: string;
  mod?: ModEntity;
}

export function AddingModsSelectVersionDialog({ profile, modType, mod }: ProfileModDialog) {
  const { data: modInfo } = useModInfo({
    profileName: profile?.profileName ?? '',
    modId: mod?.id ?? '',
  });

  function formatNumber(num: number): string {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  }

  function timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) {
      return `${seconds} секунд назад`;
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} минут назад`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} час${hours > 1 && hours < 5 ? 'а' : hours === 1 ? '' : 'ов'} назад`;
    }

    const days = Math.floor(hours / 24);
    if (days === 1) {
      return 'вчера';
    }
    if (days === 2) {
      return 'позавчера';
    }
    if (days < 30) {
      return `${days} дней назад`;
    }

    const months = Math.floor(days / 30);
    if (months < 12) {
      return `${months} месяц${months > 1 && months < 5 ? 'а' : months === 1 ? '' : 'ев'} назад`;
    }

    const years = Math.floor(months / 12);
    return `${years} год${years > 1 && years < 5 ? 'а' : years === 1 ? '' : 'ов'} назад`;
  }

  return (
    <Drawer>
      <DrawerTrigger className="w-max mt-2">
        <Button variant="secondary" className="w-max gap-2">
          Выбрать
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="gap-2 flex items-center flex-wrap">
            <Avatar className="w-8 h-8">
              <AvatarImage src={mod?.iconUrl} alt="Icon" />
              <AvatarFallback>
                <FileIcon />
              </AvatarFallback>
            </Avatar>
            {mod?.name}
            <Separator orientation="vertical" />
            <span className="text-muted-foreground">Выберите версию</span>
          </DrawerTitle>
        </DrawerHeader>
        <DrawerFooter className="h-[400px] md:h-[650px] overflow-y-auto">
          {modInfo?.versions && modInfo?.versions.length > 0 ? (
            modInfo?.versions.map((mod, index) => (
              <Card key={mod.id} className="py-4 px-5">
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <h3 className="flex items-center font-bold text-sm gap-2">
                      {mod.versionName}
                      <Badge className="gap-1 cursor-pointer text-sm bg-white bg-opacity-10 text-white text-opacity-90 hover:bg-opacity-100 hover:bg-white hover:text-black">
                        <DownloadIcon width={16} height={16} />
                        {formatNumber(mod.downloads)}
                      </Badge>
                      <p className="text-muted-foreground">{timeAgo(mod.datePublished)}</p>
                    </h3>
                    <Button className="w-max mt-2 gap-2" variant="secondary">
                      <ArrowDownIcon />
                      Установить
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center">
              <FileIcon className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-lg font-bold">Ничего не найдено</p>
              <p className="text-muted-foreground">
                Попробуйте изменить запрос или проверьте параметры фильтрации.
              </p>
            </div>
          )}
          <DrawerClose className="flex justify-end">
            <Button variant="outline">Отмена</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
