import { StorageType } from "@/shared/enums/storages";

export type SettingsPlatformBaseEntity = {
  registrationIsEnabled: boolean;
  storageType: StorageType;
  storageHost: string;
  storageLogin: string;
};
