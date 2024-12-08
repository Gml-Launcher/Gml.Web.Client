import { AxiosResponse } from "axios";

import { $api } from "@/core/api";
import {
  TAddPlayerToProfileRequest,
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
  TPostProfilesRequest,
  TPostProfilesResponse,
  TPutProfileRequest,
  TPutProfileResponse,
} from "@/shared/api/contracts";
import { ResponseBaseEntity } from "@/shared/api/schemas";

class ProfileService {
  private BASE_URL = "/profiles";

  async getProfiles(): Promise<TGetProfilesResponse> {
    const { data } = await $api.get<TGetProfilesResponse>(this.BASE_URL);

    return data;
  }

  async getProfile(body: TGetProfileRequest): Promise<TGetProfileResponse> {
    const { data } = await $api.post<TGetProfileResponse>(`${this.BASE_URL}/details`, body);

    return data;
  }

  async createProfile(body: TPostProfilesRequest): Promise<TPostProfilesResponse> {
    const { data } = await $api.post<TPostProfilesResponse>(this.BASE_URL, body, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  }

  async editProfile(body: TPutProfileRequest): Promise<TPutProfileResponse> {
    const { data } = await $api.put<TPutProfileResponse>(this.BASE_URL, body);

    return data;
  }

  async deleteProfile({
    profileName,
    ...params
  }: TDeleteProfileRequest): Promise<TDeleteProfileResponse> {
    const { data } = await $api.delete<TDeleteProfileResponse>(`${this.BASE_URL}/${profileName}`, {
      params,
    });

    return data;
  }

  async deleteProfiles({
    profileNames,
    ...params
  }: TDeleteProfilesRequest): Promise<TDeleteProfilesResponse> {
    const { data } = await $api.delete<TDeleteProfileResponse>(`${this.BASE_URL}/${profileNames}`, {
      params,
    });

    return data;
  }

  async addPlayer({
    profileName,
    ...params
  }: TAddPlayerToProfileRequest): Promise<ResponseBaseEntity> {
    debugger;
    const { data } = await $api.post<ResponseBaseEntity>(
      `${this.BASE_URL}/${profileName}/players/whitelist/${params.userUuid}`,
      {
        params,
      },
    );

    return data;
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
