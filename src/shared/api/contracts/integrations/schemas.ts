export type AuthIntegrationBaseEntity = {
  name: string;
  authType: number;
  endpoint: string | null;
};

export type BranchBaseEntity = {
  version: string;
};

export type SentryBaseEntity = {
  url: string;
};
