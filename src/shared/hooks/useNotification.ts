import { isAxiosError } from "axios";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/shared/services/NotifiactionService";

export const useNotifications = () => {
  return useQuery({
    queryKey: ["get-notifications"],
    queryFn: () => notificationService.getNotification(),
    select: (data) => data.data,
  });
};
