import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { modService } from '@/shared/services';
import { playersKeys } from '@/shared/hooks/usePlayers';
import { ModDetailsEntity } from '@/shared/api/contracts/mods/schemas';

export const modsKeys = {
  all: ['mods'] as const,
  optinal: () => [...modsKeys.all, 'optional'] as const,
  modsDetails: () => [...modsKeys.all, 'modsDetails'] as const,
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

export const useModInfo = ({ profileName, modId }: { profileName: string; modId: string }) => {
  return useQuery({
    queryKey: ['versions', profileName, modId],
    queryFn: () => modService.getModInfo({ profileName, modId }),
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

export const useSearchMods = (profileName: string, search: string, limit: number = 20) => {
  return useInfiniteQuery({
    queryKey: playersKeys.all,
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      modService.getAvailableModsList({
        limit,
        offset: pageParam,
        modName: search,
        profileName,
      }),
    select: (data) => data.pages.flatMap((page) => page.data.data),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.data?.length < 20) return undefined;
      return allPages.length * 20;
    },
  });
};
