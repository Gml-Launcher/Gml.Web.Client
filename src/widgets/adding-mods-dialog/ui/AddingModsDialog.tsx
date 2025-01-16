import React, { useEffect, useState } from 'react';
import { DownloadIcon, FileIcon, HeartFilledIcon, PlusIcon } from '@radix-ui/react-icons';
import { SubmitHandler, useForm } from 'react-hook-form';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';

import { Button } from '@/shared/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/ui/drawer';
import { ProfileExtendedBaseEntity } from '@/shared/api/contracts';
import { Badge } from '@/shared/ui/badge';
import { useSearchMods } from '@/shared/hooks/useMods';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Form, FormControl, FormItem } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Icons } from '@/shared/ui/icons';
import { SearchFormSchemaType } from '@/widgets/adding-mods-dialog/lib/static';
import { Card } from '@/shared/ui/card';
import { AddingModsSelectVersionDialog } from '@/widgets/adding-mods-select-version-dialog';
import modrinth from '@/assets/logos/modrinth.png';
import { formatNumber } from '@/shared/lib/utils';

interface ProfileModDialog {
  profile?: ProfileExtendedBaseEntity;
  modType?: string;
}

export function AddingModsDialog({ profile, modType }: ProfileModDialog) {
  const form = useForm<SearchFormSchemaType>();
  const [modName, setModName] = useState<string>('');
  const { ref, inView } = useInView();

  const {
    data: searchMods,
    status,
    error,
    fetchNextPage,
    refetch,
  } = useSearchMods(profile?.profileName ?? '', modName);

  const onSubmit: SubmitHandler<SearchFormSchemaType> = async (content: SearchFormSchemaType) => {
    setModName(content.name);
    refetch();
    refetch();
  };

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return (
    <Drawer>
      <DrawerTrigger className="flex items-start">
        <Button variant="secondary" className="w-max gap-2">
          <Image src={modrinth} alt="Modrinth" className="w-4 h-4" />
          Добавить
          <PlusIcon width={16} height={16} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="gap-2 flex items-center flex-wrap">
            Мастер добавления модификаций
            <Badge className="cursor-pointer text-sm bg-blue-500 text-white hover:bg-opacity-100 hover:bg-blue-500">
              {modType}
            </Badge>
            <Badge className="cursor-pointer text-sm bg-white bg-opacity-10 text-white text-opacity-90 hover:bg-opacity-100 hover:bg-white hover:text-black">
              Minecraft: {profile?.minecraftVersion}
            </Badge>
            <Badge className="cursor-pointer text-sm bg-white bg-opacity-10 text-white text-opacity-90 hover:bg-opacity-100 hover:bg-white hover:text-black">
              Загрузчик: {profile?.launchVersion}
            </Badge>
            <Badge className="cursor-pointer text-sm bg-white bg-opacity-10 text-white text-opacity-90 hover:bg-opacity-100 hover:bg-white hover:text-black">
              Фильтр: Mods
            </Badge>
          </DrawerTitle>
          <Form {...form}>
            <form className="flex gap-3 items-end mt-3" onSubmit={form.handleSubmit(onSubmit)}>
              <FormItem className="w-full">
                <FormControl>
                  <Input placeholder="Начните искать мод" {...form.register('name')} />
                </FormControl>
              </FormItem>

              <Button
                type="submit"
                className="w-fit ml-auto"
                disabled={status === 'pending' || !form.formState.isDirty}
              >
                {status === 'pending' && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Поиск
              </Button>
            </form>
          </Form>
        </DrawerHeader>
        <DrawerFooter className="h-[400px] md:h-[650px] overflow-y-auto">
          {searchMods && !!searchMods.length ? (
            <div className="flex flex-col gap-4">
              {searchMods.map((mod, index) => (
                <Card key={mod?.id} className="py-4 px-5">
                  <div className="flex gap-4 h-full">
                    <Avatar className="w-8 h-8 mt-2">
                      <AvatarImage src={mod?.iconUrl} alt="Icon" />
                      <AvatarFallback>
                        <FileIcon />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col h-full">
                      <h3 className="flex items-center font-bold text-sm gap-2">
                        {mod?.name}
                        <Badge className="gap-1 cursor-pointer text-sm bg-white bg-opacity-10 text-white text-opacity-90 hover:bg-opacity-100 hover:bg-white hover:text-black">
                          <DownloadIcon width={16} height={16} />
                          {formatNumber(mod?.downloadCount)}
                        </Badge>
                        <Badge className="gap-1 cursor-pointer text-sm bg-white bg-opacity-10 text-white text-opacity-90 hover:bg-opacity-100 hover:bg-white hover:text-black">
                          <HeartFilledIcon className="text-red-500" width={16} height={16} />
                          {formatNumber(mod?.followsCount)}
                        </Badge>
                      </h3>
                      <p className="text-muted-foreground mb-3">{mod?.description}</p>
                      <AddingModsSelectVersionDialog
                        profile={profile}
                        modType={modType}
                        mod={mod}
                      />
                    </div>
                  </div>
                </Card>
              ))}

              <div ref={ref} style={{ height: '10px' }} className="bg-red-500" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <FileIcon className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-lg font-bold">Ничего не найдено</p>
              <p className="text-muted-foreground">
                Попробуйте изменить запрос или проверьте параметры фильтрации.
              </p>
            </div>
          )}
          <DrawerClose className="flex justify-end">
            <Button variant="outline">Отмена</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
