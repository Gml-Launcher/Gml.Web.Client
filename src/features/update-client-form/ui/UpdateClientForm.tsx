import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useLauncherVersionsBuilds, useUpdateLauncher } from "@/shared/hooks";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Icons } from "@/shared/ui/icons";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

import { ClientUpdateFormSchemaType, ClientUpdateSchema } from "../lib/static";
import { Textarea } from "@/shared/ui/textarea";
import React from "react";

interface UpdateClientFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onOpenChange: () => void;
}

export function UpdateClientForm({ className, onOpenChange, ...props }: UpdateClientFormProps) {
  const { data: versions } = useLauncherVersionsBuilds();

  const { mutateAsync, isPending } = useUpdateLauncher();

  const form = useForm<ClientUpdateFormSchemaType>({
    values: { version: "", title: "", description: "", launcherBuild: "" },
    resolver: zodResolver(ClientUpdateSchema),
  });

  const onSubmit: SubmitHandler<ClientUpdateFormSchemaType> = async (
    data: ClientUpdateFormSchemaType,
  ) => {
    const formCreate = new FormData();
    formCreate.append("version", data.version);
    formCreate.append("title", data.title);
    formCreate.append("description", data.description);
    formCreate.append("launcherBuild", data.launcherBuild);
    await mutateAsync(formCreate);
  };

  return (
    <div className={cn("grid gap-4", className)} {...props}>
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
                            {name}
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
                  <Input placeholder="1.1.0.0" {...field} />
                </FormControl>
                {form.formState.errors.version && (
                  <FormMessage>{form.formState.errors.version.message}</FormMessage>
                )}
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
                  <Textarea placeholder="Введите описание обновлениz" {...field} />
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
function useRef<T>(arg0: null) {
  throw new Error("Function not implemented.");
}
