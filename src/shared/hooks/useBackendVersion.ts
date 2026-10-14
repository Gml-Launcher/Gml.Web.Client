import { useQuery } from '@tanstack/react-query';

import { getStorageAccessToken } from '@/shared/services/AuthTokenService';
import { systemService } from '@/shared/services/SystemService';

export const useBackendVersion = () => {
  return useQuery({
    queryKey: ['backend-version'],
    queryFn: () => systemService.getVersion(),
    enabled: Boolean(getStorageAccessToken()),
    staleTime: 5 * 60 * 1000,
    gcTime: 0,
  });
};
