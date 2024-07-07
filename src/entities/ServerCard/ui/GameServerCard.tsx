import React from "react";

import Image from "next/image";

import { ClientState } from "@/widgets/client-hub";

import { DeleteGameServerDialog } from "@/features/delete-game-server";

import { GameServerBaseEntity } from "@/shared/api/contracts";
import { Card } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import { getProgressColor } from "@/shared/lib/utils";
import { EntityState } from "@/shared/enums";

import minecraftLogo from "@/assets/logos/minecraft.png";

interface GameServerCardParams {
  profileName: string;
  server: GameServerBaseEntity;
}

export const GameServerCard = ({ server, profileName }: GameServerCardParams) => {
  const progressValue = (server.online * 100) / server.maxOnline;

  return (
    <Card className="flex flex-row items-center justify-between gap-y-4 p-3 pr-8">
      <div className="flex flex-row gap-x-5 items-center">
        <Image src={minecraftLogo} className="w-16" alt="GML Frontend" />
        <div className="flex flex-col">
          <span className="text-lg font-bold">{server.name}</span>
          <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">
            {server.version ?? "Нет информации"}
          </span>
        </div>
        {Boolean(server.isOnline) && (
          <div>
            <div className="flex flex-row items-center justify-between gap-x-3 ml-3 relative">
              <Progress
                value={progressValue}
                className={`absolute w-full h-1 bottom-0 rounded ${getProgressColor(progressValue)}`}
              />
              <div className="flex flex-row items-center justify-between gap-x-3 relative z-2 mb-3">
                <div className="z-1 inline-flex opacity-30 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
                  {server.online}
                </div>
                из
                <div className="z-1 inline-flex opacity-30 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
                  {server.maxOnline}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-x-8">
        {server.isOnline ? (
          <ClientState state={EntityState.ENTITY_STATE_ACTIVE} />
        ) : (
          <ClientState state={EntityState.ENTITY_STATE_DISABLED} />
        )}
        <DeleteGameServerDialog serverName={server.name} profileName={profileName} />
      </div>
    </Card>
  );
};
