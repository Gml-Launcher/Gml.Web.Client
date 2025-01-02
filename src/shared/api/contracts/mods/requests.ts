import { ModBaseEntity } from '@/shared/api/contracts/mods/schemas';
import { ResponseBaseEntity } from '@/shared/api/schemas';

export type TGetModListRequest = {};
export type TGetModListResponse = ResponseBaseEntity & {
  data: ModBaseEntity[];
};

export type TGetModOptionalListRequest = {};
export type TGetModOptionalListResponse = ResponseBaseEntity & {
  data: ModBaseEntity[];
};
