import { useQuery } from "@tanstack/react-query";
import { sentryService } from "@/shared/services/SentryService";

export const sentryKeys = {
  all: ["sentry"] as const,
  exception: () => [...sentryKeys.all, "exception"] as const,
  stats: () => [...sentryKeys.all, "stats"] as const,
  summary: () => [...sentryKeys.all, "summary"] as const,
};

export const useSentryErrors = () => {
  return useQuery({
    queryKey: sentryKeys.all,
    queryFn: () => sentryService.getSentryErrors(),
    select: (data) => data.data.data,
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
