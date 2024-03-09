import axios from 'axios';

import { getStorageAccessToken } from '@/shared/services';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const PREFIX_API = process.env.NEXT_PUBLIC_PREFIX_API;
const VERSION_API = process.env.NEXT_PUBLIC_VERSION_API;

export const $api = axios.create({
  baseURL: `${BASE_URL}/${PREFIX_API}/${VERSION_API}`,
  headers: { 'Access-Control-Allow-Credentials': '*' },
});

$api.interceptors.request.use((config) => {
  const accessToken = getStorageAccessToken();
  config.headers.set('Authorization', `Bearer ${accessToken}`);

  return config;
});
