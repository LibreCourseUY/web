import type { AwesomeOrg } from '@/lib/awesome';
import { esc } from '@/lib/awesome-card';

export function organizationCard(org: AwesomeOrg): string {
  const light = org.color?.light ?? 'var(--color-emphasis-secondary)';
  const dark = org.color?.dark ?? 'var(--color-emphasis-secondary)';
  const accent = `--org: ${esc(light)}; --org-dark: ${esc(dark)};`;
  const relationship = org.relationship === 'official' ? 'official' : 'community';

  return `
    <article data-organization="${esc(org.name)}" style="${accent}" class="flex min-w-0 flex-col gap-4 border border-line bg-surface p-6 transition-colors hover:border-[color:var(--org)] dark:hover:border-[color:var(--org-dark)]">
      <h3 class="min-w-0 text-lg font-bold">
        <a href="${esc(org.url)}" target="_blank" rel="noopener noreferrer" class="flex items-start justify-between gap-4 text-emphasis hover:text-[color:var(--org)] dark:hover:text-[color:var(--org-dark)]">
          <span class="min-w-0 break-words">${esc(org.name)}</span>
          <span aria-hidden="true" class="shrink-0 text-[color:var(--org)] dark:text-[color:var(--org-dark)]">↗</span>
          <span class="sr-only"> (opens in a new tab)</span>
        </a>
      </h3>
      <p class="break-words text-sm leading-relaxed text-muted">${esc(org.description)}</p>
      <div class="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-xs">
        <span class="border border-current px-1.5 py-0.5 text-[color:var(--org)] dark:text-[color:var(--org-dark)]">[${relationship}]</span>
        ${org.repository && org.repository !== org.url ? `<a href="${esc(org.repository)}" target="_blank" rel="noopener noreferrer" class="font-bold text-[color:var(--org)] underline underline-offset-4 dark:text-[color:var(--org-dark)]">Source <span aria-hidden="true">↗</span><span class="sr-only"> for ${esc(org.name)} (opens in a new tab)</span></a>` : ''}
      </div>
    </article>`;
}
