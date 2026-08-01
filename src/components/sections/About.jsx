import { motion } from 'framer-motion';
import { GraduationCap, School, BookOpen, Trophy } from 'lucide-react';
import { useContent } from '../../content/ContentContext.jsx';

// Icon per education level (falls back to the graduation cap).
const eduIcons = [GraduationCap, School, BookOpen];

function SectionHeading({ children }) {
  return (
    <div className="mb-7 flex flex-col items-center">
      <h3 className="text-center text-[13px] font-bold uppercase tracking-[0.18em] text-primary sm:text-sm">
        {children}
      </h3>
      {/* Delicate fading hairline — replaces the heavier solid rule. */}
      <span className="mt-2.5 h-px w-10 rounded-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
    </div>
  );
}

function reveal(i = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.5, ease: 'easeOut', delay: i * 0.05 },
  };
}

export default function About() {
  const { education, profile, aboutParagraphs, sportsAchievements, siteText } = useContent();
  return (
    <section id="about" className="bg-surface/70 pt-10 pb-24 sm:pt-14 transition-none">
      <div className="container">
        {/* Profile photo — centered above the title */}
        <img src="/profile-face.jpg" alt={profile.name} className="profile-photo" />

        {/* Title */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
            {siteText.sections.about.title}
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-accent" />
        </div>

        <div className="space-y-20">
          {/* My Story — standalone titled card */}
          <motion.div id="my-story" className="scroll-mt-32" {...reveal(0)}>
            <div className="group relative mx-auto max-w-5xl">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/10 via-sky-500/5 to-transparent opacity-70 blur-2xl" />
              <div className="relative rounded-xl bg-gradient-to-br from-primary/25 via-accent/15 to-transparent p-px shadow-[0_12px_36px_rgba(0,0,0,0.1)] transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_20px_45px_rgba(0,0,0,0.14)]">
                <div className="rounded-[11px] bg-[#FCFCFC] p-10 shadow-inner ring-1 ring-black/5 dark:bg-surface dark:ring-white/10 sm:p-14">
                  <SectionHeading>My Story</SectionHeading>
                  <div className="mx-auto max-w-3xl space-y-5 text-[17px] leading-[1.8] text-[#333333] dark:text-[#C9B8C4]">
                    {/* Lead paragraph — larger and tighter to anchor the hierarchy. */}
                    <p className="text-xl font-medium leading-[1.65] tracking-tight text-foreground sm:text-[22px]">
                      {aboutParagraphs[0]}
                    </p>
                    {aboutParagraphs.slice(1).map((text, i) => (
                      <p key={i}>{text}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Row: Education + Beyond Academics */}
          <div className="grid items-stretch gap-8 lg:grid-cols-2">
            <motion.div id="education" className="flex h-full scroll-mt-32 flex-col" {...reveal(1)}>
              <div className="group relative flex h-full flex-col">
                <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/10 via-sky-500/5 to-transparent opacity-70 blur-2xl" />
                <div className="relative flex flex-1 flex-col rounded-xl bg-gradient-to-br from-primary/25 via-accent/15 to-transparent p-px shadow-[0_12px_36px_rgba(0,0,0,0.1)] transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_20px_45px_rgba(0,0,0,0.14)]">
                  <div className="flex flex-1 flex-col rounded-[11px] bg-[#FCFCFC] p-6 shadow-inner ring-1 ring-black/5 dark:bg-surface dark:ring-white/10 sm:p-8">
                    <SectionHeading>Education</SectionHeading>
                    <div className="relative w-full flex-1">
                      <div className="absolute bottom-1 left-5 top-1 w-px bg-gradient-to-b from-primary/50 via-border to-transparent sm:left-6" />
                      <div className="space-y-6">
                        {education.map((edu, i) => {
                          const Icon = eduIcons[i] ?? GraduationCap;
                          return (
                            <div key={i} className="group/edu relative flex gap-4 sm:gap-6">
                              {/* Identical interactive highlight for every entry —
                                  driven by the row's group/edu, so hovering the
                                  icon or its text lights the same states. */}
                              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-primary shadow-sm transition-all duration-300 ease-out group-hover/edu:scale-110 group-hover/edu:border-primary/50 group-hover/edu:bg-primary/20 group-hover/edu:shadow-lg group-hover/edu:shadow-primary/40 group-active/edu:scale-95 group-active/edu:shadow-md sm:h-12 sm:w-12">
                                <Icon size={20} />
                              </div>
                              <div className="flex-1 pt-1.5">
                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                  <h3 className="text-lg font-bold tracking-tight">{edu.degree}</h3>
                                  <span className="text-xs font-medium text-muted">{edu.period}</span>
                                </div>
                                {edu.field && (
                                  <p className="text-sm font-medium text-primary">{edu.field}</p>
                                )}
                                <p className="mt-1 text-sm text-muted">{edu.institution}</p>
                                {edu.detail && <p className="mt-2 text-sm text-muted">{edu.detail}</p>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div id="beyond-academics" className="flex h-full scroll-mt-32 flex-col" {...reveal(2)}>
              <div className="group relative flex h-full flex-col">
                <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/10 via-sky-500/5 to-transparent opacity-70 blur-2xl" />
                <div className="relative flex flex-1 flex-col rounded-xl bg-gradient-to-br from-primary/25 via-accent/15 to-transparent p-px shadow-[0_12px_36px_rgba(0,0,0,0.1)] transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_20px_45px_rgba(0,0,0,0.14)]">
                  <div className="flex flex-1 flex-col rounded-[11px] bg-[#FCFCFC] p-6 shadow-inner ring-1 ring-black/5 dark:bg-surface dark:ring-white/10 sm:p-8">
                    <SectionHeading>Beyond Academics</SectionHeading>
                    <div className="flex flex-1 flex-col gap-5">
                      {sportsAchievements.map(({ sport, year, tag, org, description }) => (
                        <div
                          key={sport}
                          className="group/card flex flex-1 flex-col rounded-xl border border-border bg-background p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/20"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm transition-all duration-300 ease-out group-hover/card:scale-110 group-hover/card:bg-primary/20 group-hover/card:shadow-lg group-hover/card:shadow-primary/40">
                              <Trophy size={18} />
                            </span>
                            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                              {tag}
                            </span>
                          </div>
                          <div className="mt-3 flex items-baseline justify-between gap-2">
                            <h4 className="text-base font-bold text-[#1A1A1A] dark:text-white">
                              {sport}
                            </h4>
                            {year && (
                              <span className="text-sm font-semibold text-primary">{year}</span>
                            )}
                          </div>
                          <p className="mt-1 text-sm font-medium text-muted">{org}</p>
                          <p className="mt-2 text-sm leading-relaxed text-[#333333] dark:text-[#C9B8C4]">
                            {description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
