import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useContent } from '../../content/ContentContext.jsx';

// Resume-style certificate list; "View Certificate" opens a full-screen lightbox.
export default function CertificateGallery() {
  const { certificates } = useContent();
  const [index, setIndex] = useState(null);
  const isOpen = index !== null;

  const close = () => setIndex(null);
  const prev = (e) => {
    e?.stopPropagation();
    setIndex((i) => (i - 1 + certificates.length) % certificates.length);
  };
  const next = (e) => {
    e?.stopPropagation();
    setIndex((i) => (i + 1) % certificates.length);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const arrowClass =
    'absolute top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20';

  return (
    <>
      {/* Premium certification cards — same shell as the rest of the site:
          an ambient glow that blooms on hover over a hairline border warming
          to primary, with an inner ring surface. */}
      <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert, i) => (
          <div key={cert.image} className="group/cert relative h-full">
            <div className="pointer-events-none absolute -inset-2 rounded-[1.75rem] bg-gradient-to-br from-primary/15 via-sky-500/10 to-transparent opacity-0 blur-2xl transition-opacity duration-500 ease-out group-hover/cert:opacity-100" />
            <div className="relative flex h-full flex-col rounded-2xl bg-gradient-to-br from-border via-border to-border/40 p-px shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-500 ease-out group-hover/cert:-translate-y-1.5 group-hover/cert:from-primary/50 group-hover/cert:via-accent/25 group-hover/cert:to-primary/30 group-hover/cert:shadow-[0_22px_48px_rgba(0,0,0,0.16)]">
              <div className="flex h-full flex-col rounded-[15px] bg-surface/80 p-6 ring-1 ring-black/5 backdrop-blur-md dark:ring-white/10">
                {/* Award mark + year */}
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20 transition-transform duration-500 ease-out group-hover/cert:scale-105">
                    <Award size={22} />
                  </span>
                  <span className="rounded-full border border-border bg-background/70 px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-tight text-muted">
                    {cert.year}
                  </span>
                </div>

                {/* Title — reserves two lines so the organization line sits at
                    the same height across every card, short title or long. */}
                <h4 className="mt-4 flex min-h-[2.75rem] items-start text-lg font-bold leading-snug tracking-tight text-foreground">
                  {cert.title}
                </h4>
                <p className="mt-1 text-sm font-medium text-primary">
                  {cert.organization}
                </p>

                {/* Consistent full-width action, pinned to the bottom (mt-auto)
                    with guaranteed spacing above it, so every button aligns
                    down the grid. */}
                <div className="mt-auto pt-6">
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/40 px-4 py-2 text-sm font-semibold text-primary shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary hover:text-primary-fg hover:shadow-lg hover:shadow-primary/30"
                  >
                    View Certificate
                    <ChevronRight
                      size={16}
                      className="shrink-0 transition-transform duration-300 ease-out group-hover/btn:translate-x-0.5"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={certificates[index].title || 'Certificate'}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          >
            <button onClick={close} aria-label="Close" className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20">
              <X size={22} />
            </button>
            {certificates.length > 1 && (
              <>
                <button onClick={prev} aria-label="Previous" className={`${arrowClass} left-3 sm:left-5`}>
                  <ChevronLeft size={24} />
                </button>
                <button onClick={next} aria-label="Next" className={`${arrowClass} right-3 sm:right-5`}>
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            <motion.figure
              key={index}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-w-[92vw] flex-col items-center"
            >
              <img
                src={certificates[index].image}
                alt={certificates[index].title || 'Certificate'}
                className="max-h-[82vh] max-w-full rounded-lg bg-white object-contain shadow-2xl"
              />
              {certificates[index].title && (
                <figcaption className="mt-4 text-center text-sm text-white/80">
                  {certificates[index].title}
                </figcaption>
              )}
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
