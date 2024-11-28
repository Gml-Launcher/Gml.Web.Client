import { AxiosResponse } from "axios";

import { $api } from "@/core/api";
import {
  TGetSentryExceptionResponse,
  TGetSentryStatsResponse,
  TGetSentrySummaryResponse,
  TPostSentryErrorsResponse,
  TPostSentryFilterErrorsListRequest,
  TPostSentryFilterErrorsListResponse,
  TPostSentryFilterErrorsRequest,
  TPostSentryFilterErrorsResponse,
} from "@/shared/api/contracts/sentry/requests";

class SentryService {
  private BASE_URL = "/sentry";

  async getSentryErrors(): Promise<AxiosResponse<TPostSentryErrorsResponse>> {
    return await $api.get<TPostSentryErrorsResponse>(this.BASE_URL);
  }

  async getSentryFilterErrors(
    data: TPostSentryFilterErrorsRequest,
  ): Promise<AxiosResponse<TPostSentryFilterErrorsResponse>> {
    return await $api.post<TPostSentryFilterErrorsResponse>(`${this.BASE_URL}/filter`, data);
  }

  async postSentryFilterErrorsList(
    data: TPostSentryFilterErrorsListRequest,
  ): Promise<AxiosResponse<TPostSentryFilterErrorsListResponse>> {
    return await $api.post<TPostSentryFilterErrorsListResponse>(
      `${this.BASE_URL}/filter/list`,
      data,
    );
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
