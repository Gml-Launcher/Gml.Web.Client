import { $api } from "@/core/api";
import { AxiosResponse } from "axios";
import {
  TGetActiveAuthIntegrationsRequest,
  TGetActiveAuthIntegrationsResponse,
  TGetAuthIntegrationsRequest,
  TGetAuthIntegrationsResponse,
  TPostAuthIntegrationsRequest,
  TPostAuthIntegrationsResponse,
} from "@/shared/api/contracts";

class IntegrationService {
  private BASE_URL = "/integrations/auth";

  async getAuthIntegrations(): Promise<TGetAuthIntegrationsResponse> {
    const { data } = await $api.get<
      TGetAuthIntegrationsRequest,
      AxiosResponse<TGetAuthIntegrationsResponse>
    >(this.BASE_URL);
    return data;
  }

  async getActiveAuthIntegration(): Promise<TGetActiveAuthIntegrationsResponse> {
    const { data } = await $api.get<
      TGetActiveAuthIntegrationsRequest,
      AxiosResponse<TGetActiveAuthIntegrationsResponse>
    >(`${this.BASE_URL}/active`);
    return data;
  }

  async putAuthIntegrations(
    body: TPostAuthIntegrationsRequest,
  ): Promise<TPostAuthIntegrationsResponse> {
    const { data } = await $api.put<TPostAuthIntegrationsResponse>(this.BASE_URL, body);
    return data;
  }
}

export const integrationService = new IntegrationService();
