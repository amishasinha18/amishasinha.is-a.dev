import { useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ExternalLink, MapPin } from 'lucide-react';
import { experience } from '../../data/experience.js';
import { useIsScrolling } from '../../hooks/useIsScrolling.js';
import SectionHeading from '../ui/SectionHeading.jsx';

// Renders the company logo if the image loads; falls back to a letter
// avatar (e.g. while the logo file hasn't been uploaded yet, or is missing).
//
// We remember *which* src failed rather than a bare `failed` boolean. A plain
// boolean latches permanently: once a missing file 404s, the fallback sticks
// for the life of the component even after the file is added, because React
// state survives Vite's hot updates. Keying the failure to the src means a
// changed `logo` prop re-attempts the load automatically.
function CompanyLogo({ logo, name }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const failed = failedSrc === logo;

  const shared =
    'h-10 w-10 shrink-0 rounded-xl shadow-sm transition-transform duration-500 ease-out group-hover/row:scale-105';

  if (logo && !failed) {
    return (
      <img
        src={logo}
        alt={`${name} logo`}
        loading="lazy"
        onError={() => setFailedSrc(logo)}
        className={`${shared} border border-border bg-white object-contain p-1.5`}
      />
    );
  }

  return (
    <span
      className={`${shared} flex items-center justify-center bg-primary/10 text-sm font-bold text-primary ring-1 ring-primary/20`}
    >
      {name?.charAt(0) ?? '?'}
    </span>
  );
}

// One timeline row. Extracted into its own component so each entry can own
// its scroll hooks — calling them inside a .map() callback would break the
// rules of hooks.
function TimelineEntry({ job, index, total, isScrolling }) {
  const ref = useRef(null);
  const isFirst = index === 0;
  const isLast = index === total - 1;

  // How far this row has travelled through the viewport, 0 → 1. The rail fill
  // and the node core are both driven from it, so the line advances with the
  // scroll and each node lights up exactly as the fill arrives at it.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 85%', 'end 60%'],
  });

  // A spring makes the fill trail the scrollbar slightly rather than snapping
  // to it — that lag is what reads as "flowing" instead of mechanical.
  const fill = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.35,
  });

  // Node core fills in over the first slice of the row's progress, so it
  // lands just as the rail reaches it.
  const nodeCore = useTransform(fill, [0, 0.12], [0, 1]);

  // Rail runs between node centres only: it starts at the first node and
  // stops at the last, so nothing dangles past either end. `-bottom-10`
  // bridges the 40px gap created by the container's space-y-10.
  const segment = isFirst
    ? 'top-4 -bottom-10'
    : isLast
      ? 'top-0 h-4'
      : 'top-0 -bottom-10';

  return (
    <div
      ref={ref}
      className="group/row grid grid-cols-1 gap-3 md:grid-cols-[140px_28px_1fr] md:gap-x-4 md:gap-y-0"
    >
      {/* Date rail (left). Deliberately keeps the inherited 16px / 24px
          line-box — the node's 16px centre is derived from it, so changing
          the size here would break the alignment. */}
      <div className="flex items-center gap-2 md:block md:pt-1 md:text-right">
        <p className="font-mono font-bold tracking-tight text-primary transition-colors duration-500 group-hover/row:text-accent">
          {job.dateLabel}
        </p>
        {job.current && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary md:mt-1 md:inline-block">
            Current
          </span>
        )}
      </div>

      {/* Connecting line + node (desktop only). Both are absolutely
          positioned against this column so they share one coordinate system
          and cannot drift apart. Node centre sits at 16px, matching the date
          label's optical centre (md:pt-1 + half a 24px line-box). */}
      <div className="relative hidden md:block">
        {total > 1 && (
          // The whole rail (dim track + bright fill) fades in only while the
          // user is actively scrolling, and fades back out once they stop.
          // The nodes stay put — only the connecting line is scroll-gated.
          <div
            className={`transition-opacity duration-500 ease-out ${
              isScrolling ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Dim base track — shows the whole path up front. */}
            <span
              aria-hidden="true"
              className={`absolute left-1/2 w-px -translate-x-1/2 bg-border ${segment}`}
            />
            {/* Bright fill — its height is bound to scroll position.
                x:-50% is passed through motion rather than Tailwind's
                -translate-x-1/2, because motion writes `transform` inline and
                would otherwise clobber the class and knock the 1px line off
                centre from the nodes. */}
            <motion.span
              aria-hidden="true"
              style={{ scaleY: fill, x: '-50%', transformOrigin: 'top' }}
              className={`timeline-rail-progress absolute left-1/2 w-px ${segment}`}
            />
          </div>
        )}

        {/* Node — hollow until the fill reaches it, then its core scales in. */}
        <span className="absolute left-1/2 top-2.5 z-10 flex h-3 w-3 -translate-x-1/2 items-center justify-center rounded-full border-2 border-primary bg-background ring-4 ring-primary/10 transition-all duration-500 ease-out group-hover/row:scale-125 group-hover/row:ring-8 group-hover/row:ring-primary/25">
          <motion.span
            aria-hidden="true"
            style={{ scale: nodeCore }}
            className="h-full w-full rounded-full bg-primary"
          />
        </span>
      </div>

      {/* Card — ambient glow blooms on hover only, so a stack of entries
          stays calm at rest; the hairline border warms from neutral to
          primary as the row lights up. */}
      <div className="relative">
        <div className="pointer-events-none absolute -inset-3 rounded-[1.75rem] bg-gradient-to-br from-primary/15 via-sky-500/10 to-transparent opacity-0 blur-2xl transition-opacity duration-500 ease-out group-hover/row:opacity-100" />
        <div className="relative rounded-2xl bg-gradient-to-br from-border via-border to-border/40 p-px shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-500 ease-out group-hover/row:-translate-y-1.5 group-hover/row:from-primary/50 group-hover/row:via-accent/25 group-hover/row:to-primary/30 group-hover/row:shadow-[0_22px_48px_rgba(0,0,0,0.16)]">
          <div className="rounded-[15px] bg-background p-6 ring-1 ring-black/5 dark:ring-white/10 sm:p-7">
            {/* Company row */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CompanyLogo logo={job.logo} name={job.company} />
                <span className="inline-flex items-center text-[15px] font-semibold tracking-tight text-foreground">
                  {job.companyUrl ? (
                    // The name itself is the link — the icon alone was a
                    // ~14px hit target. Underline on hover marks it as
                    // clickable; the icon still signals "opens externally".
                    <a
                      href={job.companyUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 rounded-sm underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      {job.company}
                      <ExternalLink size={14} className="shrink-0 text-muted transition-colors group-hover/row:text-primary" />
                    </a>
                  ) : (
                    job.company
                  )}
                </span>
              </div>
            </div>

            {/* Role title — the card's primary heading */}
            {job.role && (
              <h3 className="mt-4 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {job.role}
              </h3>
            )}

            {/* Duration & location */}
            <p className="mt-1.5 inline-flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[13px] tracking-tight text-muted">
              {job.period}
              {job.location && (
                <>
                  <span className="text-primary/40">&bull;</span>
                  <MapPin size={13} className="shrink-0" />
                  <span>{job.location}</span>
                </>
              )}
            </p>
            {job.id && (
              <p className="mt-1 font-mono text-xs text-muted">Internship ID: {job.id}</p>
            )}

            {/* Description (paragraph) or responsibilities (bullets) */}
            {job.description ? (
              <p className="mt-4 text-[15px] leading-[1.75] text-[#333333] dark:text-[#C9B8C4]">
                {job.description}
              </p>
            ) : (
              job.points?.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {job.points.map((point, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-3 leading-relaxed text-[#333333] dark:text-[#C9B8C4]"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )
            )}

            {/* Technologies used + credential link */}
            {(job.tech?.length > 0 || job.credentialUrl) && (
              <div className="mt-6 space-y-4 border-t border-border pt-5">
                {job.tech?.length > 0 && (
                  <div>
                    <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                      Technologies Used
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {job.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/20 hover:shadow-md hover:shadow-primary/20"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {job.credentialUrl && (
                  <a
                    href={job.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-5 py-2 text-sm font-semibold text-primary shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary hover:text-primary-fg hover:shadow-lg hover:shadow-primary/30"
                  >
                    <ExternalLink size={15} />
                    View Certificate / LOR
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  // Drives the timeline line's scroll-gated visibility. Computed once here
  // and passed to every row so there is a single scroll listener.
  const isScrolling = useIsScrolling();

  return (
    <section id="experience" className="bg-surface/70 pt-10 pb-24 sm:pt-14 transition-none">
      <div className="container">
        <SectionHeading
          eyebrow="Where I've worked"
          title="Work Experience"
          subtitle="A glimpse into my professional journey and the organizations I've had the opportunity to work with."
        />

        {/* Timeline */}
        <div className="mx-auto max-w-4xl space-y-10">
          {experience.map((job, i) => (
            <TimelineEntry
              key={i}
              job={job}
              index={i}
              total={experience.length}
              isScrolling={isScrolling}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
