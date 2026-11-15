// Small helpers shared by the auth, reviews and admin routes.

export const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers } });

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function getCookie(request, name) {
  const raw = request.headers.get('Cookie') ?? '';
  for (const part of raw.split(/;\s*/)) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i) === name) return decodeURIComponent(part.slice(i + 1));
  }
  return null;
}

export const cookie = (name, value, maxAge) =>
  `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;

// ---------- signed tokens (HMAC-SHA256) ----------
const enc = new TextEncoder();
const b64url = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromB64url = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
const keyCache = new Map();
async function hmacKey(secret) {
  if (!keyCache.has(secret)) keyCache.set(secret, crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']));
  return keyCache.get(secret);
}

/** Sign a JSON payload; `exp` (seconds) is added. */
export async function sign(payload, secret, ttlSeconds) {
  const body = b64url(enc.encode(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + ttlSeconds })));
  const sig = b64url(await crypto.subtle.sign('HMAC', await hmacKey(secret), enc.encode(body)));
  return `${body}.${sig}`;
}

/** Verify a token from sign(); returns the payload or null if forged, malformed or expired. */
export async function verify(token, secret) {
  if (!token || !secret) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  try {
    const ok = await crypto.subtle.verify('HMAC', await hmacKey(secret), fromB64url(sig), enc.encode(body));
    if (!ok) return null;
    const payload = JSON.parse(new TextDecoder().decode(fromB64url(body)));
    return payload.exp > Date.now() / 1000 ? payload : null;
  } catch { return null; }
}

export const randomId = (bytes = 16) => b64url(crypto.getRandomValues(new Uint8Array(bytes)));

// Only allow returning to a path on this site (no open redirects).
export const safeReturn = (p) => (typeof p === 'string' && /^\/(?!\/)[\w\-./%#?=&]*$/.test(p) ? p : '/');

// State-changing requests must come from this site (SameSite=Lax cookies plus an Origin check).
export function sameOrigin(request) {
  const origin = request.headers.get('Origin');
  return origin !== null && origin === new URL(request.url).origin;
}
