import {
  AuthIntegrationBaseEntity,
  BranchBaseEntity,
  SentryBaseEntity,
  TextureServiceBaseEntity,
} from "@/shared/api/contracts";
import { ResponseBaseEntity } from "@/shared/api/schemas";
import { TexturesServiceType } from "@/shared/enums";

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
export type TGetInstallClientBranchesRequest = {};
export type TGetInstallClientBranchesResponse = ResponseBaseEntity & {
  data: BranchBaseEntity[];
};

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
