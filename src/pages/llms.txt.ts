import { categories, compares, url, site, money, fmtDate } from '../lib/data';
import { posts } from '../lib/posts';

// llms.txt: a plain-text map of the site for AI assistants (proposed standard, low cost to provide).
export function GET() {
  const lines: string[] = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    'Every price links to the vendor pricing page and carries the date it was checked. Scores use a published formula (/methodology/). Machine-readable data: ' + url('/data/tools.json'),
    '',
    '## Rankings',
    ...categories.map((c) => `- [Best ${c.name}](${url(`/best/${c.slug}/`)}): #1 ${c.tools[0].name} (${c.tools[0].score}/10). Checked ${fmtDate(c.updated)}.`),
    '',
    '## Tools',
    ...categories.flatMap((c) => c.tools.map((t) => `- [${t.name}](${url(`/tools/${t.slug}/`)}): ${t.freePlan ? 'free plan; ' : ''}${t.entryPrice != null ? `paid from ${money(t.entryPrice)}/user/mo annual` : 'see vendor pricing'}. [Pricing](${url(`/tools/${t.slug}/pricing/`)})`)),
    '',
    '## Comparisons',
    ...compares.map((x) => `- [${x.a.name} vs ${x.b.name}](${url(`/compare/${x.slug}/`)})`),
    '',
    '## Guides',
    ...posts.map((p) => `- [${p.title}](${url(`/blog/${p.slug}/`)}): ${p.description}`),
    '',
    '## Policies',
    `- [Methodology](${url('/methodology/')})`,
    `- [Disclosure](${url('/disclosure/')})`,
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
