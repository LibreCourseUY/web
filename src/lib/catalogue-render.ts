import { esc, entryCard } from '@/lib/awesome-card';
import { organizationCard } from '@/lib/awesome-org-card';
import type { AwesomeEntry, AwesomeOrg } from '@/lib/awesome';

// Shared by the build-time prerender and the client-side filter, so the HTML a
// crawler sees and the HTML a visitor sees are produced by the same code.
export function projectGroupsHtml(categories: string[], entries: AwesomeEntry[]): string {
  return categories
    .map((category) => [category, entries.filter((entry) => entry.category === category)] as const)
    .filter(([, group]) => group.length > 0)
    .map(
      ([category, group]) => `
        <section>
          <h2 class="border-b border-line pb-2 text-sm font-bold uppercase tracking-wider text-muted">${esc(category)}</h2>
          <div class="grid grid-cols-1 gap-6 pt-4 md:grid-cols-2 lg:grid-cols-3">
            ${group.map(entryCard).join('')}
          </div>
        </section>`,
    )
    .join('');
}

export function orgsGridHtml(orgs: AwesomeOrg[]): string {
  return orgs.map(organizationCard).join('');
}

export function projectsItemList(entries: AwesomeEntry[], siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'LibreCourseUY project catalogue',
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      url: entry.url,
      ...(entry.description ? { description: entry.description } : {}),
    })),
    ...(siteUrl ? { url: new URL('/projects/', siteUrl).toString() } : {}),
  };
}
