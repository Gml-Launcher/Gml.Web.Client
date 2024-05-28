import { useMutation } from "@tanstack/react-query";

import { isAxiosError } from "axios";

import { TDeleteWhitelistFileRequest, TPostWhitelistFileRequest } from "@/shared/api/contracts";
import { useToast } from "@/shared/ui/use-toast";
import { whitelistService } from "@/shared/services/WhitelistService";

export const useAddingFilesWhitelist = () => {
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["adding-files-whitelist"],
    mutationFn: (data: TPostWhitelistFileRequest) => whitelistService.appendFiles(data),
    onSuccess: (data) => {
      toast({
        title: "Успешно",
        description: data.data.message,
      });
      window.location.reload();
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

export const useDeleteFilesWhitelist = () => {
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["delete-files-whitelist"],
    mutationFn: (body: TDeleteWhitelistFileRequest) => whitelistService.deleteFiles(body),
    onSuccess: async (data) => {
      toast({
        title: "Успешно",
        description: data.data.message,
      });
      window.location.reload();
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
