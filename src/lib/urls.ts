import { categories, tools, compares, freePagesLive, iso, useCases } from './data';
import { posts } from './posts';

export type UrlEntry = { path: string; lastmod: string; published: string; indexable: boolean };

// Every published page with its dates. Used by sitemap.xml, llms.txt and the IndexNow script.
export function allUrls(): UrlEntry[] {
  const latest = [...categories.map((c) => c.updated), ...posts.map((p) => p.updated)].sort().pop() || iso(new Date());
  const out: UrlEntry[] = [
    { path: '/', lastmod: latest, published: '2000-01-01', indexable: true },
    { path: '/best/', lastmod: latest, published: '2000-01-01', indexable: true },
    { path: '/compare/', lastmod: latest, published: '2000-01-01', indexable: true },
    { path: '/blog/', lastmod: latest, published: '2000-01-01', indexable: true },
    ...['/methodology/', '/about/', '/disclosure/', '/contact/'].map((p) => ({ path: p, lastmod: latest, published: '2000-01-01', indexable: true })),
  ];
  for (const c of categories) {
    out.push({ path: `/best/${c.slug}/`, lastmod: c.updated, published: iso(c.publishDate), indexable: c.indexable });
    if (freePagesLive(c)) out.push({ path: `/best/free-${c.slug}/`, lastmod: c.updated, published: iso(c.comparesDate), indexable: c.indexable });
  }
  for (const u of useCases)
    out.push({ path: u.path, lastmod: u.category.updated, published: iso(u.category.comparesDate), indexable: u.indexable });
  for (const t of tools) {
    for (const suffix of ['', 'pricing/', 'alternatives/'])
      out.push({ path: `/tools/${t.slug}/${suffix}`, lastmod: t.checked, published: iso(t.publishDate), indexable: t.indexable });
  }
  for (const x of compares)
    out.push({ path: `/compare/${x.slug}/`, lastmod: [x.a.checked, x.b.checked].sort().pop()!, published: iso(x.category.comparesDate), indexable: x.a.indexable && x.b.indexable });
  for (const p of posts) out.push({ path: `/blog/${p.slug}/`, lastmod: p.updated, published: p.published, indexable: true });
  return out;
}
