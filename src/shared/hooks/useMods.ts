import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { modService } from '@/shared/services';
import { ModDetailsEntity } from '@/shared/api/contracts/mods/schemas';
import { isAxiosError } from '@/shared/lib/isAxiosError/isAxiosError';
import { profileKeys } from '@/shared/hooks/useProfiles';
import { TPutModOptionalRequest } from '@/shared/api/contracts/mods/requests';
import { ModType } from '@/shared/enums';

export const modsKeys = {
  all: ['mods'] as const,
  optinal: () => [...modsKeys.all, 'optional'] as const,
  modsDetails: () => [...modsKeys.all, 'modsDetails'] as const,
  putDetails: () => [...modsKeys.all, 'putDetails'] as const,
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

export const useDetailsMods = () => {
  return useQuery({
    queryKey: modsKeys.modsDetails(),
    queryFn: () => modService.getModsDetails(),
    select: (data) =>
      data.data.data.reduce(
        (acc, mod) => {
          acc[mod.key] = mod;
          return acc;
        },
        {} as Record<string, ModDetailsEntity>,
      ),
  });
};

export const usePutModDetails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: modsKeys.putDetails(),
    mutationFn: (data: TPutModOptionalRequest) => modService.putModDetails(data),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: profileKeys.all });
      toast.success('Успешно', {
        description: `Модификация успешно обновлена`,
      });
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useModInfo = ({
  profileName,
  modId,
  modType,
}: {
  profileName: string;
  modType: ModType;
  modId: string;
}) => {
  return useQuery({
    queryKey: ['versions', profileName, modId],
    queryFn: () => modService.getModInfo({ profileName, modId, modType }),
    select: (data) => data.data.data,
  });
};

// export const useSearchMods = ({
//   profileName,
//   modName,
//   limit,
//   offset,
// }: {
//   profileName: string;
//   modName: string;
//   limit: number;
//   offset: number;
// }) => {
//   return useQuery({
//     queryKey: ['mods', profileName, modName, limit],
//     queryFn: () => modService.getAvailableModsList({ profileName, modName, limit, offset }),
//     select: (data) => data.data.data,
//   });
// };

export const useSearchMods = (
  profileName: string,
  search: string,
  modType: ModType,
  limit: number = 20,
) => {
  return useInfiniteQuery({
    queryKey: ['mods', 'search', profileName, modType],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      modService.getAvailableModsList({
        limit,
        offset: pageParam,
        modName: search,
        modType: modType,
        profileName,
      }),
    select: (data) => data.pages.flatMap((page) => page.data.data),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.data?.length < 20) return undefined;
      return allPages.length * 20;
    },
  });
};
