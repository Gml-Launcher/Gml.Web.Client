"use client";

import { useState } from "react";

import { Settings2 } from "lucide-react";

import { InstallClientForm } from "@/features/install-client-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";

export function GenerateLauncherDialog() {
  const [open, setOpen] = useState(false);
  const onOpenChange = () => setOpen((prev) => !prev);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="w-fit">
          <Settings2 className="mr-2" size={16} />
          Собрать
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Сборка лаунчера</DialogTitle>
        </DialogHeader>
        <InstallClientForm onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
}
