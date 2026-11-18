import type { Lang } from '@/i18n/config';

const en = {
  nav: {
    main: 'Main navigation',
    mobile: 'Mobile navigation',
    home: 'Home',
    learn: 'Learn',
    projects: 'Projects',
    orgs: 'Orgs',
    showcase: 'Showcase',
    activity: 'Activity',
    docs: 'Docs',
    contribute: 'Contribute',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    toggleTheme: 'Toggle theme',
    theme: 'Theme',
    opensInNewTab: '(opens in a new tab)',
    switchTo: 'Cambiar a español',
    switchToShort: 'ES',
  },
  footer: {
    label: 'Footer',
    about: 'About',
    projects: 'Projects',
    orgs: 'Organizations',
    docs: 'Docs',
    contribute: 'Contribute',
    rights: 'Open Source Education',
  },
} as const;

type Dict = typeof en;

const es: Dict = {
  nav: {
    main: 'Navegación principal',
    mobile: 'Navegación móvil',
    home: 'Inicio',
    learn: 'Aprender',
    projects: 'Proyectos',
    orgs: 'Organizaciones',
    showcase: 'Productos',
    activity: 'Actividad',
    docs: 'Documentación',
    contribute: 'Contribuir',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    toggleTheme: 'Cambiar tema',
    theme: 'Tema',
    opensInNewTab: '(se abre en una pestaña nueva)',
    switchTo: 'Switch to English',
    switchToShort: 'EN',
  },
  footer: {
    label: 'Pie de página',
    about: 'Acerca',
    projects: 'Proyectos',
    orgs: 'Organizaciones',
    docs: 'Documentación',
    contribute: 'Contribuir',
    rights: 'Educación Open Source',
  },
};

export const common: Record<Lang, Dict> = { en, es };
