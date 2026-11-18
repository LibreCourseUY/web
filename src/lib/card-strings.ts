export type CardLang = 'en' | 'es';

// Chrome rendered inside catalogue cards. Descriptions themselves come from the
// feed and are never translated.
const en = {
  open: '[open]',
  community: '[community]',
  official: '[official]',
  commercial: '[commercial]',
  nonCommercial: '[non-commercial]',
  openToContributions: '[open to contributions]',
  website: '[website]',
  source: '[source]',
  repo: (name: string) => `Open ${name} repository`,
  sourceFor: (name: string) => `Source for ${name}`,
  opensInNewTab: '(opens in a new tab)',
  by: 'By',
  site: 'website',
};

type Strings = typeof en;

const es: Strings = {
  open: '[abierto]',
  community: '[comunidad]',
  official: '[oficial]',
  commercial: '[comercial]',
  nonCommercial: '[no comercial]',
  openToContributions: '[abierto a contribuciones]',
  website: '[sitio]',
  source: '[código]',
  repo: (name: string) => `Abrir el repositorio de ${name}`,
  sourceFor: (name: string) => `Código de ${name}`,
  opensInNewTab: '(se abre en una pestaña nueva)',
  by: 'por',
  site: 'sitio web',
};

export const cardStrings: Record<CardLang, Strings> = { en, es };
