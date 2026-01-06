import { ValueOf } from '@/shared/lib/helpers';

export type ProfileJavaVendor = ValueOf<typeof ProfileJavaVendor>;
export const ProfileJavaVendor = {
  DEFAULT: 0,
  AZUL: 1,
} as const;
