// Vercel Edge Middleware — the server-side gate for the admin.
//
// Runs at the edge BEFORE any static file is served, so nothing here ever ships
// in the downloadable site bundle:
//   • /as          → an edge-generated fake 404 whose hidden "0" opens a login
//                    (POSTs to /api/admin-login). Never linked, never in the
//                    bundle, so crawlers/HTTrack never see it.
//   • /admin, /admin/*  → served only when a valid signed session cookie is
//                    present; otherwise a plain 404. This is what stops an
//                    unauthenticated download of the dashboard assets.
//
// The session cookie is minted by api/admin-login.js and signed with
// process.env.ADMIN_SECRET (HMAC-SHA256). Verified here with Web Crypto.

export const config = { matcher: ['/as', '/admin', '/admin/:path*'] };

const enc = new TextEncoder();

function getCookie(request, name) {
  const header = request.headers.get('cookie') || '';
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx < 0) continue;
    if (part.slice(0, idx).trim() === name) {
      return decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return '';
}

function b64urlEncode(buffer) {
  const bytes = new Uint8Array(buffer);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlToString(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return atob(s);
}

// Constant-time string comparison.
function constEq(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

async function verifySession(token, secret) {
  if (!token || !secret) return false;
  const dot = token.lastIndexOf('.');
  if (dot < 1) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  try {
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const mac = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
    if (!constEq(sig, b64urlEncode(mac))) return false;
    const claims = JSON.parse(b64urlToString(payload));
    return typeof claims.exp === 'number' && Date.now() < claims.exp;
  } catch {
    return false;
  }
}

export default async function middleware(request) {
  const path = new URL(request.url).pathname.replace(/\/+$/, '').toLowerCase() || '/';

  // The obscure entry: a convincing 404 with a disguised "0" that reveals login.
  if (path === '/as') {
    return new Response(AS_PAGE, {
      status: 404,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'x-robots-tag': 'noindex, nofollow',
        'cache-control': 'no-store',
      },
    });
  }

  // Everything under /admin: gated by a valid session cookie.
  const ok = await verifySession(getCookie(request, 'admin_session'), process.env.ADMIN_SECRET);
  if (ok) return; // allow → the static dashboard asset is served

  return new Response(NOT_FOUND, {
    status: 404,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
  });
}

const NOT_FOUND =
  '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width, initial-scale=1">' +
  '<title>404 — Not Found</title></head>' +
  '<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;' +
  'font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#f4f4f4;color:#1f1a1d">' +
  '<div style="text-align:center"><h1 style="font-size:4rem;margin:0">404</h1>' +
  '<p style="opacity:.7">This page could not be found.</p></div></body></html>';

const AS_PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>404 — Not Found</title>
<style>
  :root { color-scheme: light dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
    font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    background: #f4f4f4; color: #1f1a1d;
  }
  @media (prefers-color-scheme: dark) { body { background: #2c001e; color: #f5eef2; } }
  .wrap { text-align: center; padding: 2rem; }
  .code { font-size: clamp(5rem, 20vw, 9rem); font-weight: 800; letter-spacing: -.03em; line-height: 1; margin: 0; }
  .zero { background: none; border: 0; padding: 0; margin: 0; font: inherit; color: inherit; cursor: default; }
  .zero:focus { outline: none; }
  .msg { margin: 1rem 0 0; font-size: 1.1rem; opacity: .7; }
  .home { display: inline-block; margin-top: 1.4rem; color: inherit; opacity: .55; text-decoration: none; border-bottom: 1px solid currentColor; font-size: .9rem; }
  .gate { margin-top: 2rem; display: none; }
  .gate.show { display: block; }
  .gate input {
    display: block; width: 240px; margin: .4rem auto; padding: .6rem .8rem;
    border: 1px solid rgba(128,128,128,.4); border-radius: 8px; background: transparent; color: inherit; font: inherit;
  }
  .gate .go { margin-top: .5rem; padding: .6rem 1.5rem; border: 0; border-radius: 8px; background: #77216f; color: #fff; font: inherit; cursor: pointer; }
  .err { color: #e0245e; font-size: .85rem; min-height: 1.2em; margin-top: .5rem; }
</style>
</head>
<body>
  <div class="wrap">
    <p class="code">4<button class="zero" id="z" type="button" aria-label="0">0</button>4</p>
    <p class="msg">This page could not be found.</p>
    <a class="home" href="/">Back to home</a>
    <form class="gate" id="g" autocomplete="off">
      <input id="u" type="text" placeholder="ID" autocomplete="username">
      <input id="p" type="password" placeholder="Password" autocomplete="current-password">
      <button class="go" type="submit">Enter</button>
      <div class="err" id="e"></div>
    </form>
  </div>
  <script>
    (function () {
      var z = document.getElementById('z'), g = document.getElementById('g'), e = document.getElementById('e');
      z.addEventListener('click', function () { g.classList.add('show'); document.getElementById('u').focus(); });
      g.addEventListener('submit', function (ev) {
        ev.preventDefault(); e.textContent = '';
        fetch('/api/admin-login', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ id: document.getElementById('u').value, password: document.getElementById('p').value })
        }).then(function (r) {
          if (r.ok) { window.location.href = '/admin/'; } else { e.textContent = 'Invalid credentials'; }
        }).catch(function () { e.textContent = 'Something went wrong'; });
      });
    })();
  </script>
</body>
</html>`;
