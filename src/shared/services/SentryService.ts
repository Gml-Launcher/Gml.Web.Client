import { AxiosResponse } from "axios";

import { $api } from "@/core/api";
import {
  TPostSentryErrorsRequest,
  TPostSentryErrorsResponse,
  TGetSentryExceptionResponse,
  TGetSentryStatsResponse,
  TGetSentrySummaryResponse,
} from "@/shared/api/contracts/sentry/requests";

class SentryService {
  private BASE_URL = "/sentry";

  async getSentryErrors(
    data: TPostSentryErrorsRequest,
  ): Promise<AxiosResponse<TPostSentryErrorsResponse>> {
    return await $api.post<TPostSentryErrorsResponse>(this.BASE_URL, data);
  }

  async getSentryException({
    exception,
  }: {
    exception: string;
  }): Promise<AxiosResponse<TGetSentryExceptionResponse>> {
    return await $api.get<TGetSentryExceptionResponse>(`${this.BASE_URL}/${exception}`);
  }

  async getSentryStats(): Promise<AxiosResponse<TGetSentryStatsResponse>> {
    return await $api.get<TGetSentryStatsResponse>(`${this.BASE_URL}/stats/last`);
  }

  async getSentrySummary(): Promise<AxiosResponse<TGetSentrySummaryResponse>> {
    return await $api.get<TGetSentrySummaryResponse>(`${this.BASE_URL}/stats/summary`);
  }
}

export const sentryService = new SentryService();
