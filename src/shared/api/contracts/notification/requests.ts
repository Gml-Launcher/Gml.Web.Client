import { ResponseBaseEntity } from '@/shared/api/schemas';
import { NotificationBaseEntity } from '@/shared/api/contracts/notification/schemas';

export type TGetNotificationRequest = {};
export type TGetNotificationResponse = ResponseBaseEntity & {
  data: {
    notifications: NotificationBaseEntity[];
    amount: number;
  };
};

export type TDeleteNotificationRequest = {};
export type TDeleteNotificationResponse = ResponseBaseEntity & {};
