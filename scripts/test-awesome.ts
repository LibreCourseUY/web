/**
 * Self-check for the awesome filtering helpers.
 * Run: node --experimental-strip-types scripts/test-awesome.ts
 */
import assert from 'node:assert/strict';
import { filterEntries, sortEntries, uniqueValues, type AwesomeEntry } from '../src/lib/awesome.ts';

const entries: AwesomeEntry[] = [
  {
    name: 'Alpha',
    url: 'https://a.example',
    description: 'A Python API',
    category: 'APIs',
    tags: ['api'],
    language: ['Python'],
    monetization: 'none',
    open_source: true,
    open_to_contributions: true,
  },
  {
    name: 'Beta',
    url: 'https://b.example',
    description: 'A Vue site',
    category: 'Web',
    tags: ['vue'],
    language: ['Vue'],
    monetization: 'paid',
    open_source: false,
    open_to_contributions: false,
  },
];

assert.equal(filterEntries(entries).length, 2);
assert.equal(filterEntries(entries, { query: 'python' }).length, 1);
assert.equal(filterEntries(entries, { categories: ['Web'] })[0].name, 'Beta');
assert.equal(filterEntries(entries, { openSource: true })[0].name, 'Alpha');
assert.equal(filterEntries(entries, { openToContributions: false })[0].name, 'Beta');
assert.equal(filterEntries(entries, { monetization: ['paid'] })[0].name, 'Beta');
assert.equal(filterEntries(entries, { languages: ['Vue'] })[0].name, 'Beta');
assert.equal(filterEntries(entries, { tags: ['api'] })[0].name, 'Alpha');
assert.equal(filterEntries(entries, { query: 'zzz' }).length, 0);
assert.deepEqual(
  sortEntries([entries[1], entries[0]]).map((e) => e.name),
  ['Alpha', 'Beta'],
);
assert.deepEqual(
  uniqueValues(entries, (e) => e.language ?? []),
  ['Python', 'Vue'],
);

console.log('awesome self-check ok');
