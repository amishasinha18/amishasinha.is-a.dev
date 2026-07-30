import { FileText, Mail, NotebookPen } from 'lucide-react';
import { Github, Linkedin } from '../ui/BrandIcons.jsx';
import { profile } from '../../data/profile.js';

// `href` opens externally; `page` navigates to an in-app view instead.
const links = [
  { label: 'GitHub', href: profile.socials.github, icon: Github },
  { label: 'LinkedIn', href: profile.socials.linkedin, icon: Linkedin },
  { label: 'Blog', page: 'blog', icon: NotebookPen },
  { label: 'Resume', href: profile.resumeUrl, icon: FileText },
  { label: 'Email', href: `mailto:${profile.email}`, icon: Mail },
];

// Plain glyphs for the outbound social/contact links.
const itemClass =
  'text-foreground transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-accent';

// The Blog entry stays visually distinct from the outbound links — a compact
// aubergine-tinted disc rather than a bare glyph — but carries no visible
// text, so it needs an explicit aria-label for its accessible name.
const blogClass =
  'group/blog inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-fg hover:shadow-lg hover:shadow-primary/30';

export default function Footer({ onNavigate }) {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container flex flex-col items-center gap-6 py-10">
        <div className="flex flex-wrap items-center justify-center gap-5">
          {links.map(({ label, href, page, icon: Icon }) =>
            page ? (
              <button
                key={label}
                type="button"
                onClick={() => onNavigate?.(page)}
                aria-label={label}
                title={`${label} — articles & writing`}
                className={blogClass}
              >
                <Icon
                  size={18}
                  className="transition-transform duration-300 ease-out group-hover/blog:scale-110 group-hover/blog:-rotate-6"
                />
              </button>
            ) : (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                title={label}
                className={itemClass}
              >
                <Icon size={20} />
              </a>
            )
          )}
        </div>
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
