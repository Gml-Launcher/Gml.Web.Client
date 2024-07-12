import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  TGetActiveAuthIntegrationsResponse,
  TPostAuthIntegrationsRequest,
  TPostLauncherUploadRequest,
  TPutConnectDiscordRequest,
  TPutConnectTexturesRequest,
  TPutSentryConnectRequest,
} from "@/shared/api/contracts";
import { integrationService } from "@/shared/services/IntegrationService";
import { useToast } from "@/shared/ui/use-toast";
import { TexturesServiceType } from "@/shared/enums";
import { isAxiosError } from "@/shared/lib/utils";

export const integrationsKeys = {
  all: ["integrations"] as const,

  auth: () => [...integrationsKeys.all, "auth"] as const,
  authEditing: () => [...integrationsKeys.auth(), "editing"] as const,

  launcherGithubVersions: () => [...integrationsKeys.all, "github-versions"] as const,
  launcherBuildVersions: () => [...integrationsKeys.all, "build-versions"] as const,
  launcherUpload: () => [...integrationsKeys.all, "launcher-upload"] as const,
  launcherPlatforms: () => [...integrationsKeys.all, "launcher-platforms"] as const,

  sentry: () => [...integrationsKeys.all, "sentry"] as const,
  sentryEditing: () => [...integrationsKeys.sentry(), "editing"] as const,

  textures: () => [...integrationsKeys.all, "textures"] as const,
  texturesEditing: (type: TexturesServiceType) =>
    [...integrationsKeys.textures(), `editing-${type}`] as const,

  discord: () => [...integrationsKeys.all, "discord"] as const,
  discordEditing: () => [...integrationsKeys.discord(), "editing"] as const,
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

export const useEditIntegration = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: integrationsKeys.authEditing(),
    mutationFn: (data: TPostAuthIntegrationsRequest) =>
      integrationService.putAuthIntegrations(data),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: integrationsKeys.auth() });
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
    queryFn: () => integrationService.getLauncherPlatforms(),
    select: (data) => data.data.data,
  });
};

export const useLauncherBuildVersions = () => {
  return useQuery({
    queryKey: integrationsKeys.launcherBuildVersions(),
    queryFn: () => integrationService.getLauncherBuildVersions(),
    select: (data) => data.data.data,
  });
};

export const useLauncherUpload = () => {
  const { toast } = useToast();

  return useMutation({
    mutationKey: integrationsKeys.launcherUpload(),
    mutationFn: (data: TPostLauncherUploadRequest) => integrationService.postLauncherUpload(data),
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

export const useSentry = () => {
  return useQuery({
    queryKey: integrationsKeys.sentry(),
    queryFn: () => integrationService.getSentryConnect(),
    select: (data) => data.data,
  });
};

export const useEditSentry = () => {
  const { toast } = useToast();

  return useMutation({
    mutationKey: integrationsKeys.sentryEditing(),
    mutationFn: (data: TPutSentryConnectRequest) => integrationService.putSentryConnect(data),
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

export const useConnectTextures = (type: TexturesServiceType) => {
  return useQuery({
    queryKey: integrationsKeys.texturesEditing(type),
    queryFn: () => integrationService.getConnectTextures({ type }),
    select: ({ data }) => data,
  });
};

export const useEditConnectTextures = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: integrationsKeys.textures(),
    mutationFn: (data: TPutConnectTexturesRequest) => integrationService.putConnectTextures(data),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: integrationsKeys.texturesEditing(TexturesServiceType.TEXTURES_SERVICE_SKINS),
      });
      await queryClient.invalidateQueries({
        queryKey: integrationsKeys.texturesEditing(TexturesServiceType.TEXTURES_SERVICE_CLOAKS),
      });
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

export const useDiscord = () => {
  return useQuery({
    queryKey: integrationsKeys.discord(),
    queryFn: () => integrationService.getConnectDiscord(),
    select: ({ data }) => data,
  });
};

export const useEditDiscord = () => {
  const { toast } = useToast();

  return useMutation({
    mutationKey: integrationsKeys.discordEditing(),
    mutationFn: (data: TPutConnectDiscordRequest) => integrationService.putConnectDiscord(data),
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
