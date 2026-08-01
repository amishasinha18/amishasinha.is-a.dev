import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './admin.css';
import { ContentProvider } from '../content/ContentContext.jsx';
import AdminDashboard from '../components/admin/AdminDashboard.jsx';

// Entry for the standalone admin bundle (built to dist/admin/ and served ONLY
// behind Edge Middleware auth — see middleware.js). It shares localStorage
// ('portfolio-content') with the public site because it is the same origin, so
// edits, "View site", Export and Reset behave exactly as before.

// Log out: clear the server session cookie, then leave the admin.
function logout() {
  fetch('/api/admin-logout', { method: 'POST' })
    .catch(() => {})
    .finally(() => {
      window.location.href = '/';
    });
}

createRoot(document.getElementById('admin-root')).render(
  <StrictMode>
    <ContentProvider>
      <AdminDashboard onExit={logout} />
    </ContentProvider>
  </StrictMode>
);
