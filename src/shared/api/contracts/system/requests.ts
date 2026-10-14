import { ResponseBaseEntity } from '@/shared/api/schemas';

export type BackendBuildInfo = {
  version: string;
  commit: string;
};

export type TGetBackendVersionResponse = ResponseBaseEntity & {
  data: BackendBuildInfo;
};
