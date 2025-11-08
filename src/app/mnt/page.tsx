'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { config } from '@/core/configs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Button, buttonVariants } from '@/shared/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';
import logo from '@/assets/logos/logo.svg';

{
  config.name;
}

export default function MntPage() {
  const router = useRouter();
  return (
    <div
      id="pageContent"
      className="min-h-screen p-4 sm:p-10 flex flex-col items-center justify-center gap-6"
    >
      <Image src={logo} alt="Gml Frontend" className="w-12 sm:w-16" />
      <h1 className="text-3xl font-bold tracking-tight">{config.name} Первый запуск</h1>

      <noscript>
        <div className="nojs-message text-sm text-muted-foreground">
          Пожалуйста, включите JavaScript в браузере для доступа к {config.name}.
        </div>
      </noscript>

      {/* THE PAGE CONTENT BEGIN */}
      <div id="nestedPageContent" className="grid gap-6 w-full max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Перед началом</CardTitle>
            <CardDescription>
              Пожалуйста, ознакомьтесь с настройками ниже перед первым запуском {config.name}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Сервер {config.name} хранит конфигурацию сервера, определения проектов, результаты
              сборок и кеши на диске в<b> Каталоге данных</b>.{' '}
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs font-medium cursor-help align-baseline select-none"
                    aria-label="Подробнее"
                  >
                    ?
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  Подробнее в документации:{' '}
                  <a
                    className={buttonVariants({ variant: 'link' })}
                    href="https://gml-launcher.github.io/Gml.Docs/profiles-add-files.html#dy4fr9_3"
                    target="_blank"
                    rel="noreferrer"
                  >
                    открыть
                  </a>
                </TooltipContent>
              </Tooltip>
            </p>

            <p className="text-sm">
              Расположение каталога данных:{' '}
              <b>
                <span className="font-mono bg-white/10 p-2 rounded-md">/srv/gml</span>
              </b>
            </p>
          </CardContent>
          <CardFooter className="justify-end">
            <div className=" action-block flex gap-2">
              <Button id="restoreButton" variant="secondary" onClick={() => router.push('/mnt/restore')}>
                Восстановить из резервной копии
              </Button>
              <Button id="proceedButton" onClick={() => router.push('/mnt/license')}>
                Продолжить
              </Button>
            </div>
          </CardFooter>
        </Card>
        <div className=" text-center text-xs text-muted-foreground">
          {config.name} {config.version}
        </div>
      </div>
      {/* THE PAGE CONTENT END */}
    </div>
  );
}
