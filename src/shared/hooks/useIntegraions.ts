import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { isAxiosError } from "axios";

import {
  TGetActiveAuthIntegrationsResponse,
  TPostAuthIntegrationsRequest,
  TPutConnectTexturesRequest,
  TPutSentryConnectRequest,
} from "@/shared/api/contracts";
import { integrationService } from "@/shared/services/IntegrationService";
import { useToast } from "@/shared/ui/use-toast";
import { TexturesServiceType } from "@/shared/enums";

export const useAuthIntegrations = () => {
  return useQuery({
    queryKey: ["integrations/findAll"],
    queryFn: () => integrationService.getAuthIntegrations(),
    select: ({ data }) => data,
  });
};

export const useGetActiveAuthIntegrations = (): TGetActiveAuthIntegrationsResponse => {
  const queryClient = useQueryClient();

  const data = queryClient.getQueryData<TGetActiveAuthIntegrationsResponse>([
    "integrations/findActive",
  ]);
  if (!data) return {} as TGetActiveAuthIntegrationsResponse;

  return data;
};
export const useActiveAuthIntegrations = () => {
  return useQuery({
    queryKey: ["integrations/findActive"],
    queryFn: () => integrationService.getActiveAuthIntegration(),
    select: ({ data }) => data,
  });
};

export const useEditIntegration = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-integration"],
    mutationFn: (data: TPostAuthIntegrationsRequest) =>
      integrationService.putAuthIntegrations(data),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["integrations/findActive"] });
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

export const useGithubLauncherVersions = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["clientBranches"],
    queryFn: () => integrationService.getInstallClientBranches(),
  });

  return { data: data?.data, isLoading };
};

export const useSentry = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["get-sentry"],
    queryFn: () => integrationService.getSentryConnect({}),
  });

  return { data: data?.data, isLoading };
};

export const useEditSentry = () => {
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["update-sentry"],
    mutationFn: (data: TPutSentryConnectRequest) => integrationService.putSentryConnect(data),
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

export const useConnectTextures = (type: TexturesServiceType) => {
  return useQuery({
    queryKey: [`get-connect-textures-${type}`],
    queryFn: () => integrationService.getConnectTextures({ type }),
    select: ({ data }) => data,
  });
};

export const useEditConnectTextures = () => {
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["update-connect-textures"],
    mutationFn: (data: TPutConnectTexturesRequest) => integrationService.putConnectTextures(data),
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
