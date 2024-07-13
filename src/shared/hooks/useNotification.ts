import { useQuery } from "@tanstack/react-query";

import { notificationService } from "@/shared/services/NotifiactionService";

export const notificationsKeys = {
  all: ["notifications"] as const,
};

export const useNotifications = () => {
  return useQuery({
    queryKey: notificationsKeys.all,
    queryFn: () => notificationService.getNotification(),
    select: (data) => data.data.data,
  });
};
