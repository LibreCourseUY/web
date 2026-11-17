const FEED_URL =
  'https://raw.githubusercontent.com/LibreCourseUY/awesome-librecourseuy/master/public/entries.json';
const CACHE_URL = 'https://librecourse.uy/api/feed';
const SERVER_INFO = {
  name: 'librecourseuy-site',
  title: 'LibreCourseUY',
  version: '1.0.0',
};
const SUPPORTED_PROTOCOLS = ['2025-06-18', '2025-03-26', '2024-11-05'];

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, MCP-Protocol-Version, Mcp-Session-Id',
  'Access-Control-Expose-Headers': 'MCP-Protocol-Version',
};

interface CatalogueEntry {
  name: string;
  url: string;
  description: string;
  category: string;
  tags?: string[];
  language?: string[];
  maintainers?: string[];
  license?: string | null;
  open_to_contributions?: boolean;
  open_source?: boolean;
  relationship?: string;
}

interface CatalogueFeed {
  categories?: string[];
  entries?: CatalogueEntry[];
}

interface JsonRpcRequest {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: Record<string, unknown>;
}

interface Context {
  request: Request;
  waitUntil: (promise: Promise<unknown>) => void;
}

const PAGES: Record<string, { url: string; description: string }> = {
  home: { url: 'https://librecourse.uy/', description: 'Community landing page' },
  projects: {
    url: 'https://librecourse.uy/projects/',
    description: 'Filterable catalogue of community projects',
  },
  showcase: {
    url: 'https://librecourse.uy/showcase/',
    description: 'Products built by community members',
  },
  orgs: {
    url: 'https://librecourse.uy/orgs/',
    description: 'Organisations in the LibreCourseUY ecosystem',
  },
  learn: {
    url: 'https://librecourse.uy/learn/',
    description: 'Learning guide: grow as a contributor through real projects',
  },
  contribute: {
    url: 'https://librecourse.uy/contribute/',
    description: 'Step-by-step contribution guide',
  },
  dco: {
    url: 'https://librecourse.uy/dco/',
    description: 'Developer Certificate of Origin text and sign-off rules',
  },
  'gpg-signature': {
    url: 'https://librecourse.uy/docs/gpg-signature/',
    description: 'Create a GPG key and sign commits',
  },
  docs: {
    url: 'https://librecourse.uy/docs/',
    description: 'Documentation index',
  },
};

const TOOLS = [
  {
    name: 'search_projects',
    title: 'Search LibreCourseUY projects',
    description:
      'Search the public LibreCourseUY catalogue by free text and optional filters. Returns matching project names, URLs, descriptions and contribution status.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            'Free text matched against name, description, tags, category and maintainers.',
        },
        category: { type: 'string', description: 'Exact category, for example "Web" or "APIs".' },
        language: { type: 'string', description: 'Programming language recorded on the entry.' },
        open_to_contributions: {
          type: 'boolean',
          description: 'Only return entries currently open to contributions.',
        },
        limit: {
          type: 'integer',
          minimum: 1,
          maximum: 50,
          description: 'Maximum results (default 10).',
        },
      },
      required: ['query'],
      additionalProperties: false,
    },
  },
  {
    name: 'list_categories',
    title: 'List catalogue categories',
    description: 'List the catalogue categories with how many entries each one holds.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'get_site_page',
    title: 'Find a LibreCourseUY page',
    description:
      'Resolve a logical page name (projects, showcase, learn, contribute, dco, gpg-signature, docs, orgs, home) to its URL and purpose.',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'string', enum: Object.keys(PAGES) },
      },
      required: ['page'],
      additionalProperties: false,
    },
  },
  {
    name: 'get_contribution_steps',
    title: 'Get the contribution checklist',
    description:
      'Return the hard requirements for contributing to a LibreCourseUY repository (DCO sign-off, GPG signing, Conventional Commits) and where to ask for help.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
];

async function loadFeed(context: Context): Promise<CatalogueFeed | null> {
  const cache = caches.default;
  const cached = await cache.match(CACHE_URL);
  if (cached) return (await cached.json()) as CatalogueFeed;

  const upstream = await fetch(FEED_URL).catch(() => null);
  if (!upstream?.ok) return null;

  const body = await upstream.text();
  context.waitUntil(
    cache.put(
      CACHE_URL,
      new Response(body, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300',
        },
      }),
    ),
  );
  try {
    return JSON.parse(body) as CatalogueFeed;
  } catch {
    return null;
  }
}

function textResult(text: string, isError = false) {
  return { content: [{ type: 'text', text }], isError };
}

function formatEntry(entry: CatalogueEntry): string {
  const bits = [entry.category];
  if (entry.language?.length) bits.push(entry.language.join(', '));
  if (entry.license) bits.push(entry.license);
  if (entry.open_to_contributions) bits.push('open to contributions');
  return `- ${entry.name} (${bits.join(' · ')})\n  ${entry.url}\n  ${entry.description}`;
}

async function searchProjects(args: Record<string, unknown>, context: Context) {
  const feed = await loadFeed(context);
  if (!feed?.entries?.length)
    return textResult('The catalogue feed is unavailable right now.', true);

  const query = String(args.query ?? '')
    .trim()
    .toLowerCase();
  if (!query) return textResult('A non-empty "query" is required.', true);

  const category = typeof args.category === 'string' ? args.category.toLowerCase() : '';
  const language = typeof args.language === 'string' ? args.language.toLowerCase() : '';
  const openOnly = args.open_to_contributions === true;
  const limit = Math.min(Math.max(Number(args.limit) || 10, 1), 50);

  const matches = feed.entries.filter((entry) => {
    if (category && entry.category?.toLowerCase() !== category) return false;
    if (openOnly && !entry.open_to_contributions) return false;
    if (language && !(entry.language ?? []).some((l) => l.toLowerCase() === language)) return false;
    const haystack = [
      entry.name,
      entry.description,
      entry.category,
      ...(entry.tags ?? []),
      ...(entry.maintainers ?? []),
      ...(entry.language ?? []),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(query);
  });

  if (!matches.length) {
    return textResult(`No catalogue entries matched "${args.query}". Try a broader term.`);
  }

  const shown = matches.slice(0, limit);
  const header = `${matches.length} match(es) for "${args.query}"${matches.length > shown.length ? `, showing ${shown.length}` : ''}:`;
  return textResult([header, ...shown.map(formatEntry)].join('\n'));
}

async function listCategories(context: Context) {
  const feed = await loadFeed(context);
  if (!feed) return textResult('The catalogue feed is unavailable right now.', true);
  const counts = new Map<string, number>();
  for (const entry of feed.entries ?? []) {
    if (!entry.category) continue;
    counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1);
  }
  const lines = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => `- ${name}: ${count}`);
  return textResult(
    [
      `${feed.entries?.length ?? 0} catalogue entries in ${lines.length} categories:`,
      ...lines,
    ].join('\n'),
  );
}

function getSitePage(args: Record<string, unknown>) {
  const page = String(args.page ?? '').trim();
  const match = PAGES[page];
  if (!match) {
    return textResult(
      `Unknown page "${page}". Known pages: ${Object.keys(PAGES).join(', ')}.`,
      true,
    );
  }
  return textResult(`${match.description}\n${match.url}`);
}

function getContributionSteps() {
  return textResult(
    [
      'Every LibreCourseUY repository enforces:',
      '1. DCO sign-off on every commit (git commit -s).',
      '2. GPG-signed commits (https://librecourse.uy/docs/gpg-signature/).',
      '3. Conventional Commits messages, e.g. "feat(ui): add org cards".',
      '',
      'Flow: fork or branch, commit with -s, push, open a pull request against the default branch.',
      'Read the repository CONTRIBUTING.md first; ask in Discord before large changes.',
      '',
      'Links:',
      `- Contribute: ${PAGES.contribute.url}`,
      `- DCO: ${PAGES.dco.url}`,
      '- Discord: https://librecourse.uy/join/',
      '- Issues: https://gitsion.librecourse.uy/issues',
    ].join('\n'),
  );
}

async function callTool(name: string, args: Record<string, unknown>, context: Context) {
  switch (name) {
    case 'search_projects':
      return searchProjects(args, context);
    case 'list_categories':
      return listCategories(context);
    case 'get_site_page':
      return getSitePage(args);
    case 'get_contribution_steps':
      return getContributionSteps();
    default:
      return textResult(`Unknown tool "${name}".`, true);
  }
}

async function handleMessage(
  message: JsonRpcRequest,
  context: Context,
): Promise<Record<string, unknown> | null> {
  const { id = null, method, params = {} } = message;
  const isNotification = message.id === undefined;

  if (typeof method !== 'string') {
    return { jsonrpc: '2.0', id, error: { code: -32600, message: 'Invalid Request' } };
  }

  if (method.startsWith('notifications/')) {
    return null;
  }

  switch (method) {
    case 'initialize': {
      const requested = typeof params.protocolVersion === 'string' ? params.protocolVersion : '';
      const protocolVersion = SUPPORTED_PROTOCOLS.includes(requested)
        ? requested
        : SUPPORTED_PROTOCOLS[0];
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion,
          capabilities: { tools: { listChanged: false } },
          serverInfo: SERVER_INFO,
          instructions:
            'Read-only access to the LibreCourseUY project catalogue and contribution guide. No authentication required.',
        },
      };
    }
    case 'ping':
      return { jsonrpc: '2.0', id, result: {} };
    case 'tools/list':
      return { jsonrpc: '2.0', id, result: { tools: TOOLS } };
    case 'tools/call': {
      const name = typeof params.name === 'string' ? params.name : '';
      const args = (params.arguments ?? {}) as Record<string, unknown>;
      if (!TOOLS.some((tool) => tool.name === name)) {
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32602, message: `Unknown tool "${name}"` },
        };
      }
      const result = await callTool(name, args, context);
      return { jsonrpc: '2.0', id, result };
    }
    case 'resources/list':
      return { jsonrpc: '2.0', id, result: { resources: [] } };
    case 'prompts/list':
      return { jsonrpc: '2.0', id, result: { prompts: [] } };
    default:
      if (isNotification) return null;
      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32601, message: `Method not found: ${method}` },
      };
  }
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...CORS,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'MCP-Protocol-Version': SUPPORTED_PROTOCOLS[0],
    },
  });
}

export async function onRequest(context: Context): Promise<Response> {
  const { request } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (request.method !== 'POST') {
    return new Response('method not allowed: use POST with a JSON-RPC body', {
      status: 405,
      headers: { ...CORS, Allow: 'POST, OPTIONS' },
    });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }, 400);
  }

  if (Array.isArray(payload)) {
    if (!payload.length) {
      return json(
        { jsonrpc: '2.0', id: null, error: { code: -32600, message: 'Invalid Request' } },
        400,
      );
    }
    const results = await Promise.all(
      payload.map((message) => handleMessage(message as JsonRpcRequest, context)),
    );
    const responses = results.filter((result) => result !== null);
    if (!responses.length) return new Response(null, { status: 202, headers: CORS });
    return json(responses);
  }

  if (!payload || typeof payload !== 'object') {
    return json(
      { jsonrpc: '2.0', id: null, error: { code: -32600, message: 'Invalid Request' } },
      400,
    );
  }

  const response = await handleMessage(payload as JsonRpcRequest, context);
  if (!response) return new Response(null, { status: 202, headers: CORS });
  return json(response);
}
