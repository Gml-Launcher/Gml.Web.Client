import { EntityState } from '@/shared/enums';
import { PlayerBaseEntity } from '@/shared/api/contracts';

export type ProfileBaseEntity = {
  name: string;
  displayName: string;
  loader: number;
  priority: number;
  createDate: string;
  description: string;
  gameVersion: string;
  launchVersion: string;
  jvmArguments: string;
  iconBase64: string;
  state: number;
};

export type ProfileExtendedBaseEntity = {
  recommendedRam: number;
  javaPath: string;
  profileName: string;
  displayName: string;
  minecraftVersion: string;
  clientVersion: string;
  launchVersion: string;
  iconBase64: string;
  priority: number;
  background: string;
  description: string;
  arguments: string;
  jvmArguments: string;
  gameArguments: string;
  hasUpdate: boolean;
  isEnabled: boolean;
  state: EntityState;
  files: ProfileFileBaseEntity[];
  whiteListFiles: ProfileFileBaseEntity[];
  whiteListFolders: ProfileFolderBaseEntity[];
  usersWhiteList: PlayerBaseEntity[];
};

export type ProfileFileBaseEntity = {
  name: string;
  directory: string;
  size: number;
  hash: string;
};

export type JavaVersionBaseEntity = {
  name: string;
  version: string;
  majorVersion: number;
};

export type ProfileFolderBaseEntity = {
  path: string;
};
