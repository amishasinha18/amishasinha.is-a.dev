import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading.jsx';

// Wrapper that gives every section a scroll anchor id, consistent padding,
// an optional heading, and a subtle fade/slide-in on scroll.
//
// `padY` sets the vertical padding. It defaults to the shared rhythm; pass a
// tighter value (e.g. a smaller top) for a section that should sit higher.
export default function Section({
  id,
  title,
  subtitle,
  eyebrow,
  padY = 'py-28 sm:py-40',
  className = '',
  children,
}) {
  return (
    <section id={id} className={`${padY} ${className}`}>
      <div className="container">
        {title && <SectionHeading title={title} subtitle={subtitle} eyebrow={eyebrow} />}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
