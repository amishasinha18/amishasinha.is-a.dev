import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bluetooth,
  CircuitBoard,
  Cpu,
  Maximize2,
  MonitorCog,
  ToggleRight,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import { electronicsProject } from '../../data/projects.js';

// One icon per feature, in order; falls back to a generic bolt.
const featureIcons = [Bluetooth, MonitorCog, ToggleRight, CircuitBoard];

// Shared shell: ambient glow that blooms on hover, over a hairline border
// that warms from neutral to primary. The hover classes are passed in as
// whole literal strings — Tailwind scans source statically, so a class name
// assembled at runtime would never make it into the stylesheet.
function Panel({ group, glow, border, children }) {
  return (
    <div className={`${group} relative h-full`}>
      <div
        className={`pointer-events-none absolute -inset-3 rounded-[1.75rem] bg-gradient-to-br from-primary/15 via-sky-500/10 to-transparent opacity-0 blur-2xl transition-opacity duration-500 ease-out ${glow}`}
      />
      <div
        className={`relative flex h-full flex-col rounded-2xl bg-gradient-to-br from-border via-border to-border/40 p-px shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-500 ease-out ${border}`}
      >
        <div className="relative flex flex-1 flex-col overflow-hidden rounded-[15px] bg-background ring-1 ring-black/5 dark:ring-white/10">
          {/* Circuit texture sits under the content, above the surface. */}
          <div
            aria-hidden="true"
            className="circuit-grid pointer-events-none absolute inset-0"
          />
          <div className="relative flex flex-1 flex-col">{children}</div>
        </div>
      </div>
    </div>
  );
}

// Small mono label used as a card header strip.
function PanelBar({ icon: Icon, label, trailing }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-3">
      <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
        <Icon size={14} className="shrink-0" />
        {label}
      </span>
      {trailing && (
        <span className="font-mono text-[11px] tracking-tight text-muted">{trailing}</span>
      )}
    </div>
  );
}

export default function ElectronicsProject() {
  const { title, intro, features, closing, images, tech } = electronicsProject;
  const [openIndex, setOpenIndex] = useState(null);
  const isOpen = openIndex !== null;

  // Close on Escape and lock background scroll while the lightbox is open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && setOpenIndex(null);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
      {/* Build gallery */}
      <Panel
        group="group/gal"
        glow="group-hover/gal:opacity-100"
        border="group-hover/gal:from-primary/50 group-hover/gal:via-accent/25 group-hover/gal:to-primary/30 group-hover/gal:shadow-[0_22px_48px_rgba(0,0,0,0.16)]"
      >
        <PanelBar
          icon={CircuitBoard}
          label="Build Gallery"
          trailing={`${images.length} shots`}
        />
        <div className="grid flex-1 grid-cols-2 gap-3 p-4 sm:gap-4 sm:p-5">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`View ${title} photo ${i + 1}`}
              className="group/shot relative block overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <img
                src={src}
                alt={`${title} — photo ${i + 1}`}
                loading="lazy"
                className="aspect-square w-full cursor-zoom-in object-cover transition-transform duration-700 ease-out group-hover/shot:scale-110"
              />
              {/* Scrim + affordances, revealed on hover */}
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover/shot:opacity-100" />
              <span className="pointer-events-none absolute bottom-2 left-2 rounded-md bg-black/55 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover/shot:opacity-100">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="pointer-events-none absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-black/55 text-white opacity-0 backdrop-blur-sm transition-all duration-500 group-hover/shot:opacity-100">
                <Maximize2 size={13} />
              </span>
            </button>
          ))}
        </div>
      </Panel>

      {/* Spec sheet */}
      <Panel
        group="group/spec"
        glow="group-hover/spec:opacity-100"
        border="group-hover/spec:from-primary/50 group-hover/spec:via-accent/25 group-hover/spec:to-primary/30 group-hover/spec:shadow-[0_22px_48px_rgba(0,0,0,0.16)]"
      >
        <PanelBar icon={Cpu} label="Hardware · IoT" />

        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h3>
          <div className="mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-primary to-accent" />

          <p className="mt-5 text-[15px] leading-[1.75] text-[#333333] dark:text-[#C9B8C4]">
            {intro}
          </p>

          {/* Components used */}
          {tech?.length > 0 && (
            <div className="mt-6">
              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                Components
              </p>
              <div className="flex flex-wrap gap-2">
                {tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-xs font-medium text-primary shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/20 hover:shadow-md hover:shadow-primary/20"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          <p className="mb-3 mt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            Features
          </p>
          <ul className="space-y-2.5">
            {features.map((feature, i) => {
              const Icon = featureIcons[i] ?? Zap;
              return (
                <li
                  key={feature}
                  className="group/feat flex items-start gap-3 rounded-xl border border-border bg-background/60 px-3.5 py-2.5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md hover:shadow-primary/20"
                >
                  <span className="mt-px flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-all duration-300 ease-out group-hover/feat:scale-110 group-hover/feat:bg-primary/20">
                    <Icon size={14} />
                  </span>
                  <span className="text-sm leading-relaxed text-[#333333] dark:text-[#C9B8C4]">
                    {feature}
                  </span>
                </li>
              );
            })}
          </ul>

          {/* Build note */}
          <div className="mt-auto pt-6">
            <div className="rounded-xl border border-primary/15 bg-primary/[0.06] p-4">
              <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                <Wrench size={13} />
                Build note
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#333333] dark:text-[#C9B8C4]">
                {closing}
              </p>
            </div>
          </div>
        </div>
      </Panel>

      {/* Lightbox */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpenIndex(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${title} photo ${openIndex + 1}`}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(null)}
              aria-label="Close"
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <X size={22} />
            </button>

            <motion.figure
              key={openIndex}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-w-[92vw] flex-col items-center"
            >
              <img
                src={images[openIndex]}
                alt={`${title} — photo ${openIndex + 1}`}
                className="max-h-[82vh] max-w-full rounded-xl object-contain shadow-2xl"
              />
              <figcaption className="mt-4 font-mono text-xs tracking-tight text-white/70">
                {String(openIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                <span className="mx-2 text-white/30">·</span>
                {title}
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
