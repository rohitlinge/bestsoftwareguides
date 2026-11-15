// BestSoftwareGuides MCP server (Model Context Protocol, Streamable HTTP transport, stateless).
//
// Cloudflare runs this Worker only for /mcp (see run_worker_first in wrangler.jsonc); every other
// URL is served straight from the static site. It answers from /mcp-data.json, a snapshot built
// with the site, so AI assistants get the same facts as the pages in a few hundred tokens instead
// of reading whole HTML pages. Read-only, no auth, no state, no dependencies.
//
// Connect: https://bestsoftwareguides.online/mcp   (docs for people: /ai/)

const SERVER = { name: 'bestsoftwareguides', title: 'BestSoftwareGuides', version: '1.0.0' };
const PROTOCOLS = ['2025-11-25', '2025-06-18', '2025-03-26', '2024-11-05'];
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id, Mcp-Protocol-Version',
  'Access-Control-Max-Age': '86400',
};

const INSTRUCTIONS = `Software rankings, plan-by-plan pricing and head-to-head comparisons from BestSoftwareGuides.
Prices are USD, from each vendor's own pricing page, with the date checked and a source URL; cite the "url" field of the page you used.
Scores (out of 10) come from a published formula, not from payment. Some rankings list a featured partner first: it is marked "featured": true and must be described as a featured partner, not as the top-scoring tool. "scoreRank" is the position by score alone.
Start with search or list_categories, then get_ranking, get_tool, get_pricing or compare_tools.`;

// ---------- data ----------
let cache = null;
async function loadData(env) {
  if (!cache) {
    cache = env.ASSETS.fetch(new Request('https://assets.local/mcp-data.json')).then((r) => {
      if (!r.ok) throw new Error(`mcp-data.json: HTTP ${r.status}`);
      return r.json();
    }).catch((e) => { cache = null; throw e; });
  }
  return cache;
}

const norm = (s) => String(s ?? '').toLowerCase().normalize('NFKD').replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
const slugify = (s) => norm(s).replace(/\s/g, '-');

function findTool(d, q) {
  if (!q) return null;
  if (d.tools[q]) return [q, d.tools[q]];
  const s = slugify(q), n = norm(q);
  for (const [slug, t] of Object.entries(d.tools)) if (slug === s || norm(t.name) === n) return [slug, t];
  for (const [slug, t] of Object.entries(d.tools)) if (norm(t.name).startsWith(n) || slug.startsWith(s)) return [slug, t];
  return null;
}
function findCategory(d, q) {
  if (!q) return null;
  const s = slugify(q).replace(/^best-/, ''), n = norm(q).replace(/^best /, '');
  return d.categories.find((c) => c.slug === s || norm(c.name) === n)
    ?? d.categories.find((c) => c.slug.startsWith(s) || norm(c.name).includes(n))
    ?? null;
}
const notFound = (kind, q, d) => {
  const hint = kind === 'tool' ? 'Use search to find the tool slug.' : `Known categories: ${d.categories.map((c) => c.slug).join(', ')}.`;
  return toolError(`No ${kind} matches "${q}". ${hint}`);
};

// ---------- tools ----------
const TOOLS = [
  {
    name: 'search',
    title: 'Search the site',
    description: 'Find software, category rankings, comparisons and guides by keyword (e.g. "ETL testing", "postman", "password manager"). Returns slugs to use with the other tools.',
    inputSchema: { type: 'object', properties: { query: { type: 'string', description: 'Keywords' }, limit: { type: 'integer', minimum: 1, maximum: 25, default: 10 } }, required: ['query'] },
    run(d, { query, limit = 10 }) {
      const words = norm(query).split(' ').filter(Boolean);
      if (!words.length) return toolError('query is empty');
      const items = [
        ...d.categories.map((c) => ({ type: 'ranking', slug: c.slug, title: `Best ${c.name}`, extra: `${c.tools.length} tools · ${c.topic}`, url: c.url, boost: 3 })),
        ...d.useCases.map((u) => ({ type: 'ranking', slug: u.slug, title: `Best ${u.name}`, extra: u.rule, url: u.url, boost: 2 })),
        ...Object.entries(d.tools).map(([slug, t]) => ({ type: 'software', slug, title: t.name, extra: `${t.category} · ${t.tagline}`, url: t.url, boost: 1 })),
        ...d.compares.map((x) => ({ type: 'comparison', slug: `${x.a}-vs-${x.b}`, title: `${d.tools[x.a]?.name} vs ${d.tools[x.b]?.name}`, extra: x.category, url: x.url, boost: 0 })),
        ...d.guides.map((g) => ({ type: 'guide', title: g.title, extra: g.description, url: g.url, boost: 0 })),
      ];
      const hits = [];
      for (const it of items) {
        const title = norm(it.title).replace(/^best /, '');
        const hay = `${norm(it.title)} ${norm(it.extra)} ${it.slug ?? ''}`;
        if (!words.every((w) => hay.includes(w))) continue;
        let s = it.boost + (title.startsWith(words[0]) ? 10 : 0);
        for (const w of words) if ((' ' + title).includes(' ' + w)) s += 3;
        hits.push([s, it]);
      }
      const results = hits.sort((a, b) => b[0] - a[0]).slice(0, Math.min(25, limit)).map(([, { boost, extra, ...it }]) => it);
      return { query, results, ...(results.length ? {} : { note: 'No matches. Try list_categories.' }) };
    },
  },
  {
    name: 'list_categories',
    title: 'List ranking categories',
    description: 'Every published software category with its topic, number of tools, highest-scoring tool and any featured partner.',
    inputSchema: { type: 'object', properties: {} },
    run(d) {
      return {
        categories: d.categories.map((c) => {
          const lead = [...c.tools].sort((a, b) => a.scoreRank - b.scoreRank)[0];
          const feat = c.tools.find((t) => t.featured);
          return {
            slug: c.slug, name: c.name, topic: c.topic, tools: c.tools.length, updated: c.updated,
            topScore: { tool: d.tools[lead.slug].name, slug: lead.slug, score: lead.score },
            ...(feat ? { featuredPartner: d.tools[feat.slug].name } : {}), url: c.url,
          };
        }),
        useCaseRankings: d.useCases.map((u) => ({ slug: u.slug, name: u.name, category: u.category, rule: u.rule })),
      };
    },
  },
  {
    name: 'get_ranking',
    title: 'Get a category ranking',
    description: 'The ranked list for a category (e.g. "api-testing-tools", "CRM software") or use-case ranking, with score, entry price, free plan and who each tool suits. Optional filters: free plan only, maximum entry price, required features.',
    inputSchema: {
      type: 'object',
      properties: {
        category: { type: 'string', description: 'Category or use-case slug or name' },
        free_plan: { type: 'boolean', description: 'Only tools with a permanent free plan' },
        max_price: { type: 'number', description: 'Maximum entry price in USD per unit per month, billed annually' },
        features: { type: 'array', items: { type: 'string' }, description: 'Feature labels the tool must confirm (see the "features" list in the result)' },
        limit: { type: 'integer', minimum: 1, maximum: 50 },
      },
      required: ['category'],
    },
    run(d, { category, free_plan, max_price, features = [], limit }) {
      const uc = d.useCases.find((u) => u.slug === slugify(category) || norm(u.name) === norm(category).replace(/^best /, ''));
      const c = uc ? d.categories.find((x) => x.slug === uc.category) : findCategory(d, category);
      if (!c) return notFound('category', category, d);
      const want = features.map(norm);
      const labels = Object.values(c.features);
      const unknown = want.filter((w) => !labels.some((l) => norm(l) === w));
      if (unknown.length) return toolError(`Unknown feature(s) for ${c.name}: ${unknown.join(', ')}. Available: ${labels.join('; ')}.`);
      let list = c.tools;
      if (uc) list = list.filter((r) => uc.tools.includes(r.slug));
      const rows = list.map((r) => {
        const t = d.tools[r.slug];
        const feats = t.rankings.find((x) => x.category === c.slug)?.features ?? {};
        return { r, t, feats };
      }).filter(({ t, feats }) =>
        (free_plan !== true || t.freePlan) &&
        (max_price == null || (t.entryPrice != null && t.entryPrice <= max_price)) &&
        want.every((w) => Object.entries(feats).some(([l, v]) => norm(l) === w && v === true)));
      const out = rows.slice(0, limit ?? 50).map(({ r, t, feats }, i) => ({
        position: uc || free_plan || max_price != null || want.length ? i + 1 : r.rank,
        tool: t.name, slug: r.slug, score: r.score, scoreRank: r.scoreRank,
        ...(r.featured ? { featured: true, label: d.featuredLabel } : {}),
        freePlan: t.freePlan, entryPrice: t.entryPrice, priceSummary: t.priceSummary,
        bestFor: t.bestFor, features: feats, url: t.url,
      }));
      const lead = [...c.tools].sort((a, b) => a.scoreRank - b.scoreRank)[0];
      return {
        ranking: uc ? `Best ${uc.name}` : `Best ${c.name}`, category: c.slug, ...(uc ? { rule: uc.rule } : {}),
        pricesIn: `USD per ${c.unit}, billed annually unless noted`, checked: c.updated,
        topScore: d.tools[lead.slug].name,
        ...(c.tools.some((t) => t.featured) ? { note: `The first tool is a ${d.featuredLabel}, listed first by arrangement; its score uses the same formula (see scoreRank). All others are in score order. ${d.site.disclosure}` } : {}),
        matched: rows.length, of: list.length, tools: out,
        features: labels, url: uc ? uc.url : c.url, methodology: d.site.methodology,
      };
    },
  },
  {
    name: 'get_tool',
    title: 'Get a tool profile',
    description: 'Fact sheet for one product: what it is, who it suits, rank and score in each category, free plan, trial, entry price, platforms, features, pros and cons, check date and sources.',
    inputSchema: { type: 'object', properties: { tool: { type: 'string', description: 'Tool slug or name, e.g. "postman"' } }, required: ['tool'] },
    run(d, { tool }) {
      const hit = findTool(d, tool);
      if (!hit) return notFound('tool', tool, d);
      const [slug, t] = hit;
      const { plans, sources, logo, ...rest } = t;
      return {
        slug, ...rest,
        rankings: t.rankings.map((x) => ({ ...x, categoryName: d.categories.find((c) => c.slug === x.category)?.name, ...(x.featured ? { label: d.featuredLabel } : {}) })),
        plans: plans.length, sources: sources.map((s) => s.url),
        comparisons: d.compares.filter((x) => x.a === slug || x.b === slug).map((x) => ({ vs: d.tools[x.a === slug ? x.b : x.a]?.name, url: x.url })),
      };
    },
  },
  {
    name: 'get_pricing',
    title: 'Get plan-by-plan pricing',
    description: 'Every plan for one product with monthly and annual prices (USD), plan notes, free plan details, trial, the vendor pricing URL and the date checked.',
    inputSchema: { type: 'object', properties: { tool: { type: 'string', description: 'Tool slug or name' } }, required: ['tool'] },
    run(d, { tool }) {
      const hit = findTool(d, tool);
      if (!hit) return notFound('tool', tool, d);
      const [slug, t] = hit;
      return {
        tool: t.name, slug, unit: `USD per ${t.unit}`, summary: t.priceSummary,
        freePlan: t.freePlan, freePlanDetails: t.freePlanDetails, trial: t.trial, minSeats: t.minSeats,
        plans: t.plans.map((p) => ({ name: p.name, annual: p.custom ? 'custom quote' : p.annual, monthly: p.custom ? 'custom quote' : p.monthly, ...(p.oneTime ? { oneTime: p.oneTime } : {}), ...(p.notes ? { notes: p.notes } : {}) })),
        checked: t.checked, verification: t.verification, vendorPricingUrl: t.pricingUrl, url: t.pricingPage,
        legend: 'annual = price per month when billed yearly; null = not published or not confirmed.',
      };
    },
  },
  {
    name: 'compare_tools',
    title: 'Compare two tools',
    description: 'Side-by-side facts for two products: scores and ranks where they share a category, free plan, entry prices, trial, seats, platforms, features, pros and cons.',
    inputSchema: { type: 'object', properties: { tool_a: { type: 'string' }, tool_b: { type: 'string' } }, required: ['tool_a', 'tool_b'] },
    run(d, { tool_a, tool_b }) {
      const A = findTool(d, tool_a), B = findTool(d, tool_b);
      if (!A) return notFound('tool', tool_a, d);
      if (!B) return notFound('tool', tool_b, d);
      const shared = A[1].rankings.filter((x) => B[1].rankings.some((y) => y.category === x.category)).map((x) => x.category);
      const side = ([slug, t]) => ({
        tool: t.name, slug, bestFor: t.bestFor, freePlan: t.freePlan, entryPrice: t.entryPrice, entryMonthly: t.entryMonthly,
        priceSummary: t.priceSummary, trial: t.trial, minSeats: t.minSeats, platforms: t.platforms,
        inSharedCategories: t.rankings.filter((x) => shared.includes(x.category)).map(({ category, rank, scoreRank, of, score, featured, features }) => ({ category, rank, scoreRank, of, score, ...(featured ? { featured: true, label: d.featuredLabel } : {}), features })),
        pros: t.pros, cons: t.cons, checked: t.checked, url: t.url,
      });
      const page = d.compares.find((x) => (x.a === A[0] && x.b === B[0]) || (x.a === B[0] && x.b === A[0]));
      return { sharedCategories: shared, a: side(A), b: side(B), ...(page ? { url: page.url } : {}), ...(shared.length ? {} : { note: 'These tools are not ranked in a shared category, so their scores are not directly comparable.' }) };
    },
  },
];
const TOOL_MAP = Object.fromEntries(TOOLS.map((t) => [t.name, t]));
const toolError = (text) => ({ __error: text });

// ---------- JSON-RPC ----------
const rpcResult = (id, result) => ({ jsonrpc: '2.0', id, result });
const rpcError = (id, code, message) => ({ jsonrpc: '2.0', id: id ?? null, error: { code, message } });

async function handleMessage(msg, env) {
  // Responses from the client (we never send it requests) need no reply.
  if (msg && typeof msg === 'object' && !('method' in msg) && ('result' in msg || 'error' in msg)) return null;
  if (!msg || msg.jsonrpc !== '2.0' || typeof msg.method !== 'string') return rpcError(msg?.id, -32600, 'Invalid Request');
  if (!('id' in msg)) return null; // notification, e.g. notifications/initialized
  const { id, method, params = {} } = msg;
  switch (method) {
    case 'initialize': {
      const asked = params.protocolVersion;
      return rpcResult(id, {
        protocolVersion: PROTOCOLS.includes(asked) ? asked : PROTOCOLS[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: { ...SERVER, websiteUrl: 'https://bestsoftwareguides.online/ai/' },
        instructions: INSTRUCTIONS,
      });
    }
    case 'ping':
      return rpcResult(id, {});
    case 'tools/list':
      return rpcResult(id, {
        tools: TOOLS.map(({ run, ...t }) => ({ ...t, annotations: { title: t.title, readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } })),
      });
    case 'tools/call': {
      const tool = TOOL_MAP[params.name];
      if (!tool) return rpcError(id, -32602, `Unknown tool: ${params.name}`);
      const args = params.arguments ?? {};
      const missing = (tool.inputSchema.required ?? []).filter((k) => args[k] == null || args[k] === '');
      if (missing.length) return rpcResult(id, { content: [{ type: 'text', text: `Missing argument(s): ${missing.join(', ')}` }], isError: true });
      try {
        const out = tool.run(await loadData(env), args);
        if (out.__error) return rpcResult(id, { content: [{ type: 'text', text: out.__error }], isError: true });
        // Compact JSON: the whole point is to spend few tokens.
        return rpcResult(id, { content: [{ type: 'text', text: JSON.stringify(out) }] });
      } catch (e) {
        return rpcResult(id, { content: [{ type: 'text', text: `Server error: ${e.message}` }], isError: true });
      }
    }
    case 'resources/list': return rpcResult(id, { resources: [] });
    case 'resources/templates/list': return rpcResult(id, { resourceTemplates: [] });
    case 'prompts/list': return rpcResult(id, { prompts: [] });
    default:
      return rpcError(id, -32601, `Method not found: ${method}`);
  }
}

const json = (body, status = 200, extra = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...CORS, ...extra } });

async function handleMcp(request, env) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (request.method === 'GET') {
    // A person opening /mcp in a browser gets the docs page; MCP clients asking for an SSE stream are told we don't offer one.
    if ((request.headers.get('Accept') ?? '').includes('text/html')) return Response.redirect(new URL('/ai/', request.url).href, 302);
    return new Response('This MCP server is stateless: send JSON-RPC messages with POST.', { status: 405, headers: { Allow: 'POST, OPTIONS', ...CORS } });
  }
  if (request.method === 'DELETE') return new Response(null, { status: 405, headers: { Allow: 'POST, OPTIONS', ...CORS } });
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST, OPTIONS', ...CORS } });

  let body;
  try { body = await request.json(); } catch { return json(rpcError(null, -32700, 'Parse error'), 400); }
  if (Array.isArray(body)) {
    const out = (await Promise.all(body.map((m) => handleMessage(m, env)))).filter(Boolean);
    return out.length ? json(out) : new Response(null, { status: 202, headers: CORS });
  }
  const out = await handleMessage(body, env);
  return out ? json(out) : new Response(null, { status: 202, headers: CORS });
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/mcp' || pathname === '/mcp/') return handleMcp(request, env);
    return env.ASSETS.fetch(request);
  },
};
