import axios, { CreateAxiosDefaults, HttpStatusCode } from 'axios';

import {
  getStorageAccessToken,
  removeStorageProfile,
  removeStorageTokens,
  removeStorageRecloudIDAccessToken,
} from '@/shared/services';

const OPTIONS: CreateAxiosDefaults = {
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: { 'Access-Control-Allow-Credentials': '*' },
};

export const $api = axios.create(OPTIONS);

$api.interceptors.request.use((config) => {
  const accessToken = getStorageAccessToken();
  config.headers.set('Authorization', `Bearer ${accessToken}`);

  return config;
});

$api.interceptors.response.use((response) => {
  if (response.status === HttpStatusCode.Unauthorized) {
    removeStorageProfile();
    removeStorageTokens();
    removeStorageRecloudIDAccessToken();
  }

  return response;
});
