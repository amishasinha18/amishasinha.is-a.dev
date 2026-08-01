import crypto from 'node:crypto';

// POST /api/admin-login  { id, password }
// Verifies credentials against SERVER-side env vars (never shipped to the
// browser), and on success sets a signed, HttpOnly session cookie that the
// Edge middleware (middleware.js) verifies before serving /admin/*.
//
// Required Vercel env vars (Project → Settings → Environment Variables):
//   ADMIN_ID        - the login id (optional; defaults to "admin")
//   ADMIN_PASSWORD  - the password
//   ADMIN_SECRET    - long random string used to sign session tokens
// Rotate by editing ADMIN_PASSWORD in Vercel and redeploying — no code change.

const SESSION_MS = 2 * 60 * 60 * 1000; // 2 hours

const b64url = (buf) => Buffer.from(buf).toString('base64url');

// Constant-time string compare that never leaks length via early return.
function safeEqual(a, b) {
  const ab = Buffer.from(String(a), 'utf8');
  const bb = Buffer.from(String(b), 'utf8');
  if (ab.length !== bb.length) {
    crypto.timingSafeEqual(ab, ab); // keep the work roughly constant
    return false;
  }
  return crypto.timingSafeEqual(ab, bb);
}

function signToken(secret) {
  const payload = b64url(JSON.stringify({ exp: Date.now() + SESSION_MS }));
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

async function readJson(req) {
  if (req.body != null) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
    return req.body;
  }
  const chunks = [];
  for await (const c of req) chunks.push(c);
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return {};
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const ADMIN_ID = process.env.ADMIN_ID || 'admin';
  const { ADMIN_PASSWORD, ADMIN_SECRET } = process.env;
  if (!ADMIN_PASSWORD || !ADMIN_SECRET) {
    res.status(500).json({ error: 'Admin is not configured' });
    return;
  }

  const body = await readJson(req);
  const id = (body?.id ?? '').toString();
  const password = (body?.password ?? '').toString();

  const idOk = safeEqual(id, ADMIN_ID);
  const passOk = safeEqual(password, ADMIN_PASSWORD);

  if (!idOk || !passOk) {
    // Small randomized delay: brute-force friction + blunts timing analysis.
    await sleep(400 + Math.floor(Math.random() * 300));
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = signToken(ADMIN_SECRET);
  // Secure only over https (so `vercel dev` on http can still set the cookie).
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const secure = proto === 'https' ? ' Secure;' : '';
  res.setHeader(
    'Set-Cookie',
    `admin_session=${token}; HttpOnly;${secure} SameSite=Strict; Path=/; Max-Age=${SESSION_MS / 1000}`
  );
  res.status(200).json({ ok: true });
}
