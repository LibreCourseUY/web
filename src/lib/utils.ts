// Libreries
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatLink = (url: string): string => {
  if (!url) return '#';

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return `https://${url}`;
};
