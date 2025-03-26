import { AxiosResponse } from 'axios';

import { $api } from '@/services/api.service';
import {
  TDeleteNewsProvidersIntegrationsResponse,
  TGetActiveAuthIntegrationsRequest,
  TGetActiveAuthIntegrationsResponse,
  TGetAuthIntegrationsRequest,
  TGetAuthIntegrationsResponse,
  TGetConnectDiscordRequest,
  TGetConnectDiscordResponse,
  TGetConnectTexturesRequest,
  TGetConnectTexturesResponse,
  TGetLauncherActualVersionResponse,
  TGetLauncherBuildPlatformsResponse,
  TGetLauncherBuildVersionsResponse,
  TGetLauncherGithubVersionsResponse,
  TGetNewsProvidersIntegrationsRequest,
  TGetNewsProvidersIntegrationsResponse,
  TGetNewsRequest,
  TGetNewsResponse,
  TGetSentryConnectRequest,
  TGetSentryConnectResponse,
  TPostAuthIntegrationsRequest,
  TPostAuthIntegrationsResponse,
  TPostLauncherUploadRequest,
  TPostLauncherUploadResponse,
  TPostNewsIntegrationsRequest,
  TPostNewsIntegrationsResponse,
  TPutConnectDiscordRequest,
  TPutConnectDiscordResponse,
  TPutConnectTexturesRequest,
  TPutConnectTexturesResponse,
  TPutSentryConnectRequest,
  TPutSentryConnectResponse,
} from '@/shared/api/contracts';
import { NewsTypeEnum } from '@/shared/enums/news-type';

class IntegrationService {
  private BASE_URL = '/integrations';
  private BASE_URL_AUTH = `${this.BASE_URL}/auth`;
  private BASE_URL_NEWS = `${this.BASE_URL}/news`;
  private BASE_URL_GITHUB = `${this.BASE_URL}/github`;
  private BASE_URL_SENTRY = `${this.BASE_URL}/sentry/dsn`;
  private BASE_URL_TEXTURE = `${this.BASE_URL}/texture`;
  private BASE_URL_DISCORD = `${this.BASE_URL}/discord`;
  private BASE_URL_LAUNCHER = '/launcher';

  async getAuthIntegrations(): Promise<TGetAuthIntegrationsResponse> {
    const { data } = await $api.get<
      TGetAuthIntegrationsRequest,
      AxiosResponse<TGetAuthIntegrationsResponse>
    >(this.BASE_URL_AUTH);

    return data;
  }

  async getActiveAuthIntegration(): Promise<TGetActiveAuthIntegrationsResponse> {
    const { data } = await $api.get<
      TGetActiveAuthIntegrationsRequest,
      AxiosResponse<TGetActiveAuthIntegrationsResponse>
    >(`${this.BASE_URL_AUTH}/active`);

    return data;
  }

  async getNewsIntegration(): Promise<TGetNewsProvidersIntegrationsResponse> {
    const { data } = await $api.get<
      TGetNewsProvidersIntegrationsRequest,
      AxiosResponse<TGetNewsProvidersIntegrationsResponse>
    >(`${this.BASE_URL_NEWS}/providers`);

    return data;
  }

  async getNews(): Promise<TGetNewsResponse> {
    const { data } = await $api.get<TGetNewsRequest, AxiosResponse<TGetNewsResponse>>(
      `${this.BASE_URL_NEWS}/list`,
    );

    return data;
  }

  async deleteNewsProvider({
    type,
  }: {
    type: NewsTypeEnum;
  }): Promise<AxiosResponse<TDeleteNewsProvidersIntegrationsResponse>> {
    return await $api.delete<TDeleteNewsProvidersIntegrationsResponse>(
      `${this.BASE_URL_NEWS}/${type}`,
    );
  }

  async postNewsIntegration(
    body: TPostNewsIntegrationsRequest,
  ): Promise<TPostNewsIntegrationsResponse> {
    const { data } = await $api.post<
      TPostNewsIntegrationsRequest,
      AxiosResponse<TPostNewsIntegrationsResponse>
    >(`${this.BASE_URL_NEWS}`, body);

    return data;
  }

  async putAuthIntegrations(
    body: TPostAuthIntegrationsRequest,
  ): Promise<TPostAuthIntegrationsResponse> {
    const { data } = await $api.put<TPostAuthIntegrationsResponse>(this.BASE_URL_AUTH, body);

    return data;
  }

  async getLauncherGithubVersions(): Promise<AxiosResponse<TGetLauncherGithubVersionsResponse>> {
    return await $api.get<TGetLauncherGithubVersionsResponse>(
      `${this.BASE_URL_GITHUB}/launcher/versions`,
    );
  }

  async getLauncherBuildVersions(): Promise<AxiosResponse<TGetLauncherBuildVersionsResponse>> {
    return await $api.get<TGetLauncherBuildVersionsResponse>(`${this.BASE_URL_LAUNCHER}/builds`);
  }

  async getLauncherActualVersion(): Promise<AxiosResponse<TGetLauncherActualVersionResponse>> {
    return await $api.get<TGetLauncherActualVersionResponse>(this.BASE_URL_LAUNCHER);
  }

  async getLauncherBuildPlatforms(): Promise<AxiosResponse<TGetLauncherBuildPlatformsResponse>> {
    return await $api.get<TGetLauncherBuildPlatformsResponse>(
      `${this.BASE_URL_LAUNCHER}/platforms`,
    );
  }

  async postLauncherUpload(body: TPostLauncherUploadRequest): Promise<TPostLauncherUploadResponse> {
    const { data } = await $api.post<TPostLauncherUploadResponse>(
      `${this.BASE_URL_LAUNCHER}/upload`,
      body,
    );

    return data;
  }

  async getSentryConnect(params?: TGetSentryConnectRequest): Promise<TGetSentryConnectResponse> {
    const { data } = await $api.get<TGetSentryConnectResponse>(this.BASE_URL_SENTRY, { params });

    return data;
  }

  async putSentryConnect(body: TPutSentryConnectRequest): Promise<TPutSentryConnectResponse> {
    const { data } = await $api.put<TPutSentryConnectResponse>(this.BASE_URL_SENTRY, body);

    return data;
  }

  async getConnectTextures({
    type,
    ...params
  }: TGetConnectTexturesRequest): Promise<TGetConnectTexturesResponse> {
    const { data } = await $api.get<TGetConnectTexturesResponse>(
      `${this.BASE_URL_TEXTURE}/${type}`,
      { params },
    );

    return data;
  }

  async putConnectTextures({
    type,
    ...body
  }: TPutConnectTexturesRequest): Promise<TPutConnectTexturesResponse> {
    const { data } = await $api.put<TPutConnectTexturesResponse>(
      `${this.BASE_URL_TEXTURE}/${type}`,
      body,
    );

    return data;
  }

  async getConnectDiscord(params?: TGetConnectDiscordRequest): Promise<TGetConnectDiscordResponse> {
    const { data } = await $api.get<TGetConnectDiscordResponse>(this.BASE_URL_DISCORD, { params });

    return data;
  }

  async putConnectDiscord({
    ...body
  }: TPutConnectDiscordRequest): Promise<TPutConnectDiscordResponse> {
    const { data } = await $api.put<TPutConnectDiscordResponse>(this.BASE_URL_DISCORD, body);

    return data;
  }
}

export const integrationService = new IntegrationService();
