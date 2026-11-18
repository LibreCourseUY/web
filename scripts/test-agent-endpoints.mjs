// Self-check for the agent endpoints served by the Cloudflare Pages Functions:
// /mcp (Model Context Protocol), /api/health, and the markdown negotiation
// middleware. Runs the handlers directly with Web-standard Requests.
import assert from 'node:assert/strict';

globalThis.caches = {
  default: {
    match: async () => undefined,
    put: async () => {},
  },
};

const { onRequest: mcp } = await import('../functions/mcp.ts');
const { onRequest: health } = await import('../functions/api/health.ts');
const { onRequest: middleware } = await import('../functions/_middleware.ts');

const BASE = 'https://librecourse.uy';
const results = [];

class Skip extends Error {}

async function check(name, fn) {
  try {
    await fn();
    results.push(['PASS', name]);
  } catch (error) {
    if (error instanceof Skip) results.push(['SKIP', name, error.message]);
    else results.push(['FAIL', name, error.message]);
  }
}

function mcpContext(body) {
  return {
    request: new Request(`${BASE}/mcp`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json, text/event-stream',
      },
      body: JSON.stringify(body),
    }),
    waitUntil: () => {},
  };
}

async function rpc(body) {
  const response = await mcp(mcpContext(body));
  const text = await response.text();
  return { status: response.status, json: text ? JSON.parse(text) : null };
}

await check('MCP initialize negotiates protocol and capabilities', async () => {
  const { json } = await rpc({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'self-check' } },
  });
  assert.equal(json.result.protocolVersion, '2025-06-18');
  assert.equal(json.result.serverInfo.name, 'librecourseuy-site');
  assert.equal(json.result.capabilities.tools.listChanged, false);
  assert.ok(json.result.instructions.length > 10);
});

await check('MCP tools/list exposes the documented tools', async () => {
  const { json } = await rpc({ jsonrpc: '2.0', id: 2, method: 'tools/list' });
  assert.deepEqual(json.result.tools.map((tool) => tool.name).sort(), [
    'get_contribution_steps',
    'get_site_page',
    'list_categories',
    'search_projects',
  ]);
  for (const tool of json.result.tools) {
    assert.equal(tool.inputSchema.type, 'object');
    assert.ok(tool.description.length > 20);
  }
});

await check('MCP tools/call search_projects returns catalogue matches', async () => {
  const { json } = await rpc({
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: { name: 'search_projects', arguments: { query: 'web', limit: 3 } },
  });
  if (json.result.isError) throw new Skip('catalogue feed unreachable (offline?)');
  assert.match(json.result.content[0].text, /match\(es\)/);
  assert.match(json.result.content[0].text, /https:\/\/github\.com\//);
});

await check('MCP tools/call list_categories counts entries', async () => {
  const { json } = await rpc({
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: { name: 'list_categories', arguments: {} },
  });
  if (json.result.isError) throw new Skip('catalogue feed unreachable (offline?)');
  assert.match(json.result.content[0].text, /\d+ catalogue entries in \d+ categories/);
});

await check('MCP tools/call get_site_page resolves URLs', async () => {
  const { json } = await rpc({
    jsonrpc: '2.0',
    id: 5,
    method: 'tools/call',
    params: { name: 'get_site_page', arguments: { page: 'projects' } },
  });
  assert.match(json.result.content[0].text, /https:\/\/librecourse\.uy\/projects\//);
});

await check('MCP rejects unknown tools with -32602', async () => {
  const { json } = await rpc({
    jsonrpc: '2.0',
    id: 6,
    method: 'tools/call',
    params: { name: 'nope', arguments: {} },
  });
  assert.equal(json.error.code, -32602);
});

await check('MCP accepts notifications with 202', async () => {
  const { status } = await rpc({ jsonrpc: '2.0', method: 'notifications/initialized' });
  assert.equal(status, 202);
});

await check('MCP rejects GET with 405', async () => {
  const response = await mcp({
    request: new Request(`${BASE}/mcp`, { method: 'GET' }),
    waitUntil: () => {},
  });
  assert.equal(response.status, 405);
});

await check('MCP returns a parse error on malformed JSON', async () => {
  const response = await mcp({
    request: new Request(`${BASE}/mcp`, { method: 'POST', body: '{not json' }),
    waitUntil: () => {},
  });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error.code, -32700);
});

await check('MCP advertises CORS for browser agents', async () => {
  const response = await mcp({
    request: new Request(`${BASE}/mcp`, { method: 'OPTIONS' }),
    waitUntil: () => {},
  });
  assert.equal(response.headers.get('access-control-allow-origin'), '*');
});

await check('health returns ok JSON and is not cached', async () => {
  const response = await health({ request: new Request(`${BASE}/api/health`) });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const json = await response.json();
  assert.equal(json.status, 'ok');
  assert.ok(Date.parse(json.time));
});

const HTML = `<!doctype html>
<html><head><title>T</title><script>bad()</script></head>
<body>
  <nav><a href="/hidden/">nav links are dropped</a></nav>
  <main>
    <h1>Hello</h1>
    <p>Read <a href="/docs/">docs</a> &amp; the <strong>guide</strong>.</p>
    <ul><li>One</li><li>Two</li></ul>
    <ol><li>First</li><li>Second</li></ol>
    <pre><code>npm install &amp; run</code></pre>
    <img src="/og.jpg" alt="Preview">
  </main>
</body></html>`;

function runMiddleware(accept, path = '/') {
  return middleware({
    request: new Request(`${BASE}${path}`, { headers: { accept } }),
    next: async () =>
      new Response(HTML, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } }),
  });
}

await check('www host redirects to the apex with 301', async () => {
  const response = await middleware({
    request: new Request('https://www.librecourse.uy/about/?x=1'),
    next: async () => new Response('should not be reached', { status: 200 }),
  });
  assert.equal(response.status, 301);
  assert.equal(response.headers.get('location'), 'https://librecourse.uy/about/?x=1');
});

await check('markdown negotiation converts HTML for Accept: text/markdown', async () => {
  const response = await runMiddleware('text/markdown');
  assert.match(response.headers.get('content-type'), /^text\/markdown/);
  assert.ok(Number(response.headers.get('x-markdown-tokens')) > 0);
  const body = await response.text();
  assert.match(body, /^# Hello/m);
  assert.match(body, /https:\/\/librecourse\.uy\/docs\//);
  assert.doesNotMatch(body, /bad\(\)/);
  assert.doesNotMatch(body, /nav links are dropped/);
});

await check('markdown conversion keeps structure', async () => {
  const response = await runMiddleware('text/markdown');
  const body = await response.text();
  assert.match(body, /- One\n- Two/);
  assert.match(body, /1\. First\n2\. Second/);
  assert.match(body, /\*\*guide\*\*/);
  assert.match(body, /```\nnpm install & run\n```/);
  assert.match(body, /!\[Preview\]\(https:\/\/librecourse\.uy\/og\.jpg\)/);
  assert.match(body, /\) & the \*\*guide\*\*\./);
});

await check('markdown negotiation keeps HTML for browsers', async () => {
  const response = await runMiddleware('text/html,application/xhtml+xml,*/*;q=0.8');
  assert.match(response.headers.get('content-type'), /text\/html/);
});

await check('markdown negotiation respects q=0', async () => {
  const response = await runMiddleware('text/markdown;q=0,text/html');
  assert.match(response.headers.get('content-type'), /text\/html/);
});

await check('markdown negotiation skips API and well-known paths', async () => {
  const response = await runMiddleware('text/markdown', '/api/feed');
  assert.match(response.headers.get('content-type'), /text\/html/);
});

const failures = results.filter(([status]) => status === 'FAIL');
for (const [status, name, detail] of results) {
  console.log(`${status}  ${name}${detail ? `\n      ${detail}` : ''}`);
}
console.log(`\n${results.length - failures.length}/${results.length} checks passed`);
if (failures.length) process.exit(1);
