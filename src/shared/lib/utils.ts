import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const enumValues = <T extends Record<string, unknown>>(enumEntity: T) =>
  Object.entries(enumEntity).filter(([key]) => Number.isNaN(+key));

export const emptyArray = (length: number) => Array(length).fill(1);

export const getApiBaseUrl = () => (process.env.NEXT_PUBLIC_BACKEND_URL as string)?.slice(0, -7);

const isValidToken = (token: string) => {
  const tokenRegex = /^[a-zA-Z0-9-_]+?\.[a-zA-Z0-9-_]+?\.([a-zA-Z0-9-_]+)?$/;
  return tokenRegex.test(token);
};

const getTokenExpiredTime = (token: string) => {
  const tokenParts = token.split('.');
  const payload = JSON.parse(atob(tokenParts[1]));
  return payload.exp;
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
