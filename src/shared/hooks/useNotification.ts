import { useMutation, useQuery } from "@tanstack/react-query";

import { toast as sonner } from "sonner";
import { notificationService } from "@/shared/services/NotifiactionService";
import { TPostGameServersRequest } from "@/shared/api/contracts";
import { gameServerService } from "@/shared/services/GameServerService";
import { isAxiosError } from "@/shared/lib/isAxiosError/isAxiosError";
import { serversKeys } from "@/shared/hooks/useServers";
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

  return useMutation({
    mutationKey: serversKeys.creating(),
    mutationFn: () => notificationService.clearNotification(),
    onSuccess: async (data) => {
      clearNotifications();
      clearCount();
      sonner("Успешно", {
        description: `Все уведомления были очищены`,
      });
    },
    onError: () => {
      sonner("Ошибка");
    },
  });
};
