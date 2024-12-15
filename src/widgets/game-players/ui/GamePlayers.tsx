import { GamePlayersSkeleton } from './GamePlayersSkeleton';

import { useGameServers } from '@/shared/hooks';
import { ProfileExtendedBaseEntity } from '@/shared/api/contracts';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { $api } from '@/services/api.service';
import { CreateWhiteUserDialog } from '@/features/create-game-white-user';

interface GameServersParams {
  profile: ProfileExtendedBaseEntity;
}

export const GamePlayers = ({ profile }: GameServersParams) => {
  const { isLoading } = useGameServers({ profileName: profile.profileName });

  if (isLoading) return <GamePlayersSkeleton />;

  return (
    <div className="grid gap-y-4">
      <div className="flex flex-col gap-x-2">
        <CreateWhiteUserDialog profile={profile} />
      </div>
      <div className="flex flex-wrap gap-4">
        {profile?.usersWhiteList.map((server, index) => (
          <Card key={index} className="w-[280px]">
            <CardHeader className="flex flex-row items-center">
              <img
                src={$api.getUri() + `/integrations/texture/head/${server.uuid}`}
                alt="skin"
                className="w-10 rounded-lg"
              />
              <div className="ml-2">
                <CardTitle className="font-bold">{server.name}</CardTitle>
                <CardDescription className="font-medium">
                  {server.isBanned ? 'Заблокирован' : 'Не заблокирован'}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};
