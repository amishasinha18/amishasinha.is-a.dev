import { Calendar, Sparkles } from 'lucide-react';
import { ProjectLinks, TechChips } from './ProjectMeta.jsx';

// One compact project card for the 2-column grid. No imagery — the card
// holds description, tech chips, key features and the action links, and
// stretches to match its row-mate's height (see the grid in Projects.jsx).
export default function ProjectCard({ item }) {
  const tech = item.tech ?? [];
  const features = item.features ?? [];

  return (
    <article className="group/row relative h-full">
        {/* Ambient glow — blooms on hover so the stack stays calm at rest */}
        <div className="pointer-events-none absolute -inset-2 rounded-[1.75rem] bg-gradient-to-br from-primary/15 via-sky-500/10 to-transparent opacity-0 blur-2xl transition-opacity duration-500 ease-out group-hover/row:opacity-100" />

        {/* Hairline border, warming from neutral to primary on hover */}
        <div className="relative flex h-full flex-col rounded-2xl bg-gradient-to-br from-border via-border to-border/40 p-px shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-500 ease-out group-hover/row:-translate-y-1.5 group-hover/row:from-primary/50 group-hover/row:via-accent/25 group-hover/row:to-primary/30 group-hover/row:shadow-[0_22px_48px_rgba(0,0,0,0.16)]">
          <div className="relative flex h-full flex-1 flex-col overflow-hidden rounded-[15px] bg-surface/80 p-4 ring-1 ring-black/5 backdrop-blur-md dark:ring-white/10 sm:p-5">
            {/* ── High-tech surface treatment (all decorative) ──────── */}
            {/* Faint blueprint grid, masked away before it reaches the text */}
            <span
              aria-hidden="true"
              className="tech-grid pointer-events-none absolute inset-0 rounded-[15px]"
            />
            {/* Status rail along the top edge, lights up on hover */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover/row:opacity-70"
            />
            {/* HUD corner brackets — drawn only on hover */}
            <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-4 w-4 rounded-tl-[15px] border-l border-t border-primary/0 transition-colors duration-500 ease-out group-hover/row:border-primary/60" />
            <span aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-4 w-4 rounded-tr-[15px] border-r border-t border-primary/0 transition-colors duration-500 ease-out group-hover/row:border-primary/60" />
            <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-4 w-4 rounded-bl-[15px] border-b border-l border-primary/0 transition-colors duration-500 ease-out group-hover/row:border-primary/60" />
            <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-4 w-4 rounded-br-[15px] border-b border-r border-primary/0 transition-colors duration-500 ease-out group-hover/row:border-primary/60" />
            {/* Light sweep — travels across the card once on hover */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -left-1/4 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-primary/[0.07] to-transparent opacity-0 transition-all duration-1000 ease-out group-hover/row:left-full group-hover/row:opacity-100"
            />

            {/* ── Content ───────────────────────────────────────────── */}
            {/* Meta strip: year + featured flag */}
            <div className="relative mb-1.5 flex flex-wrap items-center gap-1.5">
              {item.year && (
                <span className="inline-flex items-center gap-1 rounded-md border border-border bg-background/70 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-tight text-muted">
                  <Calendar size={10} className="shrink-0" />
                  {item.year}
                </span>
              )}
              {item.featured && (
                <span className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                  <Sparkles size={10} className="shrink-0" />
                  Featured
                </span>
              )}
            </div>

            <h3 className="relative text-lg font-bold leading-tight tracking-tight text-foreground">
              {item.title}
            </h3>
            {item.subtitle && (
              <p className="relative mt-0.5 font-mono text-[11px] font-medium leading-snug text-primary">
                {item.subtitle}
              </p>
            )}

            <p className="relative mt-2 text-[13px] leading-snug text-[#333333] dark:text-[#C9B8C4]">
              {item.description}
            </p>

            {/* All chips, always */}
            <TechChips items={tech} className="relative mt-2.5" />

            {/* All features as a clean single-column list — fits the compact
                2-column card without cramping. */}
            {features.length > 0 && (
              <div className="relative mt-2.5">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                  Key Features
                </p>
                <ul className="mt-1.5 space-y-1">
                  {features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-1.5 text-[13px] leading-snug text-[#333333] dark:text-[#C9B8C4]"
                    >
                      <span className="mt-[6px] h-1 w-1 shrink-0 rotate-45 rounded-[1px] bg-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* mt-auto pins the buttons to the bottom edge, so every card
                lines its footer up down the column. */}
            <ProjectLinks demo={item.demo} github={item.github} className="relative mt-auto" />
          </div>
        </div>
    </article>
  );
}
