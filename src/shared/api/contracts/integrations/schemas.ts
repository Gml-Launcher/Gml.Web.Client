import { AuthenticationType } from "@/shared/enums";

export type AuthIntegrationBaseEntity = {
  name: string;
  authType: AuthenticationType;
  endpoint: string | null;
};

export type BranchBaseEntity = {
  version: string;
};

export type SentryBaseEntity = {
  url: string;
};

export type TextureServiceBaseEntity = {
  url: string;
};
