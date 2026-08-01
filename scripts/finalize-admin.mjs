// The admin build's entry is admin.html, so Vite emits dist/admin/admin.html.
// The admin is served at /admin/, which needs dist/admin/index.html — rename it.
import { renameSync, existsSync } from 'node:fs';

const from = 'dist/admin/admin.html';
const to = 'dist/admin/index.html';
if (existsSync(from)) {
  renameSync(from, to);
  console.log('finalize-admin: dist/admin/admin.html -> dist/admin/index.html');
} else if (existsSync(to)) {
  console.log('finalize-admin: dist/admin/index.html already present');
} else {
  console.error('finalize-admin: no admin html found in dist/admin/');
  process.exit(1);
}
