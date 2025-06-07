'use client';

import { PencilIcon, PlugIcon, ActivityIcon } from 'lucide-react';
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/shared/ui/dialog';
import { useSentry } from '@/shared/hooks';
import { Button } from '@/shared/ui/button';
import { ConnectSentryForm } from '@/features/connect-sentry-form';

export function ConnectSentryDialog() {
  const [open, setOpen] = useState(false);
  const onOpenChange = () => setOpen((prev) => !prev);

  const { data: sentry, isLoading } = useSentry();

  const connectionText = Boolean(sentry?.url) ? 'Изменить' : 'Подключить';
  const connectionIcon = Boolean(sentry?.url) ? (
    <PencilIcon className="mr-2" size={16} />
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
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-red-100 p-2 dark:bg-red-900">
              <ActivityIcon className="h-5 w-5 text-red-600 dark:text-red-300" />
            </div>
            <DialogTitle className="text-xl">Подключение Sentry</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Настройте интеграцию с Sentry для отслеживания ошибок и производительности вашего приложения
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-x-8">
          <ConnectSentryForm onOpenChange={onOpenChange} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
