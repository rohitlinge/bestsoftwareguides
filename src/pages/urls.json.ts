import { allUrls } from '../lib/urls';
import { url } from '../lib/data';

// Manifest of published URLs with publish dates; read by scripts/indexnow.mjs after each deploy.
export function GET() {
  return new Response(JSON.stringify(allUrls().map((u) => ({ ...u, url: url(u.path) }))), { headers: { 'Content-Type': 'application/json' } });
}
