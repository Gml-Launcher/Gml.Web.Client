import { AxiosResponse } from "axios";

import { $api } from "@/core/api";

import { TGetNotificationRequest, TGetNotificationResponse } from "@/shared/api/contracts";

class NotificationService {
  private BASE_URL = "/notifications";

  async getNotification(
    params?: TGetNotificationRequest,
  ): Promise<AxiosResponse<TGetNotificationResponse>> {
    return await $api.get<TGetNotificationResponse>(this.BASE_URL, { params });
  }
}

export const notificationService = new NotificationService();
