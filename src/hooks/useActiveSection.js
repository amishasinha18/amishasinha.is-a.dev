import { useEffect, useState } from 'react';

// Tracks which section is currently in view and returns its id,
// so the Navbar can highlight the matching link.
export function useActiveSection(ids, rootMargin = '-45% 0px -50% 0px') {
  const [activeId, setActiveId] = useState(ids[0] ?? '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin, threshold: 0 }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(','), rootMargin]);

  return activeId;
}
