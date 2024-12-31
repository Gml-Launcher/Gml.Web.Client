import { AxiosResponse } from 'axios';

import { $api } from '@/services/api.service';
import {
  TDeleteWhitelistFileRequest,
  TDeleteWhitelistFileResponse,
  TDeleteWhitelistFolderRequest,
  TDeleteWhitelistFolderResponse,
  TPostWhitelistFileRequest,
  TPostWhitelistFileResponse,
  TPostWhitelistFolderRequest,
  TPostWhitelistFolderResponse,
} from '@/shared/api/contracts';

class WhitelistService {
  private BASE_URL_FILE = '/file/whitelist';
  private BASE_URL_FOLDER = '/folder/whitelist';

  async appendFiles(
    body: TPostWhitelistFileRequest,
  ): Promise<AxiosResponse<TPostWhitelistFileResponse>> {
    return await $api.post<TPostWhitelistFileResponse>(this.BASE_URL_FILE, body);
  }

  async deleteFiles(
    params: TDeleteWhitelistFileRequest,
  ): Promise<AxiosResponse<TDeleteWhitelistFileResponse>> {
    return await $api.delete<TDeleteWhitelistFileResponse>(this.BASE_URL_FILE, { data: params });
  }

  async appendFolder(
    params: TPostWhitelistFolderRequest,
  ): Promise<AxiosResponse<TPostWhitelistFolderResponse>> {
    return await $api.post<TPostWhitelistFolderResponse>(this.BASE_URL_FOLDER, params);
  }

  async deleteFolder(
    params: TDeleteWhitelistFolderRequest,
  ): Promise<AxiosResponse<TDeleteWhitelistFolderResponse>> {
    return await $api.delete<TDeleteWhitelistFolderResponse>(this.BASE_URL_FOLDER, {
      data: params,
    });
  }
}

export const whitelistService = new WhitelistService();
