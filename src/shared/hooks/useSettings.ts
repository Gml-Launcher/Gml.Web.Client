import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { TPutSettingsPlatformRequest } from "@/shared/api/contracts";
import { settingsService } from "@/shared/services/SettingsService";
import { useToast } from "@/shared/ui/use-toast";

export const useSettingsPlatform = () => {
  return useQuery({
    queryKey: ["settings-platform"],
    queryFn: () => settingsService.getPlatform(),
    select: ({ data }) => data.data,
  });
};

export const useEditSettingsPlatform = () => {
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["edit-settings-platform"],
    mutationFn: (data: TPutSettingsPlatformRequest) => settingsService.editPlatform(data),
    onSuccess: (data) => {
      toast({
        title: "Успешно",
        description: `Настройки платформы успешно обновлены`,
      });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast({
          variant: "destructive",
          title: (error.response && error.response.data.message) || "Ошибка!",
          description: error.response && error.response.data.errors[0],
        });
      }
    },
  });
};
