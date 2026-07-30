import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Cycles through a list of phrases with a smooth crossfade + slide transition.
export default function RotatingText({ phrases, interval = 2500, className = '' }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length);
    }, interval);
    return () => clearInterval(id);
  }, [phrases.length, interval]);

  return (
    <span className={`relative inline-flex h-[1.5em] items-center overflow-hidden align-middle ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="whitespace-nowrap font-semibold text-primary"
        >
          {phrases[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
