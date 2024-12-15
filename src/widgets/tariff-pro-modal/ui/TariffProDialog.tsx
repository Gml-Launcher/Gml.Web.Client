'use client';

import Link from 'next/link';
import { CheckIcon, Copy, LinkIcon, StarIcon } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { HREF_RECLOUD_PRO } from '@/shared/constants';
import { Separator } from '@/shared/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';

export function TariffProDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <LinkIcon className="mr-2" size={16} />
          Подключить
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <h1 className="text-4xl text-center mt-6 mb-2 font-bold leading-none tracking-tight bg-gradient-to-r from-purple-500 to-pink-500 inline-block text-transparent bg-clip-text">
            Перейти на Pro
          </h1>
          <p className="text-gray-400 text-center mx-5">
            Больше свободы, эксклюзивные функции, персональная поддержка от разработчиков
          </p>
        </DialogHeader>
        <Card className="overflow-hidden mt-1" x-chunk="dashboard-05-chunk-4">
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
                Список возможностей
                <Button
                  size="icon"
                  variant="outline"
                  className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Copy className="h-3 w-3" />
                  <span className="sr-only">Copy Order ID</span>
                </Button>
              </CardTitle>
              <CardDescription>Предоставляемые услуги вместе с пакетом Pro</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 text-sm max-h-80 overflow-y-auto">
            <div className="grid gap-3">
              <div className="font-semibold">Поставка Gml.Backend</div>
              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">• Подготовка ОС (Linux, Windows)</span>
                  <CheckIcon className="text-purple-700" size={16} />
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">• Установка серверной части</span>
                  <CheckIcon className="text-purple-700" size={16} />
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">• Настройка серверной части</span>
                  <CheckIcon className="text-purple-700" size={16} />
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">• Настройка Proxy-Сервера</span>
                  <CheckIcon className="text-purple-700" size={16} />
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    • Помощь в настройке текстур-сервиса
                  </span>
                  <CheckIcon className="text-purple-700" size={16} />
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    • Техническая поддержка по текущему ПО
                  </span>
                  <CheckIcon className="text-purple-700" size={16} />
                </li>
              </ul>
              <Separator className="my-2" />
              <div className="font-semibold">Поставка Gml.Launcher</div>
              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">• Подготовка ОС (Linux, Windows)</span>
                  <CheckIcon className="text-purple-700" size={16} />
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">• Помощь в установке IDE</span>
                  <CheckIcon className="text-purple-700" size={16} />
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">• Настройка IDE</span>
                  <CheckIcon className="text-purple-700" size={16} />
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">• Помощь в сборке проекта</span>
                  <CheckIcon className="text-purple-700" size={16} />
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">• Помощь в публикации лаунчера</span>
                  <CheckIcon className="text-purple-700" size={16} />
                </li>
              </ul>
              <Separator className="my-2" />
              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <div className="font-semibold">Дополнительные возможности</div>
                  <CheckIcon className="text-purple-700" size={16} />
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Персональная поддержка по работе с linux
                  </span>
                  <CheckIcon className="text-purple-700" size={16} />
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Приоритетная реализация функционала</span>
                  <CheckIcon className="text-purple-700" size={16} />
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
            <div className="text-xs text-muted-foreground">
              Обновлено: <time dateTime="2024-07-07">07 июля 2024</time>
            </div>
          </CardFooter>
        </Card>
        <DialogFooter>
          <Link
            target="_blank"
            className="mx-auto inline-flex mt-1 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-purple-600 text-secondary-foreground hover:bg-purple-700 h-10 px-4 py-2 w-fit"
            href={HREF_RECLOUD_PRO}
          >
            <StarIcon className="mr-2" size={16} />
            Подключить
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
