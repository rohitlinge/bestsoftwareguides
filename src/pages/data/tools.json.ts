import { tools, site, url } from '../../lib/data';

// Open, citable dataset of every published tool record.
export function GET() {
  const data = {
    source: site.name,
    url: url('/data/tools.json'),
    license: 'Free to reuse with attribution and a link to the page used.',
    generated: new Date().toISOString(),
    tools: tools.map(({ publishDate, indexable, ...t }) => ({ ...t, page: url(`/tools/${t.slug}/`) })),
  };
  return new Response(JSON.stringify(data, null, 2), { headers: { 'Content-Type': 'application/json' } });
}
