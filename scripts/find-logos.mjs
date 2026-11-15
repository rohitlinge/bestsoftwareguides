// Finds each tool's official icon on the vendor's own website and stores its URL as `logo` in
// src/data/tools.json. Pages show the image straight from the vendor's server, with the lettered
// tile underneath as a fallback if it fails to load.
//
//   node scripts/find-logos.mjs            # only tools without a logo
//   node scripts/find-logos.mjs --all      # re-check every tool
//   node scripts/find-logos.mjs --dry-run  # print, don't write
//
// It reads <link rel="apple-touch-icon"> and <link rel="icon"> from the homepage, prefers the largest
// square icon, and keeps a URL only if it answers 200 with an image content type. Tools hosted on
// GitHub are skipped (the icon would be GitHub's or a person's avatar). Set `logo` by hand to override,
// or to "" to keep the lettered tile.
import fs from 'node:fs';

const FILE = new URL('../src/data/tools.json', import.meta.url);
const UA = 'BestSoftwareGuidesBot/1.0 (+https://bestsoftwareguides.online/methodology/)';
const args = new Set(process.argv.slice(2));
const raw = fs.readFileSync(FILE, 'utf8');
const tools = JSON.parse(raw);

// Sites whose product page lives on a docs or help subdomain: read the main brand site instead.
const HOME_OVERRIDE = { 'onlinehelp.informatica.com': 'https://www.informatica.com/' };
const SKIP_HOSTS = new Set(['github.com']);

async function get(url, accept = 'text/html') {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 15000);
  try {
    return await fetch(url, { headers: { 'User-Agent': UA, Accept: accept }, redirect: 'follow', signal: ctl.signal });
  } finally { clearTimeout(timer); }
}

const attr = (tag, name) => tag.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'))?.slice(2).find((v) => v != null);

function candidates(html, base) {
  const out = [];
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    const rel = (attr(tag, 'rel') ?? '').toLowerCase();
    const href = attr(tag, 'href');
    if (!href || !/(^|\s)(apple-touch-icon|apple-touch-icon-precomposed|icon)(\s|$)/.test(rel)) continue;
    const sizes = attr(tag, 'sizes') ?? '';
    const type = attr(tag, 'type') ?? '';
    const px = Number(sizes.match(/(\d+)x\d+/i)?.[1] ?? 0);
    const svg = /svg/i.test(type) || /\.svg(\?|$)/i.test(href);
    // Score: big apple-touch icons first, then SVG, then sized PNGs, then the rest.
    let score = rel.includes('apple-touch-icon') ? 300 + (px || 180) : svg ? 400 : px ? px : 10;
    if (px && px < 32) score -= 50;
    try { out.push({ url: new URL(href.replace(/&amp;/g, '&'), base).href, score }); } catch {}
  }
  return out.sort((a, b) => b.score - a.score);
}

async function isImage(url) {
  try {
    const r = await get(url, 'image/*');
    const type = r.headers.get('content-type') ?? '';
    if (!r.ok || !/^image\//i.test(type)) return false;
    const buf = await r.arrayBuffer();
    return buf.byteLength > 100;
  } catch { return false; }
}

async function findLogo(t) {
  const site = new URL(t.website);
  if (SKIP_HOSTS.has(site.hostname)) return { logo: null, why: 'hosted on GitHub' };
  const home = HOME_OVERRIDE[site.hostname] ?? `${site.origin}/`;
  let html = '', base = home;
  try {
    const r = await get(home);
    base = r.url || home;
    html = await r.text();
  } catch (e) { /* fall through to the default paths */ }
  const origin = new URL(base).origin;
  const list = [...candidates(html, base), { url: `${origin}/apple-touch-icon.png`, score: 100 }, { url: `${origin}/favicon.ico`, score: 0 }].sort((a, b) => b.score - a.score);
  const seen = new Set();
  for (const c of list) {
    if (seen.has(c.url)) continue;
    seen.add(c.url);
    if (await isImage(c.url)) return { logo: c.url };
  }
  return { logo: null, why: 'no icon found' };
}

const todo = tools.filter((t) => args.has('--all') || t.logo === undefined);
const results = [];
for (let i = 0; i < todo.length; i += 6) {
  results.push(...(await Promise.all(todo.slice(i, i + 6).map(async (t) => ({ t, ...(await findLogo(t)) })))));
}
for (const r of results) {
  console.log(`${r.logo ? 'ok  ' : 'MISS'} ${r.t.slug.padEnd(40)} ${r.logo ?? r.why}`);
  if (r.logo) r.t.logo = r.logo;
}
if (!args.has('--dry-run')) {
  // Keep `logo` next to `website` so records stay readable.
  const ordered = tools.map((t) => {
    if (t.logo === undefined) return t;
    const o = {};
    for (const [k, v] of Object.entries(t)) { if (k === 'logo') continue; o[k] = v; if (k === 'website') o.logo = t.logo; }
    return o;
  });
  fs.writeFileSync(FILE, JSON.stringify(ordered, null, 2) + '\n');
  console.log(`\nWrote ${results.filter((r) => r.logo).length} logo URLs to src/data/tools.json`);
}
