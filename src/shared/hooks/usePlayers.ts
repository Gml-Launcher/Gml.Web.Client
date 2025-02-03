import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { playersService } from '@/shared/services/PlayersService';
import { modsKeys } from '@/shared/hooks/useMods';
import { isAxiosError } from '@/shared/lib/isAxiosError/isAxiosError';
import { TPostBanPlayersRequest, TPostRemovePlayersRequest } from '@/shared/api/contracts';

export const playersKeys = {
  all: ['players'] as const,
  getPlayers: () => [...modsKeys.all, 'getPlayers'] as const,
  banPlayer: () => [...modsKeys.all, 'banPlayer'] as const,
  pardonPlayer: () => [...modsKeys.all, 'pardonPlayer'] as const,
  removePlayer: () => [...modsKeys.all, 'pardonPlayer'] as const,
};

export const usePlayers = (search: string) => {
  return useInfiniteQuery({
    queryKey: playersKeys.all,
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      playersService.getPlayers({
        take: 20,
        offset: pageParam,
        findName: search,
      }),
    select: (data) => data.pages.flatMap((page) => page.data),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.length < 10) return undefined;
      return allPages.length * 10;
    },
  });
};

export const useBanPlayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: playersKeys.banPlayer(),
    mutationFn: (data: TPostBanPlayersRequest) => playersService.banPlayer(data),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: playersKeys.all });
      toast.success('Успешно', {
        description: `Пользователь заблокирован`,
      });
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useRemoveUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: playersKeys.banPlayer(),
    mutationFn: (data: TPostRemovePlayersRequest) => playersService.removePlayer(data),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: playersKeys.all });
      toast.success('Успешно', {
        description: `Пользователь удален`,
      });
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const usePardonPlayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: playersKeys.pardonPlayer(),
    mutationFn: (data: TPostBanPlayersRequest) => playersService.pardonPlayer(data),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: playersKeys.all });
      toast.success('Успешно', {
        description: `Пользователь разблокирован`,
      });
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};
