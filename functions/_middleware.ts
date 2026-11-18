// Content negotiation for AI agents: when a request asks for text/markdown,
// convert the rendered HTML into markdown. HTML stays the default.
//
// The converter is deliberately dependency-free (no DOM): Cloudflare Workers
// does not provide a DOM, and pulling one in costs bundle size and reliability.

interface Context {
  request: Request;
  next: () => Promise<Response>;
}

const SKIP_PREFIXES = ['/_astro/', '/api/', '/.well-known/'];
const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  mdash: '—',
  ndash: '–',
  hellip: '…',
  rsquo: '’',
  lsquo: '‘',
  ldquo: '“',
  rdquo: '”',
};

function decodeEntities(value: string): string {
  return value.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity: string) => {
    if (entity.startsWith('#')) {
      const code =
        entity[1] === 'x' || entity[1] === 'X'
          ? Number.parseInt(entity.slice(2), 16)
          : Number.parseInt(entity.slice(1), 10);
      return Number.isFinite(code) && code > 0 ? String.fromCodePoint(code) : match;
    }
    return ENTITIES[entity.toLowerCase()] ?? match;
  });
}

function absolute(href: string, origin: string): string {
  if (!href) return href;
  if (/^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(href)) return href;
  return href.startsWith('/') ? `${origin}${href}` : `${origin}/${href}`;
}

/**
 * Convert the body of an HTML document to markdown.
 * Intentionally simple: it targets the markup this site emits.
 */
export function htmlToMarkdown(html: string, origin: string): string {
  const body = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<![^>]*>/g, '')
    .replace(/<head\b[\s\S]*?<\/head>/gi, '')
    .replace(
      /<(script|style|noscript|svg|template|iframe|nav|footer|aside|button|select)\b[\s\S]*?<\/\1>/gi,
      '',
    );

  const out: string[] = [];
  const lists: Array<{ ordered: boolean; index: number }> = [];
  const linkStack: string[] = [];
  let inPre = false;
  let preBuffer = '';
  let inTitle = false;

  const block = (): void => {
    if (!out.length) return;
    out.push('\n\n');
  };

  const text = (value: string): void => {
    if (!value) return;
    const decoded = inPre ? value : decodeEntities(value).replace(/\s+/g, ' ');
    if (inTitle) return;
    out.push(decoded);
  };

  const tagPattern = /<\/?([a-zA-Z][\w:-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>|([^<]+)/g;
  let match: RegExpExecArray | null;

  while ((match = tagPattern.exec(body)) !== null) {
    const [raw, tagName, rawAttrs, rawText] = match;

    if (inPre) {
      if (rawText !== undefined) {
        preBuffer += rawText;
        continue;
      }
      if (tagName.toLowerCase() === 'pre' && raw.startsWith('</')) {
        inPre = false;
        block();
        const code = decodeEntities(preBuffer.replace(/<[^>]+>/g, ''))
          .replace(/^\n+/, '')
          .replace(/\n+$/, '');
        out.push(`\`\`\`\n${code}\n\`\`\`\n\n`);
        preBuffer = '';
      }
      continue;
    }

    if (rawText !== undefined) {
      text(rawText);
      continue;
    }

    const tag = tagName.toLowerCase();
    const closing = raw.startsWith('</');
    const attrs = rawAttrs ?? '';
    const attr = (name: string): string => {
      const found = attrs.match(
        new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'),
      );
      return found ? decodeEntities(found[1] ?? found[2] ?? found[3] ?? '') : '';
    };

    if (tag === 'pre') {
      if (!closing) {
        block();
        inPre = true;
        preBuffer = '';
      }
      continue;
    }
    if (tag === 'title') {
      inTitle = !closing;
      continue;
    }

    if (/^h[1-6]$/.test(tag)) {
      if (!closing) {
        block();
        out.push(`${'#'.repeat(Number(tag[1]))} `);
      } else {
        block();
      }
      continue;
    }

    switch (tag) {
      case 'ul':
      case 'ol':
        block();
        if (!closing) lists.push({ ordered: tag === 'ol', index: 0 });
        else lists.pop();
        continue;
      case 'li': {
        if (closing) continue;
        const list = lists[lists.length - 1];
        const indent = '  '.repeat(Math.max(0, lists.length - 1));
        if (!list) {
          out.push(`${indent}- `);
        } else if (list.ordered) {
          list.index += 1;
          out.push(`\n${indent}${list.index}. `);
        } else {
          out.push(`\n${indent}- `);
        }
        continue;
      }
      case 'a':
        if (!closing) {
          out.push('[');
          linkStack.push(attr('href'));
        } else {
          const href = linkStack.pop() ?? '';
          out.push(href ? `](${absolute(href, origin)})` : ']');
        }
        continue;
      case 'strong':
      case 'b':
        out.push('**');
        continue;
      case 'em':
      case 'i':
        out.push('*');
        continue;
      case 'code':
        out.push('`');
        continue;
      case 'br':
        out.push('\n');
        continue;
      case 'hr':
        block();
        out.push('---');
        block();
        continue;
      case 'img':
        out.push(`![${attr('alt')}](${absolute(attr('src'), origin)})`);
        continue;
      case 'td':
      case 'th':
        if (closing) out.push(' | ');
        continue;
      case 'tr':
        block();
        continue;
      case 'p':
      case 'div':
      case 'section':
      case 'article':
      case 'main':
      case 'header':
      case 'blockquote':
      case 'figure':
      case 'table':
      case 'dl':
      case 'dt':
      case 'dd':
        block();
        continue;
      default:
        if (VOID_ELEMENTS.has(tag) && !closing) continue;
        continue;
    }
  }

  return decodeEntities(
    out
      .join('')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/^[ \t]+/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/^\s+/, '')
      .trimEnd()
      .concat('\n'),
  );
}

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

export async function onRequest(context: Context): Promise<Response> {
  const { request } = context;

  // One canonical host: www duplicates every URL.
  const url = new URL(request.url);
  if (url.hostname === 'www.librecourse.uy') {
    url.hostname = 'librecourse.uy';
    return Response.redirect(url.toString(), 301);
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') return context.next();

  if (!wantsMarkdown(request.headers.get('accept') ?? '')) return context.next();

  if (shouldSkip(url.pathname)) return context.next();

  const response = await context.next();
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('text/html')) return response;

  const markdown = htmlToMarkdown(await response.text(), url.origin);
  const headers = new Headers(response.headers);
  headers.set('Content-Type', 'text/markdown; charset=utf-8');
  headers.set('x-markdown-tokens', String(Math.ceil(markdown.length / 4)));
  headers.delete('Content-Length');
  headers.append('Vary', 'Accept');

  return new Response(request.method === 'HEAD' ? null : markdown, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
