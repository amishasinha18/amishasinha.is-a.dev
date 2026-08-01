import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Second build: the admin dashboard, emitted to dist/admin/ with a /admin/
// asset base. It is a separate entry from the public site (index.html), so no
// admin code or chunk is ever referenced by the public bundle. Access is gated
// at the edge (middleware.js) — the files here are only served after auth.
export default defineConfig({
  plugins: [react()],
  base: '/admin/',
  // The admin needs no static assets of its own; content image paths ('/…')
  // resolve from the site root. Skip copying public/ into dist/admin/.
  publicDir: false,
  build: {
    outDir: 'dist/admin',
    // Only clears dist/admin (its own outDir), not the main dist/ built first.
    emptyOutDir: true,
    rollupOptions: {
      input: 'admin.html',
    },
  },
});
