import { isAwesomeFeed, type AwesomeFeed } from '@/lib/awesome';

const UPSTREAM =
  'https://raw.githubusercontent.com/LibreCourseUY/awesome-librecourseuy/master/public/entries.json';

/**
 * Fetch the catalogue at build time so /projects/ and /orgs/ ship real content
 * instead of an empty shell. Returns null on failure and lets the page fall
 * back to the client-side fetch with its maintenance notice.
 */
export async function fetchCatalogueForBuild(): Promise<AwesomeFeed | null> {
  const url = import.meta.env.AWESOME_FEED_URL_BUILD || UPSTREAM;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { accept: 'application/json' },
    });
    if (!response.ok) {
      console.warn(`[catalogue] build fetch failed: HTTP ${response.status}`);
      return null;
    }
    const data = await response.json();
    if (!isAwesomeFeed(data)) {
      console.warn('[catalogue] build fetch returned an unexpected shape');
      return null;
    }
    return data;
  } catch (error) {
    console.warn(`[catalogue] build fetch failed: ${String(error)}`);
    return null;
  } finally {
    clearTimeout(timer);
  }
}
