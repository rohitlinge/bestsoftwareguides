// Pings IndexNow (Bing, Yandex, Seznam, Naver...) with pages published or updated today.
// Bing's index matters for ChatGPT search, so fast discovery helps new pages get cited sooner.
// Usage: node scripts/indexnow.mjs            -> URLs published/updated today (UTC)
//        node scripts/indexnow.mjs --all      -> every indexable URL (use once after first launch)
import fs from 'node:fs';
import config from '../site.config.mjs';

const all = process.argv.includes('--all');
const today = (process.env.BUILD_DATE || new Date().toISOString().slice(0, 10));
const manifest = JSON.parse(fs.readFileSync(new URL('../dist/urls.json', import.meta.url), 'utf8'));
const urls = manifest
  .filter((u) => u.indexable && (all || u.published === today || u.lastmod === today))
  .map((u) => u.url);

if (!urls.length) {
  console.log(`IndexNow: nothing new for ${today}.`);
  process.exit(0);
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: config.domain,
    key: config.indexNowKey,
    keyLocation: `${config.url}/${config.indexNowKey}.txt`,
    urlList: urls.slice(0, 10000),
  }),
});
console.log(`IndexNow: submitted ${urls.length} URL(s), HTTP ${res.status}`);
if (res.status >= 400) console.log(await res.text());
