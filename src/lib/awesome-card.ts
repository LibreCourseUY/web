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
