"use client";

import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";
import { useTheme } from "next-themes";

export const ChangeTheme = () => {
  const { setTheme } = useTheme();

  const currentTheme = localStorage.getItem("theme");
  const isDarkTheme = currentTheme === "dark";

  const onChangeTheme = () => {
    if (currentTheme === "light") return setTheme("dark");

    return setTheme("light");
  };

  return (
    <div
      className="flex justify-between items-center space-x-2 gap-x-3 text-base p-2.5 rounded-lg transition-colors hover:bg-muted cursor-pointer"
      onClick={onChangeTheme}
    >
      <div className="flex items-center gap-x-2 cursor-pointer">
        <Label className="cursor-pointer">Темная тема</Label>
      </div>
      <Switch checked={isDarkTheme} />
    </div>
  );
};
