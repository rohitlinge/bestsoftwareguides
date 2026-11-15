import { url, site, money, type Tool, type Category } from './data';

// Author: a real Person (with jobTitle and sameAs profiles) once site.config names one, otherwise the Organization.
export const authorLd = () => {
  const e: any = site.editor;
  if (e.type === 'Person')
    return {
      '@type': 'Person', name: e.name, url: url(e.url),
      ...(e.jobTitle ? { jobTitle: e.jobTitle } : {}),
      ...(e.bio ? { description: e.bio } : {}),
      ...(e.sameAs?.length ? { sameAs: e.sameAs } : {}),
      worksFor: { '@id': url('/#organization') },
    };
  return { '@type': 'Organization', name: e.name, url: url(e.url) };
};

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
    // Editorial review of a third-party product (not self-serving). No aggregateRating yet: user reviews load in the browser, not at build time.
    review: {
      '@type': 'Review',
      author: authorLd(),
      datePublished: t.checked,
      reviewRating: { '@type': 'Rating', ratingValue: t.score, bestRating: 10, worstRating: 0 },
      reviewBody: `${t.tagline} Best for ${t.bestFor.charAt(0).toLowerCase() + t.bestFor.slice(1)}.`,
    },
  };
};

export const itemListLd = (c: { name: string; tools: (Tool & { pos?: number })[] }, path: string, name = `Best ${c.name}`) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name,
  url: url(path),
  numberOfItems: c.tools.length,
  itemListElement: c.tools.map((t, i) => ({ '@type': 'ListItem', position: t.pos ?? i + 1, name: t.name, url: url(`/tools/${t.slug}/`) })),
});

export const collectionLd = (o: { name: string; description: string; path: string; modified: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: o.name,
  description: o.description,
  url: url(o.path),
  dateModified: o.modified,
  isPartOf: { '@id': url('/#website') },
});

export const articleLd = (o: { headline: string; description: string; path: string; published: string; modified: string; type?: string }) => ({
  '@context': 'https://schema.org',
  '@type': o.type ?? 'Article',
  headline: o.headline,
  description: o.description,
  mainEntityOfPage: url(o.path),
  datePublished: o.published,
  dateModified: o.modified > o.published ? o.modified : o.published,
  author: authorLd(),
  publisher: { '@id': url('/#organization') },
});

export { money };
