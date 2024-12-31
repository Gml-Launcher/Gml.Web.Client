import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  TDeleteWhitelistFileRequest,
  TDeleteWhitelistFolderRequest,
  TPostWhitelistFileRequest,
  TPostWhitelistFolderRequest,
} from '@/shared/api/contracts';
import { whitelistService } from '@/shared/services/WhitelistService';
import { isAxiosError } from '@/shared/lib/isAxiosError/isAxiosError';

export const whitelistKeys = {
  addingFilesWhitelist: ['adding-files-whitelist'] as const,
  deleteFilesWhitelist: ['delete-files-whitelist'] as const,
  addingFoldersWhitelist: ['adding-folders-whitelist'] as const,
  deleteFoldersWhitelist: ['delete-folders-whitelist'] as const,
};

export const useAddingFilesWhitelist = () => {
  return useMutation({
    mutationKey: whitelistKeys.addingFilesWhitelist,
    mutationFn: (data: TPostWhitelistFileRequest) => whitelistService.appendFiles(data),
    onSuccess: (data) => {
      toast.success('Успешно', {
        description: data.data.message,
      });
      window.location.reload();
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useDeleteFilesWhitelist = () => {
  return useMutation({
    mutationKey: whitelistKeys.deleteFilesWhitelist,
    mutationFn: (body: TDeleteWhitelistFileRequest) => whitelistService.deleteFiles(body),
    onSuccess: async (data) => {
      toast.success('Успешно', {
        description: data.data.message,
      });
      window.location.reload();
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useAddingFolderWhitelist = () => {
  return useMutation({
    mutationKey: whitelistKeys.addingFoldersWhitelist,
    mutationFn: (data: TPostWhitelistFolderRequest) => whitelistService.appendFolder(data),
    onSuccess: (data) => {
      toast.success('Успешно', {
        description: data.data.message,
      });
      window.location.reload();
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useDeleteFolderWhitelist = () => {
  return useMutation({
    mutationKey: whitelistKeys.deleteFoldersWhitelist,
    mutationFn: (body: TDeleteWhitelistFolderRequest) => whitelistService.deleteFolder(body),
    onSuccess: async (data) => {
      toast.success('Успешно', {
        description: data.data.message,
      });
      window.location.reload();
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};
