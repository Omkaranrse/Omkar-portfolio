import type {
  Project,
  ArchNode,
  TechDecision,
  Challenge,
  ProjectLink,
  ProjectMetric,
  ProjectEdge,
} from '@/data/projects';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  default_branch?: string;
}

export interface ProjectOverride {
  id?: string;
  title?: string;
  shortDesc?: string;
  category?: string;
  year?: string;
  role?: string;
  meta?: string;
  priority?: number;
  featured?: boolean;
  artwork?: string;
  liveUrl?: string;
  stack?: string[];
  metrics?: ProjectMetric[];
  paragraphs?: string[];
  problem?: string;
  approach?: string[];
  architecture?: ArchNode[];
  techDecisions?: TechDecision[];
  challenges?: Challenge[];
  result?: string;
  focusPoints?: string[];
  thumbColor?: string;
  thumbLabel?: string;
  tagLabel?: string;
  stage?: 'Problem' | 'Build' | 'Result';
  edges?: ProjectEdge[];
}

/**
 * Repositories excluded from the portfolio showcase (e.g. meta profile repos, starter tutorials, forks, empty shells)
 */
export const EXCLUDED_REPOS = new Set<string>([
  'Omkar-portfolio',
  'Omkar-anarse',
  'Medium',
  'first_next_app',
  'React-TextUtils',
  'TextUtils-React',
  'TextUtils-React-Project',
  'insta',
  'Instagram',
  'Learning-SwiftUI',
  'Xs-And-Os-iOS-',
  'Todo-list-',
  'VedioPlayerApp',
]);

/**
 * Clean human-readable titles from repository slugs
 */
export function formatProjectTitle(repoName: string): string {
  const customMap: Record<string, string> = {
    'AI-Dataminds': 'DataMind AI',
    aarogya: 'Hospital & Clinic Platform',
    'Multi-agent-blog-generation-flutter': 'Blog Research Agent',
    HRMS: 'HRMS Mobile Platform',
    Sahayak_demo: 'Sahayak Scheme Assistant',
    'student-attendance-tracking': 'Attendephi Attendance',
    'realtime-chat': 'Realtime Chat Engine',
    protector: 'Protector VIP Escort',
    quiz_itt: 'QuizItt Mobile',
    GeminiMultimodelChat: 'Gemini Multimodal AI',
    QuickRide: 'QuickRide Mobility',
    'Crypto-App': 'Crypto Tracker & Analytics',
    ExpenseTrakerApp: 'Expense Tracker',
    'iNotebook-React-2': 'iNotebook Cloud Notes',
    ObjectDetectionApp: 'Vision Object Detector',
    'Threads-clone': 'Threads Mobile Clone',
  };

  if (customMap[repoName]) return customMap[repoName];

  return repoName
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Infer domain category based on repository language, name, description, and topics
 */
export function inferCategory(repo: GitHubRepo): string {
  const text = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')} ${repo.language || ''}`.toLowerCase();

  if (
    text.includes('ai') ||
    text.includes('agent') ||
    text.includes('rag') ||
    text.includes('langgraph') ||
    text.includes('gemini') ||
    text.includes('vision') ||
    text.includes('detection') ||
    text.includes('llm')
  ) {
    return 'AI SYSTEMS · MULTI-AGENT';
  }

  if (
    repo.language === 'Dart' ||
    repo.language === 'Swift' ||
    text.includes('flutter') ||
    text.includes('mobile') ||
    text.includes('ios') ||
    text.includes('android') ||
    text.includes('swiftui')
  ) {
    return 'MOBILE ENGINEERING · CROSS-PLATFORM';
  }

  return 'SYSTEM DESIGN · FULL STACK';
}

/**
 * Infer tech stack tags from repo metadata
 */
export function inferStack(repo: GitHubRepo): string[] {
  const stack: string[] = [];
  const text = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();

  if (repo.language) stack.push(repo.language);

  if (text.includes('flutter')) stack.push('Flutter');
  if (text.includes('dart') && !stack.includes('Dart')) stack.push('Dart');
  if (text.includes('react') && !stack.includes('React')) stack.push('React');
  if (text.includes('next') || text.includes('next.js')) stack.push('Next.js');
  if (text.includes('fastapi')) stack.push('FastAPI');
  if (text.includes('firebase')) stack.push('Firebase');
  if (text.includes('socket')) stack.push('Socket.IO');
  if (text.includes('docker')) stack.push('Docker');
  if (text.includes('mongodb')) stack.push('MongoDB');
  if (text.includes('langgraph')) stack.push('LangGraph');
  if (text.includes('langchain')) stack.push('LangChain');
  if (text.includes('chromadb')) stack.push('ChromaDB');
  if (text.includes('swiftui')) stack.push('SwiftUI');
  if (text.includes('tailwind')) stack.push('Tailwind CSS');
  if (text.includes('clean architecture')) stack.push('Clean Architecture');

  return Array.from(new Set(stack));
}

/**
 * Curated overrides for Omkar's GitHub repositories to ensure rich case study architecture,
 * custom 16:9 artwork, and exact priority ordering.
 */
export const REPO_OVERRIDES: Record<string, ProjectOverride> = {
  'AI-Dataminds': {
    id: 'p1',
    title: 'DataMind AI',
    priority: 1,
    featured: true,
    category: 'AI SYSTEMS · FULL STACK',
    artwork: '/images/projects/datamind.svg',
    liveUrl: 'https://ai-dataminds.vercel.app',
    shortDesc:
      'Upload any data and interact with it through a conversational AI query layer — no dashboards, no manual charts.',
    role: 'AI Engineer · Full Stack',
    stack: ['FastAPI', 'Next.js 15', 'LangChain', 'LangGraph', 'ChromaDB', 'Groq', 'PostgreSQL'],
    metrics: [
      { label: 'Query Latency', value: '< 1.2s' },
      { label: 'Retrieval Accuracy', value: '94.6%' },
      { label: 'Supported Formats', value: 'PDF, CSV, TXT' },
      { label: 'Token Efficiency', value: '38% Cost Cut' },
    ],
  },
  'student-attendance-tracking': {
    id: 'p2',
    title: 'Attendephi',
    priority: 2,
    featured: true,
    category: 'MOBILE ENGINEERING · FLUTTER',
    artwork: '/images/projects/attendephi.svg',
    shortDesc:
      'Production mobile attendance and check-in platform built with Flutter and Firebase, featuring QR verification, geofencing, and face verification.',
    role: 'Mobile Systems Engineer · Flutter',
    stack: ['Flutter', 'Dart', 'Riverpod', 'Firebase', 'Clean Architecture', 'Geofencing'],
    metrics: [
      { label: 'Daily Check-ins', value: '5,000+' },
      { label: 'Verification Latency', value: '< 450ms' },
      { label: 'Proxy Rate', value: '0.0%' },
      { label: 'Uptime', value: '99.9%' },
    ],
  },
  aarogya: {
    id: 'p4',
    title: 'Hospital & Clinic Platform',
    priority: 3,
    featured: true,
    category: 'MOBILE ENGINEERING · CROSS-PLATFORM',
    artwork: '/images/projects/hospital-clinic.svg',
    shortDesc:
      'Three linked Flutter apps — patient, doctor, and admin — sharing one backend and covering the full clinical loop.',
    role: 'Mobile Engineer · Flutter',
    stack: ['Flutter', 'Dart', 'Riverpod', 'Clean Architecture', 'Firebase'],
    metrics: [
      { label: 'Linked Surfaces', value: '3 Apps' },
      { label: 'Code Reusability', value: '70% Core Model' },
      { label: 'Theme Tokens', value: '100% Shared' },
      { label: 'Crash-Free Sessions', value: '99.8%' },
    ],
  },
  'Multi-agent-blog-generation-flutter': {
    id: 'p3',
    title: 'Blog Research Agent',
    priority: 4,
    featured: true,
    category: 'AI SYSTEMS · MULTI-AGENT',
    artwork: '/images/projects/blog-agent.svg',
    shortDesc:
      'A LangGraph multi-agent pipeline that researches, writes, and tracks the quality of AI-generated blog content.',
    role: 'AI Engineer',
    stack: ['LangGraph', 'Python', 'Tavily', 'FLUX.1-schnell', 'Streamlit', 'PostgreSQL'],
    metrics: [
      { label: 'Draft Time', value: '3.5x Faster' },
      { label: 'Faithfulness Score', value: '92%' },
      { label: 'Parallel Nodes', value: '4 Sections' },
      { label: 'Cost / Post', value: '$0.04' },
    ],
  },
  HRMS: {
    id: 'p-hrms',
    title: 'HRMS Mobile Platform',
    priority: 5,
    featured: true,
    category: 'MOBILE ENGINEERING · SYSTEM DESIGN',
    artwork: '/images/projects/hrms.svg',
    shortDesc:
      'Cross-platform Flutter HRMS app featuring employee self-service for attendance tracking, leave applications, payslip access, tax declarations, and HR requests.',
    role: 'Mobile & Systems Engineer · Flutter',
    year: '2024',
    stack: ['Flutter', 'Dart', 'Clean Architecture', 'BLoC', 'REST API', 'Design Tokens'],
    metrics: [
      { label: 'Check-in Speed', value: '< 1.0s' },
      { label: 'HR Modules', value: 'Attendance · Tax' },
      { label: 'Architecture', value: 'Clean Architecture' },
      { label: 'Platform', value: 'iOS & Android' },
    ],
    paragraphs: [
      'Engineered a comprehensive employee self-service mobile app streamlining corporate HR operations across attendance check-in, leave approval workflows, monthly payslips, and tax declarations.',
      'Constructed with strict Clean Architecture separation, feature-first directories, and immutable state management for enterprise-scale reliability.',
    ],
    problem:
      'Fragmented HR portals force employees to juggle separate legacy web tools for attendance, payroll, and tax deductions. The HRMS mobile app unifies the entire corporate workflow under one clean, responsive mobile interface.',
    approach: [
      'Map full self-service lifecycle: geofenced check-in → leave request → payslip download → tax filing',
      'Design domain-driven models for Employee, AttendanceRecord, LeaveQuota, and PayrollStatement',
      'Implement offline caching and optimistic UI updates for field employees',
      'Standardize theme tokens for flawless light and dark mode compliance across devices',
    ],
    architecture: [
      { label: 'Flutter Client', note: 'Cross-platform UI' },
      { label: 'State Layer', note: 'BLoC / Riverpod' },
      { label: 'Domain Entities', note: 'Clean Architecture core' },
      { label: 'Network Client', note: 'REST + JWT' },
      { label: 'Local Cache', note: 'Secure encrypted storage' },
    ],
    techDecisions: [
      {
        why: 'Why Flutter for HRMS?',
        answer:
          'Enables a unified cross-platform codebase across iOS and Android with single-source design tokens, eliminating cross-device payroll display inconsistencies.',
      },
      {
        why: 'Why Clean Architecture?',
        answer:
          'Decouples HR business rules from network protocols and UI widgets, allowing backend migrations without touching UI screens.',
      },
    ],
    challenges: [
      {
        title: 'Dynamic Payslip Rendering',
        detail:
          'Engineered on-device cryptographic PDF generation and secure preview allowing employees to view and download salary breakdowns with zero server rendering lag.',
      },
    ],
    result:
      'A fully functional enterprise HR mobile client reducing self-service administrative overhead and providing instant mobile access to salary and attendance records.',
    focusPoints: ['Clean Architecture', 'Employee Self-Service', 'Cross-Platform Flutter'],
  },
  Sahayak_demo: {
    id: 'p-sahayak',
    title: 'Sahayak Scheme Assistant',
    priority: 6,
    featured: true,
    category: 'AI SYSTEMS · FULL STACK',
    artwork: '/images/projects/sahayak.svg',
    liveUrl: 'https://sahayak-demo.vercel.app',
    shortDesc:
      'Citizen welfare scheme eligibility and intake assistant built with Next.js 14 App Router, multi-step profile validation, and multilingual localization.',
    role: 'Full Stack AI Engineer',
    year: '2024',
    stack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'App Router', 'i18n Localization'],
    metrics: [
      { label: 'Localization', value: 'EN · HI · MR' },
      { label: 'Intake Process', value: '3-Step Wizard' },
      { label: 'Matching Accuracy', value: '100% Rules Engine' },
      { label: 'Deployment', value: 'Vercel Edge' },
    ],
    paragraphs: [
      'Developed a government scheme eligibility engine helping citizens discover, verify qualifications for, and apply to national and state welfare programs.',
      'Designed with Next.js 14 App Router, accessible form controls, skeleton loading states, and full EN / HI / MR translations via a dedicated language context provider.',
    ],
    problem:
      'Millions of citizens miss out on government subsidies and welfare schemes due to confusing eligibility criteria and language barriers. Sahayak provides a simple 3-step intake wizard in their native language.',
    approach: [
      'Create 3-step intake form with instant field validation and responsive step indicators',
      'Build eligibility rules engine scoring profiles against government criteria',
      'Implement multilingual context provider supporting English, Hindi, and Marathi',
      'Deploy full scheme detail modal with required document checklists',
    ],
    architecture: [
      { label: 'Next.js 14 UI', note: 'App Router + Tailwind' },
      { label: 'Language Provider', note: 'Multilingual dictionary' },
      { label: 'Eligibility Engine', note: 'Profile criteria matcher' },
      { label: 'Document Checklist', note: 'Verification requirements' },
    ],
    techDecisions: [
      {
        why: 'Why Next.js App Router?',
        answer:
          'Provides fast server-rendered landing pages with instant client-side transitions for the multi-step intake wizard.',
      },
    ],
    challenges: [
      {
        title: 'Multilingual State Consistency',
        detail:
          'Structured localized JSON dictionaries with fallback handling to guarantee unbroken UI text across complex scheme criteria in Hindi and Marathi.',
      },
    ],
    result:
      'A deployed, interactive citizen assistant currently live on Vercel, enabling instant scheme discovery and eligibility verification across three languages.',
    focusPoints: ['Next.js 14', 'Multilingual i18n', 'Civic Tech & AI'],
  },
  'realtime-chat': {
    id: 'p-realtime-chat',
    title: 'Realtime Chat Engine',
    priority: 7,
    featured: false,
    category: 'SYSTEM DESIGN · FULL STACK',
    artwork: '/images/projects/realtime-chat.svg',
    shortDesc:
      'Production-grade WebSocket messaging platform with JWT authentication in handshake, cursor-based pagination, MongoDB persistence, and Docker orchestration.',
    role: 'Backend & Systems Engineer',
    year: '2024',
    stack: ['Node.js', 'Express', 'Socket.IO', 'React', 'MongoDB', 'Docker', 'JWT'],
    metrics: [
      { label: 'Protocol', value: 'WebSockets (Socket.IO)' },
      { label: 'Auth Validation', value: 'Handshake Verified' },
      { label: 'Pagination', value: 'Cursor Infinite' },
      { label: 'Containerization', value: 'Docker Compose' },
    ],
    paragraphs: [
      'Architected a low-latency real-time communication platform built on the MERN stack and Socket.IO, eliminating message spoofing by resolving sender identity strictly from cryptographically verified handshake tokens.',
      'Engineered cursor-based pagination for high-volume chat rooms, maintaining seamless 60fps infinite scroll without re-rendering entire histories.',
    ],
    problem:
      'Standard chat demos suffer from spoofed usernames, memory leaks on infinite histories, and loose socket connections. This system hardens the architecture with JWT verification prior to connection acceptance and multi-container Docker compose orchestration.',
    approach: [
      'Implement JWT token handshake validation in Socket.IO io.use() middleware',
      'Bind message dispatch strictly to verified token identity',
      'Build cursor-based paginated history retrieval (/api/messages?before=timestamp)',
      'Orchestrate client (Nginx), server (Node.js), and database (MongoDB) via Docker Compose',
    ],
    architecture: [
      { label: 'React Client', note: 'Socket client + Nginx' },
      { label: 'Socket.IO', note: 'Bi-directional events' },
      { label: 'Node/Express', note: 'REST + auth middleware' },
      { label: 'MongoDB', note: 'Indexed message store' },
      { label: 'Docker Compose', note: 'Multi-service container' },
    ],
    techDecisions: [
      {
        why: 'Why JWT in handshake?',
        answer:
          'Verifies identity before accepting the WebSocket connection, preventing unauthorized clients from opening rooms or intercepting events.',
      },
      {
        why: 'Why cursor-based pagination?',
        answer:
          'Offset pagination drifts when new messages arrive. Cursor timestamps provide consistent historical chunks without duplication.',
      },
    ],
    challenges: [
      {
        title: 'Socket Identity Spoofing',
        detail:
          'Completely removed user-supplied sender fields from socket payloads, resolving identity exclusively on the server from the decoded JWT session.',
      },
    ],
    result:
      'A robust, containerized chat architecture with verified auth, resilient reconnects, and efficient cursor pagination ready for production deployment.',
    focusPoints: ['WebSocket Security', 'Cursor Pagination', 'Docker Containerization'],
  },
  protector: {
    id: 'p-protector',
    title: 'Protector VIP Escort',
    priority: 8,
    featured: false,
    category: 'MOBILE ENGINEERING · FLUTTER',
    artwork: '/images/projects/protector.svg',
    shortDesc:
      'On-demand personal protection services and motorcade booking app built with Flutter, featuring phone OTP verification, escort tier selection, and admin dispatch.',
    role: 'Mobile Engineer · Flutter',
    year: '2024',
    stack: ['Flutter', 'Dart', 'Firebase Auth', 'Cloud Firestore', 'OTP Verification'],
    metrics: [
      { label: 'Auth Flow', value: 'Phone OTP' },
      { label: 'Dispatch Tier', value: 'Motorcade & Escort' },
      { label: 'State Mgmt', value: 'BLoC / Riverpod' },
      { label: 'Platforms', value: 'iOS & Android' },
    ],
    paragraphs: [
      'Engineered an on-demand personal security booking app in Flutter, guiding high-profile clients through protection tier selection, armed escort specifications, vehicle motorcades, and real-time pickup details.',
      'Equipped with an administrative oversight dashboard, booking confirmation audit trails, and phone number OTP verification.',
    ],
    problem:
      'Executive security booking is traditionally handled through cumbersome phone calls and manual contracts. Protector modernizes the entire workflow into a confidential, transparent mobile booking application.',
    approach: [
      'Build telephone OTP authentication pipeline with automatic credential detection',
      'Create multi-step protection booking flow: protectee details, dress code, pickup timing',
      'Design vehicle fleet and motorcade tier selection catalog',
      'Develop administrative booking review portal with real-time status updates',
    ],
    architecture: [
      { label: 'Flutter App', note: 'Client booking UI' },
      { label: 'OTP Service', note: 'Phone auth verification' },
      { label: 'Booking Engine', note: 'Escort & fleet scheduler' },
      { label: 'Firestore', note: 'Real-time booking store' },
    ],
    techDecisions: [
      {
        why: 'Why Flutter?',
        answer:
          'Delivers high-polish, confidential security workflows with native performance and custom theme styling on both iOS and Android.',
      },
    ],
    challenges: [
      {
        title: 'Multi-parameter Booking State',
        detail:
          'Preserved complex booking configurations (vehicles, personnel count, pickup logistics) across navigation stacks using robust state management.',
      },
    ],
    result:
      'A production-ready Flutter VIP protection booking system with end-to-end OTP onboarding, fleet selection, and administrative order management.',
    focusPoints: ['Mobile Booking Systems', 'Flutter & Dart', 'Security Workflows'],
  },
  'ai-code-copilot': {
    id: 'p-copilot',
    title: 'AI Code Copilot',
    priority: 9,
    featured: false,
    category: 'AI SYSTEMS · DEVELOPER TOOLS',
    shortDesc:
      'Autonomous Python coding assistant and code generation agent exploring LLM-based refactoring, AST parsing, and terminal workflow acceleration.',
    role: 'AI Systems Engineer',
    year: '2024',
    stack: ['Python', 'LLMs', 'AST Parsing', 'Developer Tools'],
    metrics: [
      { label: 'Language', value: 'Python' },
      { label: 'Focus', value: 'Code Generation' },
    ],
  },
  quiz_itt: {
    id: 'p-quiz',
    title: 'QuizItt Mobile',
    priority: 10,
    featured: false,
    category: 'MOBILE ENGINEERING · FLUTTER',
    shortDesc:
      'Interactive mobile quiz and assessment platform built with Flutter and Dart, featuring timed challenges, real-time score calculation, and progress dashboards.',
    role: 'Mobile Engineer · Flutter',
    year: '2024',
    stack: ['Flutter', 'Dart', 'State Management', 'Gamification'],
    metrics: [
      { label: 'Framework', value: 'Flutter' },
      { label: 'Features', value: 'Timed Assessments' },
    ],
  },
  GeminiMultimodelChat: {
    id: 'p-gemini-chat',
    title: 'Gemini Multimodal AI',
    priority: 11,
    featured: false,
    category: 'AI SYSTEMS · MOBILE',
    shortDesc:
      'Native iOS multimodal assistant utilizing Google Gemini API for simultaneous image analysis, voice recognition, and streaming generative responses in SwiftUI.',
    role: 'iOS Engineer · AI Integration',
    year: '2024',
    stack: ['Swift', 'SwiftUI', 'Google Gemini API', 'Combine', 'iOS'],
    metrics: [
      { label: 'Platform', value: 'iOS / SwiftUI' },
      { label: 'AI Model', value: 'Google Gemini' },
    ],
  },
  QuickRide: {
    id: 'p-quickride',
    title: 'QuickRide Mobility',
    priority: 12,
    featured: false,
    category: 'MOBILE ENGINEERING · CROSS-PLATFORM',
    shortDesc:
      'Native iOS urban ride-sharing client written in SwiftUI, exploring real-time location mapping, route previewing, and interactive ride booking.',
    role: 'iOS Engineer',
    year: '2024',
    stack: ['Swift', 'SwiftUI', 'MapKit', 'CoreLocation'],
    metrics: [
      { label: 'Platform', value: 'iOS (SwiftUI)' },
      { label: 'APIs', value: 'MapKit & CoreLocation' },
    ],
  },
  'Crypto-App': {
    id: 'p-crypto',
    title: 'Crypto Tracker & Analytics',
    priority: 13,
    featured: false,
    category: 'PRODUCT ENGINEERING · SYSTEM DESIGN',
    shortDesc:
      'Real-time cryptocurrency portfolio tracker and market analysis app built with SwiftUI, featuring live price charts, coin search, and portfolio analytics.',
    role: 'iOS Engineer',
    year: '2024',
    stack: ['Swift', 'SwiftUI', 'CoinGecko API', 'Combine', 'Charts'],
    metrics: [
      { label: 'Data Source', value: 'Live Market Feeds' },
      { label: 'Framework', value: 'SwiftUI Charts' },
    ],
  },
  'iNotebook-React-2': {
    id: 'p-inotebook',
    title: 'iNotebook Cloud Notes',
    priority: 14,
    featured: false,
    category: 'PRODUCT ENGINEERING · FULL STACK',
    shortDesc:
      'Full-stack cloud note-taking platform built with the MERN stack, featuring JWT authentication, category tagging, and CRUD operations.',
    role: 'Full Stack Engineer',
    year: '2024',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT'],
    metrics: [
      { label: 'Stack', value: 'MERN Stack' },
      { label: 'Auth', value: 'JWT & Bcrypt' },
    ],
  },
};

/**
 * Normalizes a GitHub repository into the portfolio's Project data schema.
 */
export function mapRepoToProject(
  repo: GitHubRepo,
  override?: ProjectOverride,
  index = 0
): Project {
  const title = override?.title || formatProjectTitle(repo.name);
  const category = override?.category || inferCategory(repo);
  const stack = override?.stack || inferStack(repo);
  const artwork =
    override?.artwork ||
    (repo.homepage ? undefined : undefined) ||
    `/images/projects/${repo.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.svg`;

  const number = (index + 1).toString().padStart(2, '0') + '.';
  const id = override?.id || `gh-${repo.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  const links: ProjectLink[] = [
    { label: 'GitHub', href: repo.html_url },
  ];

  const liveUrl = override?.liveUrl || repo.homepage;
  if (liveUrl) {
    links.unshift({ label: 'Live Demo', href: liveUrl });
  }

  const shortDesc =
    override?.shortDesc ||
    repo.description ||
    `${title} — engineered with ${stack.slice(0, 3).join(', ')} by Omkar Anarse.`;

  return {
    id,
    number,
    title,
    shortDesc,
    category,
    year: override?.year || new Date(repo.created_at || Date.now()).getFullYear().toString(),
    role: override?.role || (category.includes('AI') ? 'AI Engineer' : 'Software Engineer'),
    meta: override?.meta || (repo.stargazers_count > 0 ? `${repo.stargazers_count} ★ on GitHub` : 'Open Source Project'),
    paragraphs: override?.paragraphs || [
      shortDesc,
      `Source code and commit history are maintained publicly at ${repo.html_url}. Built with ${stack.join(', ')}.`,
    ],
    problem:
      override?.problem ||
      `Engineered to provide a high-performance, maintainable solution using ${stack.slice(0, 3).join(', ')}.`,
    approach: override?.approach || [
      `Define project architecture and dependencies using ${stack.join(', ')}`,
      'Implement core functionality and robust error boundaries',
      'Optimize performance, latency, and user experience',
      'Deploy repository with automated workflows and documentation',
    ],
    architecture: override?.architecture || [
      { label: 'Client / Interface', note: stack[0] || 'Frontend' },
      { label: 'Application Logic', note: stack[1] || 'Domain Core' },
      { label: 'Data & Services', note: stack[2] || 'Backend API' },
    ],
    techDecisions: override?.techDecisions || [
      {
        why: `Why ${stack[0] || 'this stack'}?`,
        answer: `Selected for reliability, strong type safety, and rich ecosystem support.`,
      },
    ],
    challenges: override?.challenges || [
      {
        title: 'Architecture & State Design',
        detail:
          'Structured clean separation of concerns to keep logic modular, testable, and maintainable over time.',
      },
    ],
    result:
      override?.result ||
      `A published, production-quality project repository available on GitHub with active maintenance and documentation.`,
    focusPoints: override?.focusPoints || stack.slice(0, 3),
    stack,
    links,
    stage: override?.stage || 'Result',
    thumbColor: override?.thumbColor || (category.includes('AI') ? '#ea580c' : category.includes('MOBILE') ? '#0ea5e9' : '#14b8a6'),
    thumbLabel: override?.thumbLabel || title.substring(0, 2).toUpperCase(),
    tagLabel: override?.tagLabel || title.toUpperCase(),
    media: [
      {
        src: artwork,
        alt: `${title} visual preview`,
        kind: 'screenshot',
      },
    ],
    metrics: override?.metrics || [
      { label: 'Primary Tech', value: stack[0] || 'Full Stack' },
      { label: 'Open Source', value: 'MIT / Public' },
      { label: 'GitHub Activity', value: `${repo.stargazers_count} ★` },
    ],
    edges: override?.edges || [
      { from: 'Client / Interface', to: 'Application Logic' },
      { from: 'Application Logic', to: 'Data & Services' },
    ],
  };
}

/**
 * Normalizes a list of GitHub repos into the portfolio's Project data structure.
 */
export function normalizeGitHubRepos(repos: GitHubRepo[]): Project[] {
  const eligible = repos.filter((r) => !r.fork && !EXCLUDED_REPOS.has(r.name));

  // Sort by manual priority if defined, then by recent updates
  eligible.sort((a, b) => {
    const prioA = REPO_OVERRIDES[a.name]?.priority ?? 99;
    const prioB = REPO_OVERRIDES[b.name]?.priority ?? 99;
    if (prioA !== prioB) return prioA - prioB;
    return new Date(b.pushed_at || b.updated_at).getTime() - new Date(a.pushed_at || a.updated_at).getTime();
  });

  return eligible.map((repo, idx) => {
    const override = REPO_OVERRIDES[repo.name];
    return mapRepoToProject(repo, override, idx);
  });
}
