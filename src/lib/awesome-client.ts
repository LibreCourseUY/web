import { isAwesomeFeed, type AwesomeFeed } from '@/lib/awesome';

const CACHE_KEY = 'awesome-feed';
export const AWESOME_FEED_URL = import.meta.env.PUBLIC_AWESOME_FEED_URL || '/api/feed';

let inflight: Promise<AwesomeFeed | null> | null = null;

function readCache(): AwesomeFeed | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isAwesomeFeed(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function fetchFeed(): Promise<AwesomeFeed | null> {
  try {
    const res = await fetch(AWESOME_FEED_URL, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const data = await res.json();
    return isAwesomeFeed(data) ? data : null;
  } catch {
    return null;
  }
}

// Network-first: the CDN caches the feed, so a fresh fetch is cheap and a
// hard refresh shows updates. sessionStorage is only the offline fallback.
export function loadAwesomeFeed(): Promise<AwesomeFeed | null> {
  if (inflight) return inflight;
  inflight = fetchFeed().then((feed) => {
    if (feed) {
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(feed));
      } catch {
        /* storage unavailable, ignore */
      }
      return feed;
    }
    return readCache();
  });
  return inflight;
}

export function prefetchAwesomeFeed(): void {
  void loadAwesomeFeed();
}
