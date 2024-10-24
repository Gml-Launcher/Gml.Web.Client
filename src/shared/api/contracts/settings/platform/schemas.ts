import { StorageType } from "@/shared/enums/storages";
import { TextureProtocol } from "@/shared/enums/texture-protocol";

export type SettingsPlatformBaseEntity = {
  registrationIsEnabled: boolean;
  storageType: StorageType;
  storageHost: string;
  storageLogin: string;
  textureProtocol: TextureProtocol;
};
