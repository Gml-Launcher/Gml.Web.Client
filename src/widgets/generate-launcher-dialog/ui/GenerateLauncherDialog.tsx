'use client';

import { useState } from 'react';
import { Hammer } from 'lucide-react';

import { useConnectionHub } from '../lib/hooks/useConnectionHub';

import { DownloadClientForm } from '@/features/download-client-form';
import { BuildClientForm } from '@/features/build-client-form';
import { UpdateClientForm } from '@/features/update-client-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

export function GenerateLauncherDialog() {
  const [open, setOpen] = useState(false);
  const onOpenChange = () => setOpen((prev) => !prev);

  const connectionState = useConnectionHub();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="w-fit">
          <Hammer className="mr-2" size={16} />
          Собрать лаунчер
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold">Сборка лаунчера</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1">
            Настройте параметры для скачивания, сборки или обновления лаунчера
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="download" className="h-[620px] sm:flex sm:gap-6">
          <TabsList className="grid grid-cols-3 gap-2 sm:flex sm:flex-col sm:w-48 sm:h-auto sm:items-start sm:justify-start">
            <TabsTrigger value="download" className="sm:justify-start sm:w-full">
              1. Скачивание
            </TabsTrigger>
            <TabsTrigger value="build" className="sm:justify-start sm:w-full">
              2. Сборка
            </TabsTrigger>
            <TabsTrigger value="update" className="sm:justify-start sm:w-full">
              3. Обновление
            </TabsTrigger>
          </TabsList>
          <div className="sm:flex-1 sm:min-w-0">
            <TabsContent value="download" className="space-y-4 sm:mt-0">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Скачивание исходного кода</h3>
                <p className="text-sm text-muted-foreground">
                  Загрузите исходный код лаунчера с GitHub для дальнейшей работы с ним
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <DownloadClientForm
                  connectionHub={connectionState.connectionHub}
                  state={connectionState.download}
                />
              </div>
            </TabsContent>
            <TabsContent value="build" className="space-y-4 sm:mt-0">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Сборка лаунчера</h3>
                <p className="text-sm text-muted-foreground">
                  Соберите лаунчер для выбранных операционных систем из исходного кода
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <BuildClientForm
                  connectionHub={connectionState.connectionHub}
                  state={connectionState.build}
                />
              </div>
            </TabsContent>
            <TabsContent value="update" className="space-y-4 sm:mt-0">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Обновление лаунчера</h3>
                <p className="text-sm text-muted-foreground">
                  Создайте новую версию лаунчера и опубликуйте обновление для пользователей
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <UpdateClientForm onOpenChange={onOpenChange} />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
