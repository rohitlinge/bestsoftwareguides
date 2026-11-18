import { defineConfig } from 'astro/config';
import config from './site.config.mjs';

// The publishing schedule is resolved here, in Node, and baked into the build as constants.
// Pages may be prerendered inside the Cloudflare Workers runtime (Workers Builds), where
// `new Date()` at module scope returns 1970-01-01 and `process.env` can be empty. Reading the
// date there made every scheduled page look like it was in the future, so nothing was published.
const BUILD_DATE = process.env.BUILD_DATE || new Date().toISOString().slice(0, 10);
const LAUNCH_DATE = process.env.LAUNCH_DATE || config.launchDate;
const PREVIEW = process.env.PREVIEW === '1';

// Approved user-review totals, fetched once per build from the live site's reviews API, so tool
// pages can show star ratings (and AggregateRating markup) without any request at page load.
// If the API can't be reached the build carries on with no ratings rather than failing.
async function reviewSummary() {
  if (process.env.SKIP_REVIEWS === '1') return {};
  try {
    const r = await fetch(`${config.url.replace(/\/$/, '')}/api/reviews/summary`, { signal: AbortSignal.timeout(8000) });
    if (!r.ok) return {};
    return (await r.json()).tools ?? {};
  } catch {
    return {};
  }
}
const REVIEW_SUMMARY = await reviewSummary();

export default defineConfig({
  site: config.url,
  trailingSlash: 'always',
  build: { format: 'directory' },
  vite: {
    define: {
      __BUILD_DATE__: JSON.stringify(BUILD_DATE),
      __LAUNCH_DATE__: JSON.stringify(LAUNCH_DATE),
      __PREVIEW__: JSON.stringify(PREVIEW),
      __REVIEW_SUMMARY__: JSON.stringify(REVIEW_SUMMARY),
    },
  },
});
