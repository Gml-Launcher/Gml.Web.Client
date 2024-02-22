import { useQuery } from "@tanstack/react-query";
import { integrationService } from "@/shared/services/IntegrationService";

export const useAuthIntegrations = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["integrations/findAll"],
    queryFn: () => integrationService.getAuthIntegrations(),
  });

  return { data: data, isLoading };
};

export const useActiveAuthIntegrations = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["integrations/findActive"],
    queryFn: () => integrationService.getActiveAuthIntegration(),
  });

  return { data: data, isLoading };
};
