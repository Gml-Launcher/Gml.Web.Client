import axios, { CreateAxiosDefaults, HttpStatusCode } from 'axios';
import { toast } from 'sonner';

import {
  getStorageAccessToken,
  removeStorageProfile,
  removeStorageRecloudIDAccessToken,
  removeStorageTokens,
} from '@/shared/services';

const OPTIONS: CreateAxiosDefaults = {
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
};

export const $api = axios.create(OPTIONS);

$api.interceptors.request.use((config) => {
  const accessToken = getStorageAccessToken();
  config.headers.set('Authorization', `Bearer ${accessToken}`);

  return config;
});

$api.interceptors.response.use(
  (response) => {
    if (response.status === HttpStatusCode.Unauthorized) {
      removeStorageProfile();
      removeStorageTokens();
      removeStorageRecloudIDAccessToken();
    }

    return response;
  },
  (error) => {
    try {
      const status = error?.response?.status;
      const data = error?.response?.data ?? {};
      const errors: string[] | undefined = data?.errors;
      const message: string | undefined = data?.message || error?.message;

      if (Array.isArray(errors) && errors.length) {
        errors.forEach((e: any) => {
          const text = typeof e === 'string' ? e : JSON.stringify(e);
          toast.error(text);
        });
      } else if (message) {
        toast.error(message);
      } else {
        toast.error('Произошла ошибка запроса');
      }

      if (status === HttpStatusCode.Unauthorized) {
        removeStorageProfile();
        removeStorageTokens();
        removeStorageRecloudIDAccessToken();
      }
    } catch (_) {
      // Fallback toast if parsing fails
      toast.error('Произошла ошибка запроса');
    }

    return Promise.reject(error);
  },
);
