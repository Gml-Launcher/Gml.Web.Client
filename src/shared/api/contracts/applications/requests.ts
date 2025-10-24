import { 
  ExternalApplicationListDto, 
  ExternalApplicationReadDto, 
  ExternalApplicationCreateDto 
} from './schemas';

import { ResponseBaseEntity } from '@/shared/api/schemas';

// GET /api/v1/applications
export type TGetApplicationsResponse = ResponseBaseEntity & {
  data: ExternalApplicationListDto[];
};

// POST /api/v1/applications
export type TPostApplicationRequest = ExternalApplicationCreateDto;

export type TPostApplicationResponse = ResponseBaseEntity & {
  data: ExternalApplicationReadDto;
};

// DELETE /api/v1/applications/{id}
export type TDeleteApplicationResponse = ResponseBaseEntity;
