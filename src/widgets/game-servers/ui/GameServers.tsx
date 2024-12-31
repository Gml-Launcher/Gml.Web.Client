import { GameServersSkeleton } from './GameServersSkeleton';

import { CreateGameServerDialog } from '@/features/create-game-server';
import { GameServerCard } from '@/entities/ServerCard';
import { useGameServers } from '@/shared/hooks';
import { ProfileExtendedBaseEntity } from '@/shared/api/contracts';

interface GameServersParams {
  profile: ProfileExtendedBaseEntity;
}

export const GameServers = ({ profile }: GameServersParams) => {
  const { data, isLoading } = useGameServers({ profileName: profile.profileName });

  if (isLoading) return <GameServersSkeleton />;

  return (
    <div className="grid gap-y-4">
      <div className="flex flex-col gap-x-2">
        <CreateGameServerDialog profile={profile} />
      </div>
      <div className="flex flex-col gap-y-2">
        {data?.map((server, index) => (
          <GameServerCard
            key={`${server.name}-${index}`}
            server={server}
            profileName={profile.profileName}
          />
        ))}
      </div>
    </div>
  );
};
