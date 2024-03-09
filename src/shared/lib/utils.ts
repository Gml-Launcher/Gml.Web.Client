import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const enumValues = <T extends Record<string, unknown>>(enumEntity: T) =>
  Object.entries(enumEntity).filter(([key]) => Number.isNaN(+key));

export const emptyArray = (length: number) => Array(length).fill(1);

export const getApiBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL;
