import { SubmitHandler } from "react-hook-form";

import { useConnectionHub } from "@/widgets/generate-launcher-dialog";

import { toast } from "@/shared/ui/use-toast";

import { ClientBuildFormSchemaType } from "../static";

interface UseOnSubmitBuildParams {
  connectionHub: ReturnType<typeof useConnectionHub>["connectionHub"];
  state: ReturnType<typeof useConnectionHub>["build"];
}

export const useOnSubmit = ({ connectionHub, state }: UseOnSubmitBuildParams) => {
  const onSubmit: SubmitHandler<ClientBuildFormSchemaType> = async (
    data: ClientBuildFormSchemaType,
  ) => {
    try {
      state.setIsBuilding(() => true);
      connectionHub?.invoke("Compile", data.branch).then(() => {});
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Ошибка!",
        description: JSON.stringify(error),
      });
    } finally {
      state.setLogs(null);
    }
  };

  return { onSubmit };
};
