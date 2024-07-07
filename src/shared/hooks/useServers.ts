import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { isAxiosError } from "axios";

import { toast, useToast } from "@/shared/ui/use-toast";
import { gameServerService } from "@/shared/services/GameServerService";
import {
  TDeleteGameServersRequest,
  TGetGameServersRequest,
  TPostGameServersRequest,
} from "@/shared/api/contracts";

type useGameServersParams = {
  profileName?: string;
};

export const useGameServers = (profile: TGetGameServersRequest) => {
  return useQuery({
    queryKey: ["get-gameservers", profile],
    queryFn: () => gameServerService.getServers(profile),
    select: (data) => data?.data,
  });
};

export const useGameServer = ({ profileName }: { profileName?: string }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add-gameserver"],
    mutationFn: (data: TPostGameServersRequest) => gameServerService.addServer(data, profileName),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ["get-gameservers", { profileName }],
      });
      toast({
        title: "Успешно",
        description: `Сервер "${data.data.name}" успешно добавлен`,
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

export const useDeleteGameServer = ({ profileName }: { profileName?: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-gameserver"],
    mutationFn: (data: TDeleteGameServersRequest) => gameServerService.deleteServer(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["get-gameservers", { profileName }],
      });
      toast({
        title: "Успешно",
        description: "Сервер успешно удален",
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
