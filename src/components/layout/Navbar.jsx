import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useContent } from '../../content/ContentContext.jsx';
import { Github, Linkedin } from '../ui/BrandIcons.jsx';
import ThemeToggle from '../ui/ThemeToggle.jsx';

// Icon button styling shared with ThemeToggle, so the header cluster reads
// as one consistent row of controls.
const iconBtn =
  'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground transition hover:border-accent hover:text-accent';

function SocialLinks() {
  const { profile } = useContent();
  const socials = [
    { label: 'GitHub', href: profile.socials.github, Icon: Github },
    { label: 'LinkedIn', href: profile.socials.linkedin, Icon: Linkedin },
  ];
  return (
    <>
      {socials.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={label}
          title={label}
          className={iconBtn}
        >
          <Icon size={18} />
        </a>
      ))}
    </>
  );
}

export default function Navbar({ activePage, onNavigate }) {
  const [open, setOpen] = useState(false);
  const { siteText } = useContent();
  const navLinks = siteText.nav;

  const go = (id) => {
    onNavigate(id);
    setOpen(false);
  };

  // Desktop link — text colour only; the underline is a single shared element
  // (below) that slides between tabs, rather than one per button.
  const deskLink = (id) =>
    activePage === id
      ? 'relative py-1 text-sm font-semibold tracking-[0.5px] text-primary transition-colors duration-200'
      : 'relative py-1 text-sm font-medium tracking-[0.5px] text-[#555555] transition-colors duration-200 hover:text-primary dark:text-[#B49FAC]';

  const mobLink = (id) =>
    activePage === id
      ? 'rounded-md px-3 py-2 text-left text-sm font-semibold text-primary bg-primary/10'
      : 'rounded-md px-3 py-2 text-left text-sm font-medium text-[#555555] transition-colors hover:bg-primary/5 hover:text-primary dark:text-[#B49FAC]';

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/70 backdrop-blur-md backdrop-saturate-150">
      <nav className="container flex h-16 items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => go('home')}
          className="group flex items-center gap-3 text-left"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary font-mono text-sm font-bold text-primary-fg shadow-sm transition-transform duration-300 group-hover:scale-105">
            AS
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-extrabold tracking-tight text-foreground">
              Amisha Sinha
            </span>
            <span className="mt-0.5 font-mono text-xs tracking-wide text-muted">
              <span className="text-primary/60">&gt;</span> B.Tech Computer Science
            </span>
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 lg:flex">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => go(link.id)}
                className={deskLink(link.id)}
              >
                {link.label}
                {/* Single underline shared across tabs — Framer's layoutId makes
                    it slide from the old tab to the new one whenever the active
                    page changes (on click or any navigation). */}
                {activePage === link.id && (
                  <motion.span
                    layoutId="navUnderline"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-primary"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Social links + theme toggle, split off by a divider. The two
              social icons stay grouped (gap-2); an exact 50px gap sets the
              theme toggle clearly apart from them. */}
          <div className="flex items-center gap-[50px] border-l border-border pl-6">
            <div className="flex items-center gap-2">
              <SocialLinks />
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-background/90 backdrop-blur-md lg:hidden">
          <div className="container flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => go(link.id)}
                className={mobLink(link.id)}
              >
                {link.label}
              </button>
            ))}
            {/* Social links — kept out of the compact top bar on mobile */}
            <div className="mt-2 flex items-center gap-2 border-t border-border pt-4">
              <SocialLinks />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
