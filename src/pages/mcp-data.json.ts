import { categories, tools, compares, useCases, rankingsFor, toolCategory, featuredLabel, priceLine, site, url, iso, buildDate } from '../lib/data';
import { posts } from '../lib/posts';

// Compact snapshot of everything published, read by the MCP server (worker/index.js) at /mcp.
// Built here so the server answers from exactly the data the pages show, including featured
// placements and the publishing schedule. Not meant for people: see /data/tools.json for open data.
export function GET() {
  const data = {
    site: { name: site.name, url: site.url, methodology: url('/methodology/'), disclosure: url('/disclosure/') },
    built: iso(buildDate),
    featuredLabel,
    categories: categories.map((c) => ({
      slug: c.slug, name: c.name, topic: c.topic, updated: c.updated, url: url(`/best/${c.slug}/`),
      unit: c.priceUnit?.long ?? 'user/month', // a tool can override this; its priceSummary always states its own unit
      features: c.featureLabels,
      // In page order: a featured partner (if any) first, then score order.
      tools: c.tools.map((t) => ({ slug: t.slug, rank: t.rank, scoreRank: t.scoreRank, score: t.score, ...(t.featured ? { featured: true } : {}) })),
    })),
    useCases: useCases.filter((u) => u.indexable).map((u) => ({
      slug: u.slug, name: u.name, category: u.category.slug, rule: u.ruleText, url: url(u.path), tools: u.tools.map((t) => t.slug),
    })),
    tools: Object.fromEntries(tools.map((t) => [t.slug, {
      name: t.name, tagline: t.tagline, bestFor: t.bestFor, description: t.description,
      category: toolCategory(t).slug, website: t.website, logo: t.logo || undefined,
      freePlan: t.freePlan, freePlanDetails: t.freePlanDetails, trial: t.trial, minSeats: t.minSeats,
      priceSummary: priceLine(t), entryPrice: t.entryPrice, entryMonthly: t.entryMonthly, unit: t.unit.long,
      plans: t.plans, pricingUrl: t.pricingUrl, checked: t.checked, verification: t.verification,
      platforms: t.platforms, pros: t.pros, cons: t.cons,
      founded: t.founded, hq: t.hq, integrations: t.integrations, compliance: t.compliance, support: t.support,
      // feature flags per category the tool is ranked in, keyed by the category's labels
      rankings: rankingsFor(t.slug).map((x) => ({
        category: x.c.slug, rank: x.t.rank, scoreRank: x.t.scoreRank, of: x.c.tools.length, score: x.t.score,
        ...(x.t.featured ? { featured: true } : {}),
        features: Object.fromEntries(Object.entries(x.c.featureLabels).map(([k, label]) => [label, x.t.features[k] ?? null])),
      })),
      sources: t.sources,
      url: url(`/tools/${t.slug}/`), pricingPage: url(`/tools/${t.slug}/pricing/`), alternativesPage: url(`/tools/${t.slug}/alternatives/`),
    }])),
    compares: compares.map((x) => ({ a: x.a.slug, b: x.b.slug, category: x.category.slug, url: url(`/compare/${x.slug}/`) })),
    guides: posts.map((p) => ({ title: p.title, description: p.description, updated: p.updated, url: url(`/blog/${p.slug}/`) })),
  };
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
}
