import { AxiosResponse } from 'axios';

import { $api } from '@/services/api.service';
import {
  TDeleteNotificationResponse,
  TGetNotificationRequest,
  TGetNotificationResponse,
} from '@/shared/api/contracts';

class NotificationService {
  private BASE_URL = '/notifications';

  async getNotification(
    params?: TGetNotificationRequest,
  ): Promise<AxiosResponse<TGetNotificationResponse>> {
    return await $api.get<TGetNotificationResponse>(this.BASE_URL, { params });
  }

  async clearNotification(): Promise<AxiosResponse<TDeleteNotificationResponse>> {
    return await $api.delete<TDeleteNotificationResponse>(this.BASE_URL);
  }
}

export const notificationService = new NotificationService();
