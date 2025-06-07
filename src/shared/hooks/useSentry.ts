import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { sentryService } from '@/shared/services/SentryService';
import { isAxiosError } from '@/shared/lib/isAxiosError/isAxiosError';
import {
  TPostSentryFilterErrorsListRequest,
  TPostSentryFilterErrorsRequest,
} from '@/shared/api/contracts/sentry/requests';

export const sentryKeys = {
  all: ['sentry'] as const,
  exception: () => [...sentryKeys.all, 'exception'] as const,
  stats: () => [...sentryKeys.all, 'stats'] as const,
  summary: () => [...sentryKeys.all, 'summary'] as const,
  filterErrors: () => [...sentryKeys.all, 'filter', 'errors'] as const,
  filterErrorsList: () => [...sentryKeys.all, 'filter', 'errors', 'list'] as const,
};

export const useSentryErrors = () => {
  return useQuery({
    queryKey: sentryKeys.exception(),
    queryFn: () => sentryService.getSentryErrors(),
    select: (data) => data.data.data,
  });
};

export const useSentryFilterErrorsList = () => {
  return useMutation({
    mutationKey: sentryKeys.filterErrors(),
    mutationFn: (data: TPostSentryFilterErrorsListRequest) =>
      sentryService.postSentryFilterErrorsList(data),
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useSentryFilterErrors = () => {
  return useMutation({
    mutationKey: sentryKeys.filterErrors(),
    mutationFn: (data: TPostSentryFilterErrorsRequest) => sentryService.getSentryFilterErrors(data),
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

export const useSolveSentryErrors = () => {
  return useMutation({
    mutationKey: sentryKeys.summary(),
    mutationFn: () => sentryService.solveSentryErrors(),
    onSuccess: async (data) => {
      toast.success('Успешно', {
        description: data.message,
      });
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useSentrySummary = () => {
  return useQuery({
    queryKey: sentryKeys.all,
    queryFn: () => sentryService.getSentrySummary(),
    select: (data) => data.data.data,
  });
};
