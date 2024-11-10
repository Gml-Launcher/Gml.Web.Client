import { SubmitHandler } from "react-hook-form";

import { ClientDownloadFormSchemaType } from "../static";

import { useConnectionHub } from "@/widgets/generate-launcher-dialog";
import { toast } from "@/shared/ui/use-toast";


interface UseOnSubmitParams {
  connectionHub: ReturnType<typeof useConnectionHub>["connectionHub"];
  state: ReturnType<typeof useConnectionHub>["download"];
}

export const useOnSubmit = ({ connectionHub, state }: UseOnSubmitParams) => {
  const onSubmit: SubmitHandler<ClientDownloadFormSchemaType> = async (
    data: ClientDownloadFormSchemaType,
  ) => {
    try {
      state.setIsDownload(() => true);
      connectionHub?.invoke("Download", data.branch, data.host, data.folder).then(() => {});
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Ошибка!",
        description: JSON.stringify(error),
      });
    } finally {
      state.setPercent(0);
    }
  };

  return { onSubmit };
};
