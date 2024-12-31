'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu } from 'lucide-react';

import classes from './styles.module.css';

import { config } from '@/core/configs';
import { cn } from '@/shared/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui/sheet';
import { Button } from '@/shared/ui/button';
import { TMenuItem } from '@/shared/types';
import logo from '@/assets/logos/logo.svg';

interface MobileNavigationParams {
  menu: TMenuItem[];
}

export const MobileNavigation = ({ menu }: MobileNavigationParams) => {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className={classes.sheet}>
        <nav className={classes.sheet__navigation}>
          <Link href="/" className={classes.sheet__logo}>
            <Image src={logo} alt="Gml Frontend" />
            {config.name}
            <sup className={classes.version}>{config.version}</sup>
          </Link>
          {menu.map(({ icon, path, text }) => (
            <Link
              key={path}
              href={path}
              className={cn(
                classes.sheet__link,
                pathname === path && `${classes['sheet__link-active']} dark:bg-muted`,
              )}
            >
              {icon}
              {text}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
