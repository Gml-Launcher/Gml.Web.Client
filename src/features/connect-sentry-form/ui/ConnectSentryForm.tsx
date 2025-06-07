'use client';

import React, { useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InfoIcon } from 'lucide-react';

import { integrationSchema, SentryFormSchemaType } from '../lib/static';

import { useEditSentry, useSentry } from '@/shared/hooks';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Icons } from '@/shared/ui/icons';
import { Input } from '@/shared/ui/input';
import { Card, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';

interface SignInFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onOpenChange: (open: boolean) => void;
}

export function ConnectSentryForm({ className, onOpenChange, ...props }: SignInFormProps) {
  const { data } = useSentry();
  const { mutateAsync, isPending } = useEditSentry();

  const form = useForm<SentryFormSchemaType>({
    values: {
      url: data?.url || '',
    },
    resolver: zodResolver(integrationSchema),
  });

  const protocolInfo = useMemo(() => {
    const url = form.watch('url') || data?.url || '';
    if (!url) return null;

    try {
      // Try to extract protocol from URL
      const match = url.match(/^(https?|http):\/\//i);
      const protocol = match ? match[1].toUpperCase() : null;

      if (protocol) {
        return {
          protocol,
          color: protocol === 'HTTPS' ? 'green' : 'yellow',
          secure: protocol === 'HTTPS',
        };
      }
      return null;
    } catch (e) {
      return null;
    }
  }, [form.watch('url'), data?.url]);

  const onSubmit: SubmitHandler<SentryFormSchemaType> = async (data: SentryFormSchemaType) => {
    await mutateAsync(data).then(() => {
      onOpenChange(false);
    });
  };

  return (
    <div className={cn('grid gap-4', className)} {...props}>
      <Form {...form}>
        <form className="flex flex-col space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormItem>
            <FormLabel className="text-sm font-medium">Введите эндпоинт</FormLabel>
            <FormControl>
              <Input
                placeholder="https://xxxxx@sentry.io/xxxxx"
                className="focus-visible:ring-offset-1 focus-visible:ring-2"
                {...form.register('url')}
              />
            </FormControl>
            <p className="text-xs text-muted-foreground mt-1">
              Укажите DSN URL вашего проекта Sentry для отслеживания ошибок
            </p>
            {form.formState.errors.url && (
              <FormMessage>{form.formState.errors.url.message}</FormMessage>
            )}
          </FormItem>

          {protocolInfo && (
            <Card className="border border-muted">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Информация о протоколе:</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Badge
                    variant={protocolInfo.secure ? 'default' : 'destructive'}
                    className={cn(
                      'px-2 py-0.5 text-xs font-medium',
                      protocolInfo.secure
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
                    )}
                  >
                    {protocolInfo.protocol}
                  </Badge>
                  <span className="text-sm">
                    {protocolInfo.secure ? 'Безопасное соединение' : 'Небезопасное соединение'}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              className="w-fit"
              variant="default"
              disabled={isPending || !form.formState.isDirty}
            >
              {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Сохранить
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
