import { url, PREVIEW } from '../lib/data';

// AI search and assistant crawlers are explicitly allowed: being fetchable is
// a precondition for being cited by ChatGPT, Perplexity, Claude and Gemini.
export function GET() {
  const body = PREVIEW
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *
Allow: /

# AI search / answer engines
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: ${url('/sitemap.xml')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}
