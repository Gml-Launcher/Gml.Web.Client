import { EntityState } from '@/shared/enums';
import { PlayerBaseEntity } from '@/shared/api/contracts';

export type ProfileBaseEntity = {
  name: string;
  createDate: string;
  description: string;
  gameVersion: string;
  launchVersion: string;
  jvmArguments: string;
  iconBase64: string;
  state: number;
};

export type ProfileExtendedBaseEntity = {
  javaPath: string;
  profileName: string;
  minecraftVersion: string;
  clientVersion: string;
  launchVersion: string;
  iconBase64: string;
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
