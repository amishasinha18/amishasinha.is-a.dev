// Grouped technical skills — each group renders as a card with badges.
export const skills = [
  {
    category: 'Cloud & DevOps',
    items: ['Git', 'GitHub', 'Linux', 'AWS', 'Bash'],
  },
  {
    category: 'Frontend',
    items: ['HTML/CSS', 'JavaScript'],
  },
  {
    category: 'Real-Time & Media',
    items: ['WebRTC', 'LiveKit', 'Socket.IO', 'WebSockets'],
  },
];

// Achievements & certificates — each renders a card with a short description
// and a "View Certificate" link. PDFs live in /public/certificates/.
export const achievements = [
  {
    title: 'C++ Certification',
    description: 'Certified in C++ programming and object-oriented fundamentals.',
    file: '/certificates/Certificate_C++_inforsys.pdf',
  },
  {
    title: 'Linux Shell Scripting',
    description: 'Automating tasks and workflows with Bash on the Linux command line.',
    file: '/certificates/Certificate_Linux_Shell_Scripting.pdf',
  },
  {
    title: 'Hack-a-Throne',
    description: 'Built and pitched a working project under pressure in a competitive hackathon.',
    file: '/certificates/Certificate_Hackthon.pdf',
  },
  {
    title: 'Introduction to DSA',
    description: 'Solid grounding in core data structures and algorithmic problem-solving.',
    file: '/certificates/Certificate_DSA.pdf',
  },
];

// Soft skills — each renders as a card with a title and short description.
export const softSkills = [
  { title: 'Team Leadership', description: 'Leading teams & coordinating projects' },
  { title: 'Communication', description: 'Clear technical communication' },
  { title: 'Problem Solving', description: 'Analytical thinking & solutions' },
  { title: 'Project Management', description: 'Deliver projects on time & scope' },
  { title: 'Adaptability', description: 'Quick learning & adapting to tech' },
  { title: 'Empathy', description: 'Understanding team & user needs' },
];
