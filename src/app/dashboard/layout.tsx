import Link from "next/link";
import Image from "next/image";

import { ArrowUpDownIcon, BlocksIcon, SettingsIcon } from "lucide-react";

import { ChangeTheme } from "@/features/change-theme";

import { DesktopNavigation } from "@/shared/ui/DesktopNavigation";
import { MobileNavigation } from "@/shared/ui/MobileNavigation";
import { AccountNavigation } from "@/shared/ui/AccountNavigation";
import { DASHBOARD_PAGES } from "@/shared/routes";
import { DonationPro } from "@/shared/ui/DonationPro";
import { TMenuItem } from "@/shared/types";
import logo from "@/assets/logos/logo.svg";

import classes from "./styles.module.css";

const menu: TMenuItem[] = [
  {
    icon: <BlocksIcon size={16} />,
    path: DASHBOARD_PAGES.PROFILES,
    text: "Профили",
  },
  {
    icon: <ArrowUpDownIcon size={16} />,
    path: DASHBOARD_PAGES.INTEGRATIONS,
    text: "Интеграции",
  },
  {
    icon: <SettingsIcon size={16} />,
    path: DASHBOARD_PAGES.SETTINGS,
    text: "Настройки",
  },
];

export default function Page({ children }: React.PropsWithChildren) {
  return (
    <div className={classes.layout}>
      <aside className={classes.aside}>
        <div className={classes.aside__wrapper}>
          <div className={classes["aside__wrapper-logo"]}>
            <Link href="/" className={classes.aside__logo}>
              <Image src={logo} alt="GML Frontend" />
              GML Frontend
            </Link>
          </div>
          <DesktopNavigation menu={menu} />
          <div className="mt-auto p-4">
            <DonationPro />
          </div>
        </div>
      </aside>
      <div className={classes.content}>
        <header className={classes.header}>
          <MobileNavigation menu={menu} />
          <div className={classes.header__actions}>
            <ChangeTheme />
            <AccountNavigation />
          </div>
        </header>
        <main className={classes.main}>{children}</main>
      </div>
    </div>
  );
}
