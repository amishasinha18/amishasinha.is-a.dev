// Aggregated default content for the whole portfolio. The content store
// (ContentContext) is seeded from this and merged with any localStorage
// overrides made through the admin dashboard. Existing src/data/* files remain
// the source of the base values; the arrays that used to live inline inside
// components are moved here so they're editable too.
import { profile } from '../data/profile.js';
import { projectTabs, projectData, electronicsProject } from '../data/projects.js';
import { skills, softSkills } from '../data/skills.js';
import { experience } from '../data/experience.js';
import { education } from '../data/education.js';
import { certificates } from '../data/certificates.js';
import { blogs } from '../data/blogs.js';

// Was inline in About.jsx — the "My Story" paragraphs.
export const aboutParagraphs = [
  "I'm passionate about building practical software solutions and exploring how cloud technologies make applications scalable, reliable, and efficient.",
  'During my B.Tech journey, I explored web development before discovering my interest in Cloud Computing and DevOps. I enjoy learning how applications are deployed, managed, and automated using modern cloud technologies.',
  'Working on academic and team projects has strengthened my problem-solving, collaboration, and debugging skills while teaching me how to build reliable software as part of a team.',
  'I believe continuous learning and hands-on practice are the foundation of becoming a better engineer. Every project helps me improve my technical skills and brings me one step closer to becoming a Cloud Engineer.',
];

// Was inline in About.jsx — "Beyond Academics".
export const sportsAchievements = [
  {
    sport: 'Cricket',
    year: '2025',
    tag: 'First Runner-Up',
    org: 'Lovely Professional University',
    description: 'Represented the college team in a competitive tournament.',
  },
  {
    sport: 'Volleyball',
    year: '2026',
    tag: 'First Runner-Up',
    org: 'Lovely Professional University',
    description: 'Competed as part of the college volleyball team.',
  },
];

// Was inline in Overview.jsx — the hero stat cards.
export const milestones = [
  { value: '5+', sub: 'Projects Built' },
  { value: '5+', sub: 'Certifications Earned' },
  { value: '10+', sub: 'Technologies Explored' },
];

// Was inline in Terminal.jsx — the hero terminal script.
export const terminalCommands = [
  { command: 'whoami', output: ['Amisha Sinha'] },
  { command: 'role', output: ['Cloud & DevOps Enthusiast'] },
  {
    command: 'focus',
    output: ['Cloud Infrastructure', 'DevOps Automation', 'Linux', 'Applied AI'],
  },
  { command: 'currently-learning', output: ['Docker', 'Kubernetes', 'Terraform'] },
  {
    command: 'goal',
    output: ['Design secure, scalable, and reliable cloud solutions'],
  },
];

// Free-form sections the owner can add from the admin, keyed by site page.
// Each entry is a titled card (title + body) rendered at the end of that page.
export const customSections = {
  home: [],
  about: [],
  experience: [],
  skills: [],
  projects: [],
  blog: [],
  contact: [],
};

// Fixed UI copy — nav labels, hero text, section headings, contact copy,
// footer and terminal chrome. Extracted here so every string is editable.
export const siteText = {
  nav: [
    { label: 'Overview', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Experience', id: 'experience' },
    { label: 'Skills', id: 'skills' },
    { label: 'Projects', id: 'projects' },
  ],
  hero: {
    role: 'Cloud & DevOps Enthusiast',
    statusBadge: 'Looking for New Opportunities',
    bio: 'Building scalable cloud solutions, automating infrastructure with DevOps, strengthening Linux expertise, and applying AI to solve real-world problems.',
    resumeLabel: 'Resume',
    contactLabel: 'Contact',
  },
  sections: {
    about: { eyebrow: '', title: 'About Me', subtitle: '' },
    experience: {
      eyebrow: "Where I've worked",
      title: 'Work Experience',
      subtitle:
        "A glimpse into my professional journey and the organizations I've had the opportunity to work with.",
    },
    skills: { eyebrow: '', title: 'Skills', subtitle: '' },
    projects: { eyebrow: 'Selected work', title: 'Projects', subtitle: '' },
    blog: {
      eyebrow: 'Writing & insights',
      title: 'Blog',
      subtitle: "Technical articles, writing, and insights I've put together along the way.",
    },
    contact: {
      title: 'Get In Touch',
      lead: "Let's Connect.",
      body: "Great ideas begin with meaningful conversations. Whether you'd like to collaborate, share ideas, or simply connect, I'd be delighted to hear from you.",
      badge: 'Open to Internship Opportunities',
      successMsg: 'Thanks! Your message has been captured.',
    },
  },
  footer: { rights: 'All rights reserved.' },
  terminal: { host: 'amisha@cloud' },
};

// Bump this whenever the shipped default content changes. A browser holding an
// older localStorage snapshot (e.g. a preview saved in the admin) will detect
// the mismatch and refresh to these latest defaults instead of shadowing them.
export const CONTENT_VERSION = '2026-08-03.10';

export const defaultContent = {
  profile,
  projectTabs,
  projectData,
  electronicsProject,
  skills,
  softSkills,
  experience,
  education,
  certificates,
  blogs,
  aboutParagraphs,
  sportsAchievements,
  milestones,
  terminalCommands,
  customSections,
  siteText,
};
