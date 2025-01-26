import { useEffect, useRef } from 'react';
import { Ubuntu_Mono } from 'next/font/google';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown } from 'lucide-react';

import { ClientBuildFormSchemaType, ClientBuildSchema } from '../lib/static';
import { useOnSubmit } from '../lib/hooks/useOnSubmit';

import { useConnectionHub } from '@/widgets/generate-launcher-dialog';
import { useLauncherGithubVersions, useLauncherPlatforms } from '@/shared/hooks';
import { cn } from '@/shared/lib/utils';
import { Icons } from '@/shared/ui/icons';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Textarea } from '@/shared/ui/textarea';
import { SelectOption } from '@/shared/types';
import { MultiSelect } from '@/shared/ui/multi-select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';

interface BuildClientFormProps extends React.HTMLAttributes<HTMLDivElement> {
  connectionHub: ReturnType<typeof useConnectionHub>['connectionHub'];
  state: ReturnType<typeof useConnectionHub>['build'];
}

const ubuntuMono = Ubuntu_Mono({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: '400',
});

export function BuildClientForm({
  className,
  connectionHub,
  state,
  ...props
}: BuildClientFormProps) {
  const { isBuilding, logs } = state;

  const versions = useLauncherGithubVersions();
  const platforms = useLauncherPlatforms();

  const versionsOptions = ((versions.data &&
    versions.data.map(({ version }) => ({
      label: version,
      value: version,
    }))) ||
    []) as SelectOption[];

  const platformsOptions =
    platforms.data &&
    ((platforms.data.map((name) => ({
      label: name,
      value: name,
    })) || []) as SelectOption[]);

  const form = useForm<ClientBuildFormSchemaType>({
    defaultValues: {
      version: '',
      operatingSystem: [],
    },
    resolver: zodResolver(ClientBuildSchema),
    disabled: isBuilding,
  });

  const { onSubmit } = useOnSubmit({
    connectionHub,
    state,
    version: form.getValues('version'),
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className={cn('grid gap-4', className)} {...props}>
      <Form {...form}>
        <form className="flex flex-col space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem className="space-y-2 flex-1">
                <FormLabel>Выберите версию</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full justify-between',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value
                            ? versionsOptions &&
                              versionsOptions.find((version) => version.value === field.value)
                                ?.label
                            : 'Выберите версию'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Поиск..." />
                        <CommandEmpty>Версия не найдена</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {versionsOptions.map((option) => (
                              <CommandItem
                                key={option.value}
                                value={option.value}
                                onSelect={(currentValue) => {
                                  form.setValue('version', currentValue);
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    option.value === field.value ? 'opacity-100' : 'opacity-0',
                                  )}
                                />
                                {option.label}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                {form.formState.errors.version && (
                  <FormMessage>{form.formState.errors.version.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <Controller
            control={form.control}
            name="operatingSystem"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Выберите операционную систему</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={platformsOptions}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    placeholder="Выберите операционную систему"
                    variant="inverted"
                    maxCount={3}
                  />
                </FormControl>
                {form.formState.errors.operatingSystem && (
                  <FormMessage>{form.formState.errors.operatingSystem.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <div className="flex gap-x-4 justify-end items-center">
            <Button className="w-fit" disabled={isBuilding || !form.formState.isDirty}>
              {isBuilding && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Собрать
            </Button>
          </div>
        </form>
      </Form>
      {isBuilding && logs && (
        <Textarea
          ref={textareaRef}
          value={logs.join('\n')}
          className={cn('h-64 max-h-64 font-sans', ubuntuMono.variable)}
          readOnly
        />
      )}
    </div>
  );
}
