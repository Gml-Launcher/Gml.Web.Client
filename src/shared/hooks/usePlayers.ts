import { useInfiniteQuery } from "@tanstack/react-query";

import { playersService } from "@/shared/services/PlayersService";

export const playersKeys = {
  all: ["players"] as const,
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
