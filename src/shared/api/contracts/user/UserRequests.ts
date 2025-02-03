import { PlayerBaseEntity, UserBaseEntity } from '@/shared/api/contracts';
import { ResponseBaseEntity } from '@/shared/api/schemas';

// Регистрация
export type TPostSignUpRequest = {
  login: string;
  password: string;
  email: string;
};
export type TPostSignUpResponse = ResponseBaseEntity & {
  data: UserBaseEntity & {
    accessToken: string;
  };
};

// Авторизация
export type TPostSignInRequest = {
  login: string;
  password: string;
};
export type TPostSignInResponse = ResponseBaseEntity & {
  data: UserBaseEntity & {
    accessToken: string;
  };
};

// Игроки
export type TGetPlayersRequest = {
  take: number;
  offset: number;
  findName: string;
};
export type TGetPlayersResponse = ResponseBaseEntity & {
  data: PlayerBaseEntity[];
};

// Бан юзера
export type TPostBanPlayersRequest = string[];
export type TPostBanPlayersResponse = ResponseBaseEntity & {};

// Удаление юзера
export type TPostRemovePlayersRequest = string[];
export type TPostRemovePlayersResponse = ResponseBaseEntity & {};
