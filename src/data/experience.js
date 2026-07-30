// Work experience / internships shown on the Experience timeline.
// `dateLabel` is the short date shown on the timeline's left rail;
// `period` is the full range shown inside the card.
// `credentialUrl` (optional) renders a "View Certificate / LOR" button —
// add it once the certificate/LOR file is uploaded.
export const experience = [
  {
    role: '',
    company: 'Prishal Technolabs',
    companyUrl: 'https://prishal.ai',
    // Add the logo file at public/prishal-logo.png to have it appear
    // automatically next to the company name (falls back gracefully otherwise).
    logo: '/prishal-logo.png',
    dateLabel: 'Jun 2026',
    period: 'Jun 2026 – Aug 2026',
    location: 'On-site',
    current: true,
    description:
      'Engineering cloud infrastructure components and automating internal workflows to reduce manual operational overhead, while contributing to hands-on technical projects across the team.',
    tech: [],
    credentialUrl: '',
  },
  {
    role: 'Web Development Intern',
    company: 'SkillCraft Technology',
    companyUrl: 'https://skillcrafttech.com/',
    // Add the logo file at public/skillcraft-logo.png to have it appear
    // automatically next to the company name (falls back gracefully otherwise).
    logo: '/skillcraft-logo.png',
    dateLabel: 'Jun 2025',
    period: 'Jun 2025 – Jul 2025',
    location: 'Remote',
    current: false,
    description:
      'Enhanced problem-solving abilities and UI design skills by translating conceptual logic into functional web applications.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    credentialUrl: '',
  },
];
