import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Section from '../ui/Section.jsx';
import ProjectTabs from '../projects/ProjectTabs.jsx';
import ProjectCard from '../projects/ProjectCard.jsx';
import ElectronicsProject from '../projects/ElectronicsProject.jsx';
import { projectData, projectTabs } from '../../data/projects.js';

export default function Projects() {
  const [active, setActive] = useState(projectTabs[0].key);
  const items = projectData[active] ?? [];
  // Featured first, everything else in data order.
  const ordered = [
    ...items.filter((item) => item.featured),
    ...items.filter((item) => !item.featured),
  ];

  return (
    <Section
      id="projects"
      eyebrow="Selected work"
      title="Projects"
      padY="pt-12 pb-28 sm:pt-16 sm:pb-40"
    >
      <ProjectTabs active={active} onChange={setActive} />

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          {active === 'electronics' ? (
            <ElectronicsProject />
          ) : (
            // Responsive 2-column grid (single column on mobile). `items-stretch`
            // makes the two cards in each row match heights, so every pair
            // aligns cleanly without forcing the small cards to the tallest
            // card's height.
            <div className="grid items-stretch gap-6 sm:grid-cols-2">
              {ordered.map((item, i) => (
                <ProjectCard key={item.github || item.title || i} item={item} />
              ))}

              {items.length === 0 && (
                <p className="text-center text-muted">
                  Nothing here yet — check back soon!
                </p>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}
