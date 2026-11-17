import TurndownService from 'turndown';

interface Context {
  request: Request;
  next: () => Promise<Response>;
}

const SKIP_PREFIXES = ['/_astro/', '/api/', '/.well-known/'];

function parseQuality(accept: string, type: string): number {
  for (const part of accept.split(',')) {
    const [rawType, ...params] = part.trim().split(';');
    if (rawType.trim().toLowerCase() !== type) continue;
    const q = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
    const value = q ? Number.parseFloat(q.slice(2)) : 1;
    return Number.isFinite(value) ? value : 0;
  }
  return 0;
}

function wantsMarkdown(accept: string): boolean {
  if (!accept) return false;
  const markdown = Math.max(
    parseQuality(accept, 'text/markdown'),
    parseQuality(accept, 'text/x-markdown'),
  );
  if (markdown <= 0) return false;
  return markdown >= parseQuality(accept, 'text/html');
}

function shouldSkip(pathname: string): boolean {
  if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true;
  if (pathname === '/mcp') return true;
  const lastSegment = pathname.split('/').pop() ?? '';
  return lastSegment.includes('.') && !lastSegment.endsWith('.html');
}

function toMarkdown(html: string, base: string): string {
  const cleaned = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, '')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, '');

  const turndown = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    hr: '---',
  });
  turndown.remove(['script', 'style', 'noscript']);

  const markdown = turndown.turndown(cleaned);
  return markdown
    .replace(/\]\((\/(?!\/)[^)\s]*)\)/g, (_, path: string) => `](${base}${path})`)
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .concat('\n');
}

export async function onRequest(context: Context): Promise<Response> {
  const { request } = context;
  if (request.method !== 'GET' && request.method !== 'HEAD') return context.next();

  const accept = request.headers.get('accept') ?? '';
  if (!wantsMarkdown(accept)) return context.next();

  const url = new URL(request.url);
  if (shouldSkip(url.pathname)) return context.next();

  const response = await context.next();
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('text/html')) return response;

  const html = await response.text();
  const markdown = toMarkdown(html, url.origin);
  const headers = new Headers(response.headers);
  headers.set('Content-Type', 'text/markdown; charset=utf-8');
  headers.set('x-markdown-tokens', String(Math.ceil(markdown.length / 4)));
  headers.set('x-markdown-tags', 'turndown');
  headers.delete('Content-Length');
  headers.append('Vary', 'Accept');

  return new Response(request.method === 'HEAD' ? null : markdown, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
