import { AxiosResponse, GenericAbortSignal } from 'axios';

import {
  TGetModDetailsResponse,
  TGetModInfoResponse,
  TGetModListResponse,
  TGetModOptionalListResponse,
  TGetSearchModOptionalListResponse,
  TPutModOptionalRequest,
  TPutModOptionalResponse,
} from '@/shared/api/contracts/mods/requests';
import { $api } from '@/services/api.service';

class ModService {
  private BASE_URL = '/profiles';
  private MODS_BASE_URL = '/mods';

  // Получение списка модов
  async getModsList({
    profileName,
  }: {
    profileName: string;
  }): Promise<AxiosResponse<TGetModListResponse>> {
    return await $api.get<TGetModListResponse>(`${this.BASE_URL}/${profileName}/mods`);
  }

  async getModInfo({
    profileName,
    modId,
    signal,
  }: {
    profileName: string;
    modId: string;
    signal?: GenericAbortSignal;
  }): Promise<AxiosResponse<TGetModInfoResponse>> {
    return await $api.get<TGetModInfoResponse>(
      `${this.BASE_URL}/${profileName}/mods/info?modId=${modId}`,
      {
        signal,
      },
    );
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

  // Получение списка информации по модам
  async getModsDetails(): Promise<AxiosResponse<TGetModDetailsResponse>> {
    return await $api.get<TGetModDetailsResponse>(`${this.MODS_BASE_URL}/details`);
  }

  async putModDetails({ ...body }: TPutModOptionalRequest): Promise<TPutModOptionalResponse> {
    const { data } = await $api.put<TPutModOptionalResponse>(`${this.MODS_BASE_URL}/details`, body);
    return data;
  }

  async getAvailableModsList({
    profileName,
    modName,
    limit,
    offset,
  }: {
    profileName: string;
    modName: string;
    limit: number;
    offset: number;
  }): Promise<AxiosResponse<TGetSearchModOptionalListResponse>> {
    return await $api.get<TGetSearchModOptionalListResponse>(
      `${this.BASE_URL}/${profileName}/mods/search?ModName=${modName}&Offset=${offset}&Take=${limit}`,
    );
  }
}

// Экспорт экземпляра сервиса
export const modService = new ModService();
