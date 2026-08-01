import { motion } from 'framer-motion';
import { useContent } from '../../content/ContentContext.jsx';
import { sectionsForPage } from '../../content/customSections.js';

function reveal(i = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.5, ease: 'easeOut', delay: i * 0.05 },
  };
}

// Renders the owner's custom sections for a given page (added from the admin)
// as titled cards, styled like the "My Story" card. Nothing renders until the
// page has at least one non-empty block.
export default function CustomSections({ page }) {
  const { customSections } = useContent();
  const items = sectionsForPage(customSections, page).filter(
    (s) => s && (s.title || s.body)
  );
  if (items.length === 0) return null;

  return (
    <div className="container space-y-16 pb-24 pt-12 sm:pt-16">
      {items.map((section, i) => (
        <motion.div key={i} {...reveal(i)}>
          <div className="group relative mx-auto max-w-5xl">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/10 via-sky-500/5 to-transparent opacity-70 blur-2xl" />
            <div className="relative rounded-xl bg-gradient-to-br from-primary/25 via-accent/15 to-transparent p-px shadow-[0_12px_36px_rgba(0,0,0,0.1)] transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_20px_45px_rgba(0,0,0,0.14)]">
              <div className="rounded-[11px] bg-[#FCFCFC] p-8 shadow-inner ring-1 ring-black/5 dark:bg-surface dark:ring-white/10 sm:p-10">
                {section.title && (
                  <h3 className="mb-5 text-center text-[13px] font-bold uppercase tracking-[0.18em] text-primary sm:text-sm">
                    {section.title}
                  </h3>
                )}
                <div className="mx-auto max-w-3xl space-y-4 text-[15px] leading-[1.8] text-[#333333] dark:text-[#C9B8C4]">
                  {String(section.body || '')
                    .split('\n')
                    .filter((p) => p.trim())
                    .map((para, j) => (
                      <p key={j}>{para}</p>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
