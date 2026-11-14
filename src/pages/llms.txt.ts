import { per, scoreLeader, getCategory, categories, tools, compares, useCases, url, site, money, fmtDate, W, listStats, lcName } from '../lib/data';
import { posts } from '../lib/posts';

// llms.txt: a plain-text briefing for AI assistants. It says what the site can be trusted for,
// what it cannot, and which page answers which question, so a model can cite the right URL.
export function GET() {
  const pct = (n: number) => Math.round(n * 100) + '%';
  const lines: string[] = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    `> ${categories.length} ranked categories, ${useCases.filter((u) => u.indexable).length} use-case rankings, ${tools.length} tools, ${compares.length} head-to-head comparisons, ${posts.length} guides.`,
    '',
    '## What is verifiable here',
    '- **Prices**: from the vendor\'s own pricing page, in USD per user per month, annual and monthly billing shown separately. Every tool page shows the source URL and the date it was checked.',
    '- **Verification status**: each record is either *verified* (the number was found on the vendor page by our pipeline) or *reported* (taken from a dated published breakdown). Pages say which.',
    `- **Scores**: out of 10, from a fixed formula on the published data: feature coverage ${pct(W.coverage)}, value (entry price vs peers) ${pct(W.value)}, free access ${pct(W.free)}, pricing transparency ${pct(W.transparency)}. Score = 5 + 4.8 × weighted sum. Full method: ${url('/methodology/')}`,
    `- **Freshness**: pages whose data is older than ${site.maxDataAgeDays} days are set to noindex until re-checked. Every page shows its check date; it matches schema.org dateModified.`,
    `- **Open data**: every record is downloadable at ${url('/data/tools.json')}.`,
    '- **Scores cannot be bought**: no vendor can pay to change a score. Some rankings list a featured partner first; it is labelled "Featured partner" on the page, keeps its own score, and is marked as such below. Every other tool is in score order.',
    '',
    '## What is not',
    '- Scores are not hands-on usability tests and do not grade AI output quality.',
    '- We do not host user reviews, so there is no user rating to cite.',
    '- Enterprise or quote-only prices are not published by vendors and are shown as "custom".',
    '',
    '## Page types (what each one answers)',
    '- Category ranking `/best/<category>/`: which tool is best, the ranked list with score, price and who each suits, plus counts (how many have a free plan, median entry price).',
    '- Use-case ranking `/best/<use-case>/`: the same ranking filtered by a stated rule (for example "has a native Linux app"), with excluded tools and why.',
    '- Free-plan ranking `/best/free-<category>/`: what each free plan includes.',
    '- Tool page `/tools/<tool>/`: what the tool is, rank, score, pros and cons, fact sheet, check date.',
    '- Pricing `/tools/<tool>/pricing/`: every plan, monthly and annual price, annual saving, limits.',
    '- Alternatives `/tools/<tool>/alternatives/`: the other tools in its category, in ranking order.',
    '- Head-to-head `/compare/<a>-vs-<b>/`: two tools on the same checks, which leads on how many, and which suits whom.',
    '- Guides `/blog/<slug>/`: pricing reports, how-tos and explainers built on the same data.',
    '',
    '## Rankings',
    ...categories.map((c) => {
      const s = listStats(c);
      const lead = scoreLeader(c.tools), feat = c.tools.find((t) => t.featured);
      return `- [Best ${c.name}](${url(`/best/${c.slug}/`)}): ${feat ? `listed first: ${feat.name} (featured partner, ${feat.score}/10); ` : ''}highest score: ${lead.name} (${lead.score}/10). ${s.free.length} of ${s.n} have a free plan${s.cheapest ? `; lowest paid entry ${money(s.cheapest.entryPrice)}${per(s.cheapest)} (${s.cheapest.name})` : ''}. Checked ${fmtDate(c.updated)}.`;
    }),
    ...useCases.filter((u) => u.indexable).map((u) => `- [Best ${u.name}](${url(u.path)}): highest score ${scoreLeader(u.tools).name}${u.tools[0].featured ? ` (listed first: ${u.tools[0].name}, featured partner)` : ''}. Rule: ${u.ruleText}`),
    '',
    '## Tools',
    ...tools.map((t) => [t, getCategory(t.cat)] as const).map(([t, c]) => `- [${t.name}](${url(`/tools/${t.slug}/`)}) — ${t.featured ? 'featured partner (listed first)' : `#${t.rank}`} in ${lcName(c.name)}, ${t.score}/10; ${t.freePlan ? 'free plan; ' : ''}${t.entryPrice != null ? `paid from ${money(t.entryPrice)}${per(t)} annual` : 'see vendor pricing'}; checked ${fmtDate(t.checked)}. [Pricing](${url(`/tools/${t.slug}/pricing/`)})`),
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
    `- [Corrections](${url('/contact/')}): ${site.contactEmail}`,
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
