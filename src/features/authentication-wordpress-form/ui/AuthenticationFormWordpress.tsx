'use client';

import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { IntegrationFormSchemaType, integrationSchema } from '../lib/static';

import { useEditIntegration, useGetActiveAuthIntegrations } from '@/shared/hooks';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Icons } from '@/shared/ui/icons';
import { Input } from '@/shared/ui/input';
import { AuthenticationType } from '@/shared/enums';
import { HREF_GET_WORDPRESS_AUTH_PHP } from '@/shared/constants';

interface SignInFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onOpenChange: (open: boolean) => void;
}

export function AuthenticationFormWordpress({
  className,
  onOpenChange,
  ...props
}: SignInFormProps) {
  const { data: integration } = useGetActiveAuthIntegrations();

  const { mutateAsync, isPending } = useEditIntegration();

  const form = useForm<IntegrationFormSchemaType>({
    values: {
      endpoint:
        integration?.authType === AuthenticationType.AUTHENTICATION_TYPE_WORDPRESS
          ? String(integration.endpoint)
          : '',
      authType:
        integration?.authType === AuthenticationType.AUTHENTICATION_TYPE_WORDPRESS
          ? integration.authType
          : AuthenticationType.AUTHENTICATION_TYPE_WORDPRESS,
    },
    resolver: zodResolver(integrationSchema),
  });

  const onSubmit: SubmitHandler<IntegrationFormSchemaType> = async (
    data: IntegrationFormSchemaType,
  ) => {
    await mutateAsync(data).then(() => {
      onOpenChange(false);
    });
  };

  return (
    <div className={cn('grid gap-4', className)} {...props}>
      <Form {...form}>
        <form className="flex flex-col space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormItem>
            <FormLabel>Введите ссылку на auth.php</FormLabel>
            <FormControl>
              <Input placeholder="Введите ссылку на auth.php" {...form.register('endpoint')} />
            </FormControl>

            {form.formState.errors.endpoint ? (
              <FormMessage>{form.formState.errors.endpoint.message}</FormMessage>
            ) : (
              <FormDescription>
                Не знаете где взять файл auth.php?{' '}
                <a
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  href={HREF_GET_WORDPRESS_AUTH_PHP}
                  target="_blank"
                  download="auth.php"
                >
                  Скачайте по ссылке
                </a>
              </FormDescription>
            )}
          </FormItem>
          <Button
            type="submit"
            className="w-fit ml-auto"
            disabled={isPending || !form.formState.isDirty}
          >
            {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Сохранить
          </Button>
        </form>
      </Form>
    </div>
  );
}
