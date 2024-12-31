'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

import classes from './styles.module.css';

import { cn } from '@/shared/lib/utils';
import { TMenuItem } from '@/shared/types';

interface DesktopNavigationParams {
  menu: TMenuItem[];
}

export const DesktopNavigation = ({ menu }: DesktopNavigationParams) => {
  const pathname = usePathname();

  return (
    <div className={classes.nav__wrapper}>
      <nav className={classes.nav}>
        {menu.map(({ icon, path, text }) => (
          <Link
            key={path}
            href={path}
            className={cn(
              `${classes.nav__link} dark:hover:bg-muted`,
              pathname === path && `${classes['nav__link-active']} dark:bg-muted`,
            )}
          >
            {icon}
            {text}
          </Link>
        ))}
      </nav>
    </div>
  );
};
