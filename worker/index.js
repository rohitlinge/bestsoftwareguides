// BestSoftwareGuides Worker. Cloudflare runs it only for the paths in wrangler.jsonc
// "run_worker_first"; every other URL is served straight from the static site in dist/.
//   /                homepage: adds discovery Link headers, and serves /index.md to agents that
//                    ask for markdown (Accept: text/markdown, or a user-triggered AI agent)
//   /mcp             MCP server for AI assistants (worker/mcp.js)
//   /api/v1/*        public read-only REST API (worker/api.js, spec at /openapi.json)
//   /auth/*          Sign in with LinkedIn (worker/auth.js)
//   /api/reviews     LinkedIn-verified reviews (worker/reviews.js)
//   /api/reviews/summary  approved-review totals for every tool (read by the build for star ratings)
//   /admin/reviews   review moderation (worker/admin.js)
import { handleMcp } from './mcp.js';
import { handleApi, apiError } from './api.js';
import { handleAuth } from './auth.js';
import { handleReviews, handleSummary } from './reviews.js';
import { handleAdmin } from './admin.js';
import { json } from './util.js';

// RFC 8288 Link headers on the homepage: where agents should look before parsing any HTML.
const HOME_LINKS = [
  '</index.md>; rel="alternate"; type="text/markdown"',
  '</llms.txt>; rel="describedby"; type="text/plain"',
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json"',
  '</developers/>; rel="service-doc"',
  '</sitemap.xml>; rel="sitemap"; type="application/xml"',
].join(', ');

// AI agents acting for a person (not search crawlers) get the same homepage content as markdown.
const AGENT_UA = /\b(ChatGPT-User|Claude-User|Perplexity-User|MistralAI-User)\b/i;
const wantsMarkdown = (request) => {
  const accept = request.headers.get('Accept') ?? '';
  if (/text\/markdown/i.test(accept) && !/text\/html/i.test(accept.split(',')[0])) return true;
  return AGENT_UA.test(request.headers.get('User-Agent') ?? '');
};

async function handleHome(request, env) {
  const md = wantsMarkdown(request);
  const asset = await env.ASSETS.fetch(md ? new Request(new URL('/index.md', request.url), request) : request);
  const res = new Response(asset.body, asset);
  res.headers.set('Link', HOME_LINKS);
  res.headers.set('Vary', 'Accept, User-Agent');
  if (md && asset.ok) res.headers.set('Content-Type', 'text/markdown; charset=utf-8');
  return res;
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    try {
      if (pathname === '/') return await handleHome(request, env);
      if (pathname === '/mcp' || pathname === '/mcp/') return await handleMcp(request, env);
      if (pathname.startsWith('/auth/')) return await handleAuth(request, env, pathname);
      if (pathname === '/api/reviews/summary') return await handleSummary(request, env);
      if (pathname === '/api/reviews') return await handleReviews(request, env);
      if (pathname === '/api/admin/reviews' || pathname === '/admin/reviews' || pathname === '/admin/reviews/') return await handleAdmin(request, env, pathname.replace(/\/$/, ''));
      if (pathname === '/api' || pathname.startsWith('/api/')) return await handleApi(request, env, pathname);
    } catch (e) {
      console.error(e);
      if (pathname.startsWith('/api/')) return apiError(500, 'server_error', 'Unexpected server error.', 'Retry in a few seconds.');
      return json({ error: 'Server error' }, 500);
    }
    return env.ASSETS.fetch(request);
  },
};
