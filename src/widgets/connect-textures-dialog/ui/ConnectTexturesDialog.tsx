'use client';

import { useState } from 'react';
import { WallpaperIcon } from 'lucide-react';

import { ConnectTexturesForm } from '@/features/connect-textures-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { useConnectTextures } from '@/shared/hooks';
import { TexturesServiceType } from '@/shared/enums';

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
          <WallpaperIcon className="mr-2" size={16} />
          Настроить
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[calc(100vh-theme(spacing.16))] overflow-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
              <WallpaperIcon className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            </div>
            <DialogTitle className="text-xl">Подключение сервиса скинов и плащей</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Настройте интеграцию с сервисами скинов и плащей для вашего проекта
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <ConnectTexturesForm
            skins={textures_skins}
            cloaks={textures_cloaks}
            onOpenChange={onOpenChange}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
