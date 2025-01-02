import { ModType } from '@/shared/enums';

export type ModBaseEntity = {
  name: string;
  description: string;
  iconUrl: string;
  type: ModType;
};
