"use client";

import { useActiveAuthIntegrations, useAuthIntegrations } from "@/shared/hooks/useIntegraions";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { integrationService } from "@/shared/services/IntegrationService";

export const Table = () => {
  const toast = useToast();

  const { data: integrations, isLoading: integrationsLoading } = useAuthIntegrations();
  const { data: activeIntegration, isLoading: activeIntegrationLoading } =
    useActiveAuthIntegrations();

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-auth-integration"],
    mutationFn: () =>
      integrationService.putAuthIntegrations({
        authType: 1,
        endpoint: "https://launcher.recloud.tech/auth.php",
      }),
    onSuccess: (data) => {
      toast.toast({
        title: "Успешно",
        description: data.message,
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

  return (
    <>
      {integrationsLoading && "isLoading..."}
      {integrations &&
        integrations.data &&
        integrations.data.map((item) => (
          <h1 key={item.name}>
            {item.authType} {item.name} {item.endpoint}
          </h1>
        ))}

      {activeIntegrationLoading && "isLoading..."}
      {activeIntegration && activeIntegration.data && (
        <h1>
          {activeIntegration.data.authType} {activeIntegration.data.name}{" "}
          {activeIntegration.data.endpoint}
        </h1>
      )}
    </>
  );
};
