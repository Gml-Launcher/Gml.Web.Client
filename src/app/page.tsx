import Link from 'next/link';

import { cn } from '@/shared/lib/utils';
import { AUTH_PAGES } from '@/shared/routes';
import { buttonVariants } from '@/shared/ui/button';
import WelcomeNavbar from '@/app/auth/welcome/welcomeNavbar';

export default function Home() {
  return (
    <>
      <div className="flex flex-col px-4 py-4 sm:px-10 sm:py-6 md:px-16 md:py-8 lg:px-20 lg:py-10 w-full gap-10 sm:gap-16 md:gap-20">
        <WelcomeNavbar />

        <div className="flex h-screen items-center py-52">
          <div className="flex relative gap-y-5 flex-col w-[800px]">
            <h1 className="text-4xl font-bold">Спасибо, за выбор Gml</h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              Добро пожаловать в панель управления!
              <br />
              Мы рады приветствовать вас в панели управления. Здесь вы можете настроить, управлять и
              следить за всеми аспектами вашего проекта.
            </p>

            <div className="flex gap-x-4">
              <Link
                href={AUTH_PAGES.SIGN_IN}
                className={cn(buttonVariants({ variant: 'default' }))}
              >
                Войти
              </Link>
              <Link
                href={AUTH_PAGES.SIGN_UP}
                className={cn(buttonVariants({ variant: 'outline' }))}
              >
                Регистрация
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
