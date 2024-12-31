import React from 'react';
import Image from 'next/image';

import { ClientState } from '@/widgets/client-hub';
import { DeleteGameServerDialog } from '@/features/delete-game-server';
import { GameServerBaseEntity } from '@/shared/api/contracts';
import { Card } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';
import { getProgressColor } from '@/shared/lib/utils';
import { EntityState } from '@/shared/enums';
import minecraftLogo from '@/assets/logos/minecraft.png';

interface GameServerCardParams {
  profileName: string;
  server: GameServerBaseEntity;
}

export const GameServerCard = ({ server, profileName }: GameServerCardParams) => {
  const progressValue = (server.online * 100) / server.maxOnline;

  return (
    <Card className="flex flex-row items-center justify-between gap-y-4 p-3 pr-8">
      <div className="flex flex-row gap-x-5 items-center">
        <Image src={minecraftLogo} className="w-16" alt="Gml Frontend" />
        <div className="flex flex-col min-w-[350px]">
          <span className="text-lg font-bold">{server.name}</span>
          <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">
            {server.version ?? 'Нет информации'}
          </span>
        </div>
        {server.isOnline && (
          <div>
            <div className="flex flex-row items-center justify-between gap-x-3 ml-3 relative">
              <Progress
                value={progressValue}
                className={`absolute w-full h-1 bottom-0 rounded ${getProgressColor(progressValue)}`}
              />
              <div className="flex flex-row items-center justify-between gap-x-3 relative z-2 mb-3">
                <div className="flex items-center justify-center text-sm font-medium text-muted-foreground rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition h-10 w-10">
                  {server.online}
                </div>
                из
                <div className="flex items-center justify-center text-sm font-medium text-muted-foreground rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition h-10 w-10">
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
