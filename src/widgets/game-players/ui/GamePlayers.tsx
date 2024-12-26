import { TrashIcon } from 'lucide-react';

import { GamePlayersSkeleton } from './GamePlayersSkeleton';

import { useDeleteProfilePlayers, useGameServers } from '@/shared/hooks';
import { ProfileExtendedBaseEntity } from '@/shared/api/contracts';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { $api } from '@/services/api.service';
import { CreateWhiteUserDialog } from '@/features/create-game-white-user';
import { Button } from '@/shared/ui/button';
import { useGamePlayerStore } from '@/widgets/game-players/lib/store';

interface GameServersParams {
  profile: ProfileExtendedBaseEntity;
}

export const GamePlayers = ({ profile }: GameServersParams) => {
  const { isLoading } = useGameServers({ profileName: profile.profileName });
  const { mutateAsync } = useDeleteProfilePlayers({ profileName: profile.profileName });
  const { players, removePlayer } = useGamePlayerStore();

  if (isLoading) return <GamePlayersSkeleton />;

  const deletePlayer = (uuid: string) => {
    mutateAsync({ playerUuid: uuid }).then(() => {
      removePlayer(uuid);
    });
  };

  return (
    <div className="grid gap-y-4">
      <div className="flex flex-col gap-x-2">
        <CreateWhiteUserDialog profile={profile} playersState={players} />
      </div>
      <div className="flex flex-wrap gap-4">
        {players.map((server, index) => (
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
              <Button variant="destructive" onClick={() => deletePlayer(server.uuid)}>
                <TrashIcon />
              </Button>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};
