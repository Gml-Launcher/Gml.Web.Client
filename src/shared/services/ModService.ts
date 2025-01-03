import { AxiosResponse } from 'axios';

import {
  TGetModListResponse,
  TGetModOptionalListResponse,
  TGetSearchModOptionalListResponse,
} from '@/shared/api/contracts/mods/requests';
import { $api } from '@/services/api.service';

class ModService {
  private BASE_URL = '/profiles';

  // Получение списка модов
  async getModsList({
    profileName,
  }: {
    profileName: string;
  }): Promise<AxiosResponse<TGetModListResponse>> {
    return await $api.get<TGetModListResponse>(`${this.BASE_URL}/${profileName}/mods`);
  }

  // Получение списка необязательных модов
  async getModsOptionalList({
    profileName,
  }: {
    profileName: string;
  }): Promise<AxiosResponse<TGetModOptionalListResponse>> {
    return await $api.get<TGetModOptionalListResponse>(
      `${this.BASE_URL}/${profileName}/mods/optionals`,
    );
  }

  async getAvailableModsList({
    profileName,
    modName,
    limit,
  }: {
    profileName: string;
    modName: string;
    limit: number;
  }): Promise<AxiosResponse<TGetSearchModOptionalListResponse>> {
    return await $api.get<TGetSearchModOptionalListResponse>(
      `${this.BASE_URL}/${profileName}/mods/search?ModName=${modName}&Offset=0&Take=${limit}`,
    );
  }
}

// Экспорт экземпляра сервиса
export const modService = new ModService();
