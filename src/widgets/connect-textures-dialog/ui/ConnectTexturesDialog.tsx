"use client";

import { useState } from "react";

import { Settings2 } from "lucide-react";

import { ConnectTexturesForm } from "@/features/connect-textures-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { useConnectTextures } from "@/shared/hooks";
import { TexturesServiceType } from "@/shared/enums";

export function ConnectTexturesDialog() {
  const [open, setOpen] = useState(false);
  const onOpenChange = () => setOpen((prev) => !prev);

  const { data: textures_skins, isLoading: isLoadingSkins } = useConnectTextures(
    TexturesServiceType.TEXTURES_SERVICE_SKINS,
  );
  const { data: textures_cloaks, isLoading: isLoadingCloaks } = useConnectTextures(
    TexturesServiceType.TEXTURES_SERVICE_CLOAKS,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="w-fit"
          disabled={isLoadingSkins || isLoadingCloaks}
        >
          <Settings2 className="mr-2" size={16} />
          Настроить
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Подключение сервиса скинов и плащей</DialogTitle>
        </DialogHeader>
        <ConnectTexturesForm
          skins={textures_skins}
          cloaks={textures_cloaks}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
}
