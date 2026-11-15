// Browser-side search over /search.json. Shared by the search box and the /search/ page.
export type Item = { t: string; s: string; p: string; k: string };

let index: Promise<Item[]> | null = null;
export const load = () => (index ??= fetch('/search.json').then((r) => r.json()).catch(() => []));

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^\w\s]/g, ' ');
const reEsc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

// Every query word must appear. Ranked by title prefix (ignoring a leading "Best"), then word-start
// matches; rankings, then software, win ties.
export function search(items: Item[], q: string, limit = 8) {
  const words = norm(q).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const scored: [number, Item][] = [];
  for (const it of items) {
    const full = norm(it.t);
    const title = full.replace(/^best\s+/, '');
    const hay = `${full} ${norm(it.s)}`;
    if (!words.every((w) => hay.includes(w))) continue;
    let s = title.startsWith(words[0]) ? 10 : 0;
    for (const w of words) if (new RegExp(`(^|\\s)${reEsc(w)}`).test(title)) s += 3;
    if (it.k === 'Ranking') s += 2;
    else if (it.k === 'Software') s += 1;
    scored.push([s, it]);
  }
  return scored.sort((a, b) => b[0] - a[0]).slice(0, limit).map((x) => x[1]);
}
