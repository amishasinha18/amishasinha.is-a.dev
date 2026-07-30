import { ExternalLink } from 'lucide-react';
import { Github } from '../ui/BrandIcons.jsx';

// Shared building blocks for project cards. Both the featured and the compact
// card import these, so the chips and action buttons are guaranteed identical
// rather than two copies that drift apart.

// Tech-stack chips, styled as terminal-style tokens: squared corners, mono
// type and a small square LED marker, rather than the soft pills used
// elsewhere on the site. Every chip renders (CallIQ has 11), so the padding
// stays tight to limit wrapping.
export function TechChips({ items, className = '' }) {
  if (!items?.length) return null;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {items.map((t) => (
        <span
          key={t}
          className="group/chip inline-flex items-center gap-1.5 rounded-md border border-primary/25 bg-primary/[0.07] px-2 py-0.5 font-mono text-[11px] font-medium tracking-tight text-primary transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/15 hover:shadow-[0_0_12px_-2px_rgb(var(--color-primary)/0.45)]"
        >
          {/* LED marker — brightens with the chip */}
          <span className="h-1 w-1 shrink-0 rounded-[1px] bg-primary/60 transition-colors duration-300 group-hover/chip:bg-primary" />
          {t}
        </span>
      ))}
    </div>
  );
}

// One shape for every action button — same padding, radius, weight and motion.
// Only the colour role differs between the two variants.
const actionBase =
  'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[13px] font-semibold tracking-tight shadow-sm transition-all duration-300 ease-out';

const actionSolid = `${actionBase} bg-primary text-primary-fg hover:-translate-y-0.5 hover:opacity-95 hover:shadow-[0_0_18px_-2px_rgb(var(--color-primary)/0.65)]`;

const actionOutline = `${actionBase} border border-primary/40 text-primary hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10 hover:shadow-[0_0_18px_-4px_rgb(var(--color-primary)/0.6)]`;

// Disabled "coming soon" affordance — dashed border, no lift, no shadow, so it
// is visibly inert rather than just a dimmed button.
const actionDisabled = `${actionBase} cursor-not-allowed border border-dashed border-border text-muted opacity-60 shadow-none`;

// View Source + Live Demo. `Live Demo` always renders: as a real link when the
// project is deployed, otherwise as the disabled coming-soon state, so the
// footer keeps the same shape across every card in a row.
export function ProjectLinks({ demo, github, className = '' }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-2 border-t border-border pt-3 ${className}`}
    >
      {github && (
        <a href={github} target="_blank" rel="noreferrer noopener" className={actionSolid}>
          <Github size={14} />
          View Source
        </a>
      )}

      {demo ? (
        <a href={demo} target="_blank" rel="noreferrer noopener" className={actionOutline}>
          <ExternalLink size={14} />
          Live Demo
        </a>
      ) : (
        <span
          aria-disabled="true"
          title="Coming soon — not yet deployed"
          className={actionDisabled}
        >
          <ExternalLink size={14} />
          Live Demo · Coming Soon
        </span>
      )}
    </div>
  );
}
