import { GamePlayersSkeleton } from "./GamePlayersSkeleton";

import { CreateGameServerDialog } from "@/features/create-game-server";
import { useConnectTextures, useGameServers } from "@/shared/hooks";
import { ProfileExtendedBaseEntity } from "@/shared/api/contracts";
import { TexturesServiceType } from "@/shared/enums";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { $api } from "@/core/api";

interface GameServersParams {
  profile: ProfileExtendedBaseEntity;
}

export const GamePlayers = ({ profile }: GameServersParams) => {
  const { data, isLoading } = useGameServers({ profileName: profile.profileName });
  const { data: textures_skins, isLoading: isLoadingSkins } = useConnectTextures(
    TexturesServiceType.TEXTURES_SERVICE_SKINS,
  );

  if (isLoading) return <GamePlayersSkeleton />;

  return (
    <div className="grid gap-y-4">
      <div className="flex flex-col gap-x-2">
        <CreateGameServerDialog profile={profile} />
      </div>
      <div className="flex flex-wrap gap-4">
        {profile?.usersWhiteList.map((server, index) => (
          <Card className="w-[280px]">
            <CardHeader className="flex flex-row items-center">
              <img
                src={$api.getUri() + `/integrations/texture/head/${server.uuid}`}
                alt="skin"
                className="w-10 rounded-lg"
              />
              <div className="ml-2">
                <CardTitle>{server.name}</CardTitle>
                <CardDescription>
                  {server.isBanned ? "Заблокирован" : "Не заблокирован"}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>uuid:</CardDescription>
              <div>{server.uuid}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
