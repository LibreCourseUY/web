export const LOCALES = ['en', 'es'] as const;
export type Lang = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Lang = 'en';

export const LOCALE_LABEL: Record<Lang, string> = { en: 'EN', es: 'ES' };
export const LOCALE_NAME: Record<Lang, string> = { en: 'English', es: 'Español' };
export const OG_LOCALE: Record<Lang, string> = { en: 'en_US', es: 'es_UY' };
export const HTML_LANG: Record<Lang, string> = { en: 'en', es: 'es' };

/** Which locale a pathname belongs to. */
export function langFromPath(pathname: string): Lang {
  return pathname === '/es' || pathname.startsWith('/es/') ? 'es' : 'en';
}

/** The same page in another locale (default locale has no prefix). */
export function localizePath(pathname: string, lang: Lang): string {
  const withoutLocale = pathname.replace(/^\/es(?=\/|$)/, '') || '/';
  const path = withoutLocale.startsWith('/') ? withoutLocale : `/${withoutLocale}`;
  if (lang === DEFAULT_LOCALE) return path;
  return path === '/' ? '/es/' : `/es${path}`;
}

export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'es' : 'en';
}
