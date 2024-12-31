import React from 'react';
import { UseFormSetValue } from 'react-hook-form';

import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { FormControl } from '@/shared/ui/form';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/ui/command';

type FormComboboxParams = {
  value: string;
  name: string;
  setValue: UseFormSetValue<any>;
  options?: string[];
  placeholder: string;
  placeholderInputSearch: string;
  description?: string;
  isLoading?: boolean;
  isError?: boolean;
};

// TODO: Добавить Disabled: boolean
// TODO: Провести рефакторинг и отказаться от Textarea

export const FormCombobox = ({
  value,
  name,
  options = [],
  placeholderInputSearch,
  placeholder,
  isLoading,
  isError,
  setValue,
  description,
}: FormComboboxParams) => {
  if (isLoading) return <Textarea text="Загрузка" />;
  if (isError && description) return <Textarea text={description} />;

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl
            className={
              'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
            }
          >
            <Button
              role="combobox"
              variant="ghost"
              className={cn('text-black dark:text-white', !value && 'text-muted-foreground')}
            >
              {value ? options.find((info) => info === value) : placeholder}
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandInput placeholder={placeholderInputSearch} />
            <CommandEmpty>Ничего не найдено</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {options.map((info) => (
                  <CommandItem
                    key={info}
                    value={info}
                    onSelect={() => setValue(name, info, { shouldDirty: true })}
                  >
                    {info}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};

const Textarea = ({ text }: { text: string }) => {
  return (
    <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
      <span className="text-muted-foreground">{text}</span>
    </div>
  );
};
