export interface AwesomeEntry {
  name: string;
  url: string;
  description: string;
  category: string;
  tags?: string[];
  language?: string[];
  maintainers?: string[];
  license?: string | null;
  commercial?: boolean;
  open_source: boolean;
  relationship?: 'official' | 'community';
  repository?: string | null;
  open_to_contributions?: boolean;
}

export interface AwesomeOrg {
  name: string;
  url: string;
  description: string;
  tags?: string[];
  repository: string;
  relationship?: 'official' | 'community';
  color?: { light: string; dark: string };
}

export interface AwesomeFeed {
  categories: string[];
  orgs?: AwesomeOrg[];
  entries: AwesomeEntry[];
}

export interface AwesomeFilters {
  query?: string;
  categories?: string[];
  commercial?: boolean | null;
  languages?: string[];
  openToContributions?: boolean | null;
  tags?: string[];
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function matchesQuery(entry: AwesomeEntry, query: string): boolean {
  const q = normalize(query);
  if (!q) return true;
  const haystack = normalize(
    [
      entry.name,
      entry.description,
      entry.category,
      ...(entry.tags ?? []),
      ...(entry.maintainers ?? []),
    ].join(' '),
  );
  return q.split(/\s+/).every((token) => haystack.includes(token));
}

function includesAny(values: string[], selected: string[]): boolean {
  if (!selected.length) return true;
  return selected.some((value) => values.includes(value));
}

export function filterEntries(
  entries: AwesomeEntry[],
  filters: AwesomeFilters = {},
): AwesomeEntry[] {
  const {
    query = '',
    categories = [],
    commercial = null,
    languages = [],
    openToContributions = null,
    tags = [],
  } = filters;

  return entries.filter((entry) => {
    if (!matchesQuery(entry, query)) return false;
    if (categories.length && !categories.includes(entry.category)) return false;
    if (
      openToContributions !== null &&
      (entry.open_to_contributions ?? true) !== openToContributions
    )
      return false;
    if (commercial !== null && (entry.commercial ?? false) !== commercial) return false;
    if (!includesAny(entry.language ?? [], languages)) return false;
    if (!includesAny(entry.tags ?? [], tags)) return false;
    return true;
  });
}

export function sortEntries(entries: AwesomeEntry[]): AwesomeEntry[] {
  // Non-commercial first (the page groups by category, so this orders
  // within each category), then alphabetically.
  return [...entries].sort(
    (a, b) =>
      Number(a.commercial ?? false) - Number(b.commercial ?? false) ||
      a.name.localeCompare(b.name, 'en'),
  );
}

export function uniqueValues(
  entries: AwesomeEntry[],
  pick: (entry: AwesomeEntry) => string[],
): string[] {
  const seen = new Set<string>();
  for (const entry of entries) {
    for (const value of pick(entry)) seen.add(value);
  }
  return [...seen].sort((a, b) => a.localeCompare(b, 'en'));
}

function shuffle<T>(items: T[]): T[] {
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

/**
 * Pick `count` entries, preferring distinct `key` values. Entries whose key is
 * null (e.g. several maintainers) are deferred and only used to backfill.
 */
export function pickDiverse<T>(
  items: T[],
  count: number,
  key: (item: T) => string | null,
): T[] {
  if (count <= 0) return [];
  const picked: T[] = [];
  const deferred: T[] = [];
  const used = new Set<string>();
  for (const item of shuffle(items)) {
    const value = key(item);
    if (value === null || used.has(value)) {
      deferred.push(item);
      continue;
    }
    used.add(value);
    picked.push(item);
    if (picked.length >= count) return picked;
  }
  for (const item of deferred) {
    if (picked.length >= count) break;
    picked.push(item);
  }
  return picked;
}

export function isAwesomeFeed(value: unknown): value is AwesomeFeed {
  if (!value || typeof value !== 'object') return false;
  const feed = value as Record<string, unknown>;
  return (
    Array.isArray(feed.entries) &&
    Array.isArray(feed.categories) &&
    (feed.orgs === undefined || Array.isArray(feed.orgs))
  );
}
