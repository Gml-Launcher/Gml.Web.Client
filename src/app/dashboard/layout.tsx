import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowUpDownIcon,
  BlocksIcon,
  PieChartIcon,
  SettingsIcon,
  ShoppingCartIcon,
  Users2Icon,
} from 'lucide-react';

import classes from './styles.module.css';

import { config } from '@/core/configs';
import { ChangeTheme } from '@/features/change-theme';
import { Notifications } from '@/features/notifications';
import { DesktopNavigation } from '@/shared/ui/DesktopNavigation';
import { MobileNavigation } from '@/shared/ui/MobileNavigation';
import { AccountNavigation } from '@/shared/ui/AccountNavigation';
import { DASHBOARD_PAGES } from '@/shared/routes';
import { DonationPro } from '@/shared/ui/DonationPro';
import { Badge } from '@/shared/ui/badge';
import { TMenuItem } from '@/shared/types';
import logo from '@/assets/logos/logo.svg';

const menu: TMenuItem[] = [
  {
    icon: <BlocksIcon size={16} />,
    path: DASHBOARD_PAGES.PROFILES,
    text: 'Профили',
  },
  {
    icon: <ShoppingCartIcon size={16} />,
    path: DASHBOARD_PAGES.MARKETPLACE,
    text: (
      <>
        Маркетплейс
        <Badge className="ml-1" variant="secondary">
          beta
        </Badge>
      </>
    ),
  },
  {
    icon: <ArrowUpDownIcon size={16} />,
    path: DASHBOARD_PAGES.INTEGRATIONS,
    text: 'Интеграции',
  },
  {
    icon: <Users2Icon size={16} />,
    path: DASHBOARD_PAGES.PLAYERS,
    text: 'Игроки',
  },
  {
    icon: <PieChartIcon size={16} />,
    path: DASHBOARD_PAGES.SENTRY,
    text: 'Ошибки',
  },
  {
    icon: <SettingsIcon size={16} />,
    path: DASHBOARD_PAGES.SETTINGS,
    text: 'Настройки',
  },
];

export default function Page({ children }: React.PropsWithChildren) {
  return (
    <div className={classes.layout}>
      <aside className={classes.aside}>
        <div className={classes.aside__wrapper}>
          <div className={classes['aside__wrapper-logo']}>
            <Link href="/" className={classes.aside__logo}>
              <Image src={logo} alt="Gml Frontend" />
              {config.name}
              <sup className={classes.version}>{config.version}</sup>
            </Link>
          </div>
          <DesktopNavigation menu={menu} />
          <div className={classes.aside__pro}>
            <DonationPro />
          </div>
        </div>
      </aside>
      <div className={classes.content}>
        <header className={classes.header}>
          <MobileNavigation menu={menu} />
          <div className={classes.header__actions}>
            <Notifications />
            <ChangeTheme />
            <AccountNavigation />
          </div>
        </header>
        <main className={classes.main}>{children}</main>
      </div>
    </div>
  );
}
