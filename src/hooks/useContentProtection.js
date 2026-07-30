import { useEffect } from 'react';

/**
 * Site-wide content protection — JS half. The CSS half (index.css) disables
 * text selection; this blocks the context menu, copy/cut, image drag and the
 * Ctrl/Cmd shortcuts that would otherwise lift content off the page.
 *
 * IMPORTANT: this is a deterrent, not a security control. View Source,
 * DevTools, `curl`, the browser's Reader mode and simply disabling
 * JavaScript all bypass it. Do not rely on it to protect anything sensitive.
 */

// Fields the visitor is meant to be able to edit. Their contents are the
// visitor's own data, not site content, so native select/copy/paste stays
// intact — otherwise the contact form becomes unusable (no correcting a
// typo, no pasting your own email address).
function isEditable(target) {
  if (!target || typeof target.tagName !== 'string') return false;
  const tag = target.tagName.toUpperCase();
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable === true
  );
}

// Ctrl/Cmd + these are blocked outside form fields.
//   c copy · x cut · a select-all · s save-page · u view-source · p print
// Trim this set if any of them feel too aggressive.
const BLOCKED_COMBOS = new Set(['c', 'x', 'a', 's', 'u', 'p']);

// Ctrl/Cmd + Shift + these open developer tools.
const DEVTOOLS_COMBOS = new Set(['i', 'j', 'c']);

export function useContentProtection() {
  useEffect(() => {
    const block = (e) => {
      if (isEditable(e.target)) return;
      e.preventDefault();
    };

    const onKeyDown = (e) => {
      if (typeof e.key !== 'string') return;
      const key = e.key.toLowerCase();
      const mod = e.ctrlKey || e.metaKey;

      // DevTools shortcuts are blocked everywhere, including in form fields.
      if (e.key === 'F12' || (mod && e.shiftKey && DEVTOOLS_COMBOS.has(key))) {
        e.preventDefault();
        return;
      }

      // Everything else stays available inside form fields so that paste,
      // select-all and undo keep working where the visitor is typing.
      if (isEditable(e.target)) return;

      if (mod && !e.shiftKey && BLOCKED_COMBOS.has(key)) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', block);
    document.addEventListener('copy', block);
    document.addEventListener('cut', block);
    document.addEventListener('dragstart', block);
    document.addEventListener('selectstart', block);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('contextmenu', block);
      document.removeEventListener('copy', block);
      document.removeEventListener('cut', block);
      document.removeEventListener('dragstart', block);
      document.removeEventListener('selectstart', block);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);
}
