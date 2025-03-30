import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { throttle } from 'lodash';
import { PlusIcon } from '@radix-ui/react-icons';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Form, FormItem, FormMessage } from '@/shared/ui/form';
import { Button } from '@/shared/ui/button';
import { useAddProfilePlayers, useCreateGameServer } from '@/shared/hooks';
import {
  AddGameServerScheme,
  AddGameServerSchemeType,
  PlayerBaseEntity,
  ProfileExtendedBaseEntity,
} from '@/shared/api/contracts';
import { Icons } from '@/shared/ui/icons';
import { usePlayers } from '@/shared/hooks/usePlayers';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/shared/ui/command';
import { cn } from '@/shared/lib/utils';
import { $api } from '@/services/api.service';
import { Input } from '@/shared/ui/input';
import { useGamePlayerStore } from '@/widgets/game-players/lib/store';

type AddGameServerDialogParams = {
  profile?: ProfileExtendedBaseEntity;
  playersState: PlayerBaseEntity[];
};

export const CreateWhiteUserDialog = ({ profile, playersState }: AddGameServerDialogParams) => {
  const [open, setOpen] = useState(false);
  const onOpenChange = () => setOpen((prev) => !prev);

  const [openComboBox, setComboboxOpen] = React.useState(false);
  const [valueComboBox, setComboboxValue] = React.useState('');
  const [search, setSearch] = useState('');
  const { mutateAsync } = useAddProfilePlayers(profile?.profileName);

  const { addPlayer } = useGamePlayerStore();

  const form = useForm<AddGameServerSchemeType>({
    resolver: zodResolver(AddGameServerScheme),
  });

  const { isPending } = useCreateGameServer();
  const { data: players, refetch } = usePlayers(search);

  const handleSearchInput = throttle((text: string) => {
    setSearch(text);
    refetch().then(() => {});
  }, 2000);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutateAsync({
      profileName: profile!.profileName,
      userUuid: valueComboBox,
    }).then((response) => {
      addPlayer(response.data.data);
      onOpenChange();
      setComboboxValue('');
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-fit gap-2">
          <PlusIcon width={16} height={16} />
          Добавить пользователя
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавление игрока в белый список</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <FormItem>
              {players && (
                <Popover open={openComboBox} onOpenChange={setComboboxOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[200px] justify-between"
                    >
                      {valueComboBox
                        ? players.find((player) => player.uuid === valueComboBox)?.name
                        : 'Выберите игрока...'}
                      <ChevronsUpDownIcon className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Input
                      className="mb-4"
                      placeholder={`Начните искать...`}
                      type="text"
                      onChange={(value) => handleSearchInput(value.target.value)}
                    />
                    <Command>
                      <CommandList>
                        <CommandEmpty>Игроки не найдены. {players.length}</CommandEmpty>
                        <CommandGroup>
                          {players.map((player) => (
                            <CommandItem
                              key={player.name}
                              value={player.uuid}
                              className="flex items-center gap-2 font-medium"
                              onSelect={(currentValue) => {
                                setComboboxValue(
                                  currentValue === valueComboBox ? '' : currentValue,
                                );
                                setComboboxOpen(false);
                              }}
                            >
                              <img
                                src={$api.getUri() + `/integrations/texture/head/${player.uuid}`}
                                alt="skin"
                                className="w-6 rounded-lg"
                              />
                              {player.name}
                              <CheckIcon
                                className={cn(
                                  'ml-auto w-4',
                                  valueComboBox === player.uuid ? 'opacity-100' : 'opacity-0',
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
              {form.formState.errors.name && (
                <FormMessage>{form.formState.errors.name.message}</FormMessage>
              )}
            </FormItem>
            <div className="flex justify-end">
              <Button disabled={valueComboBox === ''}>
                {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Добавить
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
