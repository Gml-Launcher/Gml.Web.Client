import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ClientDownloadFormSchemaType, ClientDownloadSchema } from '../lib/static';
import { useOnSubmit } from '../lib/hooks/useOnSubmit';

import { useConnectionHub } from '@/widgets/generate-launcher-dialog';
import { useLauncherGithubVersions } from '@/shared/hooks';
import { cn, getApiBaseUrl } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Icons } from '@/shared/ui/icons';
import { Input } from '@/shared/ui/input';
import { Progress } from '@/shared/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

interface DownloadClientFormProps extends React.HTMLAttributes<HTMLDivElement> {
  connectionHub: ReturnType<typeof useConnectionHub>['connectionHub'];
  state: ReturnType<typeof useConnectionHub>['download'];
}

export function DownloadClientForm({
  className,
  connectionHub,
  state,
  ...props
}: DownloadClientFormProps) {
  const { percent, isDownload } = state;

  const { onSubmit } = useOnSubmit({ connectionHub, state });

  const { data: branches } = useLauncherGithubVersions();

  const form = useForm<ClientDownloadFormSchemaType>({
    values: { branch: '', host: getApiBaseUrl() || '', folder: '' },
    resolver: zodResolver(ClientDownloadSchema),
    disabled: isDownload,
  });

  return (
    <div className={cn('grid gap-4', className)} {...props}>
      <Form {...form}>
        <form className="flex flex-col space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            control={form.control}
            name="branch"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Выберите версию</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={field.disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите версию" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches &&
                        branches.map(({ version }) => (
                          <SelectItem key={version} value={version}>
                            {version}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                {form.formState.errors.branch && (
                  <FormMessage>{form.formState.errors.branch.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <Controller
            control={form.control}
            name="host"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Введите URL к API</FormLabel>
                <FormControl>
                  <Input placeholder="Введите URL к API" {...field} />
                </FormControl>
                {form.formState.errors.host && (
                  <FormMessage>{form.formState.errors.host.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <Controller
            control={form.control}
            name="folder"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Введите название папки</FormLabel>
                <FormControl>
                  <Input placeholder="Введите название папки" {...field} />
                </FormControl>
                {form.formState.errors.folder && (
                  <FormMessage>{form.formState.errors.folder.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <div className="flex justify-center items-center gap-x-4">
            {isDownload && (
              <div className="w-full flex flex-col gap-y-1">
                <p className="text-gray-700 dark:text-gray-200 text-sm">
                  Загрузка завершена на {percent}% из 100%
                </p>
                <Progress className="h-2" value={percent} />
              </div>
            )}

            <Button className="w-fit ml-auto" disabled={isDownload || !form.formState.isDirty}>
              {isDownload && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Скачать исходники
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
