"use client";

import { PlugIcon, Settings2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { useSentry } from "@/shared/hooks";
import { Button } from "@/shared/ui/button";
import { ConnectSentryForm } from "@/features/connect-sentry-form";
import { useState } from "react";

export function ConnectSentryDialog() {
  const [open, setOpen] = useState(false);
  const onOpenChange = () => setOpen((prev) => !prev);

  const { data: sentry, isLoading } = useSentry();

  const connectionText = Boolean(sentry?.url) ? "Изменить" : "Подключить";
  const connectionIcon = Boolean(sentry?.url) ? (
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
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Подключение Sentry</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-x-8">
          <ConnectSentryForm onOpenChange={onOpenChange} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
