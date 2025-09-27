import axios, { CreateAxiosDefaults, HttpStatusCode, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

import {
  getStorageAccessToken,
  removeStorageProfile,
  removeStorageRecloudIDAccessToken,
  removeStorageTokens,
} from '@/shared/services';
import { authService } from '@/shared/services';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin + '/api/v1';
  }
  // SSR or build time fallback: use relative path so browser will resolve current origin
  return '/api/v1';
};

const OPTIONS: CreateAxiosDefaults = {
  baseURL: getBaseUrl(),
  withCredentials: true,
};

export const $api = axios.create(OPTIONS);

// Single-flight guard to avoid parallel refresh calls
let tokenRefreshPromise: Promise<void> | null = null;
let lastTokenRefreshAtSec: number | null = null; // when the last successful refresh finished
const REFRESH_SKEW_SECONDS = 60; // refresh if less than 60s remains
const REFRESH_COOLDOWN_SECONDS = 30; // do not refresh again within this window

function getTokenExpFromJwt(token: string | null): number | null {
  if (!token) return null;
  try {
    const payloadRaw = token.split('.')[1];
    if (!payloadRaw) return null;
    const json = typeof atob !== 'undefined'
      ? atob(payloadRaw)
      : (globalThis as any)?.Buffer?.from(payloadRaw, 'base64')?.toString('utf-8');
    const obj = JSON.parse(json) as { exp?: number };
    return typeof obj.exp === 'number' ? obj.exp : null;
  } catch (_) {
    return null;
  }
}

async function ensureTokenFresh() {
  const token = getStorageAccessToken();
  const exp = getTokenExpFromJwt(token);
  if (!exp) return; // cannot determine, skip
  const nowSec = Math.floor(Date.now() / 1000);

  // Prevent refreshing on every request by applying a short cooldown
  if (lastTokenRefreshAtSec && nowSec - lastTokenRefreshAtSec < REFRESH_COOLDOWN_SECONDS) {
    return;
  }

  const secondsLeft = exp - nowSec;
  if (secondsLeft > REFRESH_SKEW_SECONDS) return; // still valid enough

  if (!tokenRefreshPromise) {
    tokenRefreshPromise = authService
      .refresh()
      .then(() => {
        // mark the time of last successful refresh
        lastTokenRefreshAtSec = Math.floor(Date.now() / 1000);
      })
      .finally(() => {
        tokenRefreshPromise = null;
      });
  }
  await tokenRefreshPromise;
}

$api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Skip refresh loop for the refresh endpoint itself
    const url = (config.url || '').toString();
    // Skip proactive refresh for auth endpoints to avoid breaking initial sign in/signup
    const skipProactive = url.endsWith('/users/refresh') || url.endsWith('/users/signin') || url.endsWith('/users/signup');
    if (!skipProactive) {
      // Proactively refresh if token is about to expire
      await ensureTokenFresh();
    }

    const accessToken = getStorageAccessToken();
    if (accessToken) {
      config.headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

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
