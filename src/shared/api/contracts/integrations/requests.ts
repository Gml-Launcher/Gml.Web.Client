import {
  AuthIntegrationBaseEntity,
  BranchBaseEntity,
  DiscordBaseEntity,
  LauncherBuildsBaseEntity,
  SentryBaseEntity,
  TextureServiceBaseEntity,
} from "@/shared/api/contracts";
import { TexturesServiceType } from "@/shared/enums";
import { ResponseBaseEntity } from "@/shared/api/schemas"; // Получение списка серверов для авторизации

// Получение списка серверов для авторизации
export type TGetAuthIntegrationsRequest = {};
export type TGetAuthIntegrationsResponse = ResponseBaseEntity & {
  data: AuthIntegrationBaseEntity[];
};

// Получение активного сервиса авторизации
export type TGetActiveAuthIntegrationsRequest = {};
export type TGetActiveAuthIntegrationsResponse = ResponseBaseEntity & {
  data: AuthIntegrationBaseEntity;
};

// Получение списка веток
export type TGetLauncherGithubVersionsRequest = {};
export type TGetLauncherGithubVersionsResponse = ResponseBaseEntity & {
  data: BranchBaseEntity[];
};

// Получение списка платформ
export type TGetBuildClientPlatformsRequest = {};
export type TGetBuildClientPlatformsResponse = ResponseBaseEntity & {
  data: string[];
};

// Получение списка билдов лаунчера
export type TGetLauncherBuildVersionsRequest = {};
export type TGetLauncherBuildVersionsResponse = ResponseBaseEntity & {
  data: LauncherBuildsBaseEntity[];
};

// Обновление лаунчера
export type TPostLauncherUploadRequest = FormData;
export type TPostLauncherUploadResponse = ResponseBaseEntity & {};

// Изменение сервера авторизации
export type TPostAuthIntegrationsRequest = {
  authType: number;
  endpoint: string;
};
export type TPostAuthIntegrationsResponse = ResponseBaseEntity & {};

// Получение активного сервиса авторизации
export type TGetSentryConnectRequest = {};
export type TGetSentryConnectResponse = ResponseBaseEntity & {
  data: SentryBaseEntity;
};

// Изменение сервера авторизации
export type TPutSentryConnectRequest = { url: string };
export type TPutSentryConnectResponse = ResponseBaseEntity & {};

// Получение сервиса текстур
export type TGetConnectTexturesRequest = { type: TexturesServiceType };
export type TGetConnectTexturesResponse = ResponseBaseEntity & {
  data: TextureServiceBaseEntity;
};

// Изменение сервиса текстур
export type TPutConnectTexturesRequest = { type: TexturesServiceType; url: string };
export type TPutConnectTexturesResponse = ResponseBaseEntity & {};

// Получение сервиса текстур
export type TGetConnectDiscordRequest = {};
export type TGetConnectDiscordResponse = ResponseBaseEntity & {
  data: DiscordBaseEntity;
};

// Изменение сервиса текстур
export type TPutConnectDiscordRequest = DiscordBaseEntity;
export type TPutConnectDiscordResponse = ResponseBaseEntity & {};
