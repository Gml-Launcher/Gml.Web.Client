import { NotificationStatus } from '@/shared/enums';

export type NotificationBaseEntity = {
  message: string;
  details: Nullable<string>;
  type: NotificationStatus;
  date: string;
};
