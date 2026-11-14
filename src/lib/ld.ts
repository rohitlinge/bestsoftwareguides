import { url, site, money, type Tool, type Category } from './data';

export const crumbsLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: url(it.path) })),
});

export const faqLd = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const softwareLd = (t: Tool, c: Category) => {
  const prices = t.plans.flatMap((p) => [p.annual, p.monthly]).filter((v): v is number => typeof v === 'number');
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: t.name,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: c.name,
    operatingSystem: t.platforms.join(', '),
    url: t.website,
    description: t.description,
    ...(prices.length
      ? { offers: { '@type': 'AggregateOffer', priceCurrency: 'USD', lowPrice: Math.min(...prices), highPrice: Math.max(...prices), offerCount: t.plans.length, url: t.pricingUrl } }
      : {}),
  };
};

export const itemListLd = (c: Category, path: string) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: `Best ${c.name}`,
  url: url(path),
  numberOfItems: c.tools.length,
  itemListElement: c.tools.map((t) => ({ '@type': 'ListItem', position: t.rank, name: t.name, url: url(`/tools/${t.slug}/`) })),
});

export const articleLd = (o: { headline: string; description: string; path: string; published: string; modified: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: o.headline,
  description: o.description,
  mainEntityOfPage: url(o.path),
  datePublished: o.published,
  dateModified: o.modified,
  author: { '@type': 'Organization', name: site.editor.name, url: url(site.editor.url) },
  publisher: { '@type': 'Organization', name: site.name, url: site.url },
});

export { money };
