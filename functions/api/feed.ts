const FEED_URL =
	'https://raw.githubusercontent.com/LibreCourseUY/awesome-librecourseuy/master/public/entries.json';
const CACHE_URL = 'https://librecourse.uy/api/feed';
const HEADERS = {
	'Content-Type': 'application/json',
	'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
};

interface Context {
	request: Request;
	waitUntil: (promise: Promise<unknown>) => void;
}

export async function onRequest({ request, waitUntil }: Context): Promise<Response> {
	if (request.method !== 'GET') {
		return new Response('method not allowed', { status: 405 });
	}

	const cache = caches.default;
	const cached = await cache.match(CACHE_URL);
	if (cached) {
		const headers = new Headers(cached.headers);
		headers.set('X-Feed-Cache', 'HIT');
		return new Response(cached.body, { headers });
	}

	const upstream = await fetch(FEED_URL).catch(() => null);
	if (!upstream?.ok) {
		return new Response('feed unavailable', { status: 502 });
	}

	const body = await upstream.text();
	waitUntil(cache.put(CACHE_URL, new Response(body, { headers: HEADERS })));
	return new Response(body, { headers: { ...HEADERS, 'X-Feed-Cache': 'MISS' } });
}
