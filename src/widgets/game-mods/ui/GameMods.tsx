import { FileIcon, PlusIcon } from '@radix-ui/react-icons';

import { ProfileExtendedBaseEntity } from '@/shared/api/contracts';
import { useMods, useOptionalMods } from '@/shared/hooks/useMods';
import { Button } from '@/shared/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/shared/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';

interface GameServersParams {
  profile: ProfileExtendedBaseEntity;
}

export const GameMods = ({ profile }: GameServersParams) => {
  const { data: mods } = useMods({ profileName: profile.profileName });
  const { data: optionalMods } = useOptionalMods({ profileName: profile.profileName });

  return (
    <div className="grid gap-y-4">
      <div className="flex flex-row gap-x-5">
        <div className="flex flex-col gap-3 w-full">
          <div className="text-xl font-bold">Список модов</div>
          <Table className="border border-dashed rounded-2xl">
            <TableBody>
              {mods &&
                mods.map((mod, index) => (
                  <TableRow key={index}>
                    <TableCell key={index}>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={mod.iconUrl} alt="@shadcn" />
                          <AvatarFallback>
                            <FileIcon />
                          </AvatarFallback>
                        </Avatar>
                        {mod.name}
                        <Badge className="bg-orange-500 bg-opacity-20 text-orange-500 hover:bg-opacity-100 hover:bg-orange-500 hover:text-white">
                          Jar
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>Удалить</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <Button variant="secondary" className="w-max gap-2">
            <PlusIcon />
            Добавить
          </Button>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <div className="text-xl">Опциональные моды</div>
          <Table className="border border-dashed rounded-2xl">
            <TableBody>
              {optionalMods &&
                optionalMods.map((mod, index) => (
                  <TableRow key={index}>
                    <TableCell key={index}>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={mod.iconUrl} alt="@shadcn" />
                          <AvatarFallback>
                            <FileIcon />
                          </AvatarFallback>
                        </Avatar>
                        {mod.name}
                        <Badge className="bg-orange-500 bg-opacity-20 text-orange-500 hover:bg-opacity-100 hover:bg-orange-500 hover:text-white">
                          Jar
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>Удалить</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          <Button variant="secondary" className="w-max gap-2">
            <PlusIcon />
            Добавить
          </Button>
        </div>
      </div>
    </div>
  );
};
