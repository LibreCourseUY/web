import type { AwesomeEntry } from '@/lib/awesome';

export function esc(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] ?? char;
  });
}

// [light theme, dark theme] brand colors; first language of the entry wins.
export const LANG_COLORS: Record<string, [string, string]> = {
  Python: ['#3776AB', '#82B1E0'],
  TypeScript: ['#3178C6', '#5B9BD5'],
  JavaScript: ['#8A7500', '#F7DF1E'],
  Rust: ['#D34516', '#E8845C'],
  Go: ['#00758D', '#33C5E0'],
  'C#': ['#68217A', '#A179DC'],
  Vue: ['#2F8F6A', '#42B883'],
  Astro: ['#C24800', '#FF5D01'],
  Java: ['#8A5A00', '#ED8B00'],
  Dart: ['#0175C2', '#58A6E8'],
  Kotlin: ['#7F52FF', '#B490FF'],
  Swift: ['#C2410C', '#F05138'],
  PHP: ['#5B5F97', '#9B9FD4'],
  Ruby: ['#A3251C', '#E05A4F'],
  Shell: ['#3D7A1C', '#6FCF4A'],
  HTML: ['#C2410C', '#E87040'],
  CSS: ['#1554AD', '#4DA3FF'],
  'C++': ['#004482', '#3D9BE9'],
  C: ['#394F6A', '#7A9CC6'],
  Lua: ['#7A5A2C', '#C0A062'],
  Elixir: ['#6B4F8A', '#A88BC4'],
};

// Landing card: the original layout (src/components/Cards/Cards.astro) plus all
// the awesome metadata, rendered from client-fetched feed data.
export function projectCard(entry: AwesomeEntry): string {
  const link = entry.repository ?? entry.url;

  const badges: string[] = [`[${esc(entry.category)}]`];
  if (entry.open_source) badges.push('[open]');
  if (entry.relationship !== 'official') badges.push('[community]');
  badges.push(entry.commercial ? '[commercial]' : '[non-commercial]');
  if (entry.open_to_contributions ?? true) badges.push('[open to contributions]');
  if (entry.license) badges.push(`[${esc(entry.license)}]`);
  for (const tag of entry.tags ?? []) badges.push(`[${esc(tag)}]`);
  for (const lang of entry.language ?? []) badges.push(`[${esc(lang)}]`);

  const maintainers = (entry.maintainers ?? [])
    .map(
      (handle) =>
        `<a href="https://github.com/${esc(handle.replace('@', ''))}" target="_blank" rel="noopener noreferrer" class="hover:underline hover:text-emphasis">${esc(handle)}</a>`,
    )
    .join(' · ');

  return `
    <div class="flex min-w-0 flex-row items-center gap-4 border border-line bg-surface p-4 transition-colors hover:border-emphasis-secondary/60">
      <div class="hidden md:flex w-24 h-24 md:w-36 md:h-36 shrink-0 justify-center items-center bg-surface-strong">
        <svg viewBox="0 0 128 128" aria-hidden="true" class="w-16 h-16 text-emphasis opacity-80">
          <path fill="currentColor" d="M56.7937 84.9688C44.4187 83.4688 35.7 74.5625 35.7 63.0313C35.7 58.3438 37.3875 53.2813 40.2 49.9063C38.9812 46.8125 39.1687 40.25 40.575 37.5313C44.325 37.0625 49.3875 39.0313 52.3875 41.75C55.95 40.625 59.7 40.0625 64.2937 40.0625C68.8875 40.0625 72.6375 40.625 76.0125 41.6563C78.9187 39.0313 84.075 37.0625 87.825 37.5313C89.1375 40.0625 89.325 46.625 88.1062 49.8125C91.1062 53.375 92.7 58.1563 92.7 63.0313C92.7 74.5625 83.9812 83.2813 71.4187 84.875C74.6062 86.9375 76.7625 91.4375 76.7625 96.5938L76.7625 106.344C76.7625 109.156 79.1062 110.75 81.9187 109.625C98.8875 103.156 112.2 86.1875 112.2 65.1875C112.2 38.6563 90.6375 17 64.1062 17C37.575 17 16.2 38.6562 16.2 65.1875C16.2 86 29.4187 103.25 47.2312 109.719C49.7625 110.656 52.2 108.969 52.2 106.438L52.2 98.9375C50.8875 99.5 49.2 99.875 47.7 99.875C41.5125 99.875 37.8562 96.5 35.2312 90.2188C34.2 87.6875 33.075 86.1875 30.9187 85.9063C29.7937 85.8125 29.4187 85.3438 29.4187 84.7813C29.4187 83.6563 31.2937 82.8125 33.1687 82.8125C35.8875 82.8125 38.2312 84.5 40.6687 87.9688C42.5437 90.6875 44.5125 91.9063 46.8562 91.9063C49.2 91.9063 50.7 91.0625 52.8562 88.9063C54.45 87.3125 55.6687 85.9063 56.7937 84.9688Z"/>
        </svg>
      </div>
      <div class="flex min-w-0 flex-1 flex-col justify-center gap-y-3">
        <div class="flex w-full items-center justify-between gap-2">
          <h3 class="min-w-0 break-words text-lg font-bold">${esc(entry.name)}</h3>
          <a href="${esc(link)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${esc(entry.name)} repository" class="w-6 h-6 hover:bg-emphasis/10 hover:cursor-pointer flex items-center justify-center rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-muted"><path d="M6 6v2h8.59L5 17.59 6.41 19 16 9.41V18h2V6z"/></svg>
          </a>
        </div>
        <p class="break-words text-sm text-muted">${esc(entry.description)}</p>
        <div class="flex flex-wrap gap-1">${badges
          .map(
            (b) => `<span class="border border-line px-1.5 py-0.5 text-xs text-muted">${b}</span>`,
          )
          .join('')}</div>
        <div class="mt-1 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-xs text-muted">
          <div class="flex items-center gap-2">
            ${entry.url && entry.url !== entry.repository ? `<a href="${esc(entry.url)}" target="_blank" rel="noopener noreferrer" class="hover:underline hover:text-emphasis">[website]</a>` : ''}
            ${entry.repository ? `<a href="${esc(entry.repository)}" target="_blank" rel="noopener noreferrer" class="hover:underline hover:text-emphasis">[source]</a>` : ''}
          </div>
          ${maintainers ? `<span>${maintainers}</span>` : ''}
        </div>
      </div>
    </div>`;
}

export function entryCard(entry: AwesomeEntry): string {
  const badges: string[] = [`[${esc(entry.category)}]`];
  if (entry.open_source) badges.push('[open]');
  if (entry.relationship !== 'official') badges.push('[community]');
  badges.push(entry.commercial ? '[commercial]' : '[non-commercial]');
  if (entry.open_to_contributions ?? true) badges.push('[open to contributions]');
  for (const lang of entry.language ?? []) badges.push(`[${esc(lang)}]`);

  const accent = LANG_COLORS[(entry.language ?? [])[0] ?? ''];
  const accentStyle = accent ? `--lang: ${accent[0]}; --lang-dark: ${accent[1]};` : '';
  const accentText = accent
    ? 'text-[color:var(--lang)] dark:text-[color:var(--lang-dark)]'
    : 'text-emphasis-secondary';
  const hoverBorder = accent
    ? 'hover:border-[color:var(--lang)] dark:hover:border-[color:var(--lang-dark)]'
    : 'hover:border-emphasis-secondary/60';
  const officialBadgeColor = accent
    ? 'border-[color:var(--lang)] text-[color:var(--lang)] dark:border-[color:var(--lang-dark)] dark:text-[color:var(--lang-dark)]'
    : 'border-emphasis-secondary text-emphasis-secondary';

  const maintainers = (entry.maintainers ?? [])
    .map(
      (handle) =>
        `<a href="https://github.com/${esc(handle.replace('@', ''))}" target="_blank" rel="noopener noreferrer" class="${accentText} hover:underline">${esc(handle)}</a>`,
    )
    .join(' · ');

  return `
			<div style="${accentStyle}" class="flex min-w-0 flex-col gap-3 border border-line bg-surface p-4 transition-colors ${hoverBorder}">
				<div class="flex items-center justify-between gap-2">
					<a href="${esc(entry.url)}" target="_blank" rel="noopener noreferrer" class="min-w-0 flex-1 truncate text-sm font-bold text-emphasis">${esc(entry.name)}</a>
					${entry.relationship === 'official' ? `<span class="shrink-0 border ${officialBadgeColor} px-1.5 py-0.5 text-xs font-bold">[official]</span>` : ''}
				</div>
				<p class="break-words text-sm leading-relaxed text-muted">${esc(entry.description)}</p>
				<div class="flex flex-wrap gap-1">${badges
          .map(
            (b) => `<span class="border border-line px-1.5 py-0.5 text-xs text-muted">${b}</span>`,
          )
          .join('')}</div>
				<div class="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-xs text-muted">
					<div class="flex items-center gap-2 ${accentText.replace('text-emphasis-secondary', 'text-muted')}">
						${entry.url && entry.url !== entry.repository ? `<a href="${esc(entry.url)}" target="_blank" rel="noopener noreferrer" class="hover:text-emphasis">[website]</a>` : ''}
						${entry.repository ? `<a href="${esc(entry.repository)}" target="_blank" rel="noopener noreferrer" class="hover:text-emphasis">[source]</a>` : ''}
					</div>
					${maintainers ? `<span>${maintainers}</span>` : ''}
				</div>
			</div>`;
}
