import { AuthIntegrationBaseEntity } from "@/shared/api/contracts";
import { BranchBaseEntity } from "@/shared/api/contracts/integrations/BranchBaseEntity";
import { ResponseBaseEntity } from "@/shared/api/schemas";

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
