import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Overview from './components/sections/Overview.jsx';
import About from './components/sections/About.jsx';
import Experience from './components/sections/Experience.jsx';
import Skills from './components/sections/Skills.jsx';
import Projects from './components/sections/Projects.jsx';
import Blog from './components/sections/Blog.jsx';
import Contact from './components/sections/Contact.jsx';
import GetInTouchFab from './components/ui/GetInTouchFab.jsx';
import { useContentProtection } from './hooks/useContentProtection.js';

// Maps each nav id to the component rendered when that tab is active.
// `blog` is reachable from the Footer rather than the main nav.
const pages = {
  home: Overview,
  about: About,
  experience: Experience,
  skills: Skills,
  projects: Projects,
  blog: Blog,
  contact: Contact,
};

export default function App() {
  const [activePage, setActivePage] = useState('home');

  // Blocks context menu, copy/cut, drag and Ctrl/Cmd shortcuts site-wide.
  useContentProtection();

  const navigate = useCallback((id) => {
    setActivePage(id in pages ? id : 'home');
    // Jump to top so each "page" starts clean and navigation feels snappy.
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const ActivePage = pages[activePage] ?? Overview;

  return (
    <>
      <Navbar activePage={activePage} onNavigate={navigate} />
      <main className="min-h-[calc(100svh-4rem)] pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <ActivePage onNavigate={navigate} />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer onNavigate={navigate} />
      {/* Floating CTA on every page except Overview (which has its own hero
          Contact button) and Contact (the button's own destination). */}
      <GetInTouchFab
        onNavigate={navigate}
        hidden={activePage === 'home' || activePage === 'contact'}
      />
    </>
  );
}
