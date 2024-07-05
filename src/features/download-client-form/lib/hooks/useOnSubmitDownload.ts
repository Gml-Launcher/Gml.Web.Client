import { toast } from "@/shared/ui/use-toast";
import { SubmitHandler } from "react-hook-form";
import { ClientDownloadFormSchemaType } from "../static";
import { useConnectionHub } from "./useConnectionHub";

interface UseOnSubmitParams {
  connectionHub: ReturnType<typeof useConnectionHub>["connectionHub"];
  process: ReturnType<typeof useConnectionHub>["process"];
  percent: ReturnType<typeof useConnectionHub>["percent"];
  onOpenChange: () => void;
}

export const useOnSubmit = ({
  connectionHub,
  process,
  percent,
  onOpenChange,
}: UseOnSubmitParams) => {
  const onSubmit: SubmitHandler<ClientDownloadFormSchemaType> = async (
    data: ClientDownloadFormSchemaType,
  ) => {
    process.onIsProcessingToggle();
    try {
      connectionHub?.invoke("Download", data.branch, data.host, data.folder).then(() => {
        onOpenChange();
      });
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Ошибка!",
        description: JSON.stringify(error),
      });
    } finally {
      process.onIsProcessingToggle();

      percent.setProgressPercent(0);
    }
  };
  return { onSubmit };
};
