export type ApiUserBaseEntity = {
  sub: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
  perm: string[];
  nbf: number;
  exp: number;
  iss: string;
  aud: string;
};

export type UserBaseEntity = {
  name: string;
  email: string;
  role: string;
  perm: string[];
  exp: number;
};

export interface PlayerBaseEntity {
  isBanned: boolean;
  isBannedPermanent?: boolean;
  isLauncherStarted?: boolean;
  authHistory: AuthHistoryBaseEntity[];
  serverJoinHistory: any[];
  name: string;
  accessToken: string;
  uuid: string;
  expiredDate: string;
  textureSkinUrl: string;
  textureCloakUrl: string;
  externalTextureSkinUrl: string;
  externalTextureCloakUrl: string;
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
