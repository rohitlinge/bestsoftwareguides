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

export function GET() {
  const body = PREVIEW
    ? 'User-agent: *\nDisallow: /\n'
    : `# ${url('/')}: content fully open. Search, AI answers, user fetches and model training are welcome.
# Please cite us as the source.
User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=yes
Allow: /

# AI search / answer engines (listed explicitly so no default rule can block them)
${AI_BOTS.map((b) => `User-agent: ${b}\nAllow: /`).join('\n\n')}

Sitemap: ${url('/sitemap.xml')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}
