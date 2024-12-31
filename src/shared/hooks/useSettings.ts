import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { TPutSettingsPlatformRequest } from '@/shared/api/contracts';
import { settingsService } from '@/shared/services/SettingsService';
import { isAxiosError } from '@/shared/lib/isAxiosError/isAxiosError';

export const useSettingsPlatform = () => {
  return useQuery({
    queryKey: ['settings-platform'],
    queryFn: () => settingsService.getPlatform(),
    select: ({ data }) => data.data,
  });
};

export const useEditSettingsPlatform = () => {
  return useMutation({
    mutationKey: ['edit-settings-platform'],
    mutationFn: (data: TPutSettingsPlatformRequest) => settingsService.editPlatform(data),
    onSuccess: (data) => {
      toast.success('Успешно', {
        description: `Настройки платформы успешно обновлены`,
      });
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};
