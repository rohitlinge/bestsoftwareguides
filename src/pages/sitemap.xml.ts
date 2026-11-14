import { allUrls } from '../lib/urls';
import { url, PREVIEW } from '../lib/data';

export function GET() {
  const items = PREVIEW ? [] : allUrls().filter((u) => u.indexable);
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items.map((u) => `  <url><loc>${url(u.path)}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}
</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
