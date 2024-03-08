import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/shared/services/ProfileService";
import { useToast } from "@/components/ui/use-toast";
import { isAxiosError } from "axios";
import { CreateProfileFormSchemaType, ProfileBaseEntity } from "@/shared/api/contracts";

export const useProfiles = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["profiles"],
    queryFn: () => profileService.getProfiles(),
  });

  return { data: data?.data, isLoading };
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
    mutationFn: (data: CreateProfileFormSchemaType) => profileService.createProfile(data),
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
          title: "Ошибка!",
          description: error.response && error.response.data.message,
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
    mutationFn: (profileName: string) => profileService.deleteProfile({ profileName }),
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
          title: "Ошибка!",
          description: error.response && error.response.data.message,
        });
      }
    },
  });
};
