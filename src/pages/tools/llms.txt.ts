import { tools, getCategory, money, per, fmtDate, url, lcName, listedAt } from '../../lib/data';

// /tools/llms.txt: focused index of every tool page, linked from the root /llms.txt.
export function GET() {
  const lines = [
    '# BestSoftwareGuides tools',
    '',
    '> Every tool with its rank, score and entry price. Each has an overview, a pricing page and a markdown twin (/tools/<slug>.md).',
    '',
    ...tools.map((t) => [t, getCategory(t.cat)] as const).map(([t, c]) => `- [${t.name}](${url(`/tools/${t.slug}/`)}) — ${t.featured ? `featured partner (${listedAt(t.rank)})` : `#${t.rank}`} in ${lcName(c.name)}, ${t.score}/10; ${t.freePlan ? 'free plan; ' : ''}${t.entryPrice != null ? `paid from ${money(t.entryPrice)}${per(t)} annual` : t.entryMonthly != null ? `paid from ${money(t.entryMonthly)}${per(t)} monthly` : 'see vendor pricing'}; checked ${fmtDate(t.checked)}. [Pricing](${url(`/tools/${t.slug}/pricing/`)}) · [md](${url(`/tools/${t.slug}.md`)})`),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
