const FEED_URL =
	'https://raw.githubusercontent.com/LibreCourseUY/awesome-librecourseuy/master/public/entries.json';
const CACHE_URL = 'https://librecourse.uy/api/feed';

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
		return cached;
	}

	const upstream = await fetch(FEED_URL);
	if (!upstream.ok) {
		return new Response('feed unavailable', { status: 502 });
	}

	const response = new Response(upstream.body, {
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
		},
	});
	waitUntil(cache.put(CACHE_URL, response.clone()));
	return response;
}
