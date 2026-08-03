// Content for the Projects section, keyed by tab.
// The keys here must match the `key` values in projectTabs.
export const projectTabs = [
  { key: 'tech', label: 'Tech Projects' },
  { key: 'electronics', label: 'Electronic Projects' },
];

export const projectData = {
  tech: [
    {
      featured: true,
      title: 'CallIQ',
      year: '2026',
      subtitle: 'Real-Time WebRTC Contact-Center Platform',
      description:
        'A full-stack real-time WebRTC contact-center platform featuring voice, chat, live supervision, and analytics in one workspace.',
      tech: [
        'Next.js 14',
        'React',
        'Tailwind CSS',
        'Socket.IO',
        'Upstash Redis',
        'LiveKit Cloud',
        'Node.js',
        'Express',
        'Supabase',
        'PDFKit',
        'Recharts',
      ],
      features: [
        'One-click voice & chat routing',
        'Live supervisor whisper/barge-in modes',
        'Agent workspace with call history',
        'Post-call feedback ratings',
        'Product catalogue with image uploads',
        'Downloadable PDF quotation',
      ],
      demo: 'https://calliq-web-mfv4.onrender.com',
      github: 'https://github.com/amishasinha18/CallIQ',
    },
    {
      featured: true,
      title: 'MediCare',
      year: '2026',
      subtitle: 'AI-Powered Healthcare Companion',
      description:
        'A safety-first healthcare assistant for everyday wellness, medication tracking and document analysis, pairing a Flask backend and Groq-powered LLMs with a glassmorphic interface and deterministic safety guardrails.',
      tech: [
        'Python',
        'Flask',
        'Groq API',
        'Llama 3.3 70B',
        'Vision Models',
        'Flask-Limiter',
        'pypdf',
        'JavaScript',
        'HTML5',
        'CSS3',
        'Vercel',
      ],
      features: [
        'Deterministic pre-LLM emergency guardrail',
        'Multimodal analysis of prescriptions & lab reports',
        'Hybrid drug-interaction safety engine',
        'PDF & image parsing (pypdf + vision models)',
        'Client-side medication reminders (localStorage)',
        'Serverless on Vercel with IP rate limiting',
      ],
      demo: 'https://adaptive-care.vercel.app',
      github: 'https://github.com/amishasinha18/adaptive-care',
    },
    {
      featured: true,
      title: 'IPC Framework',
      year: '2025',
      subtitle: 'Inter-Process Communication Framework with Security Layer',
      description:
        'A comprehensive Inter-Process Communication framework pairing a C backend with a modern web dashboard, covering pipes, message queues and shared memory alongside a token-based security layer.',
      tech: [
        'C',
        'Next.js 16',
        'React 19',
        'Tailwind CSS',
        'Radix UI',
        'Recharts',
        'OpenSSL',
        'TypeScript',
      ],
      features: [
        'Pipes, message queues & shared memory',
        'Token-based authentication',
        'SHA-256 hashing & AES-256 encryption',
        'Real-time IPC channel monitoring',
        'Live activity feed & system reports',
        'Browser simulation mode — no backend needed',
      ],
      demo: '',
      github: 'https://github.com/amishasinha18/IPC_FRAMEWORK',
    },
    {
      title: 'File Compression Utility',
      year: '2026',
      subtitle: 'Huffman Coding Engine with Web Interface',
      description:
        'A full-stack compression tool pairing a native C++ Huffman coding engine with a Flask web interface, so files can be compressed and decompressed from the command line or a polished browser UI.',
      tech: ['C++17', 'Python', 'Flask', 'JavaScript', 'HTML5', 'CSS3'],
      features: [
        'Bit-level C++ Huffman encode/decode engine',
        'Drag-and-drop compress & decompress in-browser',
        'Batch processing with per-file progress',
        'Session history to re-download past files',
        'Analytics dashboard — files, size & space saved',
        'Before/after preview (text or hex for binary)',
      ],
      demo: 'https://file-compression-utility.onrender.com',
      github: 'https://github.com/amishasinha18/file-compression-utility',
    },
    {
      title: 'Smart Calculator',
      year: '2025',
      description:
        'A calculator with a dark glassmorphism interface, combining an everyday keypad with a full scientific mode, persistent history and click-to-copy results — no frameworks or build step.',
      tech: ['HTML5', 'Tailwind CSS', 'JavaScript'],
      features: [
        'Normal & scientific modes',
        'Full keyboard support',
        'History saved to localStorage',
        'Click-to-copy results',
      ],
      demo: '',
      github: 'https://github.com/amishasinha18/Calculater',
    },
    {
      title: 'To-Do List',
      year: '2025',
      description:
        'A task manager with categories, priority levels, due dates and nested sub-tasks, plus live search, filtering and drag-and-drop reordering — all persisted to local storage.',
      tech: ['HTML5', 'Tailwind CSS', 'JavaScript'],
      features: [
        'Categories, priority & due dates',
        'Nested sub-tasks with progress',
        'Live search & filtering',
        'Drag-and-drop reordering',
      ],
      demo: '',
      github: 'https://github.com/amishasinha18/TO-DO-LIST',
    },
    {
      title: 'Stopwatch',
      year: '2025',
      description:
        'A centisecond-accurate stopwatch driven by requestAnimationFrame against a real timestamp so it never drifts, with a circular progress ring, lap splits and keyboard shortcuts.',
      tech: ['HTML5', 'Tailwind CSS', 'JavaScript'],
      features: [
        'Centisecond accuracy, drift-free',
        'Circular progress ring',
        'Lap splits & cumulative times',
        'Keyboard shortcuts',
      ],
      demo: '',
      github: 'https://github.com/amishasinha18/Stopwatch',
    },
    {
      title: 'Tic Tac Toe',
      year: '2025',
      description:
        'A two-player game with an optional AI opponent across three difficulties — the hardest being an unbeatable Minimax with alpha-beta pruning — plus a live scoreboard and win animations.',
      tech: ['HTML5', 'Tailwind CSS', 'JavaScript'],
      features: [
        'Player vs Player & vs AI',
        'Unbeatable Minimax on Hard',
        'Live scoreboard',
        'Animated winning line',
      ],
      demo: '',
      github: 'https://github.com/amishasinha18/Tic-tac-toe',
    },
  ],
};

// Electronics Projects — a 2x2 photo grid + a title/description panel.
export const electronicsProject = {
  title: 'Voice-Controlled Lighting System',
  intro:
    'A Voice-Controlled Lighting System powered by Arduino and Bluetooth module (HC-05).',
  // Hardware used — rendered as chips on the project card. Every item here is
  // one that already appears in the intro/features copy below.
  tech: ['Arduino', 'HC-05 Bluetooth', '16×2 LCD', 'Relay Module'],
  features: [
    'Control lights using voice commands via Bluetooth',
    'Real-time feedback using a 16x2 LCD',
    'Relay module to switch real bulbs/appliances',
    'Modular and expandable prototype',
  ],
  closing:
    'This hands-on project helped us strengthen our understanding of embedded systems, circuit design, and IoT basics. It was a great team effort, full of late-night debugging, circuit tweaking, and lots of learning!',
  images: ['/elec1.jpg', '/elec2.jpg', '/elec3.jpg', '/elec4.jpg'],
};
