import { useMutation } from "@tanstack/react-query";

import { isAxiosError } from "axios";

import {
  TDeleteWhitelistFileRequest,
  TDeleteWhitelistFolderRequest,
  TPostWhitelistFileRequest,
  TPostWhitelistFolderRequest,
} from "@/shared/api/contracts";
import { useToast } from "@/shared/ui/use-toast";
import { whitelistService } from "@/shared/services/WhitelistService";

export const whitelistKeys = {
  addingFilesWhitelist: ["adding-files-whitelist"] as const,
  deleteFilesWhitelist: ["delete-files-whitelist"] as const,
  addingFoldersWhitelist: ["adding-folders-whitelist"] as const,
  deleteFoldersWhitelist: ["delete-folders-whitelist"] as const,
};

export const useAddingFilesWhitelist = () => {
  const { toast } = useToast();

  return useMutation({
    mutationKey: whitelistKeys.addingFilesWhitelist,
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
    mutationKey: whitelistKeys.deleteFilesWhitelist,
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

export const useAddingFolderWhitelist = () => {
  const { toast } = useToast();

  return useMutation({
    mutationKey: whitelistKeys.addingFoldersWhitelist,
    mutationFn: (data: TPostWhitelistFolderRequest) => whitelistService.appendFolder(data),
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

export const useDeleteFolderWhitelist = () => {
  const { toast } = useToast();

  return useMutation({
    mutationKey: whitelistKeys.deleteFoldersWhitelist,
    mutationFn: (body: TDeleteWhitelistFolderRequest) => whitelistService.deleteFolder(body),
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
