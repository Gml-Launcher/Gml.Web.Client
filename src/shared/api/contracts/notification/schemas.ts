import { NotificationStatus } from "@/shared/enums/notificationType";

export type NotificationBaseEntity = {
  message: string;
  details: string;
  type: NotificationStatus;
  date: string;
};
