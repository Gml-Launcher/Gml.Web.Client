import { NotificationStatus } from "@/shared/enums/notificationType";

export type NotificationBaseEntity = {
  message: string;
  details: Nullable<string>;
  type: NotificationStatus;
  date: string;
};
