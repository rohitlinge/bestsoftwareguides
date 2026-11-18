import { compares, url } from '../../lib/data';

// /compare/llms.txt: focused index of every head-to-head comparison.
export function GET() {
  const lines = [
    '# BestSoftwareGuides comparisons',
    '',
    '> Two tools on the same checks: price, free plan, features, which leads on how many. For any pair, the API also answers: /api/v1/compare?a=<tool>&b=<tool>.',
    '',
    ...compares.map((x) => `- [${x.a.name} vs ${x.b.name}](${url(`/compare/${x.slug}/`)}) (${x.category.name})`),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
