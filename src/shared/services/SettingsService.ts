import { AxiosResponse } from 'axios';

import { $api } from '@/services/api.service';
import {
  TGetSettingsPlatformRequest,
  TGetSettingsPlatformResponse,
  TPutSettingsPlatformRequest,
  TPutSettingsPlatformResponse,
} from '@/shared/api/contracts';

class SettingsService {
  private BASE_URL_PLATFORM = '/settings/platform';
  private BASE_URL_RESTORE = '/settings/restore';

  async getPlatform(
    params?: TGetSettingsPlatformRequest,
  ): Promise<AxiosResponse<TGetSettingsPlatformResponse>> {
    return await $api.get<TGetSettingsPlatformResponse>(this.BASE_URL_PLATFORM, { params });
  }

  async editPlatform(
    body: TPutSettingsPlatformRequest,
  ): Promise<AxiosResponse<TPutSettingsPlatformResponse>> {
    return await $api.put<TPutSettingsPlatformResponse>(this.BASE_URL_PLATFORM, body);
  }

  async getRestoreKeys(): Promise<AxiosResponse<{ data: string[] }>> {
    return await $api.get<{ data: string[] }>(`${this.BASE_URL_RESTORE}/keys`);
  }

  async restoreByKey(key: string): Promise<AxiosResponse<unknown>> {
    return await $api.post(`${this.BASE_URL_RESTORE}/${encodeURIComponent(key)}`, '');
  }
}

export const settingsService = new SettingsService();
