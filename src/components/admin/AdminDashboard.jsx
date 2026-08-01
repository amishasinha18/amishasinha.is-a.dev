import { useState } from 'react';
import { Check, Download, ExternalLink, LogOut, RotateCcw, Save, Undo2 } from 'lucide-react';
import { useContent } from '../../content/ContentContext.jsx';
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
  customSections: {
    titleKey: 'title',
    newItem: () => ({ title: '', body: '' }),
    fields: [
      { key: 'title', label: 'Section title' },
      { key: 'body', label: 'Content', type: 'textarea', rows: 5, full: true },
    ],
  },
};

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

// Sidebar order + labels.
const SECTIONS = [
  ['profile', 'Profile'],
  ['heroText', 'Hero Text'],
  ['milestones', 'Hero Stats'],
  ['aboutParagraphs', 'About Story'],
  ['sportsAchievements', 'Beyond Academics'],
  ['terminalCommands', 'Terminal'],
  ['experience', 'Experience'],
  ['projects', 'Projects'],
  ['projectTabs', 'Project Tabs'],
  ['electronicsProject', 'Electronics Project'],
  ['skills', 'Skills'],
  ['softSkills', 'Soft Skills'],
  ['education', 'Education'],
  ['certificates', 'Certificates'],
  ['blogs', 'Blog'],
  ['customSections', 'Custom Sections'],
  ['navigation', 'Navigation'],
  ['sectionHeadings', 'Section Headings'],
  ['contactText', 'Contact Text'],
  ['footerText', 'Footer & Terminal'],
];

const labelFor = (key) => META[key]?.label ?? SECTIONS.find(([k]) => k === key)?.[1] ?? key;

// Read/write the stored value for a section (projects live under projectData,
// meta panels edit slices of siteText).
function readSection(key, content) {
  if (META[key]) return META[key].read(content);
  if (key === 'projects') return content.projectData?.tech ?? [];
  return content[key];
}
function writeSection(key, draft, content, updateSection) {
  if (META[key]) {
    META[key].write(content, updateSection, draft);
  } else if (key === 'projects') {
    updateSection('projectData', { ...content.projectData, tech: draft });
  } else {
    updateSection(key, draft);
  }
}

export default function AdminDashboard({ onExit }) {
  const content = useContent();
  const { updateSection, exportJson, resetAll } = content;
  const [active, setActive] = useState('profile');

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <aside className="flex w-56 shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-4">
          <p className="text-sm font-bold text-slate-800">Portfolio Admin</p>
          <p className="mt-0.5 text-[11px] text-slate-400">Local preview · Save to apply</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {SECTIONS.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`mb-0.5 w-full rounded-md px-3 py-2 text-left text-sm transition ${
                active === key
                  ? 'bg-indigo-600 font-semibold text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="space-y-1 border-t border-slate-200 p-2">
          <a
            href="/"
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100"
          >
            <ExternalLink size={15} /> View site
          </a>
          <button
            onClick={exportJson}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100"
          >
            <Download size={15} /> Export JSON
          </button>
          <button
            onClick={() => {
              if (confirm('Discard all saved local edits and restore defaults?')) resetAll();
            }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100"
          >
            <RotateCcw size={15} /> Reset
          </button>
          <button
            onClick={() => onExit?.()}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-500 transition hover:bg-red-50"
          >
            <LogOut size={15} /> Log out
          </button>
        </div>
      </aside>

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
  );
}

// Sticky Save / Discard bar. Nothing is applied to the live content until Save.
function SaveBar({ dirty, saved, onSave, onDiscard }) {
  return (
    <div className="sticky top-0 z-10 -mx-6 mb-5 flex items-center justify-between border-b border-slate-200 bg-slate-100/90 px-6 py-3 backdrop-blur">
      <span className="text-sm">
        {saved ? (
          <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600">
            <Check size={15} /> Saved
          </span>
        ) : dirty ? (
          <span className="font-medium text-amber-600">● Unsaved changes</span>
        ) : (
          <span className="text-slate-400">No changes</span>
        )}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDiscard}
          disabled={!dirty}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200 disabled:opacity-40"
        >
          <Undo2 size={15} /> Discard
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!dirty}
          className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-40"
        >
          <Save size={15} /> Save
        </button>
      </div>
    </div>
  );
}

function Panel({ title, hint, children }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
      <div className="mt-5">{children}</div>
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

  return (
    <Panel title={labelFor(sectionKey)} hint="Edits apply to the site only when you click Save.">
      <SaveBar dirty={dirty} saved={saved} onSave={save} onDiscard={discard} />
      <SectionFields sectionKey={sectionKey} draft={draft} onChange={onDraftChange} />
    </Panel>
  );
}

// Renders the right editor for a section, bound to the draft (not the store).
function SectionFields({ sectionKey, draft, onChange }) {
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
            <div key={key} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="mb-3 text-sm font-semibold text-slate-700">{label}</p>
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
          <TextField
            label="Terminal host"
            value={draft.host}
            onChange={(v) => set('host', v)}
          />
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
    return (
      <StringList value={draft} onChange={onChange} placeholder="A paragraph…" />
    );
  }

  return null;
}
