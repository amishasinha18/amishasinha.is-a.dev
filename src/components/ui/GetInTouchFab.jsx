import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, MessageCircle } from 'lucide-react';

// Persistent "Get in Touch" action, pinned to the bottom-right of the
// viewport. Mounted once in App.jsx rather than per page, so it stays put
// while the page content swaps underneath it.
//
// z-40 sits above page content but below the lightboxes (z-60), so it never
// floats over an opened screenshot or certificate.
export default function GetInTouchFab({ onNavigate, hidden = false }) {
  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-5 right-5 z-40 sm:bottom-7 sm:right-7"
        >
          <button
            type="button"
            onClick={() => onNavigate?.('contact')}
            aria-label="Get in Touch"
            title="Get in Touch"
            className="group inline-flex h-12 w-12 items-center justify-center gap-2 rounded-full border border-primary/40 bg-surface/80 text-sm font-semibold text-primary shadow-lg backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-fg hover:shadow-xl hover:shadow-primary/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:h-auto sm:w-auto sm:px-5 sm:py-2.5"
          >
            <MessageCircle size={17} className="shrink-0" />
            {/* Collapses to a circular icon button on small screens so it
                covers as little content as possible. */}
            <span className="hidden sm:inline">Get in Touch</span>
            <ArrowUpRight
              size={15}
              className="hidden shrink-0 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:inline"
            />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
