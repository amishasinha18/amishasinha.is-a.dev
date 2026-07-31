import { createContext, useCallback, useContext, useState } from 'react';
import { defaultContent } from './defaults.js';

// Runtime-editable content store. Every section reads its data from here via
// `useContent()`, so admin edits re-render the real portfolio live. State is
// seeded from `defaultContent` and merged with a localStorage override, so with
// nothing edited the site renders exactly as the static data files did.
//
// NOTE: persistence is per-browser (localStorage). Edits are NOT published to
// visitors until the exported JSON is committed — by design.
const STORAGE_KEY = 'portfolio-content';
const ContentContext = createContext(null);

function loadInitial() {
  if (typeof window === 'undefined') return defaultContent;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved && typeof saved === 'object') return { ...defaultContent, ...saved };
  } catch {
    /* corrupt storage — fall back to defaults */
  }
  return defaultContent;
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(loadInitial);

  // Replace one top-level section (e.g. 'experience') and persist.
  const updateSection = useCallback((key, value) => {
    setContent((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore quota/availability errors */
      }
      return next;
    });
  }, []);

  // Clear all edits and restore the shipped defaults.
  const resetAll = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setContent(defaultContent);
  }, []);

  // Download the full current content as JSON, to commit/publish later.
  const exportJson = useCallback(() => {
    setContent((current) => {
      const blob = new Blob([JSON.stringify(current, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'portfolio-content.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      return current; // no state change
    });
  }, []);

  const value = { ...content, updateSection, resetAll, exportJson };
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return ctx;
}
