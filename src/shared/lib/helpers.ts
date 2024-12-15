export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type AllowOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Pick<T, K> & Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]+?: Pick<T, K> & Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

type Prev = [never, 0, 1, 2, 3, 4, 5, ...0[]];
type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never;

export type Paths<T, D extends number = 2> = [D] extends [never]
  ? never
  : T extends object
    ? {
        [K in keyof T]-?: K extends string | number
          ? `${K}` | Join<K, Paths<T[K], Prev[D]>>
          : never;
      }[keyof T]
    : '';

export type RemoveIndex<T> = {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: T[K];
};
export type ValueOf<T> = T[keyof T];

export type FlattenObjectValues<T extends Record<string, any>, Key = keyof T> = Key extends string
  ? T[Key] extends Record<string, any>
    ? `${FlattenObjectValues<T[Key]>}`
    : T[Key] extends string
      ? `${T[Key]}`
      : never
  : never;

export type NullPartial<T> = { [P in keyof T]?: T[P] | null };

export type Nullable<T> = T | null | undefined;

export const propNameFromType = <T>(key: Paths<T, 1>) => key;

export const nonNullable = <T>(value: T): value is NonNullable<T> => {
  return value !== null && value !== undefined;
};

export const nullable = <T>(value: T): value is (null | undefined) & T => {
  return value === null || value === undefined;
};

export const getKeys = Object.keys as <T extends object>(obj: T) => (keyof T)[];

export const getEntries = Object.entries as <T extends object>(obj: T) => [keyof T, T[keyof T]][];

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y,
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop);
}

export function includes<T extends U, U>(coll: readonly T[], el: U): el is T {
  return coll.includes(el as T);
}

export const allSettledSucceeds = <T>(
  results: PromiseSettledResult<T>[],
): results is PromiseFulfilledResult<T>[] => {
  return !results.some((result) => result.status === 'rejected');
};

export const isRejectedPromiseResult = <T>(
  result: PromiseSettledResult<T>,
): result is PromiseRejectedResult => {
  return result.status === 'rejected';
};

export const asserted = <T>(value: T | undefined | null): T => {
  if (value === undefined || value === null) {
    throw new Error('Expected non undefined value');
  }
  return value;
};

export const firstElement = <T>(array: T[] | undefined): T | undefined => array?.at(0);

export const exhaustiveMatchingGuard = (_: never): never => {
  throw new Error('Unreachable');
};

export const takeLastDigits = <T>(s: T, amount: number) => {
  if (typeof s === 'string') {
    return s.replaceAll(/\D/g, '').slice(-amount) || undefined;
  }

  return s;
};
