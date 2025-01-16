import { AxiosResponse, isAxiosError as isAxiosErrorBase } from 'axios';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import {
  ProfileBaseEntity,
  TAddPlayerToProfileRequest,
  TDeleteProfileRequest,
  TDeleteProfilesRequest,
  TGameVersionsRequest,
  TGameVersionsResponse,
  TGetProfileRequest,
  TPostLoadProfileModRequest,
  TPostProfilesRequest,
  TPutProfileRequest,
  TRemoveProfileModRequest,
} from '@/shared/api/contracts';
import { profileService } from '@/shared/services/ProfileService';
import { isAxiosError } from '@/shared/lib/utils';
import { useProfileCardStore } from '@/entities/ProfileCard/lib/store';
import { modsKeys } from '@/shared/hooks/useMods';

export const profileKeys = {
  all: ['profiles'] as const,
  creating: () => [...profileKeys.all, 'creating'] as const,
  reading: () => [...profileKeys.all, 'reading'] as const,
  editing: () => [...profileKeys.all, 'editing'] as const,
  deleting: () => [...profileKeys.all, 'deleting'] as const,
  deletingAll: () => [...profileKeys.all, 'deletingAll'] as const,
  deletingPlayers: () => [...profileKeys.all, 'deletingPlayers'] as const,
  addingPlayers: () => [...profileKeys.all, 'addingPlayers'] as const,
  addingMods: () => [...profileKeys.all, 'addingMods'] as const,

  entities: () => [...profileKeys.all, 'entities'] as const,

  javaVerison: () => [...profileKeys.all, 'javaVerison'] as const,
  gameVersions: (version: string) => [...profileKeys.entities(), version, 'versions'] as const,
};

export const useProfiles = () => {
  return useQuery({
    queryKey: profileKeys.all,
    queryFn: () => profileService.getProfiles(),
    select: (data) => data.data.data,
  });
};

export const useProfile = () => {
  const { setState } = useProfileCardStore();

  const route = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...profileKeys.reading()],
    mutationFn: (data: TGetProfileRequest) => profileService.getProfile(data),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
    onSuccess: async (data) => {
      setState(data.data.data.state);
    },
    onError: (error) => {
      isAxiosError({ toast, error });

      if (isAxiosErrorBase(error)) {
        if (error.response && error.response.status === 404) {
          route.push('/dashboard/profiles');
        }
      }
    },
  });
};

export const useCurrentProfile = () => {
  return useQuery<ProfileBaseEntity>({
    queryKey: profileKeys.reading(),
  });
};

export const useCreateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: profileKeys.creating(),
    mutationFn: (data: TPostProfilesRequest) => profileService.createProfile(data),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: profileKeys.all });
      toast.success('Успешно', {
        description: `Профиль "${data.data.data.name}" успешно создан`,
      });
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useLoadProfileMods = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: profileKeys.addingMods(),
    mutationFn: (data: TPostLoadProfileModRequest) => profileService.loadProfileMod(data),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: modsKeys.all });
      toast.success('Успешно', {
        description: 'Мод успешно загружен',
      });
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useRemoveProfileMod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: profileKeys.addingMods(),
    mutationFn: (data: TRemoveProfileModRequest) => profileService.removeProfileMod(data),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: modsKeys.all });
      toast.success('Успешно', {
        description: 'Мод успешно загружен',
      });
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useEditProfile = () => {
  return useMutation({
    mutationKey: profileKeys.editing(),
    mutationFn: (data: TPutProfileRequest) => profileService.editProfile(data),
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: profileKeys.deleting(),
    mutationFn: (body: TDeleteProfileRequest) => profileService.deleteProfile(body),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: profileKeys.all });
      await queryClient.setQueryData(profileKeys.reading(), () => null);
    },
    onSuccess: async (data) => {
      toast.success('Успешно', {
        description: data.data.message,
      });
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useDeleteProfiles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: profileKeys.deletingAll(),
    mutationFn: (body: TDeleteProfilesRequest) => profileService.deleteProfiles(body),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
    onSuccess: async (data) => {
      toast.success('Успешно', {
        description: data.data.message,
      });
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useAddProfilePlayers = (profileName?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: profileKeys.addingPlayers(),
    mutationFn: (body: TAddPlayerToProfileRequest) => profileService.addPlayer(body),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: [...profileKeys.reading(), { profileName: profileName }],
      });
      toast.success('Успешно', {
        description: data.data.message,
      });
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useDeleteProfilePlayers = ({ profileName }: { profileName: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: profileKeys.deletingPlayers(),
    mutationFn: ({ playerUuid }: { playerUuid: string }) =>
      profileService.deletePlayer({ profileName, playerUuid }),
    onSuccess: async (data) => {
      toast.success('Успешно', {
        description: data.data.message,
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
    UseQueryOptions<AxiosResponse<TGameVersionsResponse>, Error, TGameVersionsResponse['data']>
  >,
): UseQueryResult<TGameVersionsResponse['data']> => {
  return useQuery({
    queryKey: [profileKeys.gameVersions(body.minecraftVersion), { gameLoader: body.gameLoader }],
    queryFn: async () => await profileService.getGameVersions(body),
    select: (data) => data.data.data,
    ...options,
  });
};

export const useGetJavaVersions = () => {
  return useQuery({
    queryKey: profileKeys.javaVerison(),
    queryFn: () => profileService.getJavaVersions(),
    select: (data) => data.data.data,
  });
};
