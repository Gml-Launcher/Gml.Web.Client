export type GameServerBaseEntity = {
  name: string;
  address: string;
  port: number;
  version: string;
  isOnline: boolean;
  online: number;
  maxOnline: number;
};
