import Image from 'next/image';
import Link from 'next/link';
import { BookIcon } from 'lucide-react';

import logo from '@/assets/logos/logo.svg';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/shared/ui/navigation-menu';
import { config } from '@/core/configs';
import recloudLogo from '@/assets/logos/recloud.png';

export default function WelcomeNavbar() {
  return (
    <>
      <NavigationMenu className="items-start h-6 max-h-6 sm:h-8 sm:max-h-8 md:h-10 md:max-h-10 lg:h-12 lg:max-h-12">
        <NavigationMenuList className="gap-5 sm:gap-6 lg:gap-8 flex-wrap">
          <Link
            href="/"
            className="flex items-center gap-x-2 text-xl sm:text-2xl font-bold whitespace-nowrap"
          >
            <Image src={logo} alt="Gml Frontend" className="w-8 sm:w-10" />
            {config.name}
            <sup className="text-xs text-gray-400">{config.version}</sup>
          </Link>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Начало работы</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[500px] lg:w-[700px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-1">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      target={'_blank'}
                      href="https://recloud.tech"
                    >
                      <div className="flex items-center gap-3 mb-2 mt-4 text-base sm:text-lg font-medium">
                        <Image src={recloudLogo} width={24} height={24} alt="Logo recloud" />
                        Recloud
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Сайт организации, представляющей продукт.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li className="row-span-1">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      target={'_blank'}
                      href="https://wiki.recloud.tech"
                    >
                      <div className="flex items-center gap-3 mb-2 mt-4 text-base sm:text-lg font-medium">
                        <BookIcon />
                        Документация
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Если у вас возникли вопросы или трудности в процессе эксплуатации,
                        обратитесь к технической документации.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="https://github.com/Gml-Launcher" target="_blank" legacyBehavior passHref>
              <NavigationMenuLink target={'_blank'}>Github</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="https://discord.gg/b5xgqfWgNt" target="_blank" legacyBehavior passHref>
              <NavigationMenuLink target={'_blank'}>Discord</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="text-xlfont-bold leading-none tracking-tight bg-gradient-to-r from-purple-500 to-pink-500 inline-block text-transparent bg-clip-text">
            <Link href="https://market.recloud.tech" target="_blank" legacyBehavior passHref>
              <NavigationMenuLink target={'_blank'}> Перейти на Pro</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
}
