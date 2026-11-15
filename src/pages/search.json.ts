import { categories, tools, compares, useCases, toolCategory } from '../lib/data';
import { posts } from '../lib/posts';

// Small index read by the site search box (header, home page and /search/). Published pages only.
export function GET() {
  const items = [
    ...categories.map((c) => ({ t: `Best ${c.name}`, s: `${c.tools.length} tools · ${c.topic}`, p: `/best/${c.slug}/`, k: 'Ranking' })),
    ...useCases.filter((u) => u.indexable).map((u) => ({ t: `Best ${u.name}`, s: `${u.tools.length} tools`, p: u.path, k: 'Ranking' })),
    ...tools.map((t) => ({ t: t.name, s: `${toolCategory(t).name} · ${t.score}/10`, p: `/tools/${t.slug}/`, k: 'Software' })),
    ...compares.map((x) => ({ t: `${x.a.name} vs ${x.b.name}`, s: x.category.name, p: `/compare/${x.slug}/`, k: 'Compare' })),
    ...posts.map((p) => ({ t: p.title, s: `${p.minutes} min read`, p: `/blog/${p.slug}/`, k: 'Guide' })),
  ];
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json' } });
}
