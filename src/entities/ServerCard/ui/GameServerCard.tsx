import { GameServerBaseEntity } from "@/shared/api/contracts";
import { DeleteGameServerDialog } from "@/features/delete-game-server";

interface GameServerCardParams {
  server: GameServerBaseEntity;
}

export const GameServerCard = ({ server }: GameServerCardParams) => {
  return (
    <div>
      <DeleteGameServerDialog server={server} />
    </div>
  );
};
