import { posts } from '../lib/posts';
import { categories, url, site } from '../lib/data';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function GET() {
  const items = [
    ...posts.map((p) => ({ title: p.title, link: url(`/blog/${p.slug}/`), date: p.date, desc: p.description })),
    ...categories.map((c) => ({ title: `Best ${c.name}`, link: url(`/best/${c.slug}/`), date: c.publishDate, desc: c.intro })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${esc(site.name)}</title><link>${site.url}</link><description>${esc(site.description)}</description>
${items.map((i) => `<item><title>${esc(i.title)}</title><link>${i.link}</link><guid>${i.link}</guid><pubDate>${i.date.toUTCString()}</pubDate><description>${esc(i.desc)}</description></item>`).join('\n')}
</channel></rss>`;
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml' } });
}
