import { useState } from 'react';
import {
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Check,
  ChevronRight,
  Cpu,
  Download,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  LayoutGrid,
  LayoutTemplate,
  LogOut,
  Mail,
  Menu,
  Moon,
  NotebookPen,
  PanelBottom,
  RotateCcw,
  Save,
  Sparkles,
  SquareTerminal,
  Sun,
  Trophy,
  Type,
  Undo2,
  User,
  Users,
  Wrench,
} from 'lucide-react';
import { useContent } from '../../content/ContentContext.jsx';
import { normalizeCustomSections, sectionsForPage } from '../../content/customSections.js';
import { StringList, TextArea, TextField } from './fields.jsx';
import { setPath } from './paths.js';
import ListEditor from './ListEditor.jsx';

// Field schemas for the array-of-object sections.
const SCHEMAS = {
  experience: {
    titleKey: 'company',
    newItem: () => ({
      role: '',
      company: '',
      companyUrl: '',
      logo: '',
      dateLabel: '',
      period: '',
      location: '',
      current: false,
      description: '',
      tech: [],
      credentialUrl: '',
    }),
    fields: [
      { key: 'role', label: 'Role / title' },
      { key: 'company', label: 'Company' },
      { key: 'companyUrl', label: 'Company URL' },
      { key: 'logo', label: 'Logo path (/xyz.png)' },
      { key: 'dateLabel', label: 'Date label (rail)' },
      { key: 'period', label: 'Full period' },
      { key: 'location', label: 'Location' },
      { key: 'current', label: 'Current role', type: 'bool' },
      { key: 'description', label: 'Description', type: 'textarea', full: true },
      { key: 'tech', label: 'Tech tags', type: 'stringlist', full: true },
      { key: 'credentialUrl', label: 'Certificate / LOR URL', full: true },
    ],
  },
  projects: {
    titleKey: 'title',
    newItem: () => ({
      title: '',
      year: '',
      subtitle: '',
      description: '',
      tech: [],
      features: [],
      demo: '',
      github: '',
      featured: false,
    }),
    fields: [
      { key: 'title', label: 'Title' },
      { key: 'year', label: 'Year' },
      { key: 'subtitle', label: 'Subtitle', full: true },
      { key: 'description', label: 'Description', type: 'textarea', full: true },
      { key: 'tech', label: 'Tech tags', type: 'stringlist', full: true },
      { key: 'features', label: 'Key features', type: 'stringlist', full: true },
      { key: 'demo', label: 'Live demo URL' },
      { key: 'github', label: 'GitHub URL' },
      { key: 'featured', label: 'Featured', type: 'bool' },
    ],
  },
  skills: {
    titleKey: 'category',
    newItem: () => ({ category: '', items: [] }),
    fields: [
      { key: 'category', label: 'Category' },
      { key: 'items', label: 'Skills', type: 'stringlist', full: true },
    ],
  },
  softSkills: {
    titleKey: 'title',
    newItem: () => ({ title: '', description: '' }),
    fields: [
      { key: 'title', label: 'Title' },
      { key: 'description', label: 'Description', full: true },
    ],
  },
  education: {
    titleKey: 'degree',
    newItem: () => ({ degree: '', field: '', institution: '', period: '', detail: '' }),
    fields: [
      { key: 'degree', label: 'Degree' },
      { key: 'field', label: 'Field' },
      { key: 'institution', label: 'Institution', full: true },
      { key: 'period', label: 'Period' },
      { key: 'detail', label: 'Detail' },
    ],
  },
  certificates: {
    titleKey: 'title',
    newItem: () => ({ title: '', organization: '', year: '', image: '' }),
    fields: [
      { key: 'title', label: 'Title' },
      { key: 'organization', label: 'Organization' },
      { key: 'year', label: 'Year' },
      { key: 'image', label: 'Image path (/certificates/x.png)', full: true },
    ],
  },
  blogs: {
    titleKey: 'title',
    newItem: () => ({ title: '', venue: '', date: '', description: '', tags: [], link: '' }),
    fields: [
      { key: 'title', label: 'Title' },
      { key: 'venue', label: 'Venue' },
      { key: 'date', label: 'Date' },
      { key: 'description', label: 'Description', type: 'textarea', full: true },
      { key: 'tags', label: 'Tags', type: 'stringlist', full: true },
      { key: 'link', label: 'Link', full: true },
    ],
  },
  sportsAchievements: {
    titleKey: 'sport',
    newItem: () => ({ sport: '', year: '', tag: '', org: '', description: '' }),
    fields: [
      { key: 'sport', label: 'Sport' },
      { key: 'year', label: 'Year' },
      { key: 'tag', label: 'Placement (e.g. First Runner-Up)' },
      { key: 'org', label: 'Organisation', full: true },
      { key: 'description', label: 'Description', type: 'textarea', full: true },
    ],
  },
  milestones: {
    titleKey: 'sub',
    newItem: () => ({ value: '', sub: '' }),
    fields: [
      { key: 'value', label: 'Value (e.g. 5+)' },
      { key: 'sub', label: 'Label' },
    ],
  },
  terminalCommands: {
    titleKey: 'command',
    newItem: () => ({ command: '', output: [] }),
    fields: [
      { key: 'command', label: 'Command' },
      { key: 'output', label: 'Output lines', type: 'stringlist', full: true },
    ],
  },
};

// Schema for a per-page custom section block.
const CUSTOM_SCHEMA = [
  { key: 'title', label: 'Section title' },
  { key: 'body', label: 'Content', type: 'textarea', rows: 5, full: true },
];

// "Meta" panels edit slices of siteText (fixed UI copy) or projectTabs. Each
// declares how to read its slice, write it back, and which editor to render.
const HEADING_SECTIONS = [
  ['about', 'About'],
  ['experience', 'Experience'],
  ['skills', 'Skills'],
  ['projects', 'Projects'],
  ['blog', 'Blog'],
];
const META = {
  navigation: {
    label: 'Navigation',
    read: (c) => c.siteText.nav,
    write: (c, u, d) => u('siteText', { ...c.siteText, nav: d }),
    render: 'navList',
  },
  heroText: {
    label: 'Hero Text',
    read: (c) => c.siteText.hero,
    write: (c, u, d) => u('siteText', { ...c.siteText, hero: d }),
    render: 'hero',
  },
  sectionHeadings: {
    label: 'Section Headings',
    read: (c) => {
      const s = c.siteText.sections;
      return {
        about: s.about,
        experience: s.experience,
        skills: s.skills,
        projects: s.projects,
        blog: s.blog,
      };
    },
    write: (c, u, d) =>
      u('siteText', { ...c.siteText, sections: { ...c.siteText.sections, ...d } }),
    render: 'headings',
  },
  contactText: {
    label: 'Contact Text',
    read: (c) => c.siteText.sections.contact,
    write: (c, u, d) =>
      u('siteText', {
        ...c.siteText,
        sections: { ...c.siteText.sections, contact: d },
      }),
    render: 'contact',
  },
  footerText: {
    label: 'Footer & Terminal',
    read: (c) => ({ rights: c.siteText.footer.rights, host: c.siteText.terminal.host }),
    write: (c, u, d) =>
      u('siteText', {
        ...c.siteText,
        footer: { ...c.siteText.footer, rights: d.rights },
        terminal: { ...c.siteText.terminal, host: d.host },
      }),
    render: 'footer',
  },
  projectTabs: {
    label: 'Project Tabs',
    read: (c) => c.projectTabs,
    write: (c, u, d) => u('projectTabs', d),
    render: 'tabs',
  },
};

// Icon per section key (custom:* handled separately).
const ICONS = {
  profile: User,
  navigation: Menu,
  sectionHeadings: Type,
  footerText: PanelBottom,
  heroText: Sparkles,
  milestones: BarChart3,
  terminalCommands: SquareTerminal,
  aboutParagraphs: BookOpen,
  education: GraduationCap,
  sportsAchievements: Trophy,
  experience: Briefcase,
  projects: FolderKanban,
  projectTabs: LayoutGrid,
  electronicsProject: Cpu,
  skills: Wrench,
  softSkills: Users,
  certificates: Award,
  blogs: NotebookPen,
  contactText: Mail,
};

// Sidebar organised by page. Each group with a `page` gets a synthetic
// "Custom sections" entry (custom:<page>) that edits that page's blocks.
const GROUPS = [
  {
    label: 'Site-wide',
    items: [
      ['profile', 'Profile'],
      ['navigation', 'Navigation'],
      ['sectionHeadings', 'Section Headings'],
      ['footerText', 'Footer & Terminal'],
    ],
  },
  {
    label: 'Home',
    page: 'home',
    items: [
      ['heroText', 'Hero Text'],
      ['milestones', 'Hero Stats'],
      ['terminalCommands', 'Terminal'],
    ],
  },
  {
    label: 'About',
    page: 'about',
    items: [
      ['aboutParagraphs', 'About Story'],
      ['education', 'Education'],
      ['sportsAchievements', 'Beyond Academics'],
    ],
  },
  { label: 'Experience', page: 'experience', items: [['experience', 'Experience']] },
  {
    label: 'Projects',
    page: 'projects',
    items: [
      ['projects', 'Projects'],
      ['projectTabs', 'Project Tabs'],
      ['electronicsProject', 'Electronics Project'],
    ],
  },
  {
    label: 'Skills',
    page: 'skills',
    items: [
      ['skills', 'Skills'],
      ['softSkills', 'Soft Skills'],
      ['certificates', 'Certificates'],
    ],
  },
  { label: 'Blog', page: 'blog', items: [['blogs', 'Blog']] },
  { label: 'Contact', page: 'contact', items: [['contactText', 'Contact Text']] },
];

// Expand each group's items with its custom-sections entry.
function groupItems(group) {
  return group.page ? [...group.items, [`custom:${group.page}`, 'Custom sections']] : group.items;
}

const iconFor = (key) => (key.startsWith('custom:') ? LayoutTemplate : ICONS[key] ?? Sparkles);

function labelFor(key) {
  if (key.startsWith('custom:')) return 'Custom sections';
  if (META[key]) return META[key].label;
  for (const g of GROUPS) {
    const found = groupItems(g).find(([k]) => k === key);
    if (found) return found[1];
  }
  return key;
}

// The page-group label an active key belongs to (for the breadcrumb).
function groupLabelFor(key) {
  for (const g of GROUPS) {
    if (groupItems(g).some(([k]) => k === key)) return g.label;
  }
  return '';
}

// Read/write the stored value for a section (projects live under projectData,
// meta panels edit slices of siteText, custom:<page> lives under customSections).
function readSection(key, content) {
  if (key.startsWith('custom:')) return sectionsForPage(content.customSections, key.slice(7));
  if (META[key]) return META[key].read(content);
  if (key === 'projects') return content.projectData?.tech ?? [];
  return content[key];
}
function writeSection(key, draft, content, updateSection) {
  if (key.startsWith('custom:')) {
    const page = key.slice(7);
    updateSection('customSections', {
      ...normalizeCustomSections(content.customSections),
      [page]: draft,
    });
  } else if (META[key]) {
    META[key].write(content, updateSection, draft);
  } else if (key === 'projects') {
    updateSection('projectData', { ...content.projectData, tech: draft });
  } else {
    updateSection(key, draft);
  }
}

// Small icon button used in the top action bar.
function IconAction({ icon: Icon, label, onClick, href, danger }) {
  const cls = `inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
    danger
      ? 'border-border text-red-500 hover:border-red-400 hover:bg-red-500/10'
      : 'border-border text-muted hover:border-primary/50 hover:text-primary hover:bg-primary/5'
  }`;
  const inner = (
    <>
      <Icon size={15} />
      <span className="hidden md:inline">{label}</span>
    </>
  );
  return href ? (
    <a href={href} className={cls} title={label}>
      {inner}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={cls} title={label}>
      {inner}
    </button>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('admin-theme', next ? 'dark' : 'light');
    } catch {
      /* ignore */
    }
  };
  return (
    <button
      type="button"
      onClick={toggle}
      title={dark ? 'Switch to light' : 'Switch to dark'}
      aria-label="Toggle theme"
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted transition hover:border-primary/50 hover:text-primary"
    >
      {dark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}

export default function AdminDashboard({ onExit }) {
  const content = useContent();
  const { updateSection, exportJson, resetAll } = content;
  const [active, setActive] = useState('profile');

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-surface">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-fg shadow-sm">
            AS
          </span>
          <div className="leading-tight">
            <p className="text-sm font-bold text-foreground">Portfolio Admin</p>
            <p className="text-[11px] text-muted">Content studio</p>
          </div>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {GROUPS.map((group) => (
            <div key={group.label}>
              <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted/70">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {groupItems(group).map(([key, label]) => {
                  const Icon = iconFor(key);
                  const isActive = active === key;
                  const isCustom = key.startsWith('custom:');
                  return (
                    <button
                      key={key}
                      onClick={() => setActive(key)}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition ${
                        isActive
                          ? 'bg-primary font-semibold text-primary-fg shadow-sm'
                          : 'text-muted hover:bg-primary/10 hover:text-foreground'
                      } ${isCustom && !isActive ? 'text-muted/80' : ''}`}
                    >
                      <Icon size={15} className="shrink-0" />
                      <span className="truncate">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-background/80 px-6 py-3 backdrop-blur">
          <div className="min-w-0">
            <p className="flex items-center gap-1 text-[11px] font-medium text-muted">
              {groupLabelFor(active)}
              <ChevronRight size={12} className="text-muted/60" />
              <span className="text-primary">{labelFor(active)}</span>
            </p>
            <h1 className="truncate text-lg font-bold text-foreground">{labelFor(active)}</h1>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <ThemeToggle />
            <IconAction icon={ExternalLink} label="View site" href="/" />
            <IconAction icon={Download} label="Export" onClick={exportJson} />
            <IconAction
              icon={RotateCcw}
              label="Reset"
              onClick={() => {
                if (confirm('Discard all saved local edits and restore defaults?')) resetAll();
              }}
            />
            <IconAction icon={LogOut} label="Log out" danger onClick={() => onExit?.()} />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-6 py-8">
            {/* key={active} remounts the editor on section switch so the draft
                resets to that section's saved value. */}
            <SectionEditor
              key={active}
              sectionKey={active}
              content={content}
              updateSection={updateSection}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

// Sticky Save / Discard bar. Nothing is applied to the live content until Save.
function SaveBar({ dirty, saved, onSave, onDiscard }) {
  return (
    <div className="sticky top-0 z-10 -mx-6 mb-6 flex items-center justify-between border-b border-border bg-background/90 px-6 py-3 backdrop-blur">
      <span className="text-sm">
        {saved ? (
          <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
            <Check size={15} /> Saved
          </span>
        ) : dirty ? (
          <span className="font-medium text-accent">● Unsaved changes</span>
        ) : (
          <span className="text-muted">No changes</span>
        )}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDiscard}
          disabled={!dirty}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted transition hover:bg-primary/5 hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <Undo2 size={15} /> Discard
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!dirty}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-primary-fg shadow-sm transition hover:opacity-90 disabled:opacity-40"
        >
          <Save size={15} /> Save
        </button>
      </div>
    </div>
  );
}

function SectionEditor({ sectionKey, content, updateSection }) {
  const stored = readSection(sectionKey, content);
  // The draft holds edits locally; nothing touches the live content until Save.
  const [draft, setDraft] = useState(stored);
  const [saved, setSaved] = useState(false);

  const dirty = JSON.stringify(draft) !== JSON.stringify(stored);

  const save = () => {
    writeSection(sectionKey, draft, content, updateSection);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };
  const discard = () => {
    setDraft(stored);
    setSaved(false);
  };

  const onDraftChange = (next) => {
    setDraft(next);
    setSaved(false);
  };

  const hint = sectionKey.startsWith('custom:')
    ? 'Add titled blocks that render at the bottom of this page. Applied on Save.'
    : 'Edits apply to the site only when you click Save.';

  return (
    <>
      <SaveBar dirty={dirty} saved={saved} onSave={save} onDiscard={discard} />
      <p className="mb-5 text-sm text-muted">{hint}</p>
      <SectionFields sectionKey={sectionKey} draft={draft} onChange={onDraftChange} />
    </>
  );
}

// Renders the right editor for a section, bound to the draft (not the store).
function SectionFields({ sectionKey, draft, onChange }) {
  if (sectionKey.startsWith('custom:')) {
    return (
      <ListEditor
        items={draft}
        schema={CUSTOM_SCHEMA}
        titleKey="title"
        newItem={() => ({ title: '', body: '' })}
        onChange={onChange}
        addLabel="Add section"
      />
    );
  }

  const meta = META[sectionKey];
  if (meta) {
    const set = (path, val) => onChange(setPath(draft, path, val));
    if (meta.render === 'navList') {
      return (
        <ListEditor
          items={draft}
          schema={[
            { key: 'label', label: 'Label' },
            { key: 'id', label: 'Page id (home/about/experience/skills/projects/blog/contact)' },
          ]}
          titleKey="label"
          newItem={() => ({ label: '', id: '' })}
          onChange={onChange}
        />
      );
    }
    if (meta.render === 'tabs') {
      return (
        <ListEditor
          items={draft}
          schema={[
            { key: 'key', label: 'Tab key (tech / electronics)' },
            { key: 'label', label: 'Tab label' },
          ]}
          titleKey="label"
          newItem={() => ({ key: '', label: '' })}
          onChange={onChange}
        />
      );
    }
    if (meta.render === 'hero') {
      return (
        <div className="grid gap-4">
          <TextField label="Role line" value={draft.role} onChange={(v) => set('role', v)} />
          <TextField
            label="Status badge"
            value={draft.statusBadge}
            onChange={(v) => set('statusBadge', v)}
          />
          <TextArea label="Bio paragraph" value={draft.bio} onChange={(v) => set('bio', v)} rows={3} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Resume button"
              value={draft.resumeLabel}
              onChange={(v) => set('resumeLabel', v)}
            />
            <TextField
              label="Contact button"
              value={draft.contactLabel}
              onChange={(v) => set('contactLabel', v)}
            />
          </div>
        </div>
      );
    }
    if (meta.render === 'headings') {
      return (
        <div className="space-y-4">
          {HEADING_SECTIONS.map(([key, label]) => (
            <div key={key} className="rounded-xl border border-border bg-surface p-4">
              <p className="mb-3 text-sm font-semibold text-foreground">{label}</p>
              <div className="grid gap-3">
                <TextField
                  label="Eyebrow"
                  value={draft[key]?.eyebrow}
                  onChange={(v) => set(`${key}.eyebrow`, v)}
                />
                <TextField
                  label="Title"
                  value={draft[key]?.title}
                  onChange={(v) => set(`${key}.title`, v)}
                />
                <TextField
                  label="Subtitle"
                  value={draft[key]?.subtitle}
                  onChange={(v) => set(`${key}.subtitle`, v)}
                />
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (meta.render === 'contact') {
      return (
        <div className="grid gap-4">
          <TextField label="Title" value={draft.title} onChange={(v) => set('title', v)} />
          <TextField label="Lead line" value={draft.lead} onChange={(v) => set('lead', v)} />
          <TextArea label="Body" value={draft.body} onChange={(v) => set('body', v)} rows={3} />
          <TextField
            label="Availability badge"
            value={draft.badge}
            onChange={(v) => set('badge', v)}
          />
          <TextField
            label="Success message"
            value={draft.successMsg}
            onChange={(v) => set('successMsg', v)}
          />
        </div>
      );
    }
    if (meta.render === 'footer') {
      return (
        <div className="grid gap-4">
          <TextField
            label="Footer rights text"
            value={draft.rights}
            onChange={(v) => set('rights', v)}
          />
          <TextField label="Terminal host" value={draft.host} onChange={(v) => set('host', v)} />
        </div>
      );
    }
  }

  if (SCHEMAS[sectionKey]) {
    const schema = SCHEMAS[sectionKey];
    return (
      <ListEditor
        items={draft}
        schema={schema.fields}
        titleKey={schema.titleKey}
        newItem={schema.newItem}
        onChange={onChange}
      />
    );
  }

  if (sectionKey === 'profile') {
    const p = draft;
    const set = (path, val) => onChange(setPath(p, path, val));
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Name" value={p.name} onChange={(v) => set('name', v)} />
        <TextField label="Email" value={p.email} onChange={(v) => set('email', v)} />
        <TextField label="Resume URL" value={p.resumeUrl} onChange={(v) => set('resumeUrl', v)} />
        <TextField label="Photo URL" value={p.photo} onChange={(v) => set('photo', v)} />
        <TextField
          label="GitHub URL"
          value={p.socials?.github}
          onChange={(v) => set('socials.github', v)}
        />
        <TextField
          label="LinkedIn URL"
          value={p.socials?.linkedin}
          onChange={(v) => set('socials.linkedin', v)}
        />
        <div className="sm:col-span-2">
          <TextArea label="Tagline" value={p.tagline} onChange={(v) => set('tagline', v)} rows={2} />
        </div>
        <div className="sm:col-span-2">
          <TextArea label="About" value={p.about} onChange={(v) => set('about', v)} rows={4} />
        </div>
        <div className="sm:col-span-2">
          <StringList label="Roles" value={p.roles} onChange={(v) => set('roles', v)} />
        </div>
      </div>
    );
  }

  if (sectionKey === 'electronicsProject') {
    const e = draft;
    const set = (path, val) => onChange(setPath(e, path, val));
    return (
      <div className="grid gap-4">
        <TextField label="Title" value={e.title} onChange={(v) => set('title', v)} />
        <TextArea label="Intro" value={e.intro} onChange={(v) => set('intro', v)} rows={2} />
        <StringList label="Components" value={e.tech} onChange={(v) => set('tech', v)} />
        <StringList label="Features" value={e.features} onChange={(v) => set('features', v)} />
        <TextArea label="Closing" value={e.closing} onChange={(v) => set('closing', v)} rows={3} />
      </div>
    );
  }

  if (sectionKey === 'aboutParagraphs') {
    return <StringList value={draft} onChange={onChange} placeholder="A paragraph…" />;
  }

  return null;
}
