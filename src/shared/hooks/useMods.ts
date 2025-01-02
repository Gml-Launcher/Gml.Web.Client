import { useQuery } from '@tanstack/react-query';

import { modService } from '@/shared/services';

export const modsKeys = {
  all: ['mods'] as const,
  optinal: () => [...modsKeys.all, 'optional'] as const,
};

export const useMods = ({ profileName }: { profileName: string }) => {
  return useQuery({
    queryKey: modsKeys.all,
    queryFn: () => modService.getModsList({ profileName }),
    select: (data) => data.data.data,
  });
};

export const useOptionalMods = ({ profileName }: { profileName: string }) => {
  return useQuery({
    queryKey: modsKeys.optinal(),
    queryFn: () => modService.getModsOptionalList({ profileName }),
    select: (data) => data.data.data,
  });
};
