import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ClipboardList,
  Cloud,
  Code2,
  Heart,
  Layers,
  MessageSquare,
  Puzzle,
  Radio,
  Repeat,
  Sparkles,
  Users,
} from 'lucide-react';
import Section from '../ui/Section.jsx';
import SegmentedTabs from '../ui/SegmentedTabs.jsx';
import CertificateGallery from '../ui/CertificateGallery.jsx';
import { skills, softSkills } from '../../data/skills.js';

// Small icon per technical category (falls back to a generic layers icon).
const categoryIcons = {
  'Cloud & DevOps': Cloud,
  Frontend: Code2,
  'Real-Time & Media': Radio,
};

// One category card, using the same premium shell as the rest of the site:
// an ambient glow that blooms on hover over a hairline border that warms from
// neutral to primary, with an inner ring surface.
function SkillCard({ group }) {
  const Icon = categoryIcons[group.category] ?? Layers;
  return (
    <div className="group/skill relative h-full">
      <div className="pointer-events-none absolute -inset-2 rounded-[1.75rem] bg-gradient-to-br from-primary/15 via-sky-500/10 to-transparent opacity-0 blur-2xl transition-opacity duration-500 ease-out group-hover/skill:opacity-100" />
      <div className="relative flex h-full flex-col rounded-2xl bg-gradient-to-br from-border via-border to-border/40 p-px shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-500 ease-out group-hover/skill:-translate-y-1.5 group-hover/skill:from-primary/50 group-hover/skill:via-accent/25 group-hover/skill:to-primary/30 group-hover/skill:shadow-[0_22px_48px_rgba(0,0,0,0.16)]">
        <div className="flex h-full flex-col rounded-[15px] bg-surface/80 p-6 ring-1 ring-black/5 backdrop-blur-md dark:ring-white/10">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20 transition-transform duration-500 ease-out group-hover/skill:scale-105">
              <Icon size={20} />
            </span>
            <h4 className="text-lg font-bold tracking-tight text-foreground">
              {group.category}
            </h4>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {group.items.map((item) => (
              <span
                key={item}
                className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/20 hover:shadow-md hover:shadow-primary/20"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TechnicalSkills() {
  return (
    <div className="grid items-stretch gap-6 sm:grid-cols-2">
      {skills.map((group) => (
        <SkillCard key={group.category} group={group} />
      ))}
    </div>
  );
}

// One icon per soft skill (falls back to a sparkle for any new entry).
const softIcons = {
  'Team Leadership': Users,
  Communication: MessageSquare,
  'Problem Solving': Puzzle,
  'Project Management': ClipboardList,
  Adaptability: Repeat,
  Empathy: Heart,
};

// Structured card — same premium shell as the technical skill cards, now with
// an icon and the short description that the plain tags used to hide.
function SoftSkillCard({ skill }) {
  const Icon = softIcons[skill.title] ?? Sparkles;
  return (
    <div className="group/soft relative h-full">
      <div className="pointer-events-none absolute -inset-2 rounded-[1.75rem] bg-gradient-to-br from-primary/15 via-sky-500/10 to-transparent opacity-0 blur-2xl transition-opacity duration-500 ease-out group-hover/soft:opacity-100" />
      <div className="relative flex h-full flex-col rounded-2xl bg-gradient-to-br from-border via-border to-border/40 p-px shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-500 ease-out group-hover/soft:-translate-y-1.5 group-hover/soft:from-primary/50 group-hover/soft:via-accent/25 group-hover/soft:to-primary/30 group-hover/soft:shadow-[0_22px_48px_rgba(0,0,0,0.16)]">
        <div className="flex h-full flex-col rounded-[15px] bg-surface/80 p-5 ring-1 ring-black/5 backdrop-blur-md dark:ring-white/10">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20 transition-transform duration-500 ease-out group-hover/soft:scale-105">
            <Icon size={20} />
          </span>
          <h4 className="mt-4 text-base font-bold tracking-tight text-foreground">
            {skill.title}
          </h4>
          <p className="mt-1 text-sm leading-snug text-muted">{skill.description}</p>
        </div>
      </div>
    </div>
  );
}

function SoftSkills() {
  return (
    <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {softSkills.map((skill) => (
        <SoftSkillCard key={skill.title} skill={skill} />
      ))}
    </div>
  );
}

function Achievements() {
  return <CertificateGallery />;
}

const tabs = [
  { key: 'technical', label: 'Technical Skills' },
  { key: 'soft', label: 'Soft Skills' },
  { key: 'achievements', label: 'Achievements' },
];

const panels = {
  technical: TechnicalSkills,
  soft: SoftSkills,
  achievements: Achievements,
};

export default function Skills() {
  const [active, setActive] = useState('technical');
  const ActivePanel = panels[active];

  return (
    <Section id="skills" title="Skills" padY="pt-12 pb-28 sm:pt-16 sm:pb-40">
      {/* Tabs — segmented control */}
      <SegmentedTabs
        tabs={tabs}
        active={active}
        onChange={setActive}
        layoutId="skillsTabHighlight"
      />

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          <ActivePanel />
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}
