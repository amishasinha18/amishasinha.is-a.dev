import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './admin.css';
import { ContentProvider } from '../content/ContentContext.jsx';
import AdminDashboard from '../components/admin/AdminDashboard.jsx';

// Apply the saved (or system) theme before first paint to avoid a flash. The
// dashboard's toggle writes 'admin-theme' and flips the `.dark` class.
(() => {
  try {
    const saved = localStorage.getItem('admin-theme');
    const prefersDark =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch {
    /* ignore */
  }
})();

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
