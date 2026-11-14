import config from '../../site.config.mjs';
import toolsRaw from '../data/tools.json';
import categoriesRaw from '../data/categories.json';
import schedule from '../data/schedule.json';

export type Plan = { name: string; monthly: number | null; annual: number | null; custom?: boolean; notes?: string };
export type Source = { label: string; url: string; date?: string };
export type Tool = {
  slug: string; name: string; category: string; website: string; pricingUrl: string;
  tagline: string; bestFor: string; description: string; pros: string[]; cons: string[];
  freePlan: boolean; freePlanDetails: string | null; trial: string | null; minSeats: number;
  plans: Plan[]; features: Record<string, boolean | null>; platforms: string[];
  checked: string; verification: 'verified' | 'reported'; sources: Source[];
  // computed
  score: number; rank: number; entryPrice: number | null; entryMonthly: number | null;
  indexable: boolean; publishDate: Date;
};
export type Category = {
  slug: string; name: string; singular: string; topic: string; intro: string;
  buyingTips: string[]; featureLabels: Record<string, string>; faqs: { q: string; a: string }[];
  // computed
  tools: Tool[]; publishDate: Date; comparesDate: Date; updated: string; indexable: boolean;
};

// ---------- dates & scheduling ----------
const DAY = 86400000;
export const PREVIEW = process.env.PREVIEW === '1';
const launch = new Date((process.env.LAUNCH_DATE || config.launchDate) + 'T00:00:00Z');
const today = process.env.BUILD_DATE ? new Date(process.env.BUILD_DATE + 'T00:00:00Z') : new Date();
export const buildDate = today;
export const addDays = (d: Date, n: number) => new Date(d.getTime() + n * DAY);
export const isLive = (d: Date) => PREVIEW || d.getTime() <= today.getTime();
export const iso = (d: Date) => d.toISOString().slice(0, 10);
export const fmtDate = (s: string | Date) =>
  new Date(typeof s === 'string' ? s + 'T00:00:00Z' : s).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
const daysOld = (s: string) => (today.getTime() - new Date(s + 'T00:00:00Z').getTime()) / DAY;


// Case helpers that keep acronyms and brand names intact ("CRM", "AI", "NordVPN").
const keepCase = (w: string) => w === w.toUpperCase() || /[A-Z].*[A-Z]|[.\d]/.test(w.slice(1)) || /[A-Z]/.test(w.slice(1));
export const lc1 = (s: string) => { const w = s.split(' ')[0]; return keepCase(w) ? s : s.charAt(0).toLowerCase() + s.slice(1); };
export const lcName = (s: string) => s.split(' ').map((w) => (keepCase(w) ? w : w.toLowerCase())).join(' ');

// ---------- pricing helpers ----------
export const money = (n: number | null | undefined) =>
  n == null ? '—' : n === 0 ? 'Free' : '$' + (Number.isInteger(n) ? n : n.toFixed(2));
const paidPrices = (t: { plans: Plan[] }, key: 'annual' | 'monthly') =>
  t.plans.map((p) => p[key]).filter((v): v is number => typeof v === 'number' && v > 0);
const minOrNull = (a: number[]) => (a.length ? Math.min(...a) : null);
export const priceLine = (t: Tool) => {
  const parts: string[] = [];
  if (t.freePlan) parts.push('Free plan');
  if (t.entryPrice != null) parts.push(`paid from ${money(t.entryPrice)}/user/mo (annual)`);
  else if (t.entryMonthly != null) parts.push(`paid from ${money(t.entryMonthly)}/user/mo`);
  if (t.trial) parts.push(t.trial);
  return parts.join(' · ') || 'See vendor pricing';
};
export const annualSaving = (p: Plan) =>
  p.monthly && p.annual && p.monthly > p.annual ? Math.round((1 - p.annual / p.monthly) * 100) : null;

// ---------- build the dataset ----------
const schedCat = new Map(schedule.categories.map((c: any) => [c.slug, c]));

// Score weights (sum to 1). Published on /methodology/. Score = 5 + 4.8 × weighted sum, so the range is 5.0–9.8.
export const W = { coverage: 0.45, value: 0.2, free: 0.2, transparency: 0.15 };

function scoreTool(t: any, peers: any[]) {
  const keys = Object.keys(t.features);
  const coverage = keys.length ? keys.filter((k) => t.features[k] === true).length / keys.length : 0;
  const entries = peers.map((p) => minOrNull(paidPrices(p, 'annual')) ?? minOrNull(paidPrices(p, 'monthly'))).filter((v): v is number => v != null).sort((a, b) => a - b);
  const mine = minOrNull(paidPrices(t, 'annual')) ?? minOrNull(paidPrices(t, 'monthly'));
  // value: 1 = cheapest entry price in the category, 0.25 = most expensive, 0.4 = unpublished
  let value = 0.4;
  if (mine != null && entries.length > 1) {
    const lo = entries[0], hi = entries[entries.length - 1];
    value = hi === lo ? 0.75 : 1 - 0.75 * ((mine - lo) / (hi - lo));
  } else if (mine != null) value = 0.75;
  const free = t.freePlan ? 1 : t.trial ? 0.4 : 0;
  const priced = t.plans.filter((p: Plan) => p.monthly != null || p.annual != null || p.custom).length / t.plans.length;
  const raw = coverage * W.coverage + value * W.value + free * W.free + priced * W.transparency;
  return Math.round((5 + 4.8 * raw) * 10) / 10;
}

const catBase = categoriesRaw as any[];
export const allCategories: Category[] = catBase
  .filter((c) => schedCat.has(c.slug))
  .map((c) => {
    const s: any = schedCat.get(c.slug);
    const publishDate = addDays(launch, s.day);
    const raw = (toolsRaw as any[]).filter((t) => t.category === c.slug);
    const tools: Tool[] = raw
      .map((t) => {
        const entryPrice = minOrNull(paidPrices(t, 'annual'));
        const entryMonthly = minOrNull(paidPrices(t, 'monthly'));
        const hasData = t.freePlan === true || entryPrice != null || entryMonthly != null;
        return {
          ...t,
          score: scoreTool(t, raw),
          entryPrice, entryMonthly,
          indexable: hasData && daysOld(t.checked) <= config.maxDataAgeDays,
          publishDate,
        } as Tool;
      })
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
      .map((t, i) => ({ ...t, rank: i + 1 }));
    const updated = tools.map((t) => t.checked).sort().pop() || iso(publishDate);
    return {
      ...c, tools, publishDate, comparesDate: addDays(launch, s.comparesDay ?? s.day), updated,
      indexable: tools.filter((t) => t.indexable).length >= 3,
    } as Category;
  });

export const categories = allCategories.filter((c) => isLive(c.publishDate));
export const tools = categories.flatMap((c) => c.tools);
export const getCategory = (slug: string) => allCategories.find((c) => c.slug === slug)!;
export const getTool = (slug: string) => tools.find((t) => t.slug === slug)!;
export const toolCategory = (t: Tool) => getCategory(t.category);

// ---------- comparisons ----------
export type Compare = { slug: string; a: Tool; b: Tool; category: Category };
export const compares: Compare[] = categories
  .filter((c) => isLive(c.comparesDate))
  .flatMap((c) => {
    const out: Compare[] = [];
    c.tools.forEach((a, i) => c.tools.slice(i + 1).forEach((b) => out.push({ slug: `${a.slug}-vs-${b.slug}`, a, b, category: c })));
    return out;
  });
export const comparesFor = (t: Tool) => compares.filter((c) => c.a.slug === t.slug || c.b.slug === t.slug);
export const freePagesLive = (c: Category) => isLive(c.comparesDate) && c.tools.some((t) => t.freePlan);

export function compareVerdict(x: Compare) {
  const { a, b, category } = x;
  const lines: string[] = [];
  const winner = a.score >= b.score ? a : b, other = winner === a ? b : a;
  lines.push(`${winner.name} scores ${winner.score}/10 against ${other.score}/10 for ${other.name} on our data score for ${lcName(category.name)}.`);
  if (a.entryPrice != null && b.entryPrice != null && a.entryPrice !== b.entryPrice) {
    const ch = a.entryPrice < b.entryPrice ? a : b, ex = ch === a ? b : a;
    lines.push(`${ch.name} is cheaper to start: paid plans from ${money(ch.entryPrice)} vs ${money(ex.entryPrice)} per user/month on annual billing.`);
  }
  if (a.freePlan !== b.freePlan) lines.push(`${(a.freePlan ? a : b).name} has a free plan; ${(a.freePlan ? b : a).name} does not.`);
  else if (a.freePlan && b.freePlan) lines.push('Both have a free plan.');
  return lines;
}

export const featureWins = (x: Compare) => {
  const keys = Object.keys(x.category.featureLabels);
  return {
    a: keys.filter((k) => x.a.features[k] === true && x.b.features[k] !== true).map((k) => x.category.featureLabels[k]),
    b: keys.filter((k) => x.b.features[k] === true && x.a.features[k] !== true).map((k) => x.category.featureLabels[k]),
  };
};

// ---------- auto FAQs built from the data (always consistent with the tables) ----------
export function categoryFaqs(c: Category) {
  const priced = c.tools.filter((t) => t.entryPrice != null).sort((a, b) => a.entryPrice! - b.entryPrice!);
  const free = c.tools.filter((t) => t.freePlan);
  const top = c.tools[0];
  const faqs = [
    { q: `What is the best ${c.singular} in ${today.getUTCFullYear()}?`, a: `${top.name} ranks first on our data score (${top.score}/10). It is best for ${lc1(top.bestFor)}. ${c.tools[1] ? `${c.tools[1].name} is second (${c.tools[1].score}/10).` : ''}` },
  ];
  if (priced.length) faqs.push({ q: `What is the cheapest ${c.singular}?`, a: `${priced[0].name} has the lowest paid entry price in this list at ${money(priced[0].entryPrice)} per user/month billed annually${free.length ? `. Free plans are available from ${free.map((t) => t.name).join(', ')}` : ''}.` });
  if (free.length) faqs.push({ q: `Which ${lcName(c.name)} have a free plan?`, a: `${free.map((t) => t.name).join(', ')} offer a free plan. ${(() => { const n = c.tools.filter((t) => !t.freePlan); return n.length ? `${n.map((t) => t.name).join(', ')} ${n.length === 1 ? 'does' : 'do'} not.` : 'Every tool in this list has one.'; })()}`.trim() });
  return [...faqs, ...c.faqs];
}

export function toolFaqs(t: Tool) {
  const c = toolCategory(t);
  const f = [
    { q: `How much does ${t.name} cost?`, a: `${t.name} ${t.freePlan ? 'has a free plan' : 'has no free plan'}${t.entryPrice != null ? ` and paid plans start at ${money(t.entryPrice)} per user/month billed annually` : ''}${t.entryMonthly != null ? ` (${money(t.entryMonthly)} billed monthly)` : ''}. Prices last checked ${fmtDate(t.checked)}.` },
    { q: `Is ${t.name} free?`, a: t.freePlan ? `Yes. ${t.freePlanDetails ?? ''}`.trim() : `No. ${t.name} has no permanent free plan${t.trial ? `, but offers a ${lc1(t.trial)}` : ''}.` },
    { q: `What are the best ${t.name} alternatives?`, a: `${c.tools.filter((o) => o.slug !== t.slug).slice(0, 3).map((o) => `${o.name} (${o.score}/10)`).join(', ')} are the closest alternatives in our ${lcName(c.name)} ranking.` },
  ];
  return f;
}

export const site = config;
export const url = (p: string) => config.url + p;
