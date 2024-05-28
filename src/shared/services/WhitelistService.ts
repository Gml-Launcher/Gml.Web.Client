import { $api } from "@/core/api";
import {
  TDeleteWhitelistFileRequest,
  TDeleteWhitelistFileResponse,
  TPostWhitelistFileRequest,
  TPostWhitelistFileResponse,
} from "@/shared/api/contracts";
import { AxiosResponse } from "axios";

class WhitelistService {
  private BASE_URL = "/file/whitelist";

  async appendFiles(
    body: TPostWhitelistFileRequest,
  ): Promise<AxiosResponse<TPostWhitelistFileResponse>> {
    return await $api.post<TPostWhitelistFileResponse>(this.BASE_URL, body);
  }

  async deleteFiles(
    params: TDeleteWhitelistFileRequest,
  ): Promise<AxiosResponse<TDeleteWhitelistFileResponse>> {
    return await $api.delete<TDeleteWhitelistFileResponse>(this.BASE_URL, { data: params });
  }
}

export const whitelistService = new WhitelistService();
