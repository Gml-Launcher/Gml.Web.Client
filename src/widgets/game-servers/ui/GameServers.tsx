import { ProfileExtendedBaseEntity } from "@/shared/api/contracts";

import { useGameServers } from "@/shared/hooks/useServers";
import { GameServersSkeleton } from "./GameServersSkeleton";
import { GameServerCard } from "@/entities/ServerCard";
import { AddGameServerDialog } from "@/features/add-game-server/ui/AddGameServerDialog";

interface GameServersParams {
  profile?: ProfileExtendedBaseEntity;
}

export const GameServers = ({ profile }: GameServersParams) => {
  const { data, isLoading } = useGameServers({ profileName: profile?.profileName });

  if (isLoading) return <GameServersSkeleton />;

  return (
    <div className="grid gap-y-4">
      <div className="flex flex-col gap-x-2">
        <AddGameServerDialog profile={profile} />
      </div>
      <div className="flex flex-col gap-y-2">
        {data?.map((server, index) => (
          <GameServerCard key={`${server.name}-${index}`} server={server} profile={profile} />
        ))}
      </div>
    </div>
  );
};
