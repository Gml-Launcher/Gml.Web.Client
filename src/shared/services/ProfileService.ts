import { $api } from "@/core/api";
import {
  TDeleteProfileRequest,
  TDeleteProfileResponse,
  TGetProfileRequest,
  TGetProfileResponse,
  TGetProfilesResponse,
  TPostProfilesRequest,
  TPostProfilesResponse,
  TPutProfileRequest,
  TPutProfileResponse,
} from "@/shared/api/contracts";

class ProfileService {
  private BASE_URL = "/profiles";

  async getProfiles(): Promise<TGetProfilesResponse> {
    const { data } = await $api.get<TGetProfilesResponse>(this.BASE_URL);
    return data;
  }

  async getProfile(body: TGetProfileRequest): Promise<TGetProfileResponse> {
    const { data } = await $api.post<TGetProfileResponse>(`${this.BASE_URL}/info`, body);
    return data;
  }

  async createProfile(body: TPostProfilesRequest): Promise<TPostProfilesResponse> {
    const { data } = await $api.post<TPostProfilesResponse>(this.BASE_URL, body);

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
}

export const profileService = new ProfileService();
