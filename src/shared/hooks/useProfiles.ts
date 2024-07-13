import { AxiosResponse } from "axios";
import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  ProfileBaseEntity,
  TDeleteProfileRequest,
  TDeleteProfilesRequest,
  TGameVersionsRequest,
  TGameVersionsResponse,
  TGetProfileRequest,
  TPostProfilesRequest,
  TPutProfileRequest,
} from "@/shared/api/contracts";
import { profileService } from "@/shared/services/ProfileService";
import { useToast } from "@/shared/ui/use-toast";
import { isAxiosError } from "@/shared/lib/utils";

export const profileKeys = {
  all: ["profiles"] as const,
  creating: () => [...profileKeys.all, "creating"] as const,
  reading: () => [...profileKeys.all, "reading"] as const,
  editing: () => [...profileKeys.all, "editing"] as const,
  deleting: () => [...profileKeys.all, "deleting"] as const,
  deletingAll: () => [...profileKeys.all, "deletingAll"] as const,

  entities: () => [...profileKeys.all, "entities"] as const,

  gameVersions: (version: string) => [...profileKeys.entities(), version, "versions"] as const,
};

export const useProfiles = () => {
  return useQuery({
    queryKey: profileKeys.all,
    queryFn: () => profileService.getProfiles(),
    select: (data) => data.data,
  });
};

export const useProfile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: profileKeys.reading(),
    mutationFn: (data: TGetProfileRequest) => profileService.getProfile(data),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useCurrentProfile = () => {
  return useQuery<ProfileBaseEntity>({
    queryKey: profileKeys.reading(),
  });
};

export const useCreateProfile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: profileKeys.creating(),
    mutationFn: (data: TPostProfilesRequest) => profileService.createProfile(data),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: profileKeys.all });
      toast({
        title: "Успешно",
        description: `Профиль "${data.data.name}" успешно создан`,
      });
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useEditProfile = () => {
  const { toast } = useToast();

  return useMutation({
    mutationKey: profileKeys.editing(),
    mutationFn: (data: TPutProfileRequest) => profileService.editProfile(data),
    onSuccess: (data) => {
      toast({
        title: "Успешно",
        description: `Профиль "${data.data.name}" успешно обновлен`,
      });
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useDeleteProfile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: profileKeys.deleting(),
    mutationFn: (body: TDeleteProfileRequest) => profileService.deleteProfile(body),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: profileKeys.all });
      await queryClient.setQueryData(profileKeys.reading(), () => null);
    },
    onSuccess: async (data) => {
      toast({
        title: "Успешно",
        description: data.message,
      });
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useDeleteProfiles = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: profileKeys.deletingAll(),
    mutationFn: (body: TDeleteProfilesRequest) => profileService.deleteProfiles(body),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
    onSuccess: async (data) => {
      toast({
        title: "Успешно",
        description: data.message,
      });
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useGetGameVersions = (
  body: TGameVersionsRequest,
  options?: Partial<
    UseQueryOptions<AxiosResponse<TGameVersionsResponse>, Error, TGameVersionsResponse["data"]>
  >,
): UseQueryResult<TGameVersionsResponse["data"]> => {
  return useQuery({
    queryKey: profileKeys.gameVersions(body.minecraftVersion),
    queryFn: async () => await profileService.getGameVersions(body),
    select: (data) => data.data.data,
    ...options,
  });
};
