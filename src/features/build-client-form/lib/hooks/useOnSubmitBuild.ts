import { toast } from "@/shared/ui/use-toast";
import { SubmitHandler } from "react-hook-form";
import { ClientBuildFormSchemaType } from "../static";
import { useConnectionHub } from "./useConnectionHub";

interface UseOnSubmitBuildParams {
  connectionHub: ReturnType<typeof useConnectionHub>["connectionHub"];
  process: ReturnType<typeof useConnectionHub>["process"];
  percent: ReturnType<typeof useConnectionHub>["percent"];
  onOpenChange: () => void;
}

export const useOnSubmitBuild = ({
  connectionHub,
  process,
  percent,
  onOpenChange,
}: UseOnSubmitBuildParams) => {
  const onSubmitBuild: SubmitHandler<ClientBuildFormSchemaType> = async (
    data: ClientBuildFormSchemaType,
  ) => {
    process.onIsProcessingToggle();
    process.setIsBuild(() => true);
    try {
      connectionHub?.invoke("Compile", data.branch).then(() => {
        onOpenChange();
        process.setIsBuild(false);
      });
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Ошибка!",
        description: JSON.stringify(error),
      });
    } finally {
      process.onIsProcessingToggle();
      process.setIsBuild(false);
      process.setLogs(null);
      percent.setProgressPercent(0);
    }
  };
  return { onSubmitBuild };
};
