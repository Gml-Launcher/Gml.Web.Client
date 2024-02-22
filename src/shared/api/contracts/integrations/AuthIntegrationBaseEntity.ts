export type AuthIntegrationBaseEntity = {
  name: string;
  authType: number;
  endpoint: string | null;
};
