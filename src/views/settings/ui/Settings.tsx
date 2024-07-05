import { EditSettingsPlatformForm } from "@/features/edit-settings-platform-form";

import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { DASHBOARD_PAGES } from "@/shared/routes";
import { CircleUser, Menu, Package2, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Checkbox } from "@/shared/ui/checkbox";
import Link from "next/link";

export const SettingsPage = () => {
  return (
    <>
      <Breadcrumbs
        current="Настройки платформы"
        breadcrumbs={[{ value: "Главная", path: DASHBOARD_PAGES.HOME }]}
      />
      <div className="mx-auto grid w-full gap-2">
        <h1 className="text-3xl font-semibold">Настройки</h1>
      </div>
      <div className="mx-auto grid w-full items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0">
          <Link href="#" className="font-semibold text-primary">
            Основные
          </Link>
        </nav>
        <div className="grid gap-6">
          <EditSettingsPlatformForm />
        </div>
      </div>
    </>
  );
};
