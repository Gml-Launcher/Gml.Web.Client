"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Icons } from "@/shared/ui/icons";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="pb-12 w-[400px]">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Настройки</h2>
          <div className="space-y-1">
            <Link
              href={"/dashboard/settings"}
              className={cn(
                "flex w-full items-center rounded-md border border-transparent px-4 py-3 hover:bg-muted",
                pathname === "/dashboard/settings"
                  ? "font-medium text-foreground bg-muted"
                  : "text-muted-foreground",
              )}
            >
              <Icons.command className="mr-2 h-4 w-4" />
              Управление
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Интеграции</h2>
          <div className="space-y-1">
            <Link
              href={"/dashboard/integrations"}
              className={cn(
                "flex w-full items-center rounded-md border border-transparent px-4 py-3 hover:bg-muted",
                pathname === "/dashboard/integrations"
                  ? "font-medium text-foreground bg-muted"
                  : "text-muted-foreground",
              )}
            >
              <Icons.command className="mr-2 h-4 w-4" />
              Управление
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Профили</h2>
          <div className="space-y-1">
            <Link
              href={"/dashboard/profiles"}
              className={cn(
                "flex w-full items-center rounded-md border border-transparent px-4 py-3 hover:bg-muted",
                pathname === "/dashboard/profiles"
                  ? "font-medium text-foreground bg-muted"
                  : "text-muted-foreground",
              )}
            >
              <Icons.command className="mr-2 h-4 w-4" />
              Управление
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
