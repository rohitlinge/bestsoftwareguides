import { url, PREVIEW } from '../lib/data';

// Everything is open to search engines and AI assistants: being fetchable is a precondition
// for being cited by ChatGPT, Perplexity, Claude, Gemini and Copilot.
// Content-Signal (contentsignals.org) states the same permission in machine-readable form.
const AI_BOTS = [
  'OAI-SearchBot', 'ChatGPT-User', 'GPTBot',
  'PerplexityBot', 'Perplexity-User',
  'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
  'Google-Extended', 'Applebot-Extended', 'Bingbot', 'DuckAssistBot',
  'MistralAI-User', 'Meta-ExternalAgent', 'Amazonbot', 'CCBot',
];

// Machine-only or private paths that are not pages: sign-in (redirects to LinkedIn), APIs, moderation,
// on-site search results and internal data snapshots. Repeated in every group because a crawler obeys
// only the most specific group that names it (Bingbot reads the Bingbot group, not "*").
// /data/tools.json (open data), /llms.txt and the MCP docs at /ai/ stay open on purpose.
const DISALLOW = ['/auth/', '/api/', '/admin/', '/search/', '/mcp', '/mcp-data.json', '/search.json', '/urls.json'];
const rules = DISALLOW.map((p) => `Disallow: ${p}`).join('\n');

export function GET() {
  const body = PREVIEW
    ? 'User-agent: *\nDisallow: /\n'
    : `# ${url('/')}: content open to search, AI answers, user fetches and model training.
# Reuse is welcome with attribution; see ${url('/terms/')}.
User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=yes
${rules}
Allow: /

# AI search / answer engines (listed explicitly so no default rule can block them)
${AI_BOTS.map((b) => `User-agent: ${b}\n${rules}\nAllow: /`).join('\n\n')}

Sitemap: ${url('/sitemap.xml')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}
