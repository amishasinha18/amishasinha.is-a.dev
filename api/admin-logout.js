// POST /api/admin-logout — clears the session cookie.
export default function handler(req, res) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const secure = proto === 'https' ? ' Secure;' : '';
  res.setHeader(
    'Set-Cookie',
    `admin_session=; HttpOnly;${secure} SameSite=Strict; Path=/; Max-Age=0`
  );
  res.status(200).json({ ok: true });
}
