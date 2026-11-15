// BestSoftwareGuides Worker. Cloudflare runs it only for the paths in wrangler.jsonc
// "run_worker_first"; every other URL is served straight from the static site in dist/.
//   /mcp             MCP server for AI assistants (worker/mcp.js)
//   /auth/*          Sign in with LinkedIn (worker/auth.js)
//   /api/reviews     LinkedIn-verified reviews (worker/reviews.js)
//   /admin/reviews   review moderation (worker/admin.js)
import { handleMcp } from './mcp.js';
import { handleAuth } from './auth.js';
import { handleReviews } from './reviews.js';
import { handleAdmin } from './admin.js';
import { json } from './util.js';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    try {
      if (pathname === '/mcp' || pathname === '/mcp/') return await handleMcp(request, env);
      if (pathname.startsWith('/auth/')) return await handleAuth(request, env, pathname);
      if (pathname === '/api/reviews') return await handleReviews(request, env);
      if (pathname === '/api/admin/reviews' || pathname === '/admin/reviews' || pathname === '/admin/reviews/') return await handleAdmin(request, env, pathname.replace(/\/$/, ''));
    } catch (e) {
      console.error(e);
      return json({ error: 'Server error' }, 500);
    }
    return env.ASSETS.fetch(request);
  },
};
