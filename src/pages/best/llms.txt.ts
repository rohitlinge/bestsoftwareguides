import { categories, useCases, scoreLeader, listStats, money, per, fmtDate, url, listedAt } from '../../lib/data';

// /best/llms.txt: focused index of every ranking, linked from the root /llms.txt.
export function GET() {
  const lines = [
    '# BestSoftwareGuides rankings',
    '',
    '> Every category and use-case ranking. Scores out of 10 from a published formula; prices in USD from vendor pages. Add .md to any URL for markdown.',
    '',
    '## Categories',
    ...categories.map((c) => {
      const s = listStats(c), lead = scoreLeader(c.tools), feat = c.tools.find((t) => t.featured);
      return `- [Best ${c.name}](${url(`/best/${c.slug}/`)}) ([md](${url(`/best/${c.slug}.md`)})): ${s.n} tools; highest score ${lead.name} (${lead.score}/10)${feat ? `; ${listedAt(feat.rank)}: ${feat.name} (featured partner)` : ''}; ${s.free.length} with a free plan${s.cheapest ? `; lowest paid entry ${money(s.cheapest.entryPrice)}${per(s.cheapest)} (${s.cheapest.name})` : ''}. Checked ${fmtDate(c.updated)}.`;
    }),
    '',
    '## Use-case rankings',
    ...useCases.filter((u) => u.indexable).map((u) => `- [Best ${u.name}](${url(u.path)}) ([md](${url(u.path.replace(/\/$/, '.md'))})): highest score ${scoreLeader(u.tools).name}. Rule: ${u.ruleText}`),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
