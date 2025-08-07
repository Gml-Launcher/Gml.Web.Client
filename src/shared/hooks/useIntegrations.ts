import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  TGetActiveAuthIntegrationsResponse,
  TPostAuthIntegrationsRequest,
  TPostLauncherUploadRequest,
  TPostNewsIntegrationsRequest,
  TPutConnectDiscordRequest,
  TPutConnectTexturesRequest,
  TPutSentryConnectRequest,
} from '@/shared/api/contracts';
import { integrationService } from '@/shared/services/IntegrationService';
import { TexturesServiceType } from '@/shared/enums';
import { isAxiosError } from '@/shared/lib/utils';
import { getEntries } from '@/shared/lib/helpers';
import { NewsTypeEnum } from '@/shared/enums/news-type';

export const integrationsKeys = {
  all: ['integrations'] as const,

  auth: () => [...integrationsKeys.all, 'auth'] as const,
  news: () => [...integrationsKeys.all, 'news'] as const,
  newsList: () => [...integrationsKeys.all, 'news-list'] as const,
  newsProviders: () => [...integrationsKeys.auth(), 'editing'] as const,
  newsDelete: () => [...integrationsKeys.auth(), 'news-delete'] as const,
  authEditing: () => [...integrationsKeys.auth(), 'add'] as const,

  launcherGithubVersions: () => [...integrationsKeys.all, 'github-versions'] as const,
  launcherBuildVersions: () => [...integrationsKeys.all, 'build-versions'] as const,
  launcherUpload: () => [...integrationsKeys.all, 'launcher-upload'] as const,
  launcherActualVersion: () => [...integrationsKeys.all, 'launcher-actual-version'] as const,
  launcherPlatforms: () => [...integrationsKeys.all, 'launcher-platforms'] as const,

  sentry: () => [...integrationsKeys.all, 'sentry'] as const,
  sentryEditing: () => [...integrationsKeys.sentry(), 'editing'] as const,
  sentrySolve: () => [...integrationsKeys.sentry(), 'solve'] as const,

  textures: () => [...integrationsKeys.all, 'textures'] as const,
  texturesEditing: (type: TexturesServiceType) =>
    [...integrationsKeys.textures(), `editing-${type}`] as const,

  discord: () => [...integrationsKeys.all, 'discord'] as const,
  discordEditing: () => [...integrationsKeys.discord(), 'editing'] as const,
};

export const useAuthIntegrations = () => {
  return useQuery({
    queryKey: integrationsKeys.all,
    queryFn: () => integrationService.getAuthIntegrations(),
    select: ({ data }) => data,
  });
};

export const useGetActiveAuthIntegrations = (): TGetActiveAuthIntegrationsResponse => {
  const queryClient = useQueryClient();

  const data = queryClient.getQueryData<TGetActiveAuthIntegrationsResponse>(
    integrationsKeys.auth(),
  );
  if (!data) return {} as TGetActiveAuthIntegrationsResponse;

  return data;
};

export const useActiveAuthIntegrations = () => {
  return useQuery({
    queryKey: integrationsKeys.auth(),
    queryFn: () => integrationService.getActiveAuthIntegration(),
    select: ({ data }) => data,
  });
};

export const useNewsProviders = () => {
  return useQuery({
    queryKey: integrationsKeys.news(),
    queryFn: () => integrationService.getNewsIntegration(),
    select: ({ data }) => data,
  });
};
export const useNews = () => {
  return useQuery({
    queryKey: integrationsKeys.newsList(),
    queryFn: () => integrationService.getNews(),
    select: ({ data }) => data,
  });
};

export const useAddNewsProvider = () => {
  return useMutation({
    mutationKey: integrationsKeys.newsProviders(),
    mutationFn: (data: TPostNewsIntegrationsRequest) =>
      integrationService.postNewsIntegration(data),
    onSuccess: async (data) => {
      toast.success('Успешно', {
        description: data.message,
      });
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useDeleteNewsProvider = () => {
  return useMutation({
    mutationKey: integrationsKeys.newsDelete(),
    mutationFn: (type: NewsTypeEnum) => integrationService.deleteNewsProvider({ type }),
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

export const useEditIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: integrationsKeys.authEditing(),
    mutationFn: (data: TPostAuthIntegrationsRequest) =>
      integrationService.putAuthIntegrations(data),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: integrationsKeys.auth() });
      toast.success('Успешно', {
        description: data.message,
      });
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useLauncherGithubVersions = () => {
  return useQuery({
    queryKey: integrationsKeys.launcherGithubVersions(),
    queryFn: () => integrationService.getLauncherGithubVersions(),
    select: (data) => data.data.data,
  });
};

export const useLauncherPlatforms = () => {
  return useQuery({
    queryKey: integrationsKeys.launcherPlatforms(),
    queryFn: () => integrationService.getLauncherBuildPlatforms(),
    select: (data) => data.data.data,
  });
};

export const useLauncherBuildVersions = () => {
  return useQuery({
    queryKey: integrationsKeys.launcherBuildVersions(),
    queryFn: () => integrationService.getLauncherBuildVersions(),
    select: (data) => {
      return data.data.data.sort(
        (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime(),
      );
    },
  });
};

export const useLauncherUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: integrationsKeys.launcherUpload(),
    mutationFn: (data: TPostLauncherUploadRequest) => integrationService.postLauncherUpload(data),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: integrationsKeys.launcherActualVersion() });
      toast.success('Успешно', {
        description: data.message,
      });
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useSentry = () => {
  return useQuery({
    queryKey: integrationsKeys.sentry(),
    queryFn: () => integrationService.getSentryConnect(),
    select: (data) => data.data,
  });
};

export const useEditSentry = () => {
  return useMutation({
    mutationKey: integrationsKeys.sentryEditing(),
    mutationFn: (data: TPutSentryConnectRequest) => integrationService.putSentryConnect(data),
    onSuccess: async (data) => {
      toast.success('Успешно', {
        description: data.message,
      });
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useConnectTextures = (type: TexturesServiceType) => {
  return useQuery({
    queryKey: integrationsKeys.texturesEditing(type),
    queryFn: () => integrationService.getConnectTextures({ type }),
    select: ({ data }) => data,
  });
};

export const useEditConnectTextures = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: integrationsKeys.textures(),
    mutationFn: (data: TPutConnectTexturesRequest) => integrationService.putConnectTextures(data),
    onSuccess: async (data, variables) => {
      if (variables.type === TexturesServiceType.TEXTURES_SERVICE_SKINS)
        await queryClient.invalidateQueries({
          queryKey: integrationsKeys.texturesEditing(TexturesServiceType.TEXTURES_SERVICE_SKINS),
        });
      if (variables.type === TexturesServiceType.TEXTURES_SERVICE_CLOAKS)
        await queryClient.invalidateQueries({
          queryKey: integrationsKeys.texturesEditing(TexturesServiceType.TEXTURES_SERVICE_CLOAKS),
        });
      toast.success('Успешно', {
        description: data.message,
      });
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useDiscord = () => {
  return useQuery({
    queryKey: integrationsKeys.discord(),
    queryFn: () => integrationService.getConnectDiscord(),
    select: ({ data }) => data,
  });
};

export const useEditDiscord = () => {
  return useMutation({
    mutationKey: integrationsKeys.discordEditing(),
    mutationFn: (data: TPutConnectDiscordRequest) => integrationService.putConnectDiscord(data),
    onSuccess: async (data) => {
      toast.success('Успешно', {
        description: data.message,
      });
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useLauncherActualVersion = () => {
  return useQuery({
    queryKey: integrationsKeys.launcherActualVersion(),
    queryFn: () => integrationService.getLauncherActualVersion(),
    select: (data) => getEntries(data.data.data),
  });
};
