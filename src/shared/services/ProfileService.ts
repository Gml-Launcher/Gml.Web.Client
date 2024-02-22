import { $api } from "@/core/api";
import { AxiosResponse } from "axios";
import {
  TDeleteProfileRequest,
  TDeleteProfileResponse,
  TGetProfilesRequest,
  TGetProfilesResponse,
  TPostProfilesRequest,
  TPostProfilesResponse,
} from "@/shared/api/contracts";

class ProfileService {
  private BASE_URL = "/profiles";

  async getProfiles(): Promise<TGetProfilesResponse> {
    const { data } = await $api.get<TGetProfilesRequest, AxiosResponse<TGetProfilesResponse>>(
      this.BASE_URL,
    );
    return data;
  }

  async createProfile(body: TPostProfilesRequest): Promise<TPostProfilesResponse> {
    const { data } = await $api.post<TPostProfilesResponse>(this.BASE_URL, body);

    return data;
  }

  async deleteProfile(body: TDeleteProfileRequest): Promise<TDeleteProfileResponse> {
    const { data } = await $api.delete<TDeleteProfileResponse>(
      `${this.BASE_URL}/${body.profileName}`,
    );

    return data;
  }

  // getProfile: async (body: GetProfileRequest) => {
  //   try {
  //     const { data } = await $api.post<
  //       GetProfileRequest,
  //       AxiosResponse<GetProfileResponse>
  //     >("/profiles/info", body);
  //     return data;
  //   } catch (error) {
  //     const axiosError = error as AxiosError;
  //     throw new Error(axiosError.message);
  //   }
  // },
}

export const profileService = new ProfileService();
