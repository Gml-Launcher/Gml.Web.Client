import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const enumValues = <T extends Record<string, unknown>>(enumEntity: T) =>
  Object.entries(enumEntity).filter(([key]) => Number.isNaN(+key));

export const emptyArray = (length: number) => Array(length).fill(1);

export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') return window.location.origin;
  // Fallback for SSR, will be corrected on client
  return '';
};

const isValidToken = (token: string) => {
  const tokenRegex = /^[a-zA-Z0-9-_]+?\.[a-zA-Z0-9-_]+?\.([a-zA-Z0-9-_]+)?$/;
  return tokenRegex.test(token);
};

const base64UrlDecode = (input: string): string => {
  try {
    const padLength = (4 - (input.length % 4)) % 4;
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(padLength);
    if (typeof atob === 'function') {
      return decodeURIComponent(
        Array.prototype.map
          .call(atob(base64), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
    }
    // Node.js fallback
    return Buffer.from(base64, 'base64').toString('utf-8');
  } catch {
    throw new Error('Invalid base64url payload');
  }
};

const getTokenExpiredTime = (token: string) => {
  const tokenParts = token.split('.');
  try {
    const json = base64UrlDecode(tokenParts[1] ?? '');
    const payload = JSON.parse(json);
    return payload?.exp as number | undefined;
  } catch {
    return undefined;
  }
};

export const isTokenExpired = (token?: string): boolean => {
  if (!token) return true;

  if (!isValidToken(token)) throw new Error('Invalid token format');

  const expired_time = getTokenExpiredTime(token);
  if (!expired_time) throw new Error('Token does not contain expiration time');

  const time_now = Math.floor(Date.now() / 1000);

  return expired_time <= time_now;
};

export const formatNumber = (num?: number | null): string => {
  if (!num) return '';

  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};

export * from './getFormatDate/getFormatDate';
export * from './getProgressColor/getProgressColor';
export * from './isAxiosError/isAxiosError';
