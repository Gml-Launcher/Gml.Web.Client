import { AxiosResponse } from "axios";

import { $api } from "@/core/api";
import {
  TGetActiveAuthIntegrationsRequest,
  TGetActiveAuthIntegrationsResponse,
  TGetAuthIntegrationsRequest,
  TGetAuthIntegrationsResponse,
  TGetInstallClientBranchesResponse,
  TPostAuthIntegrationsRequest,
  TPostAuthIntegrationsResponse,
} from "@/shared/api/contracts";

class IntegrationService {
  private BASE_URL = "/integrations";

  private BASE_URL_AUTH = `${this.BASE_URL}/auth`;

  private BASE_URL_GITHUB = `${this.BASE_URL}/github`;

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

  async putAuthIntegrations(
    body: TPostAuthIntegrationsRequest,
  ): Promise<TPostAuthIntegrationsResponse> {
    const { data } = await $api.put<TPostAuthIntegrationsResponse>(this.BASE_URL_AUTH, body);

    return data;
  }

  async getInstallClientBranches(): Promise<TGetInstallClientBranchesResponse> {
    const { data } = await $api.get<TGetInstallClientBranchesResponse>(
      `${this.BASE_URL_GITHUB}/launcher/versions`,
    );

    return data;
  }
}

export const integrationService = new IntegrationService();
