'use client';

import { useState } from 'react';
import { PencilIcon, PlugIcon } from 'lucide-react';

import { ConnectDiscordForm } from '@/features/connect-discord-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { useDiscord } from '@/shared/hooks';
import { Button } from '@/shared/ui/button';

export function ConnectDiscordDialog() {
  const [open, setOpen] = useState(false);
  const onOpenChange = () => setOpen((prev) => !prev);

  const { data: discord, isLoading } = useDiscord();

  const isConnected = Boolean(discord?.clientId);
  const connectionText = isConnected ? 'Изменить' : 'Подключить';
  const connectionIcon = isConnected ? (
    <PencilIcon className="mr-2" size={16} />
  ) : (
    <PlugIcon className="mr-2" size={16} />
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className={`w-fit`} disabled={isLoading}>
          {connectionIcon}
          {connectionText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[calc(100vh-theme(spacing.16))] overflow-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-indigo-100 p-2 dark:bg-indigo-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-indigo-600 dark:text-indigo-300"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M15.09 11.41a4 4 0 0 0-5.18-5.18M8.91 12.59a4 4 0 0 0 5.18 5.18" />
                <path d="M9.59 8.91A4 4 0 0 0 12 16c1.1 0 2.1-.45 2.82-1.18" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <DialogTitle className="text-xl">Подключение Discord</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Настройте интеграцию с Discord для отображения активности пользователей
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-x-8">
          <ConnectDiscordForm onOpenChange={onOpenChange} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
