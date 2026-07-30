import { useEffect, useRef, useState } from 'react';

// Returns `true` while the user is actively scrolling, flipping back to
// `false` after `idleDelay` ms without a scroll event. Registers a single
// passive listener, so call it once and pass the value down rather than
// having each consumer attach its own.
export function useIsScrolling(idleDelay = 700) {
  const [scrolling, setScrolling] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolling(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setScrolling(false), idleDelay);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [idleDelay]);

  return scrolling;
}
