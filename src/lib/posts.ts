import schedule from '../data/schedule.json';
import config from '../../site.config.mjs';
import { addDays, isLive, iso } from './data';

const files = import.meta.glob('../content/blog/*.md', { eager: true }) as Record<string, any>;
const launch = new Date((process.env.LAUNCH_DATE || config.launchDate) + 'T00:00:00Z');
const day = new Map(schedule.posts.map((p: any) => [p.slug, p.day]));

// Guide types, as frontmatter `type:`. Mirrors the sections answer engines pull from most:
// step-by-step how-tos, fixes, explainers, buying guides and data-led pricing reports.
export const POST_TYPES = {
  'pricing-report': 'Pricing Report',
  'buying-guide': 'Buying Guide',
  'how-to': 'How-To',
  'fix-it': 'Fix It',
  explained: 'Explained',
} as const;
export type PostType = keyof typeof POST_TYPES;

export type Post = {
  slug: string; title: string; description: string; published: string; updated: string; Content: any; headings: any[];
  type: PostType; category: string | null; minutes: number;
};

export const allPosts: (Post & { date: Date })[] = Object.entries(files)
  .map(([path, mod]) => {
    const slug = path.split('/').pop()!.replace(/\.md$/, '');
    if (!day.has(slug)) return null; // not scheduled = not published
    const date = addDays(launch, day.get(slug)!);
    const fm = mod.frontmatter;
    const raw: string = mod.rawContent?.() ?? '';
    const words = raw.replace(/\|/g, ' ').split(/\s+/).filter(Boolean).length;
    return {
      slug, title: fm.title, description: fm.description, published: iso(date),
      updated: fm.updated && fm.updated > iso(date) ? fm.updated : iso(date),
      Content: mod.Content, headings: mod.getHeadings?.() ?? [], date,
      type: (fm.type in POST_TYPES ? fm.type : 'buying-guide') as PostType,
      category: fm.category ?? null,
      minutes: Math.max(1, Math.round(words / 230)),
    };
  })
  .filter(Boolean) as any;

export const posts = allPosts.filter((p) => isLive(p.date)).sort((a, b) => b.date.getTime() - a.date.getTime());
