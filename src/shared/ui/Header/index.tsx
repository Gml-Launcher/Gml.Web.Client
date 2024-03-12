"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DASHBOARD_PAGES } from "@/shared/routes";
import { cn } from "@/shared/lib/utils";
import { BoxesIcon, PlusIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

const menu = [
  {
    item: "Профили",
    paths: [
      {
        icon: <PlusIcon />,
        path: "",
        text: "Создать профиль",
        isDisabled: true,
      },
      {
        icon: <BoxesIcon />,
        path: DASHBOARD_PAGES.PROFILES,
        text: "Список профилей",
        isDisabled: false,
      },
    ],
  },
  {
    item: "Сервера",
    paths: [
      {
        icon: <PlusIcon />,
        path: "",
        text: "Создать сервер",
        isDisabled: true,
      },
      {
        icon: <BoxesIcon />,
        path: DASHBOARD_PAGES.SERVERS,
        text: "Список серверов",
        isDisabled: true,
      },
    ],
  },
  {
    item: "Интеграции",
    paths: [
      {
        icon: <BoxesIcon />,
        path: DASHBOARD_PAGES.INTEGRATIONS,
        text: "Список интеграций",
        isDisabled: false,
      },
    ],
  },
];

export function Header() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-y-8 px-2 py-8 h-full w-[300px]">
      {menu.map(({ item, paths }) => (
        <div key={item} className="flex flex-col gap-y-1">
          <h6 className="text-sm font-bold text-muted-foreground">{item}</h6>
          {paths.map(({ icon, text, path, isDisabled }) => (
            <div key={text} className="m-0.5">
              <Tooltip>
                <TooltipTrigger className="w-full">
                  <Link
                    className={cn(
                      "flex items-center gap-x-3 text-base p-2.5 rounded-lg transition-colors hover:bg-muted",
                      pathname === path && "text-foreground bg-muted",
                      isDisabled && "pointer-events-none text-muted-foreground",
                    )}
                    href={path}
                  >
                    {icon}
                    {text}
                  </Link>
                </TooltipTrigger>
                {isDisabled && (
                  <TooltipContent className="bg-black w-fit" side="right">
                    <div className="flex flex-col gap-y-1">
                      <h6 className="text-sm font-bold text-white">Сервис временно не работает</h6>
                      <p className="text-sm text-gray-200">Мы уже работаем над этой фичей</p>
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            </div>
          ))}
        </div>
      ))}
    </nav>
  );
}
