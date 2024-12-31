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
}

export const settingsService = new SettingsService();
