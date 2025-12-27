'use client';

import { useEffect } from 'react';
import Image from 'next/image';

import logo from '@/assets/logos/logo.svg';
import { config } from '@/core/configs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Icons } from '@/shared/ui/icons';

export default function WaitPage() {
  useEffect(() => {
    // Reload the page every second to re-check backend availability
    const id = setInterval(() => {
      // Use location.reload to trigger Next server-side revalidation/route checks
      window.location.reload();
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen p-4 sm:p-10 flex flex-col items-center justify-center gap-6">
      <Image src={logo} alt="Gml Frontend" className="w-12 sm:w-16" />
      <h1 className="text-3xl font-bold tracking-tight">{config.name} Ожидание запуска</h1>

      <div id="nestedPageContent" className="grid gap-6 w-full max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Ожидаем доступность серверной части</CardTitle>
            <CardDescription>
              Мы ждём успешный ответ health от backend. Как только сервер будет доступен, вы сможете
              продолжить работу.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Icons.spinner className="h-6 w-6 text-primary animate-spin" />
            <div className="text-sm text-muted-foreground">
              Пожалуйста, подождите. Это может занять некоторое время.
            </div>
          </CardContent>
          <CardFooter className="justify-end text-xs text-muted-foreground">
            Проверка статуса: health
          </CardFooter>
        </Card>

        <div className=" text-center text-xs text-muted-foreground">
          {config.name} {config.version}
        </div>
      </div>
    </div>
  );
}
