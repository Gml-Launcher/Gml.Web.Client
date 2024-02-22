import { ProfileBaseEntity, ProfileExtendedBaseEntity } from "@/shared/api/contracts";
import { ResponseBaseEntity } from "@/shared/api/schemas";

// Получение профилей
export type TGetProfilesRequest = {};
export type TGetProfilesResponse = ResponseBaseEntity & {
  data: ProfileBaseEntity[];
};

// Создание профиля
export type TPostProfilesRequest = {
  name: string;
  description: string;
  version: string;
  gameLoader: string;
  iconBase64?: any;
};
export type TPostProfilesResponse = ResponseBaseEntity & {
  data: ProfileBaseEntity;
};

// Получение профиля
export type TGetProfileRequest = {
  UserName: string;
  ProfileName: string;
  UserAccessToken: string;
  UserUuid: string;
  OsArchitecture: string;
  OsType: string;

  WindowWidth?: number;
  WindowHeight?: number;
  GamePort?: number;
  GameAddress?: string;
  IsFullScreen?: boolean;
  RamSize?: number;
};
export type TGetProfileResponse = ResponseBaseEntity & {
  data: ProfileExtendedBaseEntity;
};

// Удаление профиля
export type TDeleteProfileRequest = {
  profileName: string;
};
export type TDeleteProfileResponse = ResponseBaseEntity & {};
