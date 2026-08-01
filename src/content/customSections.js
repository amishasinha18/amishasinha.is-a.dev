// Helpers for per-page custom sections. `customSections` in the content store
// is an object keyed by site page id, each value an array of { title, body }.
//
// Backward compatibility: an older build stored `customSections` as a single
// flat array that rendered only on the About page. `sectionsForPage` treats a
// bare array as About's blocks so old localStorage data keeps working.

export const CUSTOM_PAGES = [
  'home',
  'about',
  'experience',
  'skills',
  'projects',
  'blog',
  'contact',
];

// The list of blocks for one page (safe against the legacy array shape).
export function sectionsForPage(customSections, page) {
  if (Array.isArray(customSections)) return page === 'about' ? customSections : [];
  return customSections?.[page] ?? [];
}

// Normalize any stored shape into a plain page-keyed object, so writes never
// clobber sibling pages.
export function normalizeCustomSections(customSections) {
  if (Array.isArray(customSections)) return { about: customSections };
  return { ...(customSections || {}) };
}
