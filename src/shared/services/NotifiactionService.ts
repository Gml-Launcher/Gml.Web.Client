import { TGetNotificationResponse } from "@/shared/api/contracts/notification/requests";
import { $api } from "@/core/api";

class NotificationService {
  private BASE_URL = "/notifications";

  async getNotification(): Promise<TGetNotificationResponse> {
    const { data } = await $api.get<TGetNotificationResponse>(this.BASE_URL);

    return data;
  }
}

export const notificationService = new NotificationService();
