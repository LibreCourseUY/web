const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'Access-Control-Allow-Origin': '*',
};

interface Context {
  request: Request;
}

export async function onRequest({ request }: Context): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('method not allowed', {
      status: 405,
      headers: { Allow: 'GET, HEAD' },
    });
  }

  return new Response(
    JSON.stringify({
      status: 'ok',
      service: 'librecourse.uy',
      time: new Date().toISOString(),
    }),
    { headers: HEADERS },
  );
}
