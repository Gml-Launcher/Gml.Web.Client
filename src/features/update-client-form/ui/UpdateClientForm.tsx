import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

import { ClientUpdateFormSchemaType, ClientUpdateSchema } from '../lib/static';

import { Icons } from '@/shared/ui/icons';
import {
  useLauncherActualVersion,
  useLauncherBuildVersions,
  useLauncherUpload,
} from '@/shared/hooks';
import { cn, getApiBaseUrl, getFormatDate } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Textarea } from '@/shared/ui/textarea';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

interface UpdateClientFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onOpenChange: () => void;
}

export function UpdateClientForm({ className, onOpenChange, ...props }: UpdateClientFormProps) {
  const { data: versions } = useLauncherBuildVersions();
  const { data: actualVersion } = useLauncherActualVersion();

  const { mutateAsync, isPending } = useLauncherUpload();

  const form = useForm<ClientUpdateFormSchemaType>({
    values: { version: '', title: '', description: '', launcherBuild: '' },
    resolver: zodResolver(ClientUpdateSchema),
  });

  const onSubmit: SubmitHandler<ClientUpdateFormSchemaType> = async (
    data: ClientUpdateFormSchemaType,
  ) => {
    const formCreate = new FormData();
    formCreate.append('version', data.version);
    formCreate.append('title', data.title);
    formCreate.append('description', data.description);
    formCreate.append('launcherBuild', data.launcherBuild);
    await mutateAsync(formCreate);
  };

  return (
    <div className={cn('grid gap-4', className)} {...props}>
      <Form {...form}>
        <form className="flex flex-col space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            control={form.control}
            name="launcherBuild"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Выберите версию билда</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите версию билда" />
                    </SelectTrigger>
                    <SelectContent>
                      {versions &&
                        versions.map(({ name, dateTime }) => (
                          <SelectItem key={name} value={name}>
                            от {getFormatDate(dateTime)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                {form.formState.errors.launcherBuild && (
                  <FormMessage>{form.formState.errors.launcherBuild.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <Controller
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Введите версию обновления</FormLabel>
                <FormControl>
                  <Input placeholder="1.0.0.0" {...field} />
                </FormControl>
                {form.formState.errors.version && (
                  <FormMessage>{form.formState.errors.version.message}</FormMessage>
                )}
                <FormDescription className="flex flex-col gap-1">
                  {actualVersion && actualVersion.length > 0 ? (
                    actualVersion.map(([title, data]) => (
                      <span key={title}>
                        Актуальная версия для {title}: {data.version}
                        <Button asChild variant="link" className="ml-2">
                          <Link href={`${getApiBaseUrl()}/api/v1/file/${data.guid}`}>Скачать</Link>
                        </Button>
                      </span>
                    ))
                  ) : (
                    <span>Лаунчер ни разу не обновлялся *</span>
                  )}
                </FormDescription>
              </FormItem>
            )}
          />

          <Controller
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Введите название обновление</FormLabel>
                <FormControl>
                  <Input placeholder="Ого! Вышло обновление!" {...field} />
                </FormControl>
                {form.formState.errors.title && (
                  <FormMessage>{form.formState.errors.title.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <Controller
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Введите описание обновление</FormLabel>
                <FormControl>
                  <Textarea placeholder="Введите описание обновления" {...field} />
                </FormControl>
                {form.formState.errors.description && (
                  <FormMessage>{form.formState.errors.description.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <div className="flex gap-x-4 justify-end items-center">
            <Button className="w-fit" disabled={isPending || !form.formState.isDirty}>
              {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Обновить
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
