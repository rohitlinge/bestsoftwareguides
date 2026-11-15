// "Sign In with LinkedIn using OpenID Connect" (scopes: openid profile email).
// LinkedIn returns the member's name, photo, email and a stable id. It does NOT return job title
// or employer, so reviews are labelled "Verified LinkedIn member", never "verified employee".
//
// Needs Worker secrets: LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, SESSION_SECRET.
// Admins: ADMIN_EMAILS (comma-separated LinkedIn email addresses, verified by LinkedIn).
import { cookie, getCookie, sign, verify, randomId, safeReturn, json } from './util.js';
import { db, now } from './db.js';

const SESSION = 'bsg_session';
const STATE = 'bsg_oauth';
const SESSION_TTL = 60 * 60 * 24 * 30; // 30 days
const STATE_TTL = 60 * 10;

export const authConfigured = (env) => !!(env.LINKEDIN_CLIENT_ID && env.LINKEDIN_CLIENT_SECRET && env.SESSION_SECRET);
export const reviewsEnabled = (env) => authConfigured(env) && !!env.DB;
const redirectUri = (request) => `${new URL(request.url).origin}/auth/linkedin/callback`;

/** The signed-in member from the session cookie, or null. */
export async function currentUser(request, env) {
  const s = await verify(getCookie(request, SESSION), env.SESSION_SECRET);
  return s ? { id: s.sub, name: s.name, picture: s.picture ?? null, email: s.email ?? null, emailVerified: !!s.ev } : null;
}

export function isAdmin(user, env) {
  if (!user || !user.emailVerified || !user.email || !env.ADMIN_EMAILS) return false;
  return env.ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean).includes(user.email.toLowerCase());
}

const redirect = (location, cookies = []) => {
  const h = new Headers({ Location: location, 'Cache-Control': 'no-store' });
  for (const c of cookies) h.append('Set-Cookie', c);
  return new Response(null, { status: 302, headers: h });
};

function errorPage(message, status = 400) {
  return new Response(
    `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Sign-in problem</title>
<body style="font-family:system-ui,sans-serif;max-width:560px;margin:60px auto;padding:0 20px;color:#0b0d12">
<h1 style="font-size:1.5rem">Sign-in did not complete</h1><p>${message}</p><p><a href="/" style="color:#1d4ed8">Back to BestSoftwareGuides</a></p></body>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } },
  );
}

export async function handleAuth(request, env, pathname) {
  const url = new URL(request.url);

  if (pathname === '/auth/linkedin/start') {
    if (!authConfigured(env)) return errorPage('LinkedIn sign-in is not switched on yet. Please try again later.', 503);
    const state = randomId();
    const back = safeReturn(url.searchParams.get('return') ?? '/');
    const auth = new URL('https://www.linkedin.com/oauth/v2/authorization');
    auth.search = new URLSearchParams({ response_type: 'code', client_id: env.LINKEDIN_CLIENT_ID, redirect_uri: redirectUri(request), state, scope: 'openid profile email' });
    return redirect(auth.href, [cookie(STATE, await sign({ state, back }, env.SESSION_SECRET, STATE_TTL), STATE_TTL)]);
  }

  if (pathname === '/auth/linkedin/callback') {
    if (!authConfigured(env)) return errorPage('LinkedIn sign-in is not switched on yet.', 503);
    const saved = await verify(getCookie(request, STATE), env.SESSION_SECRET);
    const clearState = cookie(STATE, '', 0);
    if (url.searchParams.get('error')) return errorPage('You cancelled the LinkedIn sign-in, or LinkedIn refused it. Nothing was saved.');
    if (!saved || saved.state !== url.searchParams.get('state')) return errorPage('The sign-in link expired or was opened in a different browser. Please start again.');
    const code = url.searchParams.get('code');
    if (!code) return errorPage('LinkedIn did not return a sign-in code.');

    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'authorization_code', code, client_id: env.LINKEDIN_CLIENT_ID, client_secret: env.LINKEDIN_CLIENT_SECRET, redirect_uri: redirectUri(request) }),
    });
    if (!tokenRes.ok) return errorPage('LinkedIn did not accept the sign-in. Please try again.', 502);
    const { access_token } = await tokenRes.json();
    const infoRes = await fetch('https://api.linkedin.com/v2/userinfo', { headers: { Authorization: `Bearer ${access_token}` } });
    if (!infoRes.ok) return errorPage('Could not read your LinkedIn profile. Please try again.', 502);
    const p = await infoRes.json(); // { sub, name, given_name, family_name, picture, email, email_verified, locale }
    if (!p.sub || !p.name) return errorPage('LinkedIn did not return a name for this account.', 502);

    const d = db(env);
    if (d) {
      await d.ready;
      const t = now();
      await d.DB.prepare(`INSERT INTO users (id, name, given_name, family_name, picture, email, email_verified, created_at, last_login)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?8)
        ON CONFLICT(id) DO UPDATE SET name=?2, given_name=?3, family_name=?4, picture=?5, email=?6, email_verified=?7, last_login=?8`)
        .bind(p.sub, p.name, p.given_name ?? null, p.family_name ?? null, p.picture ?? null, p.email ?? null, p.email_verified ? 1 : 0, t).run();
    }
    const session = await sign({ sub: p.sub, name: p.name, picture: p.picture ?? null, email: p.email ?? null, ev: p.email_verified ? 1 : 0 }, env.SESSION_SECRET, SESSION_TTL);
    return redirect(safeReturn(saved.back), [clearState, cookie(SESSION, session, SESSION_TTL)]);
  }

  if (pathname === '/auth/logout') {
    return redirect(safeReturn(url.searchParams.get('return') ?? '/'), [cookie(SESSION, '', 0)]);
  }

  if (pathname === '/auth/me') {
    const user = await currentUser(request, env);
    const enabled = reviewsEnabled(env);
    return json({
      enabled,
      user: user ? { name: user.name, picture: user.picture, admin: isAdmin(user, env) } : null,
      // While switched off, say which setup pieces are present (yes/no only, never values).
      ...(enabled ? {} : { setup: { linkedinClientId: !!env.LINKEDIN_CLIENT_ID, linkedinClientSecret: !!env.LINKEDIN_CLIENT_SECRET, sessionSecret: !!env.SESSION_SECRET, adminEmails: !!env.ADMIN_EMAILS, database: !!env.DB } }),
    });
  }

  return new Response('Not found', { status: 404 });
}
