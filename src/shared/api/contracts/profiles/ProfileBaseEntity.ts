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
  description: string;
  arguments: string;
  files: ProfileFileBaseEntity[];
  whiteListFiles: ProfileFileBaseEntity[];
};

export type ProfileFileBaseEntity = {
  name: string;
  directory: string;
  size: number;
  hash: string;
};
