import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { applicationsApi } from '@/shared/api/applications';
import { ExternalApplicationCreateDto } from '@/shared/api/contracts';

// Query key for applications
const APPLICATIONS_QUERY_KEY = ['applications'];

/**
 * Hook to fetch all applications
 */
export const useApplications = () => {
  return useQuery({
    queryKey: APPLICATIONS_QUERY_KEY,
    queryFn: () => applicationsApi.getApplications(),
  });
};

/**
 * Hook to create a new application
 */
export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ExternalApplicationCreateDto) => applicationsApi.createApplication(data),
    onSuccess: (data) => {
      toast.success('Приложение успешно создано');
      queryClient.invalidateQueries({ queryKey: APPLICATIONS_QUERY_KEY });
      return data;
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Ошибка при создании приложения');
    },
  });
};

/**
 * Hook to delete an application
 */
export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => applicationsApi.deleteApplication(id),
    onSuccess: () => {
      toast.success('Приложение успешно удалено');
      queryClient.invalidateQueries({ queryKey: APPLICATIONS_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Ошибка при удалении приложения');
    },
  });
};
