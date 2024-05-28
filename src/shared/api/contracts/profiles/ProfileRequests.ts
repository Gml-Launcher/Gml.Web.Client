import { ProfileBaseEntity, ProfileExtendedBaseEntity } from "@/shared/api/contracts";
import { ResponseBaseEntity } from "@/shared/api/schemas";
import { OsArchitectureEnum } from "@/shared/enums";

// Получение профилей
export type TGetProfilesRequest = {};
export type TGetProfilesResponse = ResponseBaseEntity & {
  data: ProfileBaseEntity[];
};

// Создание профиля
export type TPostProfilesRequest = FormData;
export type TPostProfilesResponse = ResponseBaseEntity & {
  data: Partial<ProfileBaseEntity>;
};

// Получение профиля
export type TGetProfileRequest = {
  UserName: string;
  ProfileName: string;
  UserAccessToken: string;
  UserUuid: string;
  OsArchitecture: OsArchitectureEnum;
  OsType: string;

  jvmArguments?: string;
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
export type TPutProfileRequest = FormData;
export type TPutProfileResponse = ResponseBaseEntity & {
  data: ProfileBaseEntity;
};

// Удаление профиля
export type TDeleteProfileRequest = {
  profileName: string;
  removeFiles: boolean;
};
export type TDeleteProfileResponse = ResponseBaseEntity & {};

// Удаление профилей
export type TDeleteProfilesRequest = {
  profileNames: string;
  removeFiles: boolean;
};
export type TDeleteProfilesResponse = ResponseBaseEntity & {};
