"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { BoxesIcon, LogOutIcon } from "lucide-react";

import { ChangeTheme } from "@/features/change-theme";
import { cn } from "@/shared/lib/utils";
import { AUTH_PAGES, DASHBOARD_PAGES } from "@/shared/routes";
import { removeStorageProfile, removeStorageTokens } from "@/shared/services";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/shared/ui/navigation-menu";

const menu = [
  {
    item: "Профили",
    paths: [
      // {
      //   icon: <PlusIcon />,
      //   path: "",
      //   text: "Создать профиль",
      //   isDisabled: true,
      // },
      {
        icon: <BoxesIcon />,
        path: DASHBOARD_PAGES.PROFILES,
        text: "Список профилей",
      },
    ],
  },
  // {
  //   item: "Сервера",
  //   paths: [
  //     {
  //       icon: <PlusIcon />,
  //       path: "",
  //       text: "Создать сервер",
  //       isDisabled: true,
  //     },
  //     {
  //       icon: <BoxesIcon />,
  //       path: DASHBOARD_PAGES.SERVERS,
  //       text: "Список серверов",
  //       isDisabled: true,
  //     },
  //   ],
  // },
  {
    item: "Интеграции",
    paths: [
      {
        icon: <BoxesIcon />,
        path: DASHBOARD_PAGES.INTEGRATIONS,
        text: "Список интеграций",
      },
    ],
  },
  {
    item: "Настройки платформы",
    paths: [
      {
        icon: <BoxesIcon />,
        path: DASHBOARD_PAGES.SETTINGS,
        text: "Настройки платформы",
      },
    ],
  },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const destroySession = () => {
    removeStorageProfile();
    removeStorageTokens();
    router.push(AUTH_PAGES.SIGN_IN);
  };

  return (
    <>
      <nav className="hidden lg:flex flex-col gap-y-8 px-2 py-8 h-full w-[300px]">
        <h3 className="text-xl font-bold mb-4 ml-3">GML Frontend</h3>

        {menu.map(({ item, paths }) => (
          <div key={item} className="flex flex-col gap-y-1">
            <h6 className="text-sm font-bold text-muted-foreground ml-3">{item}</h6>
            {paths.map(({ icon, text, path }) => (
              <div key={text} className="m-0.5">
                <Link
                  className={cn(
                    "flex items-center gap-x-3 text-base p-2.5 rounded-lg transition-colors hover:bg-muted",
                    pathname === path && "text-foreground bg-muted",
                  )}
                  href={path}
                >
                  {icon}
                  {text}
                </Link>
              </div>
            ))}
          </div>
        ))}
        <div className="flex flex-col gap-y-4 mt-auto">
          <ChangeTheme />
          <button
            className="flex fixed bottom-8 items-center gap-x-3 text-base p-2.5 rounded-lg transition-colors hover:bg-muted"
            onClick={destroySession}
          >
            <LogOutIcon className="h-4 w-4" />
            Выйти из аккаунта
          </button>
        </div>
      </nav>

      <nav className="lg:hidden flex items-center gap-x-4 p-6 border-b-2 border-gray-50">
        <h3 className="text-xl font-bold">GML Frontend</h3>
        <NavigationMenu>
          <NavigationMenuList>
            {menu.map(({ item, paths }) => (
              <NavigationMenuItem key={item}>
                <NavigationMenuTrigger>{item}</NavigationMenuTrigger>
                <NavigationMenuContent className="p-4 min-w-64">
                  {paths.map(({ text, path, icon }) => (
                    <Link
                      key={text}
                      className={cn(
                        "flex items-center gap-x-3 text-base p-2.5 rounded-lg transition-colors hover:bg-muted",
                        pathname === path && "text-foreground bg-muted",
                      )}
                      href={path}
                    >
                      {icon}
                      {text}
                    </Link>
                  ))}
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
    </>
  );
}
