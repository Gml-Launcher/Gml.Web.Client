import { ProfileBaseEntity, ProfileExtendedBaseEntity } from "@/shared/api/contracts";
import { ResponseBaseEntity } from "@/shared/api/schemas";
import { OsArchitectureEnum } from "@/shared/enums";

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
  OsArchitecture: OsArchitectureEnum;
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

// Редактирование профиля
export type TPutProfileRequest = {
  originalName: string;
  name: string;
  description: string;
  iconBase64: string;
};
export type TPutProfileResponse = ResponseBaseEntity & {
  data: ProfileBaseEntity;
};

// Удаление профиля
export type TDeleteProfileRequest = {
  profileName: string;
  removeFiles: boolean;
};
export type TDeleteProfileResponse = ResponseBaseEntity & {};
