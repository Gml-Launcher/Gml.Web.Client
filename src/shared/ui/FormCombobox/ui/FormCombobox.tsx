import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { FormControl } from "@/shared/ui/form";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { Command, CommandEmpty, CommandInput } from "@/shared/ui/command";
import { CommandGroup, CommandItem } from "cmdk";
import React from "react";
import { ControllerRenderProps } from "react-hook-form";

type FormComboboxParams = {
  field: ControllerRenderProps;
  data: string[];
};

export const FormCombobox = ({ field, data }: FormComboboxParams) => {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              role="combobox"
              className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
                !field.value && "text-muted-foreground",
              )}
            >
              {field.value ? data.find((info) => info === field.value) : "Выберите версию игры"}
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandInput placeholder="Поиск версии" />
            <CommandEmpty>Такой версии не существует</CommandEmpty>
            <CommandGroup>
              <CommandItem>test</CommandItem>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};
