"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/shared/lib/utils";
import { DASHBOARD_PAGES } from "@/shared/routes";
import { Icons } from "@/shared/ui/icons";

export function Header() {
  const pathname = usePathname();

  return (
    <div className="pb-12 w-[400px]">
      <div className="space-y-2 p-4">
        <Link
          href={DASHBOARD_PAGES.SETTINGS}
          className={cn(
            "flex w-full items-center rounded-md border border-transparent px-4 py-3 hover:bg-muted",
            pathname === DASHBOARD_PAGES.SETTINGS
              ? "font-medium text-foreground bg-muted"
              : "text-muted-foreground",
          )}
        >
          <Icons.command className="mr-2 h-4 w-4" />
          Аккаунт
        </Link>
        <Link
          href={DASHBOARD_PAGES.INTEGRATIONS}
          className={cn(
            "flex w-full items-center rounded-md border border-transparent px-4 py-3 hover:bg-muted",
            pathname === DASHBOARD_PAGES.INTEGRATIONS
              ? "font-medium text-foreground bg-muted"
              : "text-muted-foreground",
          )}
        >
          <Icons.command className="mr-2 h-4 w-4" />
          Интеграции
        </Link>
        <Link
          href={DASHBOARD_PAGES.PROFILES}
          className={cn(
            "flex w-full items-center rounded-md border border-transparent px-4 py-3 hover:bg-muted",
            pathname === DASHBOARD_PAGES.PROFILES
              ? "font-medium text-foreground bg-muted"
              : "text-muted-foreground",
          )}
        >
          <Icons.command className="mr-2 h-4 w-4" />
          Профили
        </Link>
      </div>
    </div>
  );
}
