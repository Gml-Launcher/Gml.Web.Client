import { AxiosResponse } from 'axios';

import { $api } from '@/services/api.service';
import {
  TAddPlayerToProfileRequest,
  TAddPlayerToProfileResponse,
  TDeletePlayerToProfileResponse,
  TDeleteProfileRequest,
  TDeleteProfileResponse,
  TDeleteProfilesRequest,
  TDeleteProfilesResponse,
  TGameVersionsRequest,
  TGameVersionsResponse,
  TGetProfileRequest,
  TGetProfileResponse,
  TGetProfilesResponse,
  TJavaVersionsResponse,
  TPostLoadProfileModByUrlRequest,
  TPostLoadProfileModByUrlResponse,
  TPostLoadProfileModRequest,
  TPostLoadProfileModResponse,
  TPostProfilesRequest,
  TPostProfilesResponse,
  TPutProfileRequest,
  TPutProfileResponse,
  TRemoveProfileModRequest,
  TRemoveProfileModResponse,
} from '@/shared/api/contracts';

class ProfileService {
  private BASE_URL = '/profiles';

  async getProfiles(): Promise<AxiosResponse<TGetProfilesResponse>> {
    return await $api.get<TGetProfilesResponse>(this.BASE_URL);
  }

  async getProfile(body: TGetProfileRequest): Promise<AxiosResponse<TGetProfileResponse>> {
    return await $api.post<TGetProfileResponse>(`${this.BASE_URL}/details`, body);
  }

  async createProfile(body: TPostProfilesRequest): Promise<AxiosResponse<TPostProfilesResponse>> {
    return await $api.post<TPostProfilesResponse>(this.BASE_URL, body, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async loadProfileMod({
    isOptional,
    profileName,
    data,
  }: TPostLoadProfileModRequest): Promise<AxiosResponse<TPostLoadProfileModResponse>> {
    return await $api.post<TPostLoadProfileModResponse>(
      `${this.BASE_URL}/${profileName}/mods/load?isOptional=${isOptional}`,
      data,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
  }

  async loadProfileModByLink({
    isOptional,
    profileName,
    links,
  }: TPostLoadProfileModByUrlRequest): Promise<AxiosResponse<TPostLoadProfileModByUrlResponse>> {
    return await $api.post<TPostLoadProfileModByUrlResponse>(
      `${this.BASE_URL}/${profileName}/mods/load/url?isOptional=${isOptional}`,
      links,
    );
  }

  async removeProfileMod({
    profileName,
    modName,
    ...params
  }: TRemoveProfileModRequest): Promise<AxiosResponse<TRemoveProfileModResponse>> {
    return await $api.delete<TRemoveProfileModResponse>(
      `${this.BASE_URL}/${profileName}/mods/remove/${modName}`,
      {
        params,
      },
    );
  }

  async editProfile(body: TPutProfileRequest): Promise<AxiosResponse<TPutProfileResponse>> {
    return await $api.put<TPutProfileResponse>(this.BASE_URL, body);
  }

  async deleteProfile({
    profileName,
    ...params
  }: TDeleteProfileRequest): Promise<AxiosResponse<TDeleteProfileResponse>> {
    return await $api.delete<TDeleteProfileResponse>(`${this.BASE_URL}/${profileName}`, {
      params,
    });
  }

  async deleteProfiles({
    profileNames,
    ...params
  }: TDeleteProfilesRequest): Promise<AxiosResponse<TDeleteProfilesResponse>> {
    return await $api.delete<TDeleteProfileResponse>(`${this.BASE_URL}/${profileNames}`, {
      params,
    });
  }

  async addPlayer({
    profileName,
    ...params
  }: TAddPlayerToProfileRequest): Promise<AxiosResponse<TAddPlayerToProfileResponse>> {
    return await $api.post<TAddPlayerToProfileResponse>(
      `${this.BASE_URL}/${profileName}/players/whitelist/${params.userUuid}`,
      {
        params,
      },
    );
  }

  async deletePlayer({
    playerUuid,
    profileName,
  }: {
    profileName: string;
    playerUuid: string;
  }): Promise<AxiosResponse<TDeletePlayerToProfileResponse>> {
    return await $api.delete<TDeletePlayerToProfileResponse>(
      `${this.BASE_URL}/${profileName}/players/whitelist/${playerUuid}`,
    );
  }

  async getGameVersions({
    gameLoader,
    minecraftVersion,
  }: TGameVersionsRequest): Promise<AxiosResponse<TGameVersionsResponse, any>> {
    return await $api.get<TGameVersionsResponse>(
      `${this.BASE_URL}/versions/${gameLoader}/${minecraftVersion}`,
    );
  }

  async getJavaVersions(): Promise<AxiosResponse<TJavaVersionsResponse, any>> {
    return await $api.get<TJavaVersionsResponse>(`${this.BASE_URL}/versions/java`);
  }
}

export const profileService = new ProfileService();
