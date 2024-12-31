export type UserBaseEntity = {
  id: number;
  login: string;
  email: string;
};

export interface PlayerBaseEntity {
  isBanned: boolean;
  authHistory: AuthHistoryBaseEntity[];
  serverJoinHistory: any[];
  name: string;
  accessToken: string;
  uuid: string;
  expiredDate: string;
  textureSkinUrl: string;
  textureCloakUrl: string;
  textureSkinGuid: string;
  textureCloakGuid: string;
  fullSkinUrl?: any;
}

export interface AuthHistoryBaseEntity {
  date: string;
  device: string;
  address?: string;
  protocol: string;
  hwid?: string;
}
