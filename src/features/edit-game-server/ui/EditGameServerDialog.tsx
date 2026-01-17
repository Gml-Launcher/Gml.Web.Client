import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { useUpdateGameServer } from '@/shared/hooks';
import {
  AddGameServerScheme,
  AddGameServerSchemeType,
  GameServerBaseEntity,
} from '@/shared/api/contracts';
import { Icons } from '@/shared/ui/icons';

type EditGameServerDialogParams = {
  server: GameServerBaseEntity;
  profileName: string;
};

export const EditGameServerDialog = ({ server, profileName }: EditGameServerDialogParams) => {
  const [open, setOpen] = useState(false);
  const onOpenChange = () => setOpen((prev) => !prev);

  const form = useForm<AddGameServerSchemeType>({
    resolver: zodResolver(AddGameServerScheme),
    defaultValues: {
      name: server.name,
      address: server.address,
      port: server.port,
    },
  });

  const { mutateAsync, isPending } = useUpdateGameServer();

  const onSubmit: SubmitHandler<AddGameServerSchemeType> = async (
    body: AddGameServerSchemeType,
  ) => {
    await mutateAsync({
      profileName,
      serverName: server.name,
      ...body,
    });

    form.reset();
    onOpenChange();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактирование сервера</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="grid gap-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormItem>
              <FormLabel>Введите название сервера</FormLabel>
              <FormControl>
                <Input placeholder="Введите название сервера" {...form.register('name')} />
              </FormControl>
              {form.formState.errors.name && (
                <FormMessage>{form.formState.errors.name.message}</FormMessage>
              )}
            </FormItem>
            <FormItem>
              <FormLabel>Введите адрес сервера</FormLabel>
              <FormControl>
                <Input placeholder="Введите адрес сервера" {...form.register('address')} />
              </FormControl>
              {form.formState.errors.address && (
                <FormMessage>{form.formState.errors.address.message}</FormMessage>
              )}
            </FormItem>
            <FormItem>
              <FormLabel>Введите порт сервера</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Введите порт сервера"
                  {...form.register('port', { valueAsNumber: true })}
                />
              </FormControl>
              {form.formState.errors.port && (
                <FormMessage>{form.formState.errors.port.message}</FormMessage>
              )}
            </FormItem>
            <div className="flex justify-end">
              <Button disabled={isPending || !form.formState.isDirty}>
                {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Сохранить
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
