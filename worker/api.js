// Public read-only REST API (v1). Same data and logic as the MCP server (worker/mcp.js), as plain
// GET endpoints with JSON responses. No key, no sign-in, CORS open. Spec: /openapi.json
//   GET /api/v1/search?q=<keywords>&limit=10
//   GET /api/v1/categories
//   GET /api/v1/rankings/<category>?free_plan=true&max_price=20&features=a,b&limit=10
//   GET /api/v1/tools/<tool>
//   GET /api/v1/tools/<tool>/pricing
//   GET /api/v1/compare?a=<tool>&b=<tool>
import { loadData, TOOL_MAP } from './mcp.js';

const SITE = 'https://bestsoftwareguides.online';
const DOCS = `${SITE}/developers/`;
const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
  'Link': `<${SITE}/openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json", <${DOCS}>; rel="service-doc"`,
};

const send = (body, status = 200, extra = {}) =>
  new Response(JSON.stringify(body), { status, headers: { ...HEADERS, ...(status === 200 ? { 'Cache-Control': 'public, max-age=300' } : { 'Cache-Control': 'no-store' }), ...extra } });

// Every error has the same shape, so an agent can branch on `code` and follow `hint`.
export const apiError = (status, code, message, hint, extra = {}) =>
  send({ error: { status, code, message, hint: hint ?? `See the API docs: ${DOCS}`, docs: DOCS } }, status, extra);

const ROUTES = [
  { re: /^\/api\/v1\/search\/?$/, tool: 'search', args: (m, q) => ({ query: q.get('q') ?? q.get('query') ?? '', limit: int(q.get('limit')) }), required: { q: 'query' } },
  { re: /^\/api\/v1\/categories\/?$/, tool: 'list_categories', args: () => ({}) },
  { re: /^\/api\/v1\/rankings\/([^/]+)\/?$/, tool: 'get_ranking', args: (m, q) => ({ category: dec(m[1]), free_plan: bool(q.get('free_plan')), max_price: num(q.get('max_price')), features: list(q.get('features')), limit: int(q.get('limit')) }) },
  { re: /^\/api\/v1\/tools\/([^/]+)\/pricing\/?$/, tool: 'get_pricing', args: (m) => ({ tool: dec(m[1]) }) },
  { re: /^\/api\/v1\/tools\/([^/]+)\/?$/, tool: 'get_tool', args: (m) => ({ tool: dec(m[1]) }) },
  { re: /^\/api\/v1\/compare\/?$/, tool: 'compare_tools', args: (m, q) => ({ tool_a: q.get('a') ?? '', tool_b: q.get('b') ?? '' }), required: { a: 'tool_a', b: 'tool_b' } },
];

const dec = (s) => decodeURIComponent(s);
const int = (v) => (v == null || v === '' ? undefined : Number.parseInt(v, 10));
const num = (v) => (v == null || v === '' ? undefined : Number(v));
const bool = (v) => (v == null || v === '' ? undefined : v === 'true' || v === '1');
const list = (v) => (v ? v.split(',').map((s) => s.trim()).filter(Boolean) : []);

const INDEX = {
  name: 'BestSoftwareGuides API', version: 'v1',
  description: 'Read-only software rankings, plan-by-plan pricing and comparisons. Prices in USD from vendor pricing pages, each with a check date and source URL. No key needed.',
  openapi: `${SITE}/openapi.json`, docs: DOCS, mcp: `${SITE}/mcp`,
  endpoints: {
    search: `${SITE}/api/v1/search?q=password+manager`,
    categories: `${SITE}/api/v1/categories`,
    ranking: `${SITE}/api/v1/rankings/crm-software?free_plan=true`,
    tool: `${SITE}/api/v1/tools/grammarly`,
    pricing: `${SITE}/api/v1/tools/grammarly/pricing`,
    compare: `${SITE}/api/v1/compare?a=postman&b=bruno`,
  },
};

export async function handleApi(request, env, pathname) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: HEADERS });
  if (request.method !== 'GET' && request.method !== 'HEAD') return apiError(405, 'method_not_allowed', `${request.method} is not supported. The API is read-only.`, 'Send a GET request.', { Allow: 'GET, OPTIONS' });
  if (pathname === '/api/v1' || pathname === '/api/v1/' || pathname === '/api' || pathname === '/api/') return send(INDEX);

  const q = new URL(request.url).searchParams;
  for (const r of ROUTES) {
    const m = pathname.match(r.re);
    if (!m) continue;
    for (const [param] of Object.entries(r.required ?? {})) {
      if (!(q.get(param) ?? (param === 'q' ? q.get('query') : null))) return apiError(400, 'missing_parameter', `Query parameter "${param}" is required.`, `Example: ${INDEX.endpoints[r.tool === 'search' ? 'search' : 'compare']}`);
    }
    const args = r.args(m, q);
    if (args.limit !== undefined && (!Number.isInteger(args.limit) || args.limit < 1)) return apiError(400, 'invalid_parameter', '"limit" must be a positive integer.');
    if (args.max_price !== undefined && Number.isNaN(args.max_price)) return apiError(400, 'invalid_parameter', '"max_price" must be a number (USD per month, billed annually).');
    let out;
    try {
      out = TOOL_MAP[r.tool].run(await loadData(env), args);
    } catch (e) {
      console.error(e);
      return apiError(500, 'server_error', 'The data could not be loaded.', 'Retry in a few seconds.');
    }
    if (out.__error) {
      const notFound = /^No (tool|category) matches/.test(out.__error);
      return notFound
        ? apiError(404, 'not_found', out.__error, out.__error.includes('search') ? `Find the slug first: ${SITE}/api/v1/search?q=<name>` : `List categories: ${SITE}/api/v1/categories`)
        : apiError(400, 'invalid_parameter', out.__error);
    }
    return send(out);
  }
  return apiError(404, 'not_found', `No API endpoint at ${pathname}.`, `Endpoints are listed at ${SITE}/api/v1 and in ${SITE}/openapi.json.`);
}
