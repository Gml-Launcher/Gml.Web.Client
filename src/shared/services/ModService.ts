import { AxiosResponse } from 'axios';

import {
  TGetModListResponse,
  TGetModOptionalListResponse,
} from '@/shared/api/contracts/mods/requests';
import { $api } from '@/services/api.service';

class ModService {
  private BASE_URL = '/profiles';

  async getModsList({
    profileName,
  }: {
    profileName: string;
  }): Promise<AxiosResponse<TGetModListResponse>> {
    return await $api.get<TGetModListResponse>(`${this.BASE_URL}/${profileName}/mods`);
  }

  async getModsOptionalList({
    profileName,
  }: {
    profileName: string;
  }): Promise<AxiosResponse<TGetModOptionalListResponse>> {
    return await $api.get<TGetModOptionalListResponse>(
      `${this.BASE_URL}/${profileName}/mods/optionals`,
    );
  }
}

export const modService = new ModService();
