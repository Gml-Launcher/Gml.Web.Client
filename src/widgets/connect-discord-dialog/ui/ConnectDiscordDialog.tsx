"use client";

import { useState } from "react";

import { PlugIcon, Settings2 } from "lucide-react";

import { ConnectDiscordForm } from "@/features/connect-discord-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { useDiscord } from "@/shared/hooks";
import { Button } from "@/shared/ui/button";

export function ConnectDiscordDialog() {
  const [open, setOpen] = useState(false);
  const onOpenChange = () => setOpen((prev) => !prev);

  const { data: discord, isLoading } = useDiscord();

  const connectionText = Boolean(discord?.clientId) ? "Изменить" : "Подключить";
  const connectionIcon = Boolean(discord?.clientId) ? (
    <Settings2 className="mr-2" size={16} />
  ) : (
    <PlugIcon className="mr-2" size={16} />
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="w-fit" disabled={isLoading}>
          {connectionIcon}
          {connectionText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[calc(100vh-theme(spacing.16))] overflow-auto">
        <DialogHeader>
          <DialogTitle>Подключение Discord</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-x-8">
          <ConnectDiscordForm onOpenChange={onOpenChange} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
