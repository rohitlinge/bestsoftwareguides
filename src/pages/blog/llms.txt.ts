import { url } from '../../lib/data';
import { posts, POST_TYPES } from '../../lib/posts';

// /blog/llms.txt: focused index of every guide.
export function GET() {
  const lines = [
    '# BestSoftwareGuides guides',
    '',
    '> Pricing reports, how-tos and explainers built on the same dated pricing data. Add .md to any guide URL for its markdown source.',
    '',
    ...posts.map((p) => `- [${p.title}](${url(`/blog/${p.slug}/`)}) ([md](${url(`/blog/${p.slug}.md`)})) — ${POST_TYPES[p.type]}, updated ${p.updated}: ${p.description}`),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
