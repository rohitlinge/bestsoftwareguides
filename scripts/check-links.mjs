// Checks every internal link in dist/ points to a built page. Usage: node scripts/check-links.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const files = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.html') && files.push(path.join(d, e.name))));
walk(dist);
const exists = (p) => {
  const clean = p.split('#')[0].split('?')[0];
  const f = path.join(dist, clean);
  return fs.existsSync(f) && (fs.statSync(f).isFile() || fs.existsSync(path.join(f, 'index.html')));
};
// Served by the Worker (worker/index.js), not from dist/.
const WORKER_ROUTES = ['/api/', '/mcp', '/auth/', '/admin/'];
let bad = 0;
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  for (const m of html.matchAll(/href="(\/[^"]*)"/g)) {
    if (WORKER_ROUTES.some((r) => m[1].startsWith(r))) continue;
    if (!exists(m[1])) { bad++; console.log(`${f.replace(dist, '/')} -> ${m[1]}`); }
  }
}
console.log(`${files.length} pages checked, ${bad} broken internal links`);
process.exit(bad ? 1 : 0);
