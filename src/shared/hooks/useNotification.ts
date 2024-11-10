import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast as sonner } from "sonner";
import { notificationService } from "@/shared/services/NotifiactionService";
import { serversKeys } from "@/shared/hooks";
import { useNotificationsState } from "@/views/notification/lib/store";

export const notificationsKeys = {
  all: ["notifications"] as const,
  clearAll: ["clear-notifications"] as const,
};

export const useNotifications = () => {
  return useQuery({
    queryKey: notificationsKeys.all,
    queryFn: () => notificationService.getNotification(),
    select: (data) => data.data.data,
  });
};

export const useClearNotifications = () => {
  const { clearNotifications, clearCount } = useNotificationsState();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: serversKeys.creating(),
    mutationFn: () => notificationService.clearNotification(),
    onSuccess: async (data) => {
      clearNotifications();
      clearCount();
      queryClient.removeQueries({ queryKey: notificationsKeys.all });
      sonner("Успешно", {
        description: `Все уведомления были очищены`,
      });
    },
    onError: () => {
      sonner("Ошибка");
    },
  });
};
