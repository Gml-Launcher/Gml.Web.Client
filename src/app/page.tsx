import Image from 'next/image';
import Link from 'next/link';

import { config } from '@/core/configs';
import { cn } from '@/shared/lib/utils';
import { AUTH_PAGES } from '@/shared/routes';
import { buttonVariants } from '@/shared/ui/button';
import logo from '@/assets/logos/logo.svg';

export default function Home() {
  return (
    <>
      <div className="flex relative w-screen h-screen flex-col items-center justify-center gap-y-4">
        <Link href="/" className="flex items-center gap-x-2 text-2xl font-bold">
          <Image src={logo} alt="GML Frontend" className="w-10" />
          {config.name}
          <sup className="text-xs text-gray-400">{config.version}</sup>
        </Link>
        <h1 className="text-xl text-center text-gray-400">
          Добро пожаловать в панель <br /> управления вашим игровым проектом
        </h1>
        <div className="flex gap-x-4">
          <Link href={AUTH_PAGES.SIGN_UP} className={cn(buttonVariants({ variant: 'outline' }))}>
            Регистрация
          </Link>
          <Link href={AUTH_PAGES.SIGN_IN} className={cn(buttonVariants({ variant: 'default' }))}>
            Войти
          </Link>
        </div>
      </div>
    </>
  );
}
