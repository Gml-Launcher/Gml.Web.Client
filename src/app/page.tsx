import Image from 'next/image';
import React from 'react';
import Link from 'next/link';

import { config } from '@/core/configs';
import logo from '@/assets/logos/logo.svg';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { AUTH_PAGES } from '@/shared/routes';
import { cn } from '@/shared/lib/utils';
import { buttonVariants } from '@/shared/ui/button';

export default function Home() {
  return (
    <>
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a href="#" className="flex items-center gap-2 self-center font-medium">
            <Image src={logo} alt="Gml Frontend" className="w-12 sm:w-8" />
            {config.name}
          </a>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Добро пожаловать</CardTitle>
              <CardDescription>
                Здесь вы можете настроить, управлять и следить за всеми аспектами вашего проекта.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link
                href={AUTH_PAGES.SIGN_IN}
                className={cn(buttonVariants({ variant: 'default' }))}
              >
                Продолжить
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      <div></div>
      {/*<div className="min-h-screen p-4 sm:p-10 flex flex-col items-center justify-center gap-6">*/}
      {/*  <Image src={logo} alt="Gml Frontend" className="w-12 sm:w-16" />*/}
      {/*  <h1 className="text-3xl font-bold tracking-tight">Добро пожаловать!</h1>*/}

      {/*  <div id="nestedPageContent" className="grid gap-6 w-full max-w-4xl">*/}
      {/*    <Card>*/}
      {/*      <CardHeader>*/}
      {/*        <CardTitle>Панель управления вашим игровым проектом</CardTitle>*/}
      {/*        <CardDescription>*/}
      {/*          Добро пожаловать в панель управления! Мы рады приветствовать вас в панели*/}
      {/*          управления. Здесь вы можете настроить, управлять и следить за всеми аспектами вашего*/}
      {/*          проекта.*/}
      {/*        </CardDescription>*/}
      {/*      </CardHeader>*/}
      {/*      <CardContent className="flex items-center gap-4">*/}
      {/*        <Link*/}
      {/*          href={AUTH_PAGES.SIGN_IN}*/}
      {/*          className={cn(buttonVariants({ variant: 'default' }))}*/}
      {/*        >*/}
      {/*          Войти*/}
      {/*        </Link>*/}
      {/*      </CardContent>*/}
      {/*    </Card>*/}

      {/*    <div className=" text-center text-xs text-muted-foreground">*/}
      {/*      {config.name} {config.version}*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
      {/*<div className="p-4 sm:p-10 h-screen flex flex-col">*/}
      {/*  <WelcomeNavbar />*/}

      {/*  <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] xl:grid-cols-[550px_1fr] h-full gap-10 md:grid-cols-2 pt-32 sm:pt-16 items-start xl:items-center">*/}
      {/*    <div className="flex relative gap-y-5 flex-col">*/}
      {/*      <h1 className="text-4xl font-bold">Спасибо за выбор Gml</h1>*/}
      {/*      <p className="text-xl text-gray-400 leading-relaxed">*/}
      {/*        Добро пожаловать в панель управления! Мы рады приветствовать вас в панели управления.*/}
      {/*        Здесь вы можете настроить, управлять и следить за всеми аспектами вашего проекта.*/}
      {/*      </p>*/}

      {/*      <div className="flex gap-x-4">*/}
      {/*        <Link*/}
      {/*          href={AUTH_PAGES.SIGN_IN}*/}
      {/*          className={cn(buttonVariants({ variant: 'default' }))}*/}
      {/*        >*/}
      {/*          Войти*/}
      {/*        </Link>*/}
      {/*        /!*<Link*!/*/}
      {/*        /!*  href={AUTH_PAGES.SIGN_UP}*!/*/}
      {/*        /!*  className={cn(buttonVariants({ variant: 'outline' }))}*!/*/}
      {/*        /!*>*!/*/}
      {/*        /!*  Регистрация*!/*/}
      {/*        /!*</Link>*!/*/}
      {/*      </div>*/}
      {/*    </div>*/}

      {/*    /!*<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">*!/*/}
      {/*    /!*  {cardData.map((card) => (*!/*/}
      {/*    /!*    <div key={card.title} className="flex flex-col gap-5 w-full">*!/*/}
      {/*    /!*      <Card className="card-container">*!/*/}
      {/*    /!*        <CardHeader>*!/*/}
      {/*    /!*          {card.icon}*!/*/}
      {/*    /!*          <CardTitle className="text-xl truncate">{card.title}</CardTitle>*!/*/}
      {/*    /!*          <CardDescription>{card.description}</CardDescription>*!/*/}
      {/*    /!*        </CardHeader>*!/*/}
      {/*    /!*      </Card>*!/*/}
      {/*    /!*    </div>*!/*/}
      {/*    /!*  ))}*!/*/}
      {/*    /!*</div>*!/*/}
      {/*  </div>*/}
      {/*</div>*/}
    </>
  );
}
