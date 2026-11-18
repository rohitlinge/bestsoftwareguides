import { url } from '../../lib/data';

// /developers/llms.txt: focused index of the machine interfaces.
export function GET() {
  const lines = [
    '# BestSoftwareGuides for developers and agents',
    '',
    '> Read-only access to rankings, pricing and comparisons. No key, no sign-in.',
    '',
    `- [Developer docs](${url('/developers/')}): endpoints, examples, errors, limits.`,
    `- [Agent instructions](${url('/agents.md')}): when to use the site and how to cite it.`,
    `- [OpenAPI 3.1 spec](${url('/openapi.json')}): REST API at ${url('/api/v1')}.`,
    `- [API catalog (RFC 9727)](${url('/.well-known/api-catalog')})`,
    `- [MCP server](${url('/mcp')}): Streamable HTTP; [server card](${url('/.well-known/mcp/server-card.json')}); [MCP docs](${url('/ai/')}).`,
    `- [Agent skill](${url('/.well-known/agent-skills/software-research/SKILL.md')}) ([index](${url('/.well-known/agent-skills/index.json')})).`,
    `- [Open data](${url('/data/tools.json')}): every tool record as JSON.`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
