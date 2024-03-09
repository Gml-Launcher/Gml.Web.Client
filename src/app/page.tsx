import Link from 'next/link';

import { cn } from '@/shared/lib/utils';
import { AUTH_PAGES } from '@/shared/routes';
import { buttonVariants } from '@/shared/ui/button';

export default function Home() {
  return (
    <>
      <div className="flex relative w-screen h-screen flex-col items-center justify-center gap-y-4">
        <h1 className="text-2xl font-bold">Добро пожаловать на GML Frontend</h1>
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
