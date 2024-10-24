import { isAxiosError as isAxiosErrorBase } from "axios";

import { useToast } from "@/shared/ui/use-toast";

interface isAxiosErrorParams {
  toast: ReturnType<typeof useToast>["toast"];
  error: Error;
}

export const isAxiosError = ({ toast, error }: isAxiosErrorParams) => {
  if (isAxiosErrorBase(error)) {
    toast({
      variant: "destructive",
      title: (error.response && error.response.data.message) || "Ошибка!",
      description: error.response && error.response.data.errors[0],
    });
  }
};
