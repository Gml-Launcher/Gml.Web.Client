import { FileIcon, PlusIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import React from 'react';
import { clsx } from 'clsx';

import { ProfileExtendedBaseEntity } from '@/shared/api/contracts';
import { useDetailsMods, useMods, useOptionalMods } from '@/shared/hooks/useMods';
import { Table, TableBody, TableCell, TableRow } from '@/shared/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { AddingModsDialog } from '@/widgets/adding-mods-dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { useLoadProfileMods, useRemoveProfileMod } from '@/shared/hooks';
import { Button } from '@/shared/ui/button';
import { EntityState, ModType } from '@/shared/enums';
import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import { GameModItem } from '@/widgets/game-mods/ui/GameModItem';

interface GameServersParams {
  profile: ProfileExtendedBaseEntity;
}

export const GameMods = ({ profile }: GameServersParams) => {
  const { data: mods } = useMods({ profileName: profile.profileName });
  const { data: optionalMods } = useOptionalMods({ profileName: profile.profileName });
  const { mutateAsync: loadModMutate } = useLoadProfileMods();
  const { mutateAsync: removeModMutate } = useRemoveProfileMod();
  const { data: detailsMods, isPending } = useDetailsMods();
  const MAX_FILE_SIZE = 100 * 1024 * 1024;

  // 🔍 Состояние для поиска
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    isOptional: boolean,
  ) => {
    const files = event.target.files;

    if (!files) return;
    const formCreate = new FormData();

    Array.from(files).forEach((file) => {
      if (file.size <= MAX_FILE_SIZE) {
        formCreate.append('files', file);
      } else {
        console.warn(`File ${file.name} is larger than 100MB and was skipped.`);
      }
    });

    await loadModMutate({
      profileName: profile.profileName,
      data: formCreate,
      isOptional,
    });
  };

  const canEditModsList = ![
    EntityState.ENTITY_STATE_ACTIVE,
    EntityState.ENTITY_STATE_NEED_COMPILE,
  ].includes(profile.state);

  const removeMod = async (fileName: string) => {
    await removeModMutate({ profileName: profile.profileName, modName: fileName });
  };

  // 🔍 Фильтрация по названию мода
  const filteredMods = mods?.filter((mod) =>
    mod.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const filteredOptionalMods = optionalMods?.filter((mod) =>
    mod.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="grid gap-y-4 relative">
      {canEditModsList && (
        <div className="absolute w-full h-full z-[10] flex items-center justify-center">
          <Card className="p-6 w-[50%]">
            <CardHeader className="font-bold text-xl">Модификации недоступны</CardHeader>
            <CardContent className="content text-gray-700 dark:text-gray-300">
              Система модификаций доступна только для активных профилей. Убедитесь, что у вас
              активный профиль, а так же не имеет ошибок
            </CardContent>
          </Card>
        </div>
      )}

      <div
        className={clsx('flex flex-col md:flex-row gap-5', {
          'blur-sm': canEditModsList,
        })}
      >
        {/* === Основные моды === */}
        <div className="flex flex-col gap-3 w-[calc(100vw-35px)] md:w-full">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="text-xl font-bold">Список модов</div>
            {/* 🔍 Поле поиска */}
            <div className="relative w-full md:w-[250px]">
              <MagnifyingGlassIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Поиск по модам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Table className="border border-dashed rounded-2xl">
            <TableBody>
              {filteredMods && filteredMods.length > 0 ? (
                filteredMods.map((mod, index) => (
                  <TableRow key={index}>
                    <TableCell key={index}>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={mod?.iconUrl} alt="@shadcn" />
                          <AvatarFallback>
                            <FileIcon />
                          </AvatarFallback>
                        </Avatar>
                        {mod?.name}
                        <Badge className="bg-orange-500 bg-opacity-20 text-orange-500 hover:bg-opacity-100 hover:bg-orange-500 hover:text-white">
                          Jar
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="link" onClick={() => removeMod(`${mod?.name}.jar`)}>
                        Удалить
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-sm text-muted-foreground py-4">
                    Моды не найдены
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* === Добавление модов === */}
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex gap-2">
              <Label
                htmlFor="loadMod"
                className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 w-max gap-2"
              >
                Загрузить
                <PlusIcon width={16} height={16} />
              </Label>
              <Input
                id="loadMod"
                type="file"
                multiple
                accept=".jar"
                onChange={(e) => handleFileChange(e, false)}
                className="hidden"
              />
            </div>
            <AddingModsDialog profile={profile} modDirection="mods" modType={ModType.MODRINTH} />
            <AddingModsDialog profile={profile} modDirection="mods" modType={ModType.CURSE_FORGE} />
          </div>
        </div>

        {/* === Опциональные моды === */}
        <div className="flex flex-col gap-3 w-[calc(100vw-35px)] md:w-full">
          <div className="text-xl">Опциональные моды</div>
          <Table className="border border-dashed rounded-2xl overflow-x-hidden">
            <TableBody>
              {filteredOptionalMods && detailsMods && filteredOptionalMods.length > 0 ? (
                filteredOptionalMods.map((mod, index) => (
                  <TableRow key={index}>
                    <GameModItem mod={mod} details={detailsMods} profile={profile} />
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="text-center text-sm text-muted-foreground py-4">
                    Опциональные моды не найдены
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex gap-2">
              <Label
                htmlFor="loadOptionalMod"
                className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 w-max gap-2"
              >
                Загрузить
                <PlusIcon width={16} height={16} />
              </Label>
              <Input
                id="loadOptionalMod"
                type="file"
                multiple
                accept=".jar"
                onChange={(e) => handleFileChange(e, true)}
                className="hidden"
              />
            </div>
            <AddingModsDialog
              profile={profile}
              modDirection="optional"
              modType={ModType.MODRINTH}
            />
            <AddingModsDialog
              profile={profile}
              modDirection="optional"
              modType={ModType.CURSE_FORGE}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
