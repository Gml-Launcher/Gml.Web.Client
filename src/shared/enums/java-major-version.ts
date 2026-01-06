import { ValueOf } from '@/shared/lib/helpers';

export type JavaMajorVersion = ValueOf<typeof JavaMajorVersion>;
export const JavaMajorVersion = {
  VERSION_8: '8',
  VERSION_11: '11',
  VERSION_17: '17',
  VERSION_21: '21',
  VERSION_25: '25',
} as const;
