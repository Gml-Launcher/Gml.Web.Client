import Cookies from 'js-cookie';

import { UserBaseEntity } from '@/shared/api/contracts';

export const getStorageProfile = () => {
  const profile = Cookies.get('profile');

  return profile ? (JSON.parse(profile) as UserBaseEntity) : null;
};
export const setStorageProfile = (profile: UserBaseEntity) => {
  Cookies.set('profile', JSON.stringify(profile), {
    domain: process.env.BASE_URL,
    sameSite: 'strict',
    expires: 1,
  });
};

export const removeStorageProfile = () => Cookies.remove('profile');

export const getStorageAccessToken = () => Cookies.get('accessToken') || null;
export const setStorageAccessToken = (token: string) => {
  Cookies.set('accessToken', token, {
    domain: process.env.BASE_URL,
    sameSite: 'strict',
    expires: 1,
  });
};

export const removeStorageTokens = () => Cookies.remove('accessToken');

// RecloudID specific token storage
export const getStorageRecloudIDAccessToken = () => Cookies.get('recloudIDAccessToken') || null;
export const setStorageRecloudIDAccessToken = (token: string) => {
  Cookies.set('recloudIDAccessToken', token, {
    domain: process.env.BASE_URL,
    sameSite: 'strict',
    expires: 1,
  });
};

export const removeStorageRecloudIDAccessToken = () => Cookies.remove('recloudIDAccessToken');
