import { StorageType } from "@/shared/enums/storages";
import { TextureProtocol } from "@/shared/enums/textureProtocol";

export type SettingsPlatformBaseEntity = {
  registrationIsEnabled: boolean;
  storageType: StorageType;
  storageHost: string;
  storageLogin: string;
  textureProtocol: TextureProtocol;
};
