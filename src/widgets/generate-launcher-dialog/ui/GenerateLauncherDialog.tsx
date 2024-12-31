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
          Собрать
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Сборка лаунчера</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="download">
          <TabsList>
            <TabsTrigger value="download">Скачивание</TabsTrigger>
            <TabsTrigger value="build">Сборка</TabsTrigger>
            <TabsTrigger value="update">Обновление</TabsTrigger>
          </TabsList>
          <TabsContent value="download">
            <DownloadClientForm
              connectionHub={connectionState.connectionHub}
              state={connectionState.download}
            />
          </TabsContent>
          <TabsContent value="build">
            <BuildClientForm
              connectionHub={connectionState.connectionHub}
              state={connectionState.build}
            />
          </TabsContent>
          <TabsContent value="update">
            <UpdateClientForm onOpenChange={onOpenChange} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
