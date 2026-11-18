export interface ShowcaseProduct {
  name: string;
  description: string;
  descriptionEs: string;
  creator: {
    name: string;
    url?: string;
  };
  url: string;
}

export const showcaseNotice =
  'These independent products may be commercial or closed source. They are not maintained or endorsed by LibreCourseUY.';

export const showcaseNoticeEs =
  'Estos productos independientes pueden ser comerciales o de código cerrado. No están mantenidos ni respaldados por LibreCourseUY.';

export const showcaseContributionUrl =
  'https://github.com/LibreCourseUY/web/blob/main/CONTRIBUTING.md#member-products';

export const showcaseProducts: ShowcaseProduct[] = [
  {
    name: 'azulify',
    description:
      'See the real profit of every Amazon sale after fees, shipping, ads, taxes and product cost.',
    descriptionEs:
      'Mirá la ganancia real de cada venta en Amazon después de comisiones, envío, publicidad, impuestos y costo del producto.',
    creator: { name: 'Igor Benav' },
    url: 'https://azulify.io/',
  },
  {
    name: 'ClassBack',
    description:
      'Organize and share class notes, summaries and study materials with other students.',
    descriptionEs:
      'Organizá y compartí apuntes, resúmenes y material de estudio con otros estudiantes.',
    creator: { name: 'Bruno Sena' },
    url: 'https://classback.app/',
  },
  {
    name: 'EnRouta',
    description:
      'Explore community reports on a live risk map to make more informed travel decisions.',
    descriptionEs:
      'Explorá reportes de la comunidad en un mapa de riesgo en vivo para tomar mejores decisiones de viaje.',
    creator: { name: 'Yaquier Mansfarrol' },
    url: 'https://www.enrouta.com/',
  },
  {
    name: 'FastroAI',
    description:
      'Build AI-powered SaaS apps with a template that includes authentication, payments and a frontend.',
    descriptionEs:
      'Creá aplicaciones SaaS con IA usando una plantilla que ya incluye autenticación, pagos y frontend.',
    creator: { name: 'Igor Benav' },
    url: 'https://fastro.ai/',
  },
  {
    name: 'MenchoBot',
    description: 'Log fleet refueling, machine hours and fuel consumption through WhatsApp.',
    descriptionEs: 'Registrá cargas de combustible, horas de máquina y consumo por WhatsApp.',
    creator: { name: 'Franco Feijó' },
    url: 'https://menchobot.com/',
  },
  {
    name: 'Resvora',
    description:
      'Manage online bookings and appointments to keep your professional schedule organized.',
    descriptionEs:
      'Gestioná reservas y turnos online para mantener ordenada tu agenda profesional.',
    creator: { name: 'Santiago Berriel' },
    url: 'https://resvora.com/',
  },
  {
    name: 'Sapari',
    description: 'Edit videos with AI-assisted cuts, automatic captions and audio cleanup.',
    descriptionEs:
      'Editá videos con cortes asistidos por IA, subtítulos automáticos y limpieza de audio.',
    creator: { name: 'Igor Benav' },
    url: 'https://sapari.io/',
  },
  {
    name: 'Uruleyes',
    description: 'Search Uruguayan legislation and find legal information.',
    descriptionEs: 'Buscá legislación uruguaya y encontrá información legal.',
    creator: { name: 'Mauro Nievas' },
    url: 'https://www.uruleyes.com/',
  },
  {
    name: 'Wake Up',
    description: 'Track habits and emotions to discover patterns in your daily life.',
    descriptionEs: 'Seguí hábitos y emociones para descubrir patrones en tu día a día.',
    creator: { name: 'Ivan Molina' },
    url: 'https://wakeuptracker.com/',
  },
].sort((first, second) => first.name.localeCompare(second.name, 'en'));

/** Products with the description in the requested language. */
export function showcaseProductsFor(lang: 'en' | 'es'): ShowcaseProduct[] {
  return lang === 'es'
    ? showcaseProducts.map((product) => ({ ...product, description: product.descriptionEs }))
    : showcaseProducts;
}

export function showcaseNoticeFor(lang: 'en' | 'es'): string {
  return lang === 'es' ? showcaseNoticeEs : showcaseNotice;
}
