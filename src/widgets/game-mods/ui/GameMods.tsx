import { ProfileExtendedBaseEntity } from '@/shared/api/contracts';
import { Button } from '@/shared/ui/button';
import { useMods, useOptionalMods } from '@/shared/hooks/useMods';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

interface GameServersParams {
  profile: ProfileExtendedBaseEntity;
}

export const GameMods = ({ profile }: GameServersParams) => {
  const { data: mods } = useMods({ profileName: profile.profileName });
  const { data: optionalMods } = useOptionalMods({ profileName: profile.profileName });

  return (
    <div className="grid gap-y-4">
      <div className="flex flex-col gap-x-2">
        <Button>Test</Button>
      </div>
      <div className="flex flex-wrap gap-4">
        {mods &&
          mods.map((mod, index) => (
            <Card key={index} className="w-[300px]">
              <CardHeader className="flex flex-row justify-between items-Start">
                <div className="ml-2">
                  <CardTitle className="font-bold">{mod.name}</CardTitle>
                  <CardDescription className="font-medium mt-1">
                    {mod.type ? 'Заблокирован' : 'Не заблокирован'}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}

        {optionalMods &&
          optionalMods.map((mod, index) => (
            <Card key={index} className="w-[300px]">
              <CardHeader className="flex flex-row justify-between items-Start">
                <div className="ml-2">
                  <CardTitle className="font-bold">{mod.name}</CardTitle>
                  <CardDescription className="font-medium mt-1">
                    {mod.type ? 'Заблокирован' : 'Не заблокирован'}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
      </div>
    </div>
  );
};
