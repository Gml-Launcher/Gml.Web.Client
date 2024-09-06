import {AxiosResponse} from "axios";

import {$api} from "@/core/api";
import {TGetSentryErrorsResponse, TGetSentryExceptionResponse} from "@/shared/api/contracts/sentry/requests";

class SentryService {
  private BASE_URL = "/sentry";

  async getSentryErrors(): Promise<AxiosResponse<TGetSentryErrorsResponse>> {
    return await $api.get<TGetSentryErrorsResponse>(this.BASE_URL);
  }

  async getSentryException({exception}: { exception: string }): Promise<AxiosResponse<TGetSentryExceptionResponse>> {
    return await $api.get<TGetSentryExceptionResponse>(`${this.BASE_URL}/${exception}`);
  }
}

export const sentryService = new SentryService();
