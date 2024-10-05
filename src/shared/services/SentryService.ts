import { AxiosResponse } from "axios";

import { $api } from "@/core/api";
import {
  TPostSentryErrorsRequest,
  TPostSentryErrorsResponse,
  TGetSentryExceptionResponse,
  TGetSentryStatsResponse,
  TGetSentrySummaryResponse,
  TPostSentryFilterErrorsRequest,
  TPostSentryFilterResponse,
} from "@/shared/api/contracts/sentry/requests";

class SentryService {
  private BASE_URL = "/sentry";

  async getSentryErrors(): Promise<AxiosResponse<TPostSentryErrorsResponse>> {
    return await $api.get<TPostSentryErrorsResponse>(this.BASE_URL);
  }

  async getSentryFilterErrors(
    data: TPostSentryFilterErrorsRequest,
  ): Promise<AxiosResponse<TPostSentryFilterResponse>> {
    return await $api.post<TPostSentryFilterResponse>(`${this.BASE_URL}/filter`, data);
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
