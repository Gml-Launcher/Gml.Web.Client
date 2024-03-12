import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { isAxiosError } from "axios";

import { AuthIntegrationBaseEntity, TPostAuthIntegrationsRequest } from "@/shared/api/contracts";
import { integrationService } from "@/shared/services/IntegrationService";
import { useToast } from "@/shared/ui/use-toast";

export const useCurrentIntegration = () => {
  const { data } = useQuery<AuthIntegrationBaseEntity>({
    queryKey: ["integration"],
  });

  return data;
};

export const useAuthIntegrations = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["integrations/findAll"],
    queryFn: () => integrationService.getAuthIntegrations(),
  });

  return { data, isLoading };
};

export const useActiveAuthIntegrations = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["integrations/findActive"],
    queryFn: () => integrationService.getActiveAuthIntegration(),
  });

  return { data, isLoading };
};

export const useEditIntegration = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-integration"],
    mutationFn: (data: TPostAuthIntegrationsRequest) =>
      integrationService.putAuthIntegrations(data),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["integrations/findAll"] });
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(["integration"], () => null);
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
