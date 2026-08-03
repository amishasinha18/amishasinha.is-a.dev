import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useContent } from '../../content/ContentContext.jsx';

// Resume-style certificate list; each button opens a full-screen lightbox.
// A card shows a single image by default, OR several labelled artefacts when
// `cert.links = [{ label, image }]` is present (e.g. a certificate + its badge)
// — rendered as stacked buttons inside one unified card.
export default function CertificateGallery() {
  const { certificates } = useContent();

  // Flatten every viewable image into one slide list so the lightbox can page
  // through them all, and remember where each card's slides begin.
  const slides = [];
  const cards = certificates.map((cert) => {
    const links =
      Array.isArray(cert.links) && cert.links.length
        ? cert.links.map((l) => ({
            image: l.image,
            btn: `View ${l.label}`,
            caption: `${cert.title} — ${l.label}`,
          }))
        : [{ image: cert.image, btn: 'View Certificate', caption: cert.title }];
    const start = slides.length;
    links.forEach((l) => slides.push({ image: l.image, title: l.caption }));
    return { cert, links, start };
  });

  const [index, setIndex] = useState(null);
  const isOpen = index !== null;

  const close = () => setIndex(null);
  const prev = (e) => {
    e?.stopPropagation();
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  };
  const next = (e) => {
    e?.stopPropagation();
    setIndex((i) => (i + 1) % slides.length);
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
  const linkBtn =
    'group/btn inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/40 px-4 py-2 text-sm font-semibold text-primary shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary hover:text-primary-fg hover:shadow-lg hover:shadow-primary/30';

  const current = isOpen ? slides[index] : null;

  return (
    <>
      {/* Premium certification cards — same shell as the rest of the site:
          an ambient glow that blooms on hover over a hairline border warming
          to primary, with an inner ring surface. */}
      <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ cert, links, start }) => (
          <div key={cert.image || cert.title} className="group/cert relative h-full">
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

                {/* Action(s), pinned to the bottom (mt-auto) with guaranteed
                    spacing above, so buttons align down the grid. One button
                    for a single image, or a stack (e.g. Certificate + Badge). */}
                <div className="mt-auto space-y-2 pt-6">
                  {links.map((l, li) => (
                    <button
                      key={li}
                      type="button"
                      onClick={() => setIndex(start + li)}
                      className={linkBtn}
                    >
                      {l.btn}
                      <ChevronRight
                        size={16}
                        className="shrink-0 transition-transform duration-300 ease-out group-hover/btn:translate-x-0.5"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isOpen && current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={current.title || 'Certificate'}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          >
            <button onClick={close} aria-label="Close" className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20">
              <X size={22} />
            </button>
            {slides.length > 1 && (
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
                src={current.image}
                alt={current.title || 'Certificate'}
                className="max-h-[82vh] max-w-full rounded-lg bg-white object-contain shadow-2xl"
              />
              {current.title && (
                <figcaption className="mt-4 text-center text-sm text-white/80">
                  {current.title}
                </figcaption>
              )}
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
