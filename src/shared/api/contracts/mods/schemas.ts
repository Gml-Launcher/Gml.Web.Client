import { ModType } from '@/shared/enums';

export type ModBaseEntity = {
  name: string;
  description: string;
  iconUrl: string;
  type: ModType;
};

export type ModEntity = {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  downloadCount: number;
  followsCount: number;
  type: ModType;
};
