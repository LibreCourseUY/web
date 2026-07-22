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

export const formatDate = (date: string): string => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Intl.DateTimeFormat('en-GB', options).format(new Date(date));
}