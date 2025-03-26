import { SettingsPlatformBaseEntity } from '@/shared/api/contracts';
import { ResponseBaseEntity } from '@/shared/api/schemas';
import { StorageType } from '@/shared/enums';

// Получение активного сервиса авторизации
export type TGetSettingsPlatformRequest = {};
export type TGetSettingsPlatformResponse = ResponseBaseEntity & {
  data: SettingsPlatformBaseEntity;
};

// Изменение сервера авторизации
export type TPutSettingsPlatformRequest = {
  registrationIsEnabled: boolean;
  storageType: StorageType;
  curseForgeKey: string;
  vkKey: string;
  storageHost: string;
  storageLogin: string;
  storagePassword: string;
};
export type TPutSettingsPlatformResponse = ResponseBaseEntity & {};
