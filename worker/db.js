// Cloudflare D1 schema for LinkedIn-verified reviews. Created on first use, so there is no separate
// migration step: binding the database (wrangler.jsonc "d1_databases", binding "DB") is enough.

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,               -- LinkedIn OpenID "sub", stable per member
    name TEXT NOT NULL,
    given_name TEXT, family_name TEXT,
    picture TEXT,
    email TEXT, email_verified INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL, last_login TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tool TEXT NOT NULL,                -- tool slug
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title TEXT NOT NULL, pros TEXT NOT NULL, cons TEXT NOT NULL,
    role TEXT, company_size TEXT, usage TEXT,
    relationship TEXT NOT NULL,        -- user | vendor | competitor | other
    name_mode TEXT NOT NULL DEFAULT 'short', -- full | short (first name + last initial)
    status TEXT NOT NULL DEFAULT 'pending',  -- pending | approved | rejected
    reject_reason TEXT,
    created_at TEXT NOT NULL, updated_at TEXT NOT NULL, moderated_at TEXT,
    UNIQUE (tool, user_id)
  )`,
  `CREATE INDEX IF NOT EXISTS reviews_tool_status ON reviews (tool, status)`,
  `CREATE INDEX IF NOT EXISTS reviews_status ON reviews (status, created_at)`,
];

let ready = null;
export function db(env) {
  if (!env.DB) return null;
  ready ??= env.DB.batch(SCHEMA.map((s) => env.DB.prepare(s))).catch((e) => { ready = null; throw e; });
  return { DB: env.DB, ready };
}

export const now = () => new Date().toISOString();
