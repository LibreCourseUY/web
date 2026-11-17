export interface ShowcaseProduct {
  name: string;
  description: string;
  creator: {
    name: string;
    url?: string;
  };
  url: string;
}

export const showcaseNotice =
  'These independent products may be commercial or closed source. They are not maintained or endorsed by LibreCourseUY.';

export const showcaseContributionUrl =
  'https://github.com/LibreCourseUY/web/blob/main/CONTRIBUTING.md#member-products';

export const showcaseProducts: ShowcaseProduct[] = [
  {
    name: 'ClassBack',
    description:
      'Organize and share class notes, summaries and study materials with other students.',
    creator: { name: 'Bruno Sena' },
    url: 'https://classback.app/',
  },
  {
    name: 'EnRouta',
    description:
      'Explore community reports on a live risk map to make more informed travel decisions.',
    creator: { name: 'Yaquier Mansfarrol' },
    url: 'https://www.enrouta.com/',
  },
  {
    name: 'FastroAI',
    description:
      'Build AI-powered SaaS apps with a template that includes authentication, payments and a frontend.',
    creator: { name: 'Igor Benav' },
    url: 'https://fastro.ai/',
  },
  {
    name: 'MenchoBot',
    description: 'Log fleet refueling, machine hours and fuel consumption through WhatsApp.',
    creator: { name: 'Franco Feijó' },
    url: 'https://menchobot.com/',
  },
  {
    name: 'Resvora',
    description:
      'Manage online bookings and appointments to keep your professional schedule organized.',
    creator: { name: 'Santiago Berriel' },
    url: 'https://resvora.com/',
  },
  {
    name: 'Sapari',
    description: 'Edit videos with AI-assisted cuts, automatic captions and audio cleanup.',
    creator: { name: 'Igor Benav' },
    url: 'https://sapari.io/',
  },
  {
    name: 'Uruleyes',
    description: 'Search Uruguayan legislation and find legal information.',
    creator: { name: 'Mauro Nievas' },
    url: 'https://www.uruleyes.com/',
  },
  {
    name: 'Wake Up',
    description: 'Track habits and emotions to discover patterns in your daily life.',
    creator: { name: 'Ivan Molina' },
    url: 'https://wakeuptracker.com/',
  },
].sort((first, second) => first.name.localeCompare(second.name, 'en'));
