// Reviews API. Anyone can read approved reviews; writing needs a LinkedIn session.
// Every new or edited review waits for moderation (see /review-guidelines/).
//   GET    /api/reviews?tool=<slug>   approved reviews + summary (+ your own review, any status)
//   POST   /api/reviews               create or edit your review of a tool (JSON body)
//   DELETE /api/reviews?tool=<slug>   delete your review of a tool
import { json, sameOrigin } from './util.js';
import { db, now } from './db.js';
import { currentUser, reviewsEnabled } from './auth.js';
import { loadData } from './mcp.js';
import { RELATIONSHIPS, COMPANY_SIZES, USAGE, LIMITS, DAILY_LIMIT } from './review-options.js';


// Vendor and competitor reviews are shown, labelled, but left out of the average.
const COUNTS_IN_AVERAGE = new Set(['user', 'other']);

const displayName = (r) => {
  if (r.name_mode === 'full') return r.name;
  const first = r.given_name || r.name.split(' ')[0];
  const last = r.family_name || r.name.split(' ').slice(1).join(' ');
  return last ? `${first} ${last[0].toUpperCase()}.` : first;
};

export const publicReview = (r) => ({
  id: r.id, rating: r.rating, title: r.title, pros: r.pros, cons: r.cons,
  role: r.role || null, companySize: r.company_size || null, usage: r.usage || null,
  relationship: r.relationship, relationshipLabel: RELATIONSHIPS[r.relationship],
  author: displayName(r), picture: r.name_mode === 'full' ? r.picture : null,
  verified: 'LinkedIn', date: (r.moderated_at || r.created_at).slice(0, 10),
});

export function summarize(rows) {
  const counted = rows.filter((r) => COUNTS_IN_AVERAGE.has(r.relationship));
  const distribution = [5, 4, 3, 2, 1].map((n) => ({ stars: n, count: counted.filter((r) => r.rating === n).length }));
  const avg = counted.length ? Math.round((counted.reduce((s, r) => s + r.rating, 0) / counted.length) * 10) / 10 : null;
  return { average: avg, count: rows.length, counted: counted.length, distribution };
}

const clean = (s) => String(s ?? '').replace(/\r\n/g, '\n').replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '').replace(/\n{3,}/g, '\n\n').trim();

function validate(body) {
  const errors = [];
  const v = {
    rating: Number(body.rating),
    title: clean(body.title), pros: clean(body.pros), cons: clean(body.cons), role: clean(body.role),
    company_size: COMPANY_SIZES.includes(body.companySize) ? body.companySize : null,
    usage: USAGE.includes(body.usage) ? body.usage : null,
    relationship: body.relationship in RELATIONSHIPS ? body.relationship : null,
    name_mode: body.nameMode === 'full' ? 'full' : 'short',
  };
  if (!Number.isInteger(v.rating) || v.rating < 1 || v.rating > 5) errors.push('Choose a rating from 1 to 5 stars.');
  for (const [k, [min, max]] of Object.entries(LIMITS)) {
    if (v[k].length < min) errors.push(`${k[0].toUpperCase() + k.slice(1)} needs at least ${min} characters.`);
    if (v[k].length > max) errors.push(`${k[0].toUpperCase() + k.slice(1)} can be at most ${max} characters.`);
  }
  if (!v.relationship) errors.push('Tell us how you are connected to this product.');
  if (body.consent !== true) errors.push('Please confirm the review is your own honest experience.');
  return { v, errors };
}

export async function handleReviews(request, env) {
  if (!reviewsEnabled(env)) return json({ enabled: false, error: 'Reviews are not switched on yet.' }, 503);
  const d = db(env);
  await d.ready;
  const url = new URL(request.url);
  const user = await currentUser(request, env);
  const data = await loadData(env);

  if (request.method === 'GET') {
    const tool = url.searchParams.get('tool');
    if (!tool || !data.tools[tool]) return json({ error: 'Unknown tool' }, 404);
    const { results } = await d.DB.prepare(`SELECT r.*, u.name, u.given_name, u.family_name, u.picture FROM reviews r JOIN users u ON u.id = r.user_id
      WHERE r.tool = ?1 AND r.status = 'approved' ORDER BY r.moderated_at DESC LIMIT 200`).bind(tool).all();
    let mine = null;
    if (user) {
      const m = await d.DB.prepare('SELECT * FROM reviews WHERE tool = ?1 AND user_id = ?2').bind(tool, user.id).first();
      if (m) mine = { rating: m.rating, title: m.title, pros: m.pros, cons: m.cons, role: m.role, companySize: m.company_size, usage: m.usage, relationship: m.relationship, nameMode: m.name_mode, status: m.status, rejectReason: m.reject_reason };
    }
    return json({ enabled: true, tool, summary: summarize(results), reviews: results.map(publicReview), mine });
  }

  if (!sameOrigin(request)) return json({ error: 'Cross-site request refused' }, 403);
  if (!user) return json({ error: 'Sign in with LinkedIn first.' }, 401);

  if (request.method === 'POST') {
    let body;
    try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }
    if (!body.tool || !data.tools[body.tool]) return json({ error: 'Unknown tool' }, 404);
    const { v, errors } = validate(body);
    if (errors.length) return json({ error: errors.join(' '), errors }, 422);
    const since = new Date(Date.now() - 86400000).toISOString();
    const recent = await d.DB.prepare('SELECT COUNT(*) AS n FROM reviews WHERE user_id = ?1 AND updated_at > ?2').bind(user.id, since).first();
    if (recent.n >= DAILY_LIMIT) return json({ error: `You can submit up to ${DAILY_LIMIT} reviews a day. Please try again tomorrow.` }, 429);
    const t = now();
    // Make sure the member row exists (the session may predate the database).
    await d.DB.prepare(`INSERT INTO users (id, name, picture, email, email_verified, created_at, last_login) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?6) ON CONFLICT(id) DO NOTHING`)
      .bind(user.id, user.name, user.picture, user.email, user.emailVerified ? 1 : 0, t).run();
    await d.DB.prepare(`INSERT INTO reviews (tool, user_id, rating, title, pros, cons, role, company_size, usage, relationship, name_mode, status, created_at, updated_at)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, 'pending', ?12, ?12)
      ON CONFLICT(tool, user_id) DO UPDATE SET rating=?3, title=?4, pros=?5, cons=?6, role=?7, company_size=?8, usage=?9, relationship=?10, name_mode=?11,
        status='pending', reject_reason=NULL, moderated_at=NULL, updated_at=?12`)
      .bind(body.tool, user.id, v.rating, v.title, v.pros, v.cons, v.role || null, v.company_size, v.usage, v.relationship, v.name_mode, t).run();
    return json({ ok: true, status: 'pending', message: 'Thanks! Your review is waiting for moderation, usually within 2 working days.' });
  }

  if (request.method === 'DELETE') {
    const tool = url.searchParams.get('tool');
    await d.DB.prepare('DELETE FROM reviews WHERE tool = ?1 AND user_id = ?2').bind(tool, user.id).run();
    return json({ ok: true });
  }

  return json({ error: 'Method not allowed' }, 405);
}
