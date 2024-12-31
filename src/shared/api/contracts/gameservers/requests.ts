import { ResponseBaseEntity } from '@/shared/api/schemas';
import { GameServerBaseEntity } from '@/shared/api/contracts';

export type TGetGameServersRequest = {
  profileName: string;
};
export type TGetGameServersResponse = ResponseBaseEntity & {
  data: GameServerBaseEntity[];
};

export type TPostGameServersRequest = {
  profileName: string;
  name: string;
  address: string;
  port: number;
};
export type TPostGameServersResponse = ResponseBaseEntity & {
  data: GameServerBaseEntity;
};

export type TDeleteGameServersRequest = {
  profileName: string;
  serverName: string;
};
export type TDeleteGameServersResponse = ResponseBaseEntity & {};
