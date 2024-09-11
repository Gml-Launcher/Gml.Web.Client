import { useMutation, useQuery } from "@tanstack/react-query";
import { sentryService } from "@/shared/services/SentryService";
import { isAxiosError } from "@/shared/lib/isAxiosError/isAxiosError";
import { useToast } from "@/shared/ui/use-toast";
import { TPostSentryErrorsRequest } from "@/shared/api/contracts/sentry/requests";

export const sentryKeys = {
  all: ["sentry"] as const,
  exception: () => [...sentryKeys.all, "exception"] as const,
  stats: () => [...sentryKeys.all, "stats"] as const,
  summary: () => [...sentryKeys.all, "summary"] as const,
};

export const useSentryErrors = () => {
  const { toast } = useToast();

  return useMutation({
    mutationKey: sentryKeys.all,
    mutationFn: (data: TPostSentryErrorsRequest) => sentryService.getSentryErrors(data),
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useSentryException = ({ exception }: { exception: string }) => {
  return useQuery({
    queryKey: sentryKeys.exception(),
    queryFn: () => sentryService.getSentryException({ exception }),
    select: (data) => data.data.data,
  });
};

export const useSentryStats = () => {
  return useQuery({
    queryKey: sentryKeys.stats(),
    queryFn: () => sentryService.getSentryStats(),
    select: (data) => data.data.data,
  });
};

export const useSentrySummary = () => {
  return useQuery({
    queryKey: sentryKeys.summary(),
    queryFn: () => sentryService.getSentrySummary(),
    select: (data) => data.data.data,
  });
};
