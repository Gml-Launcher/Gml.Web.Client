import { NotificationStatus } from "@/shared/enums/notification-type";

export type NotificationBaseEntity = {
  message: string;
  details: Nullable<string>;
  type: NotificationStatus;
  date: string;
};
