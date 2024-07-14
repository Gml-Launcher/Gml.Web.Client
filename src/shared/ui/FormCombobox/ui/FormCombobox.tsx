import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { FormControl } from "@/shared/ui/form";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@/shared/ui/command";
import React from "react";
import { ControllerRenderProps, UseFormSetValue } from "react-hook-form";

type Error = {
  text: string;
  isError: boolean;
};

type Data = {
  text_button: string;
  text_search: string;
  data: string[];
};

type FormComboboxParams = {
  field: ControllerRenderProps;
  setValue: UseFormSetValue<any>;
  data: Data;
  isLoading: boolean;
  error?: Error;
};

export const FormCombobox = ({ field, data, isLoading, setValue, error }: FormComboboxParams) => {
  if (isLoading) return <Textera text="Загрузка" />;
  if (error && error.isError) return <Textera text={error.text} />;

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl
            className={
              "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
            }
          >
            <Button
              role="combobox"
              variant="ghost"
              className={cn("text-white", !field.value && "text-muted-foreground")}
            >
              {field.value ? data.data.find((info) => info === field.value) : data.text_button}
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandInput placeholder={data.text_search} />
            <CommandEmpty>Не найдено</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {data.data.map((info) => (
                  <CommandItem
                    key={info}
                    value={info}
                    onSelect={() => setValue(field.name, info, { shouldDirty: true })}
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

const Textera = ({ text }: { text: string }) => {
  return (
    <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
      <span className="text-muted-foreground">{text}</span>
    </div>
  );
};
