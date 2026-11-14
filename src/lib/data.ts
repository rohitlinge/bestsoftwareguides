import config from '../../site.config.mjs';
import toolsRaw from '../data/tools.json';
import categoriesRaw from '../data/categories.json';
import schedule from '../data/schedule.json';

export type Plan = { name: string; monthly: number | null; annual: number | null; custom?: boolean; oneTime?: number; notes?: string };
export type Source = { label: string; url: string; date?: string };
export type Tool = {
  slug: string; name: string; category: string; alsoIn?: string[]; website: string; pricingUrl: string;
  tagline: string; bestFor: string; description: string; pros: string[]; cons: string[];
  freePlan: boolean; freePlanDetails: string | null; trial: string | null; minSeats: number;
  plans: Plan[]; features: Record<string, boolean | null>; platforms: string[];
  checked: string; verification: 'verified' | 'reported'; sources: Source[];
  // optional fact-sheet fields (shown only when present; never guess them)
  priceUnit?: PriceUnit; // overrides the category's unit (e.g. per-user prices in a per-month category)
  founded?: string; hq?: string; integrations?: string; compliance?: string[]; support?: string[];
  // computed
  score: number; rank: number; entryPrice: number | null; entryMonthly: number | null;
  indexable: boolean; publishDate: Date;
  cat: string;          // the category this copy of the tool was ranked in (a tool can be in several)
  scoreRank: number;    // position by score alone, ignoring a featured placement
  featured: boolean;    // pinned to #1 as a labelled featured partner (see Category.featured)
  unit: PriceUnit;
};
export type PriceUnit = { short: string; long: string };
const DEFAULT_UNIT: PriceUnit = { short: 'user/mo', long: 'user/month' };
export type Category = {
  slug: string; name: string; singular: string; topic: string; intro: string;
  buyingTips: string[]; featureLabels: Record<string, string>; faqs: { q: string; a: string }[];
  plural?: string; useCases?: UseCaseDef[];
  // A featured partner is pinned to #1 with a visible label; every other tool keeps its score order.
  featured?: string;
  priceUnit?: PriceUnit;
  compareTop?: number; // only build head-to-head pages among the top N (default: every pair)
  // computed
  tools: Tool[]; publishDate: Date; comparesDate: Date; updated: string; indexable: boolean;
};

// A use-case directory is a filtered ranking ("Password Managers for Linux"). The rule is
// applied to the data, shown on the page, and the page is only indexed with 3+ matching tools.
export type UseCaseRule = { platform?: string; feature?: string; freePlan?: boolean; maxEntryPrice?: number; maxMinSeats?: number };
export type UseCaseDef = { slug: string; name: string; singular: string; intro: string; ruleText: string; rule: UseCaseRule; faqs?: { q: string; a: string }[] };

// ---------- dates & scheduling ----------
const DAY = 86400000;
// Set in astro.config.mjs (resolved in Node at build time). Never read the clock or
// process.env here: on Cloudflare Workers Builds this module runs where both are unreliable.
declare const __BUILD_DATE__: string, __LAUNCH_DATE__: string, __PREVIEW__: boolean;
export const PREVIEW = __PREVIEW__;
export const launch = new Date(__LAUNCH_DATE__ + 'T00:00:00Z');
const today = new Date(__BUILD_DATE__ + 'T00:00:00Z');
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
// "AI meeting assistant…" -> "an AI meeting assistant…" (taglines are written without an article)
export const withArticle = (s: string) => /^(a|an|the)\s/i.test(s) ? lc1(s) : (/^[aeiou]/i.test(s) && !/^(one|uni|use)/i.test(s) ? 'an ' : 'a ') + lc1(s);
export const lcName = (s: string) => s.split(' ').map((w) => (keepCase(w) ? w : w.toLowerCase())).join(' ');

// ---------- pricing helpers ----------
export const money = (n: number | null | undefined) =>
  n == null ? '—' : n === 0 ? 'Free' : '$' + (Number.isInteger(n) ? n : n.toFixed(2));
const paidPrices = (t: { plans: Plan[] }, key: 'annual' | 'monthly') =>
  t.plans.map((p) => p[key]).filter((v): v is number => typeof v === 'number' && v > 0);
const minOrNull = (a: number[]) => (a.length ? Math.min(...a) : null);
export const per = (t: { unit?: PriceUnit }) => '/' + (t.unit ?? DEFAULT_UNIT).short;
export const perLong = (t: { unit?: PriceUnit }) => 'per ' + (t.unit ?? DEFAULT_UNIT).long;
export const oneTimeFrom = (t: Tool) => minOrNull(t.plans.map((p) => p.oneTime).filter((v): v is number => typeof v === 'number' && v > 0));
export const quoteOnly = (t: Tool) => t.entryPrice == null && t.entryMonthly == null && t.plans.some((p) => p.custom);
export const priceLine = (t: Tool) => {
  const parts: string[] = [];
  if (t.freePlan) parts.push('Free plan');
  if (t.entryPrice != null) parts.push(`paid from ${money(t.entryPrice)}${per(t)} (annual)`);
  else if (t.entryMonthly != null) parts.push(`paid from ${money(t.entryMonthly)}${per(t)}`);
  else if (oneTimeFrom(t) != null) parts.push(`one-time licence from ${money(oneTimeFrom(t))}`);
  else if (quoteOnly(t)) parts.push(t.freePlan ? 'paid plans quote-only' : 'Quote-only pricing');
  if (t.trial) parts.push(t.trial);
  return parts.join(' · ') || 'See vendor pricing';
};
export const annualSaving = (p: Plan) =>
  p.monthly && p.annual && p.monthly > p.annual ? Math.round((1 - p.annual / p.monthly) * 100) : null;

// ---------- build the dataset ----------
const schedCat = new Map(schedule.categories.map((c: any) => [c.slug, c]));

// Score weights (sum to 1). Published on /methodology/. Score = 5 + 4.8 × weighted sum, so the range is 5.0–9.8.
export const W = { coverage: 0.45, value: 0.2, free: 0.2, transparency: 0.15 };

function scoreTool(t: any, peers: any[], keys: string[]) {
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
    const raw = (toolsRaw as any[]).filter((t) => t.category === c.slug || t.alsoIn?.includes(c.slug));
    const keys = Object.keys(c.featureLabels);
    const byScore: Tool[] = raw
      .map((t) => {
        const entryPrice = minOrNull(paidPrices(t, 'annual'));
        const entryMonthly = minOrNull(paidPrices(t, 'monthly'));
        // Known pricing = a free plan, a published price, or a stated quote-only plan.
        const hasData = t.freePlan === true || entryPrice != null || entryMonthly != null || t.plans.some((p: Plan) => p.custom || p.oneTime);
        return {
          ...t,
          score: scoreTool(t, raw, keys),
          entryPrice, entryMonthly,
          indexable: hasData && daysOld(t.checked) <= config.maxDataAgeDays,
          publishDate, cat: c.slug, featured: false, unit: t.priceUnit ?? c.priceUnit ?? DEFAULT_UNIT,
        } as Tool;
      })
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
      .map((t, i) => ({ ...t, scoreRank: i + 1 }));
    const pin = byScore.find((t) => t.slug === c.featured);
    const tools = (pin ? [{ ...pin, featured: true }, ...byScore.filter((t) => t !== pin)] : byScore).map((t, i) => ({ ...t, rank: i + 1 }));
    const updated = tools.map((t) => t.checked).sort().pop() || iso(publishDate);
    return {
      ...c, tools, publishDate, comparesDate: addDays(launch, s.comparesDay ?? s.day), updated,
      indexable: tools.filter((t) => t.indexable).length >= 3,
    } as Category;
  });

export const categories = allCategories.filter((c) => isLive(c.publishDate));
export const getCategory = (slug: string) => allCategories.find((c) => c.slug === slug)!;
// One entry per tool: its copy from its primary category, or the first live category it is in.
export const tools: Tool[] = (() => {
  const seen = new Map<string, Tool>();
  for (const c of categories) for (const t of c.tools) {
    const prev = seen.get(t.slug);
    if (!prev || (t.cat === t.category && prev.cat !== prev.category)) seen.set(t.slug, t);
  }
  return [...seen.values()];
})();
export const getTool = (slug: string) => tools.find((t) => t.slug === slug)!;
export const toolCategory = (t: Tool) => getCategory(t.cat);
// Every live category a tool is ranked in, with its position there.
export const rankingsFor = (slug: string) =>
  categories.flatMap((c) => { const t = c.tools.find((x) => x.slug === slug); return t ? [{ c, t }] : []; });
// The highest-scoring tool in a list, ignoring any featured placement.
export const scoreLeader = <T extends Tool>(list: T[]) => [...list].sort((a, b) => a.scoreRank - b.scoreRank)[0];
export const featuredLabel = 'Featured partner';

// ---------- comparisons ----------
export type Compare = { slug: string; a: Tool; b: Tool; category: Category };
export const compares: Compare[] = categories
  .filter((c) => isLive(c.comparesDate))
  .flatMap((c) => {
    const out: Compare[] = [];
    const top = c.tools.slice(0, c.compareTop ?? c.tools.length);
    top.forEach((a, i) => top.slice(i + 1).forEach((b) => out.push({ slug: `${a.slug}-vs-${b.slug}`, a, b, category: c })));
    return out;
  })
  // Two tools that share several categories get one comparison page (the first category wins).
  .filter((x, i, all) => all.findIndex((y) => [y.a.slug, y.b.slug].sort().join() === [x.a.slug, x.b.slug].sort().join()) === i);
export const comparesFor = (t: Tool) => compares.filter((c) => c.a.slug === t.slug || c.b.slug === t.slug);
export const freePagesLive = (c: Category) => isLive(c.comparesDate) && c.tools.some((t) => t.freePlan);

export function compareVerdict(x: Compare) {
  const { a, b, category } = x;
  const lines: string[] = [];
  const winner = a.score >= b.score ? a : b, other = winner === a ? b : a;
  lines.push(`${winner.name} scores ${winner.score}/10 against ${other.score}/10 for ${other.name} on our data score for ${lcName(category.name)}.`);
  if (a.entryPrice != null && b.entryPrice != null && a.entryPrice !== b.entryPrice) {
    const ch = a.entryPrice < b.entryPrice ? a : b, ex = ch === a ? b : a;
    lines.push(`${ch.name} is cheaper to start: paid plans from ${money(ch.entryPrice)} vs ${money(ex.entryPrice)} ${perLong(a)} on annual billing.`);
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
  const top = scoreLeader(c.tools);
  const second = c.tools.filter((t) => t !== top).sort((a, b) => a.scoreRank - b.scoreRank)[0];
  const feat = c.tools.find((t) => t.featured);
  const faqs = [
    { q: `What is the best ${c.singular} in ${today.getUTCFullYear()}?`, a: `${top.name} ranks first on our data score (${top.score}/10). It is best for ${lc1(top.bestFor)}. ${second ? `${second.name} is second (${second.score}/10).` : ''}${feat && feat !== top ? ` ${feat.name} is our featured partner and is listed first (${featuredLabel}); its own score is ${feat.score}/10.` : ''}`.trim() },
  ];
  if (priced.length) faqs.push({ q: `What is the cheapest ${c.singular}?`, a: `${priced[0].name} has the lowest paid entry price in this list at ${money(priced[0].entryPrice)} ${perLong(priced[0])} billed annually${free.length ? `. Free plans are available from ${free.map((t) => t.name).join(', ')}` : ''}.` });
  if (free.length) faqs.push({ q: `Which ${lcName(c.name)} have a free plan?`, a: `${free.map((t) => t.name).join(', ')} offer a free plan. ${(() => { const n = c.tools.filter((t) => !t.freePlan); return n.length ? `${n.map((t) => t.name).join(', ')} ${n.length === 1 ? 'does' : 'do'} not.` : 'Every tool in this list has one.'; })()}`.trim() });
  return [...faqs, ...c.faqs];
}

export function toolFaqs(t: Tool) {
  const c = toolCategory(t);
  const f = [
    { q: `How much does ${t.name} cost?`, a: `${t.name} ${t.freePlan ? 'has a free plan' : 'has no free plan'}${t.entryPrice != null ? ` and paid plans start at ${money(t.entryPrice)} ${perLong(t)} billed annually` : quoteOnly(t) ? `; paid plans are quote-only (contact ${t.name} sales)` : ''}${t.entryMonthly != null ? ` (${money(t.entryMonthly)} billed monthly)` : ''}. Prices last checked ${fmtDate(t.checked)}.` },
    { q: `Is ${t.name} free?`, a: t.freePlan ? `Yes. ${t.freePlanDetails ?? ''}`.trim() : `No. ${t.name} has no permanent free plan${t.trial ? `, but offers a ${lc1(t.trial)}` : ''}.` },
    { q: `What are the best ${t.name} alternatives?`, a: `${c.tools.filter((o) => o.slug !== t.slug).sort((a, b) => a.scoreRank - b.scoreRank).slice(0, 3).map((o) => `${o.name} (${o.score}/10)`).join(', ')} are the highest-scoring alternatives in our ${lcName(c.name)} ranking.` },
  ];
  return f;
}

export const site = config;
export const url = (p: string) => config.url + p;

// ---------- use-case directories ----------
export type UseCase = UseCaseDef & { category: Category; tools: (Tool & { pos: number })[]; excluded: Tool[]; indexable: boolean; path: string };
const matches = (t: Tool, r: UseCaseRule) =>
  (r.platform == null || t.platforms.some((p) => p.toLowerCase().includes(r.platform!.toLowerCase()))) &&
  (r.feature == null || t.features[r.feature] === true) &&
  (r.freePlan == null || t.freePlan === r.freePlan) &&
  (r.maxEntryPrice == null || (t.entryPrice != null && t.entryPrice <= r.maxEntryPrice)) &&
  (r.maxMinSeats == null || t.minSeats <= r.maxMinSeats);
export const MIN_DIRECTORY_TOOLS = 3;
export const useCases: UseCase[] = categories
  .filter((c) => isLive(c.comparesDate))
  .flatMap((c) => (c.useCases ?? []).map((u) => {
    const list = c.tools.filter((t) => matches(t, u.rule));
    return {
      ...u, category: c, path: `/best/${u.slug}/`,
      tools: list.map((t, i) => ({ ...t, pos: i + 1 })),
      excluded: c.tools.filter((t) => !list.includes(t)),
      indexable: c.indexable && list.filter((t) => t.indexable).length >= MIN_DIRECTORY_TOOLS,
    };
  }))
  .filter((u) => u.tools.length > 0);
export const alsoRankedIn = (t: Tool) =>
  useCases.flatMap((u) => { const hit = u.tools.find((x) => x.slug === t.slug); return hit ? [{ u, pos: hit.pos, of: u.tools.length }] : []; });

// ---------- aggregate numbers ("N of M have a free plan") ----------
// Quotable, data-derived statements. Answer engines lift sentences like these verbatim.
const median = (a: number[]) => { const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const monthYear = (s: string) => new Date(s + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
export function listStats(c: Category, list: Tool[] = c.tools) {
  const free = list.filter((t) => t.freePlan);
  const priced = list.filter((t) => t.entryPrice != null).sort((a, b) => a.entryPrice! - b.entryPrice!);
  const features = Object.entries(c.featureLabels).map(([k, label]) => {
    const has = list.filter((t) => t.features[k] === true);
    return { key: k, label, count: has.length, top: has.slice(0, 3) };
  }).sort((a, b) => b.count - a.count);
  const checked = list.map((t) => t.checked).sort();
  return {
    n: list.length, free, priced,
    cheapest: priced[0], priciest: priced[priced.length - 1],
    median: priced.length ? Math.round(median(priced.map((t) => t.entryPrice!)) * 100) / 100 : null,
    features, checkedMonth: checked.length ? monthYear(checked[checked.length - 1]) : '',
  };
}
// `plural` reads naturally in a sentence ("CRMs", not "CRM software"). Set it in categories.json.
export const pluralName = (c: Category) => c.plural ?? lcName(c.name);
export function statSentences(c: Category, list: Tool[] = c.tools, label = pluralName(c)) {
  const s = listStats(c, list);
  const out: { q: string; a: string }[] = [];
  if (s.priced.length) out.push({
    q: `How much do ${label} cost?`,
    a: `Of the ${s.n} ${label} we ranked, ${s.priced.length === s.n ? 'all' : s.priced.length} publish a paid starting price on annual billing. The lowest is ${money(s.cheapest!.entryPrice)}${per(s.cheapest!)} (${s.cheapest!.name})${s.priced.length > 2 ? `, the median is ${money(s.median)}${per(s.cheapest!)}` : ''} and the highest entry price is ${money(s.priciest!.entryPrice)}${per(s.priciest!)} (${s.priciest!.name}). Prices checked ${s.checkedMonth}.`,
  });
  const quotes = list.filter((t) => quoteOnly(t));
  if (quotes.length) out.push({
    q: `How many ${label} publish their prices?`,
    a: `${s.n - quotes.length} of the ${s.n} we ranked publish a price or a free plan; ${quotes.length} ${quotes.length === 1 ? 'is' : 'are'} quote-only: ${quotes.map((t) => t.name).join(', ')}.`,
  });
  out.push({
    q: `How many ${label} have a free plan?`,
    a: s.free.length
      ? `${s.free.length === s.n ? `All ${s.n}` : `${s.free.length} of the ${s.n}`} we ranked have a free plan: ${s.free.map((t) => `${t.name} (${t.score}/10)`).join(', ')}.`
      : `None of the ${s.n} we ranked has a permanent free plan.`,
  });
  const diff = s.features.filter((x) => x.count > 0 && x.count < s.n);
  const all = s.features.filter((x) => x.count === s.n);
  if (diff.length || all.length) out.push({
    q: `Which features set ${label} apart?`,
    a: [
      ...diff.slice(0, 3).map((x) => `${x.label}: ${x.count} of ${s.n} (${x.top.map((t) => t.name).join(', ')}${x.count > 3 ? ' and more' : ''}).`),
      all.length ? `Every tool we ranked confirms ${all.map((x) => lc1(x.label)).join(', ')}, so ${all.length === 1 ? 'it does' : 'these do'} not separate them.` : '',
    ].filter(Boolean).join(' '),
  });
  return out;
}

// ---------- comparison scoreboard ----------
// Yes/no, price and seat checks where both tools have data. "Leads on N checks" is easy to quote.
export function compareChecks(x: Compare) {
  const { a, b, category: c } = x;
  const rows: { label: string; winner: 'a' | 'b' | 'even' }[] = [];
  const bool = (label: string, va: boolean | null | undefined, vb: boolean | null | undefined) => {
    if (va == null || vb == null) return;
    rows.push({ label, winner: va === vb ? 'even' : va ? 'a' : 'b' });
  };
  const lower = (label: string, va: number | null, vb: number | null) => {
    if (va == null || vb == null) return;
    rows.push({ label, winner: va === vb ? 'even' : va < vb ? 'a' : 'b' });
  };
  bool('Free plan', a.freePlan, b.freePlan);
  bool('Free trial', !!a.trial, !!b.trial);
  lower('Lower entry price (annual)', a.entryPrice, b.entryPrice);
  lower('Lower entry price (monthly)', a.entryMonthly, b.entryMonthly);
  lower('Smaller seat minimum', a.minSeats, b.minSeats);
  for (const [k, label] of Object.entries(c.featureLabels)) bool(label, a.features[k], b.features[k]);
  const count = (w: string) => rows.filter((r) => r.winner === w).length;
  return { rows, a: count('a'), b: count('b'), even: count('even') };
}
