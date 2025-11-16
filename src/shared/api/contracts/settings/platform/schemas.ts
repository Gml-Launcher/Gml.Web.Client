import { Protocol, StorageType } from '@/shared/enums';

export type SettingsPlatformBaseEntity = {
  registrationIsEnabled: boolean;
  storageType: StorageType;
  storageHost: string;
  curseForgeKey: string;
  vkKey: string;
  storageLogin: string;
  textureProtocol: Protocol;
  // Sentry auto-clear settings
  sentryNeedAutoClear: boolean;
  // .NET TimeSpan serialized as string (e.g., "00:05:00" or "1.00:00:00" for 1 day)
  sentryAutoClearPeriod: string;
};
