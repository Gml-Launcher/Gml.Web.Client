export type ProfileBaseEntity = {
  name: string;
  createDate: string;
  description: string;
  gameVersion: string;
  launchVersion: string;
  iconBase64: string;
};

export type ProfileExtendedBaseEntity = {
  javaPath: string;
  profileName: string;
  minecraftVersion: string;
  clientVersion: string;
  iconBase64: string;
  background: string;
  description: string;
  arguments: string;
  hasUpdate: boolean;
  files: ProfileFileBaseEntity[];
  whiteListFiles: ProfileFileBaseEntity[];
};

export type ProfileFileBaseEntity = {
  name: string;
  directory: string;
  size: number;
  hash: string;
};
