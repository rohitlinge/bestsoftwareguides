import schedule from '../data/schedule.json';
import config from '../../site.config.mjs';
import { addDays, isLive, iso } from './data';

const files = import.meta.glob('../content/blog/*.md', { eager: true }) as Record<string, any>;
const launch = new Date((process.env.LAUNCH_DATE || config.launchDate) + 'T00:00:00Z');
const day = new Map(schedule.posts.map((p: any) => [p.slug, p.day]));

export type Post = { slug: string; title: string; description: string; published: string; updated: string; Content: any; headings: any[] };

export const allPosts: (Post & { date: Date })[] = Object.entries(files)
  .map(([path, mod]) => {
    const slug = path.split('/').pop()!.replace(/\.md$/, '');
    if (!day.has(slug)) return null; // not scheduled = not published
    const date = addDays(launch, day.get(slug)!);
    const fm = mod.frontmatter;
    return { slug, title: fm.title, description: fm.description, published: iso(date), updated: fm.updated && fm.updated > iso(date) ? fm.updated : iso(date), Content: mod.Content, headings: mod.getHeadings?.() ?? [], date };
  })
  .filter(Boolean) as any;

export const posts = allPosts.filter((p) => isLive(p.date)).sort((a, b) => b.date.getTime() - a.date.getTime());
