export type SkillGroup = {
  title: string;
  items: string[];
};

export type Project = {
  title: string;
  type: string;
  description: string;
  stack: string[];
  link: string;
};

export type TimelineItem = {
  year: string;
  title: string;
  detail: string;
  current?: boolean;
};

export const portfolioContent = {
  visitor: {
    name: 'Mrityunjay Kumar',
    location: 'Delhi, India',
    phone: '+91 8539901494',
    email: 'mrityunjaysuman7547@gmail.com',
    roles: [
      'Python Developer',
      'Software Developer',
      'Web Developer',
      'Data Analyst',
      'AI-Assisted Developer',
      'Prompt Engineer',
    ],
    title: 'Python Developer | Software Developer | Web Developer | Data Analyst | AI-Assisted Developer | Prompt Engineer',
    summary:
      'Computer Science graduate with strong hands-on experience in Python development, Django, REST APIs, and web application development. Actively uses AI tools (Cursor, ChatGPT) to accelerate coding, debugging, refactoring, and documentation. Skilled in prompt engineering for code generation and workflow optimization.',
    bio: 'Building reliable backend systems and polished interfaces with a practical, delivery-focused mindset.',
    personality: 'Detail-oriented, dependable, and comfortable translating business needs into clean technical execution.',
    whatsappNumber: '918539901494',
    linkedin: 'https://www.linkedin.com/in/mrityunjay-kumar-b6a345219/',
    github: 'https://github.com/',
  },
  skillGroups: [
    {
      title: 'Languages',
      items: ['Python', 'PHP', 'JavaScript', 'HTML', 'CSS'],
    },
    {
      title: 'Frameworks',
      items: ['Django', 'React', 'Bootstrap'],
    },
    {
      title: 'Databases',
      items: ['MySQL', 'MongoDB', 'SQL'],
    },
    {
      title: 'Tools',
      items: ['Git', 'GitHub', 'Linux (Ubuntu)', 'VS Code', 'PyCharm', 'REST APIs'],
    },
    {
      title: 'AI Tools',
      items: ['Cursor', 'ChatGPT', 'Prompt Engineering', 'AI-Assisted Development'],
    },
    {
      title: 'Data & Analytics',
      items: ['Power BI', 'Excel', 'Google Sheets', 'Data Visualization', 'Data Annotation', 'MIS Reporting'],
    },
  ],
  experience: [
    {
      year: 'Mar 2026 – Present',
      title: 'MIS Executive & Web Developer — Rajeev Dresses Pvt. Ltd.',
      detail:
        'Managing MIS reports to support business decisions, developing and maintaining web apps using Python and Django, and improving internal workflow visibility through data tracking and inventory management.',
      current: true,
    },
    {
      year: 'Jan 2026 – Mar 2026',
      title: 'Data Annotation Trainee — RMSI Pvt. Ltd.',
      detail:
        'Annotated and labelled datasets for AI/ML pipelines, quality-checked data accuracy, and documented labelling guidelines to support consistent model training.',
    },
    {
      year: 'Sep 2025 – Dec 2025',
      title: 'Software Trainee (AI Based) — Mobiloitte Technology Pvt Ltd.',
      detail:
        'Built REST APIs and web apps using Python and Django, used Cursor and ChatGPT to accelerate development workflows, and assembled chatbot-style automation through prompt-based logic.',
    },
  ],
  projects: [
    {
      title: 'Agentic AI School Management System',
      type: 'Backend + AI Workflow',
      description:
        'Backend APIs for students, attendance, timetables, and academic records, with role-based authentication and structured data designed for RAG-based AI chatbot integration.',
      stack: ['Python', 'Django', 'REST API', 'MySQL'],
      link: '#',
    },
    {
      title: 'Hostel Management System',
      type: 'PHP + Database System',
      description:
        'Student registration, room allocation, admin workflows, role-based login, and normalized MySQL database structures for room tracking and approval processes.',
      stack: ['PHP', 'MySQL', 'Database Design'],
      link: '#',
    },
  ],
  education: [
    {
      title: 'B.Tech, Computer Science & Engineering',
      institution: 'Vishveshwarya Group of Institutes, Greater Noida',
      period: '2021–2025',
      note: 'CGPA 6.1',
    },
    {
      title: 'Senior Secondary (Class XII)',
      institution: 'C.P.P. College Hissar Borahar, Bihar',
      period: '2019–2020',
      note: '65%',
    },
  ],
  certifications: [
    {
      title: 'Web Development Internship',
      issuer: 'CODSOFT',
      period: 'Aug 2024',
    },
    {
      title: 'Python Full Stack Developer',
      issuer: 'DUCAT IT Training School',
      period: '2024',
    },
  ],
};
