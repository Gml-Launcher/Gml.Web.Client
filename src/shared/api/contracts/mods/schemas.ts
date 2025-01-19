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

export type ModDetailsEntity = {
  key: string;
  title: string;
  description: string;
};

export type ModInfoEntity = {
  versions: Version[];
  id: string;
  description: string;
  url?: any;
  iconUrl: string;
  downloadCount: number;
  followsCount: number;
  name: string;
  type: number;
};

export interface Version {
  id: string;
  name: string;
  versionName: string;
  versionNumber?: any;
  datePublished: string;
  downloads: number;
  dependencies: Dependency[];
  files: string[];
}

export interface Dependency {
  versionId?: any;
  projectId: string;
  fileName?: any;
  dependencyType: string;
}
