// Pings IndexNow with pages that were published, updated or removed, so Bing (and Copilot) refresh them.
// Bing shares IndexNow submissions with the other IndexNow engines (Yandex, Seznam, Naver...).
// Usage:
//   node scripts/indexnow.mjs                         URLs published/updated today (UTC), from dist/urls.json
//   node scripts/indexnow.mjs --live                  same, from the live site's /urls.json
//   node scripts/indexnow.mjs --live --before old.json   also report URLs that disappeared since old.json
//   node scripts/indexnow.mjs --all                   every indexable URL (use rarely, e.g. after launch)
// Bing's endpoint is used directly: on 2026-11-15 api.indexnow.org answered "SiteVerificationNotCompleted"
// for this key while www.bing.com/indexnow accepted the same submission.
import fs from 'node:fs';
import config from '../site.config.mjs';

const args = process.argv.slice(2);
const all = args.includes('--all');
const live = args.includes('--live');
const beforeFile = args.includes('--before') ? args[args.indexOf('--before') + 1] : null;
const today = process.env.BUILD_DATE || new Date().toISOString().slice(0, 10);

const manifest = live
  ? await (await fetch(`${config.url}/urls.json`, { headers: { 'Cache-Control': 'no-cache' } })).json()
  : JSON.parse(fs.readFileSync(new URL('../dist/urls.json', import.meta.url), 'utf8'));

const changed = manifest.filter((u) => u.indexable && (all || u.published === today || u.lastmod === today)).map((u) => u.url);

// URLs that were in the previous manifest but are gone (or no longer indexable) now: tell Bing to recrawl
// them, so it sees the 404 / noindex and drops them.
let removed = [];
if (beforeFile && fs.existsSync(beforeFile)) {
  const before = JSON.parse(fs.readFileSync(beforeFile, 'utf8'));
  const nowIndexable = new Set(manifest.filter((u) => u.indexable).map((u) => u.url));
  removed = before.filter((u) => u.indexable && !nowIndexable.has(u.url)).map((u) => u.url);
}

const urls = [...new Set([...changed, ...removed])];
if (!urls.length) {
  console.log(`IndexNow: nothing new, updated or removed for ${today}.`);
  process.exit(0);
}

const res = await fetch('https://www.bing.com/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: config.domain,
    key: config.indexNowKey,
    keyLocation: `${config.url}/${config.indexNowKey}.txt`,
    urlList: urls.slice(0, 10000),
  }),
});
console.log(`IndexNow: submitted ${urls.length} URL(s) (${changed.length} new/updated, ${removed.length} removed), HTTP ${res.status}`);
if (res.status >= 400) {
  console.log(await res.text());
  process.exit(1);
}
