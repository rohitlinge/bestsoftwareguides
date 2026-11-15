// Moderation: /admin/reviews (page) and POST /api/admin/reviews (approve / reject / delete).
// Only members signed in with a LinkedIn-verified email listed in ADMIN_EMAILS can use it.
import { json, esc, sameOrigin } from './util.js';
import { db, now } from './db.js';
import { currentUser, isAdmin, reviewsEnabled } from './auth.js';
import { RELATIONSHIPS, REJECT_REASONS } from './review-options.js';
import { loadData } from './mcp.js';

const page = (title, body, status = 200) => new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${esc(title)}</title>
<style>
:root{--ink:#0b0d12;--ink2:#4b5563;--line:#e5e7eb;--bg2:#f6f8fc;--brand:#1d4ed8;--dark:#07090d}
*{box-sizing:border-box}body{margin:0;font-family:"Segoe UI",system-ui,sans-serif;color:var(--ink);background:var(--bg2);line-height:1.5}
header{background:var(--dark);color:#fff;padding:14px 20px;display:flex;gap:16px;align-items:center}header a{color:#c3cad6}header strong{margin-right:auto}
main{max-width:980px;margin:0 auto;padding:20px}nav.tabs{display:flex;gap:6px;margin-bottom:16px}nav.tabs a{padding:7px 14px;border-radius:8px;background:#fff;border:1px solid var(--line);color:var(--ink);text-decoration:none;font-weight:600}
nav.tabs a.on{background:var(--brand);color:#fff;border-color:var(--brand)}
.r{background:#fff;border:1px solid var(--line);border-radius:12px;padding:16px 18px;margin:12px 0}.meta{color:var(--ink2);font-size:.88rem}
.stars{color:var(--brand);letter-spacing:2px}.flag{display:inline-block;background:#111622;color:#fff;border-radius:99px;padding:1px 8px;font-size:.75rem;margin-left:6px}
pre{white-space:pre-wrap;font:inherit;margin:4px 0 10px}button,select{font:inherit;padding:7px 12px;border-radius:8px;border:1px solid #d1d5db;background:#fff;cursor:pointer}
button.ok{background:var(--brand);color:#fff;border-color:var(--brand)}.row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px}
</style></head><body><header><strong>BestSoftwareGuides · Review moderation</strong><a href="/review-guidelines/">Guidelines</a><a href="/auth/logout?return=/">Sign out</a></header><main>${body}</main></body></html>`,
{ status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' } });

export async function handleAdmin(request, env, pathname) {
  if (!reviewsEnabled(env)) return page('Reviews off', '<p>Reviews are not switched on yet (LinkedIn secrets or database missing).</p>', 503);
  const user = await currentUser(request, env);

  if (pathname === '/api/admin/reviews') {
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
    if (!sameOrigin(request)) return json({ error: 'Cross-site request refused' }, 403);
    if (!isAdmin(user, env)) return json({ error: 'Admins only' }, 403);
    const d = db(env); await d.ready;
    let body; try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }
    const id = Number(body.id);
    if (!Number.isInteger(id)) return json({ error: 'Bad id' }, 400);
    if (body.action === 'approve') {
      await d.DB.prepare(`UPDATE reviews SET status='approved', reject_reason=NULL, moderated_at=?2 WHERE id=?1`).bind(id, now()).run();
    } else if (body.action === 'reject') {
      if (!(body.reason in REJECT_REASONS)) return json({ error: 'Pick a published reason' }, 422);
      await d.DB.prepare(`UPDATE reviews SET status='rejected', reject_reason=?2, moderated_at=?3 WHERE id=?1`).bind(id, body.reason, now()).run();
    } else return json({ error: 'Unknown action' }, 400);
    return json({ ok: true });
  }

  // /admin/reviews
  if (!user) return page('Sign in', `<p>Sign in with the LinkedIn account whose email is listed as an admin.</p><p><a href="/auth/linkedin/start?return=/admin/reviews">Sign in with LinkedIn</a></p>`, 401);
  if (!isAdmin(user, env)) return page('Not allowed', `<p>${esc(user.name)}, this LinkedIn account is not an admin. Admins are set with the ADMIN_EMAILS secret, and the email must be verified on LinkedIn.</p>`, 403);

  const d = db(env); await d.ready;
  const status = ['pending', 'approved', 'rejected'].includes(new URL(request.url).searchParams.get('status')) ? new URL(request.url).searchParams.get('status') : 'pending';
  const counts = Object.fromEntries((await d.DB.prepare(`SELECT status, COUNT(*) AS n FROM reviews GROUP BY status`).all()).results.map((r) => [r.status, r.n]));
  const { results } = await d.DB.prepare(`SELECT r.*, u.name, u.email, u.email_verified FROM reviews r JOIN users u ON u.id = r.user_id
    WHERE r.status = ?1 ORDER BY r.updated_at ${status === 'pending' ? 'ASC' : 'DESC'} LIMIT 200`).bind(status).all();
  const data = await loadData(env);
  const reasonOptions = Object.entries(REJECT_REASONS).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');
  const cards = results.map((r) => `
  <div class="r" id="r${r.id}">
    <div><span class="stars" aria-label="${r.rating} of 5">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
      <strong>${esc(r.title)}</strong>${r.relationship !== 'user' ? `<span class="flag">${esc(RELATIONSHIPS[r.relationship])}</span>` : ''}</div>
    <div class="meta">${esc(data.tools[r.tool]?.name ?? r.tool)} · by ${esc(r.name)} (${esc(r.email ?? 'no email')}${r.email_verified ? ', verified' : ''})${r.name_mode === 'anon' ? ' · <strong>shown publicly as "Anonymous reviewer"</strong>' : ''}${r.role ? ` · ${esc(r.role)}` : ''}${r.company_size ? ` · ${esc(r.company_size)} employees` : ''}${r.usage ? ` · used ${esc(r.usage)}` : ''} · updated ${esc(r.updated_at.slice(0, 16).replace('T', ' '))}${r.reject_reason ? ` · rejected: ${esc(REJECT_REASONS[r.reject_reason] ?? r.reject_reason)}` : ''}</div>
    <p><strong>Likes</strong></p><pre>${esc(r.pros)}</pre><p><strong>Dislikes</strong></p><pre>${esc(r.cons)}</pre>
    <div class="row">
      ${r.status !== 'approved' ? `<button class="ok" data-id="${r.id}" data-action="approve">Approve</button>` : ''}
      ${r.status !== 'rejected' ? `<select data-reason="${r.id}"><option value="">Reject because…</option>${reasonOptions}</select><button data-id="${r.id}" data-action="reject">Reject</button>` : ''}
      <a href="/tools/${esc(r.tool)}/#reviews" target="_blank" rel="noopener">View tool page</a>
    </div>
  </div>`).join('');
  const tabs = ['pending', 'approved', 'rejected'].map((s) => `<a class="${s === status ? 'on' : ''}" href="?status=${s}">${s[0].toUpperCase() + s.slice(1)} (${counts[s] ?? 0})</a>`).join('');
  return page('Review moderation', `
  <p class="meta">Signed in as ${esc(user.name)}. Approve every honest first-hand review, positive or negative. Reject only for a published reason.</p>
  <nav class="tabs">${tabs}</nav>
  ${cards || `<p>No ${status} reviews.</p>`}
  <script>
  document.addEventListener('click', async (e) => {
    const b = e.target.closest('button[data-action]'); if (!b) return;
    const id = b.dataset.id, action = b.dataset.action;
    const reason = action === 'reject' ? document.querySelector('[data-reason="' + id + '"]').value : undefined;
    if (action === 'reject' && !reason) { alert('Pick a reason first.'); return; }
    b.disabled = true;
    const r = await fetch('/api/admin/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action, reason }) });
    const j = await r.json();
    if (j.ok) document.getElementById('r' + id).remove(); else { alert(j.error || 'Failed'); b.disabled = false; }
  });
  </script>`);
}
