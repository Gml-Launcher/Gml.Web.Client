import {
  GameLoaderOption,
  JavaVersionBaseEntity,
  PlayerBaseEntity,
  ProfileBaseEntity,
  ProfileExtendedBaseEntity,
} from '@/shared/api/contracts';
import { ResponseBaseEntity } from '@/shared/api/schemas';
import { OsArchitectureEnum } from '@/shared/enums'; // Получение профилей

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

// Загрузка мода
export type TPostLoadProfileModRequest = {
  profileName: string;
  isOptional: boolean;
  data: FormData;
};
export type TPostLoadProfileModResponse = ResponseBaseEntity;

// Загрузка мода по Url
export type TPostLoadProfileModByUrlRequest = {
  profileName: string;
  isOptional: boolean;
  links: string[];
};

export type TPostLoadProfileModByUrlResponse = ResponseBaseEntity;

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

// Удаление мода
export type TRemoveProfileModRequest = {
  profileName: string;
  modName: string;
};
export type TRemoveProfileModResponse = ResponseBaseEntity & {};

// Добавление игрока в профиль
export type TAddPlayerToProfileRequest = {
  profileName: string;
  userUuid: string;
};
export type TAddPlayerToProfileResponse = ResponseBaseEntity & {
  data: PlayerBaseEntity;
};

// Удаление игрока в профиле
export type TDeletePlayerToProfileRequest = {};
export type TDeletePlayerToProfileResponse = ResponseBaseEntity & {};

// Удаление профилей
export type TDeleteProfilesRequest = {
  profileNames: string;
  removeFiles: boolean;
};
export type TDeleteProfilesResponse = ResponseBaseEntity & {};

// Получение списка версий
export type TGameVersionsRequest = {
  gameLoader: GameLoaderOption;
  minecraftVersion: string;
};
export type TGameVersionsResponse = ResponseBaseEntity & {
  data: string[];
};

export type TJavaVersionsRequest = {};
export type TJavaVersionsResponse = ResponseBaseEntity & {
  data: JavaVersionBaseEntity[];
};
