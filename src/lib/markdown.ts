// Markdown twins of the main pages (/index.md, /best/<slug>.md, /tools/<slug>.md, /blog/<slug>.md).
// Same facts as the HTML pages, without navigation or markup, so an AI agent can read a page in a
// fraction of the tokens. Each page links its twin with <link rel="alternate" type="text/markdown">.
import {
  categories, tools, compares, site, url, money, fmtDate, priceLine, lcName,
  scoreLeader, featuredLabel, listedAt, categoryFaqs, toolFaqs, toolCategory, rankingsFor, comparesFor,
  annualSaving, type Category, type Tool, type UseCase,
} from './data';
import { posts } from './posts';

const cell = (s: unknown) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const yes = (v: boolean | null | undefined) => (v === true ? 'Yes' : v === false ? 'No' : 'Not confirmed');
const faqMd = (faqs: { q: string; a: string }[]) => faqs.flatMap((f) => [`### ${f.q}`, '', f.a, '']);

export const mdPath = (htmlPath: string) => (htmlPath === '/' ? '/index.md' : htmlPath.replace(/\/$/, '') + '.md');

export function homeMd() {
  return [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    `${categories.length} ranked categories, ${tools.length} tools, ${compares.length} head-to-head comparisons and ${posts.length} guides. Every price links to the vendor's pricing page and shows the date it was checked. Scores come from a [published formula](${url('/methodology/')}) and cannot be bought.`,
    '',
    '## When to use this site',
    '',
    '- Finding the best software for a job, with a ranked list and real prices: see the rankings below.',
    '- Checking what a product costs on monthly and annual billing, or whether it has a free plan.',
    '- Comparing two products on the same checks.',
    '',
    '## For agents and developers',
    '',
    `- MCP server: ${url('/mcp')} (Streamable HTTP, read-only, no key)`,
    `- REST API: ${url('/api/v1')} (GET, no key); OpenAPI spec: ${url('/openapi.json')}`,
    `- Developer docs: ${url('/developers/')}`,
    `- Site index for LLMs: ${url('/llms.txt')}`,
    '- Every ranking, tool and guide page has a markdown twin: add `.md` to the path (for example `/best/crm-software.md`).',
    '',
    '## Rankings',
    '',
    ...categories.map((c) => {
      const lead = scoreLeader(c.tools);
      return `- [Best ${c.name}](${url(`/best/${c.slug}/`)}) ([markdown](${url(`/best/${c.slug}.md`)})): ${c.tools.length} tools; highest score ${lead.name} (${lead.score}/10). Checked ${fmtDate(c.updated)}.`;
    }),
    '',
    '## Latest guides',
    '',
    ...posts.slice(0, 10).map((p) => `- [${p.title}](${url(`/blog/${p.slug}/`)}): ${p.description}`),
    '',
    `Contact and corrections: ${site.contactEmail}`,
    '',
  ].join('\n');
}

export function rankingMd(c: Category, u?: UseCase) {
  const list: (Tool & { pos?: number })[] = u ? u.tools : c.tools;
  const name = u ? u.name : c.name;
  const lead = scoreLeader(list);
  const feat = list.find((t) => t.featured);
  const keys = Object.keys(c.featureLabels);
  const htmlPath = u ? u.path : `/best/${c.slug}/`;
  return [
    `# Best ${name}`,
    '',
    `Source: ${url(htmlPath)} · Checked ${fmtDate(c.updated)} · ${list.length} tools`,
    '',
    u ? `${u.intro}\n\nRule: ${u.ruleText}` : c.intro,
    '',
    `**Highest score:** ${lead.name} (${lead.score}/10).${feat ? ` **${featuredLabel}:** ${feat.name} is ${listedAt(feat.pos ?? feat.rank)} by arrangement; its own score is ${feat.score}/10 (#${feat.scoreRank} by score). Every other tool is in score order.` : ''}`,
    '',
    '## Ranking',
    '',
    '| # | Tool | Score | Price | Best for |',
    '|---|---|---|---|---|',
    ...list.map((t, i) => `| ${u ? t.pos ?? i + 1 : t.rank} | [${cell(t.name)}](${url(`/tools/${t.slug}/`)})${t.featured ? ` (${featuredLabel})` : ''} | ${t.score}/10 | ${cell(priceLine(t))} | ${cell(t.bestFor)} |`),
    '',
    '## Features',
    '',
    `| Tool | ${keys.map((k) => cell(c.featureLabels[k])).join(' | ')} |`,
    `|---|${keys.map(() => '---').join('|')}|`,
    ...list.map((t) => `| ${cell(t.name)} | ${keys.map((k) => yes(t.features[k])).join(' | ')} |`),
    '',
    ...(u ? [] : ['## Buying tips', '', ...c.buyingTips.map((b) => `- ${b}`), '', '## FAQ', '', ...faqMd(categoryFaqs(c))]),
    `Scores: ${url('/methodology/')} · Disclosure: ${url('/disclosure/')}`,
    '',
  ].join('\n');
}

export function toolMd(t: Tool) {
  const c = toolCategory(t);
  const ranks = rankingsFor(t.slug);
  const facts = [
    ['Website', t.website], ['Pricing page', t.pricingUrl], ['Free plan', t.freePlan ? (t.freePlanDetails ?? 'Yes') : 'No'],
    ['Trial', t.trial], ['Platforms', t.platforms.join(', ')], ['Founded', t.founded], ['Headquarters', t.hq],
    ['Integrations', t.integrations], ['Compliance', t.compliance?.join(', ')], ['Support', t.support?.join(', ')],
  ].filter(([, v]) => v);
  return [
    `# ${t.name}`,
    '',
    `Source: ${url(`/tools/${t.slug}/`)} · Prices checked ${fmtDate(t.checked)} (${t.verification})`,
    '',
    `${t.tagline} ${t.description}`,
    '',
    `**Best for:** ${t.bestFor}`,
    '',
    '## Rankings',
    '',
    ...ranks.map(({ c: rc, t: rt }) => `- ${rt.featured ? `${featuredLabel}, ${listedAt(rt.rank)}; #${rt.scoreRank} by score` : `#${rt.rank} of ${rc.tools.length}`} in [${rc.name}](${url(`/best/${rc.slug}/`)}), score ${rt.score}/10`),
    '',
    '## Pricing',
    '',
    `Prices in USD ${t.unit.long ? `per ${t.unit.long}` : ''}. Annual = price per month when billed yearly.`,
    '',
    '| Plan | Monthly billing | Annual billing | Notes |',
    '|---|---|---|---|',
    ...t.plans.map((p) => `| ${cell(p.name)} | ${p.custom ? 'Quote' : p.monthly != null ? money(p.monthly) : '—'} | ${p.custom ? 'Quote' : p.annual != null ? `${money(p.annual)}${annualSaving(p) ? ` (save ${annualSaving(p)}%)` : ''}` : '—'} | ${cell(p.oneTime ? `One-time ${money(p.oneTime)}. ${p.notes ?? ''}` : p.notes)} |`),
    '',
    '## Pros',
    '',
    ...t.pros.map((p) => `- ${p}`),
    '',
    '## Cons',
    '',
    ...t.cons.map((p) => `- ${p}`),
    '',
    '## Facts',
    '',
    ...facts.map(([k, v]) => `- **${k}:** ${v}`),
    '',
    '## Compare',
    '',
    ...comparesFor(t).map((x) => `- [${x.a.name} vs ${x.b.name}](${url(`/compare/${x.slug}/`)})`),
    `- [${t.name} alternatives](${url(`/tools/${t.slug}/alternatives/`)})`,
    `- [All ${lcName(c.name)}](${url(`/best/${c.slug}/`)})`,
    '',
    '## FAQ',
    '',
    ...faqMd(toolFaqs(t)),
    '## Sources',
    '',
    ...t.sources.map((s) => `- [${s.label}](${s.url})${s.date ? ` (${fmtDate(s.date)})` : ''}`),
    '',
  ].join('\n');
}

export function postMd(slug: string) {
  const p = posts.find((x) => x.slug === slug)!;
  return [`# ${p.title}`, '', `Source: ${url(`/blog/${p.slug}/`)} · Updated ${fmtDate(p.updated)}`, '', `> ${p.description}`, '', p.raw.trim().replace(/\]\(\//g, `](${site.url}/`), ''].join('\n');
}

export const md = (body: string) => new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
