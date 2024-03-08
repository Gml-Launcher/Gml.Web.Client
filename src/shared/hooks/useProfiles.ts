import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/shared/services/ProfileService";
import { useToast } from "@/components/ui/use-toast";
import { isAxiosError } from "axios";
import {
  ProfileBaseEntity,
  TDeleteProfileRequest,
  TGetProfileRequest,
  TPostProfilesRequest,
  TPutProfileRequest,
} from "@/shared/api/contracts";

export const useProfiles = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["profiles"],
    queryFn: () => profileService.getProfiles(),
  });

  return { data: data?.data, isLoading };
};

export const useProfile = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["get-profile"],
    mutationFn: (data: TGetProfileRequest) => profileService.getProfile(data),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.toast({
          variant: "destructive",
          title: (error.response && error.response.data.message) || "Ошибка!",
          description: error.response && error.response.data.errors[0],
        });
      }
    },
  });
};

export const useCurrentProfile = () => {
  const { data } = useQuery<ProfileBaseEntity>({
    queryKey: ["profile"],
  });

  return data;
};

export const useCreateProfile = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-profile"],
    mutationFn: (data: TPostProfilesRequest) => profileService.createProfile(data),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
    onSuccess: (data) => {
      toast.toast({
        title: "Успешно",
        description: `Профиль "${data.data.name}" успешно создан`,
      });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.toast({
          variant: "destructive",
          title: (error.response && error.response.data.message) || "Ошибка!",
          description: error.response && error.response.data.errors[0],
        });
      }
    },
  });
};

export const useEditProfile = () => {
  const toast = useToast();

  return useMutation({
    mutationKey: ["edit-profile"],
    mutationFn: (data: TPutProfileRequest) => profileService.editProfile(data),
    onSuccess: (data) => {
      toast.toast({
        title: "Успешно",
        description: `Профиль "${data.data.name}" успешно обновлен`,
      });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.toast({
          variant: "destructive",
          title: (error.response && error.response.data.message) || "Ошибка!",
          description: error.response && error.response.data.errors[0],
        });
      }
    },
  });
};

export const useDeleteProfile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-profile"],
    mutationFn: (body: TDeleteProfileRequest) => profileService.deleteProfile(body),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profiles"] });
      await queryClient.setQueryData(["profile"], () => null);
    },
    onSuccess: async (data) => {
      toast({
        title: "Успешно",
        description: data.message,
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
