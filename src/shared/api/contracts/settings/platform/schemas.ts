import { Protocol, StorageType } from "@/shared/enums";

export type SettingsPlatformBaseEntity = {
  registrationIsEnabled: boolean;
  storageType: StorageType;
  storageHost: string;
  storageLogin: string;
  textureProtocol: Protocol;
};
