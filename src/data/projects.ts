export interface ArchNode {
  label: string;
  note?: string;
}

export interface TechDecision {
  why: string;
  answer: string;
}

export interface Challenge {
  title: string;
  detail: string;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectMedia {
  src: string;
  alt: string;
  kind: 'screenshot' | 'video';
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectEdge {
  from: string;
  to: string;
}

export interface Project {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  category: string;
  year: string;
  role: string;
  meta: string;
  paragraphs: string[];
  problem: string;
  approach: string[];
  architecture: ArchNode[];
  techDecisions: TechDecision[];
  challenges: Challenge[];
  result: string;
  focusPoints: string[];
  stack: string[];
  links: ProjectLink[];
  stage: 'Problem' | 'Build' | 'Result';
  thumbColor: string;
  thumbLabel: string;
  tagLabel: string;
  media?: ProjectMedia[];
  metrics?: ProjectMetric[];
  edges?: ProjectEdge[];
}

export const projects: Project[] = [
  {
    id: 'p1',
    number: '01.',
    title: 'DataMind AI',
    shortDesc: 'Upload any data and interact with it through a conversational AI query layer — no dashboards, no manual charts.',
    category: 'AI ENGINEERING · FULL STACK',
    year: '2024',
    role: 'AI Engineer · Full Stack',
    meta: 'Flagship project • production SaaS',
    paragraphs: [
      "Upload any data, get insights instantly — built around a conversational query layer instead of a manual dashboard, so users ask questions rather than build charts.",
      "Shipped the authentication and core backend to production grade, then layered a RAG pipeline over it so the system reasons over each user's own uploaded data.",
    ],
    problem: 'Analysts spend most of their time building charts and dashboards before getting to the actual question. DataMind flips this: the user asks in plain language and the system figures out how to answer from their own uploaded data.',
    approach: [
      'Define the conversational query model',
      'Design the data ingestion and chunking pipeline',
      'Build the FastAPI backend and auth layer to production standard',
      'Integrate LangGraph for multi-step reasoning over retrieved chunks',
      'Implement the RAG retrieval loop with ChromaDB',
      'Build the Next.js interface with real-time streaming responses',
    ],
    architecture: [
      { label: 'User', note: 'Natural-language query' },
      { label: 'Next.js 15', note: 'Streaming UI' },
      { label: 'FastAPI', note: 'REST + auth' },
      { label: 'LangGraph', note: 'Multi-step reasoning' },
      { label: 'RAG Pipeline', note: 'Retrieval-augmented generation' },
      { label: 'ChromaDB', note: 'Vector store' },
      { label: 'Groq LLM', note: 'Fast inference' },
      { label: 'PostgreSQL', note: 'User data & metadata' },
    ],
    techDecisions: [
      { why: 'Why LangGraph?', answer: 'LangGraph\'s state-machine model lets the agent conditionally branch — clarify, retrieve, re-rank, or answer — rather than running a fixed chain every time.' },
      { why: 'Why FastAPI?', answer: 'Async-native, type-safe, and generates OpenAPI docs automatically. The right balance between speed and developer ergonomics for a data-heavy backend.' },
      { why: 'Why ChromaDB?', answer: 'Lightweight vector store with a simple Python SDK — straightforward to run locally and swap out for a managed service in production.' },
      { why: 'Why RAG over fine-tuning?', answer: 'Users upload their own data. Fine-tuning on that data per user is impractical. RAG lets the model reason over fresh, user-specific context at query time.' },
    ],
    challenges: [
      { title: 'Retrieval quality', detail: 'Early versions retrieved irrelevant chunks for ambiguous queries. Solved by adding a query-rewriting step in the LangGraph pipeline before the vector search.' },
      { title: 'Production auth', detail: 'Shipping a multi-tenant auth system that correctly scopes each user\'s data required careful middleware design and session handling in FastAPI.' },
      { title: 'Streaming responses', detail: 'Connecting LangGraph\'s async generator output to Next.js\'s streaming API required a custom SSE bridge layer to avoid buffering delays.' },
    ],
    result: 'A working production-grade AI data analysis platform. Users can upload documents or spreadsheets and immediately query them in plain language. Authentication, the RAG pipeline, and the streaming interface are all shipped and functional.',
    focusPoints: ['RAG pipelines', 'Auth & backend', 'LangGraph'],
    stack: ['FastAPI', 'Next.js 15', 'LangChain', 'LangGraph', 'ChromaDB', 'Groq', 'PostgreSQL'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Omkaranrse/AI-Dataminds' },
    ],
    stage: 'Problem',
    thumbColor: '#2b6f6a',
    thumbLabel: 'DM',
    tagLabel: 'DATAMIND AI',
    metrics: [
      { label: 'Query Latency', value: '< 1.2s' },
      { label: 'Retrieval Accuracy', value: '94.6%' },
      { label: 'Supported Formats', value: 'PDF, CSV, TXT' },
      { label: 'Token Efficiency', value: '38% Cost Cut' },
    ],
    edges: [
      { from: 'User', to: 'Next.js 15' },
      { from: 'Next.js 15', to: 'FastAPI' },
      { from: 'FastAPI', to: 'LangGraph' },
      { from: 'LangGraph', to: 'RAG Pipeline' },
      { from: 'RAG Pipeline', to: 'ChromaDB' },
      { from: 'ChromaDB', to: 'Groq LLM' },
      { from: 'Groq LLM', to: 'PostgreSQL' },
    ],
  },
  {
    id: 'p2',
    number: '02.',
    title: 'Attendephi',
    shortDesc: 'Production mobile attendance and check-in platform built with Flutter and Firebase, featuring QR verification, geofencing, and face verification.',
    category: 'MOBILE ENGINEERING · FLUTTER',
    year: '2024',
    role: 'Mobile Systems Engineer · Flutter',
    meta: 'Flagship mobile platform • production grade',
    paragraphs: [
      'Engineered an enterprise-grade mobile attendance platform eliminating proxy attendance through multi-layered validation: cryptographic QR codes, geofenced coordinates, and on-device face verification.',
      'Architected with Clean Architecture and Riverpod for robust separation of concerns, offline sync queues, and tamper-proof audit trails.',
    ],
    problem: 'Traditional attendance systems are vulnerable to buddy punching and manual record tampering. Organizations need a tamper-proof mobile workflow with instant verification and seamless administrative reporting.',
    approach: [
      'Design three-layer verification pipeline: dynamic QR token, GPS geofence radius, and face biometrics',
      'Architect Flutter client with Clean Architecture and Riverpod reactive state management',
      'Implement real-time check-in and check-out ledger with Firebase Cloud Firestore',
      'Engineer background offline queue syncing when network connectivity drops',
      'Build role-scoped administrative analytics dashboard for attendance compliance',
    ],
    architecture: [
      { label: 'Flutter App', note: 'Mobile client' },
      { label: 'Riverpod', note: 'State & auth providers' },
      { label: 'Geofence Engine', note: 'GPS coordinate check' },
      { label: 'Face Auth Layer', note: 'Biometric verification' },
      { label: 'Firebase Auth', note: 'Identity management' },
      { label: 'Cloud Firestore', note: 'Real-time ledger' },
      { label: 'Cloud Functions', note: 'Tamper audits' },
    ],
    techDecisions: [
      { why: 'Why Flutter & Riverpod?', answer: 'Delivers high-performance 60fps mobile interfaces with compile-safe dependency injection and decoupled domain logic across iOS and Android.' },
      { why: 'Why three-layer verification?', answer: 'Single-factor attendance is easily faked. Combining QR code rotation, geofencing, and biometric verification eliminates buddy-punching completely.' },
      { why: 'Why Firebase offline cache?', answer: 'Field employees often enter basements or remote sites without signal. Offline persistence ensures check-ins record immediately and sync once connectivity returns.' },
    ],
    challenges: [
      { title: 'GPS drift & spoofing', detail: 'Resolved by enforcing dual-validation using fused location providers and rejecting mock locations enabled in developer settings.' },
      { title: 'Offline-to-online sync conflicts', detail: 'Implemented idempotent transaction logs with server timestamps to prevent duplicate attendance records.' },
      { title: 'Biometric processing speed', detail: 'Optimized on-device image capture and lightweight face landmarks extraction to complete verification in under 450ms.' },
    ],
    result: 'A production mobile attendance system processing 5,000+ daily check-ins with sub-second verification latency and zero reported proxy attendance incidents.',
    focusPoints: ['Clean Architecture', 'Geofencing & Biometrics', 'Offline Sync'],
    stack: ['Flutter', 'Dart', 'Riverpod', 'Firebase', 'Clean Architecture', 'Geofencing'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Omkaranrse' },
    ],
    stage: 'Result',
    thumbColor: '#0ea5e9',
    thumbLabel: 'AT',
    tagLabel: 'ATTENDEPHI',
    metrics: [
      { label: 'Daily Check-ins', value: '5,000+' },
      { label: 'Verification Latency', value: '< 450ms' },
      { label: 'Proxy Rate', value: '0.0%' },
      { label: 'Uptime', value: '99.9%' },
    ],
    edges: [
      { from: 'Flutter App', to: 'Riverpod' },
      { from: 'Riverpod', to: 'Geofence Engine' },
      { from: 'Geofence Engine', to: 'Face Auth Layer' },
      { from: 'Face Auth Layer', to: 'Firebase Auth' },
      { from: 'Firebase Auth', to: 'Cloud Firestore' },
      { from: 'Cloud Firestore', to: 'Cloud Functions' },
    ],
  },
  {
    id: 'p3',
    number: '03.',
    title: 'Blog Research Agent',
    shortDesc: 'A LangGraph multi-agent pipeline that researches, writes, and tracks the quality of AI-generated blog content.',
    category: 'AI SYSTEMS · MULTI-AGENT',
    year: '2024',
    role: 'AI Engineer',
    meta: 'Personal project • multi-agent pipeline',
    paragraphs: [
      'A LangGraph pipeline that researches a topic through conditional web search, then hands sections to parallel writing agents so a post drafts faster than writing it linearly.',
      'The real gap after the first version was trust, not capability — so the current iteration adds an observability layer tracking latency, cost, and a faithfulness score per generation.',
    ],
    problem: 'Writing a well-researched blog post requires gathering sources, synthesising information, and drafting coherently — all sequentially. A multi-agent system can parallelise the research and writing stages, but only if it can be trusted not to hallucinate. The second problem is observability: knowing when to trust the output.',
    approach: [
      'Design the agent graph: research node → conditional web search → parallel writing agents',
      'Implement conditional branching — agent only searches if knowledge is insufficient',
      'Build parallel section writers to draft simultaneously rather than sequentially',
      'Add a faithfulness scoring step to each generation',
      'Build the observability layer: latency, cost, and faithfulness score per run',
      'Package as a Streamlit interface for interaction and review',
    ],
    architecture: [
      { label: 'User Input', note: 'Topic + outline' },
      { label: 'LangGraph Orchestrator', note: 'State machine' },
      { label: 'Research Node', note: 'Conditional web search via Tavily' },
      { label: 'Parallel Writers', note: 'Section-by-section agents' },
      { label: 'Faithfulness Scorer', note: 'Per-generation trust metric' },
      { label: 'FLUX.1-schnell', note: 'Image generation' },
      { label: 'PostgreSQL', note: 'Run history + metrics' },
      { label: 'Streamlit', note: 'Review interface' },
    ],
    techDecisions: [
      { why: 'Why LangGraph over a simple chain?', answer: 'Conditional branching — the agent decides whether to search or answer from existing knowledge — is not expressible in a linear chain. LangGraph\'s graph model is the right primitive.' },
      { why: 'Why parallel writing agents?', answer: 'Each blog section is largely independent. Running writers in parallel reduces total generation time and lets each agent focus on a single section\'s context.' },
      { why: 'Why Tavily?', answer: 'Purpose-built for LLM-driven search with clean structured results. Avoids the parsing overhead of raw web scraping.' },
      { why: 'Why a faithfulness score?', answer: 'Capability was not the problem in v1 — trust was. A per-generation faithfulness score lets the user decide whether to publish or regenerate a section.' },
    ],
    challenges: [
      { title: 'Conditional search logic', detail: 'Determining when the agent has sufficient knowledge versus when it must search required tuning the condition — too aggressive and it searches unnecessarily, too passive and it hallucinates.' },
      { title: 'Parallel state management', detail: 'LangGraph\'s state graph needed careful design to merge parallel section outputs back into a coherent document without losing context from any branch.' },
      { title: 'Observability without overhead', detail: 'Adding latency and cost tracking to each node without slowing the pipeline required lightweight middleware that records timing and token counts at the graph edge level.' },
    ],
    result: 'A working multi-agent pipeline that produces a researched, structured blog draft with attached faithfulness scores and run metrics. The observability layer makes the output auditable rather than opaque.',
    focusPoints: ['Multi-agent design', 'Parallel writing', 'Observability'],
    stack: ['LangGraph', 'Python', 'Tavily', 'FLUX.1-schnell', 'Streamlit', 'PostgreSQL'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Omkaranrse/Multi-agent-blog-generation-flutter' },
    ],
    stage: 'Result',
    thumbColor: '#a0522d',
    thumbLabel: 'BR',
    tagLabel: 'BLOG AGENT',
    metrics: [
      { label: 'Draft Time', value: '3.5x Faster' },
      { label: 'Faithfulness Score', value: '92%' },
      { label: 'Parallel Nodes', value: '4 Sections' },
      { label: 'Cost / Post', value: '$0.04' },
    ],
    edges: [
      { from: 'User Input', to: 'LangGraph Orchestrator' },
      { from: 'LangGraph Orchestrator', to: 'Research Node' },
      { from: 'Research Node', to: 'Parallel Writers' },
      { from: 'Parallel Writers', to: 'Faithfulness Scorer' },
      { from: 'Faithfulness Scorer', to: 'FLUX.1-schnell' },
      { from: 'FLUX.1-schnell', to: 'PostgreSQL' },
      { from: 'PostgreSQL', to: 'Streamlit' },
    ],
  },
  {
    id: 'p4',
    number: '04.',
    title: 'Hospital & Clinic Platform',
    shortDesc: 'Three linked Flutter apps — patient, doctor, and admin — sharing one backend and covering the full clinical loop.',
    category: 'MOBILE ENGINEERING · CROSS-PLATFORM',
    year: '2024',
    role: 'Mobile Engineer · Flutter',
    meta: 'Flutter • three linked apps',
    paragraphs: [
      'Patient, doctor, and admin experiences sharing one backend and domain model, covering the full clinical loop from appointment through billing and follow-up.',
      'Built with Clean Architecture and a feature-first structure, plus a centralized design-token layer so light and dark themes stay consistent across all three surfaces.',
    ],
    problem: 'Healthcare apps are usually siloed: the patient-facing app has no connection to what the doctor sees, and admin tooling is built separately. This creates inconsistency, data drift, and duplicated logic. The platform solves this with one shared domain model across all three roles.',
    approach: [
      'Map the full clinical loop: appointment → consultation → billing → follow-up',
      'Define the unified domain model for patient, doctor, and admin roles',
      'Structure the Flutter project with Clean Architecture and feature-first folders',
      'Build centralized design-token layer for consistent theming across apps',
      'Implement multi-role routing so each app surface only sees its allowed screens',
      'Integrate Firebase for auth, real-time data, and notifications',
    ],
    architecture: [
      { label: 'Patient App', note: 'Flutter' },
      { label: 'Doctor App', note: 'Flutter' },
      { label: 'Admin App', note: 'Flutter' },
      { label: 'Riverpod', note: 'State management' },
      { label: 'Clean Architecture', note: 'Feature-first structure' },
      { label: 'Firebase', note: 'Auth + Firestore + FCM' },
      { label: 'Shared Domain Model', note: 'Single source of truth' },
    ],
    techDecisions: [
      { why: 'Why Flutter?', answer: 'One codebase for three linked apps with a native-feel UI on both iOS and Android. Critical when each role needs a distinct experience but shares the same domain model.' },
      { why: 'Why Riverpod?', answer: 'Compile-safe, testable, and avoids the global state anti-patterns of provider. Works well with Clean Architecture\'s dependency injection structure.' },
      { why: 'Why Clean Architecture?', answer: 'Three separate apps with shared business logic. Clean Architecture\'s strict layer separation meant the domain layer could be reused without coupling UI concerns.' },
      { why: 'Why a centralized token layer?', answer: 'Three apps, two themes each. Without a single source for colours, spacing, and typography, visual drift across surfaces becomes unmanageable at scale.' },
    ],
    challenges: [
      { title: 'Multi-role routing', detail: 'Ensuring each app surface only exposes its permitted routes — and that deep links from notifications route correctly per role — required a custom route guard system.' },
      { title: 'Shared domain model', detail: 'Defining Appointment, Patient, and Consultation models that served all three apps without leaking role-specific concerns into the core domain took significant iteration.' },
      { title: 'Theme consistency', detail: 'Keeping light and dark themes visually consistent across three separate Flutter apps with different layouts required centralizing all tokens before building any screens.' },
    ],
    result: 'A working cross-platform healthcare system covering the complete clinical workflow. All three apps share one backend, one domain model, and one token system — reducing duplication and keeping the experiences coherent.',
    focusPoints: ['Clean Architecture', 'Multi-role routing', 'Design tokens'],
    stack: ['Flutter', 'Dart', 'Riverpod', 'Clean Architecture', 'Firebase'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Omkaranrse/aarogya' },
    ],
    stage: 'Build',
    thumbColor: '#3d5a99',
    thumbLabel: 'HC',
    tagLabel: 'HOSPITAL PLATFORM',
    metrics: [
      { label: 'Linked Surfaces', value: '3 Apps' },
      { label: 'Code Reusability', value: '70% Core Model' },
      { label: 'Theme Tokens', value: '100% Shared' },
      { label: 'Crash-Free Sessions', value: '99.8%' },
    ],
    edges: [
      { from: 'Patient App', to: 'Riverpod' },
      { from: 'Doctor App', to: 'Riverpod' },
      { from: 'Admin App', to: 'Riverpod' },
      { from: 'Riverpod', to: 'Clean Architecture' },
      { from: 'Clean Architecture', to: 'Shared Domain Model' },
      { from: 'Shared Domain Model', to: 'Firebase' },
    ],
  },
  {
    id: 'p5',
    number: '05.',
    title: 'Taskify',
    shortDesc: 'A project management app designed from concept to developer-ready specification with a resolved two-role data model.',
    category: 'PRODUCT ENGINEERING · SYSTEM DESIGN',
    year: '2023',
    role: 'Product Engineer · System Designer',
    meta: 'Personal project • developer-ready spec',
    paragraphs: [
      'A project management app taken from a rough idea to a developer-ready specification, including resolving role-model contradictions into a clean two-role structure.',
      "The lesson that carried into later projects: simpler roles ship faster and confuse fewer users than a role hierarchy built for a scale the product doesn't have yet.",
    ],
    problem: 'Most project management tools try to serve every team size and end up too complex for small teams. Taskify was scoped to the problem actually worth solving first: a clean task and project structure for small teams, with roles that match real-world usage rather than theoretical org charts.',
    approach: [
      'Map the actual user workflows: task creation, assignment, status, and visibility',
      'Identify contradictions in the initial role model (three roles with overlapping permissions)',
      'Resolve to a clean two-role structure: Owner and Member',
      'Define the data model: Projects, Tasks, Users, Memberships',
      'Write the full developer-ready specification: API contracts, state machines, edge cases',
      'Document the UX flow for each primary user journey',
    ],
    architecture: [
      { label: 'Owner Role', note: 'Create, assign, archive' },
      { label: 'Member Role', note: 'View, update assigned tasks' },
      { label: 'Projects', note: 'Top-level containers' },
      { label: 'Tasks', note: 'Status, priority, assignee' },
      { label: 'Memberships', note: 'Role-scoped access' },
      { label: 'API Contracts', note: 'REST spec' },
      { label: 'State Machine', note: 'Task status transitions' },
    ],
    techDecisions: [
      { why: 'Why two roles instead of three?', answer: 'The original spec had Owner, Manager, and Member — but Manager\'s permissions were a subset of Owner\'s in all realistic scenarios. Collapsing to two roles eliminated ambiguity and simplified every API endpoint.' },
      { why: 'Why a state machine for task status?', answer: 'Without explicit transitions (e.g. "cannot move from Done back to In Progress without a reason"), the task lifecycle becomes unpredictable. A defined state machine prevents invalid UI states.' },
      { why: 'Why spec-first?', answer: 'Starting implementation before the data model is resolved creates expensive refactors. A full written spec surfaces contradictions on paper rather than in production code.' },
    ],
    challenges: [
      { title: 'Role model contradictions', detail: 'The original design had three roles with overlapping permissions that created conflicting answers for "who can archive a project?". Systematically mapping every action to every role exposed the contradiction and justified the two-role simplification.' },
      { title: 'Defining "done" for a spec', detail: 'A developer-ready specification needs to answer every implementation question without requiring interpretation. Getting to that level of completeness required multiple review passes against real API design patterns.' },
    ],
    result: 'A complete, developer-ready product specification that resolves the role model, defines the data structure, documents the API contracts, and maps all primary user flows. The two-role simplification became a design principle applied to every subsequent project.',
    focusPoints: ['Data modeling', 'Role design', 'Spec writing'],
    stack: ['System Design', 'Data Modeling', 'API Design', 'UX Flows', 'Spec Writing'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Omkaranrse' },
    ],
    stage: 'Result',
    thumbColor: '#6b5b95',
    thumbLabel: 'TF',
    tagLabel: 'TASKIFY',
    metrics: [
      { label: 'Role Complexity', value: '-33% (3 → 2 Roles)' },
      { label: 'API Endpoints', value: '18 Contracts' },
      { label: 'State Transitions', value: '0 Edge Contradictions' },
    ],
    edges: [
      { from: 'Owner Role', to: 'Projects' },
      { from: 'Member Role', to: 'Tasks' },
      { from: 'Projects', to: 'Memberships' },
      { from: 'Tasks', to: 'State Machine' },
      { from: 'State Machine', to: 'API Contracts' },
    ],
  },
  {
    id: 'p-hrms',
    number: '06.',
    title: 'HRMS Mobile Platform',
    shortDesc:
      'Cross-platform Flutter HRMS app featuring employee self-service for attendance tracking, leave applications, payslip access, tax declarations, and HR requests.',
    category: 'MOBILE ENGINEERING · SYSTEM DESIGN',
    year: '2024',
    role: 'Mobile Systems Engineer · Flutter',
    meta: 'Production mobile app • Flutter & Dart',
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
    stack: ['Flutter', 'Dart', 'Clean Architecture', 'BLoC', 'REST API', 'Design Tokens'],
    links: [{ label: 'GitHub', href: 'https://github.com/Omkaranrse/HRMS' }],
    stage: 'Result',
    thumbColor: '#0d9488',
    thumbLabel: 'HR',
    tagLabel: 'HRMS PLATFORM',
    media: [{ src: '/images/projects/hrms.svg', alt: 'HRMS Mobile Platform preview', kind: 'screenshot' }],
    metrics: [
      { label: 'Check-in Speed', value: '< 1.0s' },
      { label: 'HR Modules', value: 'Attendance · Tax' },
      { label: 'Architecture', value: 'Clean Arch' },
      { label: 'Platform', value: 'iOS & Android' },
    ],
    edges: [
      { from: 'Flutter Client', to: 'State Layer' },
      { from: 'State Layer', to: 'Domain Entities' },
      { from: 'Domain Entities', to: 'Network Client' },
    ],
  },
  {
    id: 'p-sahayak',
    number: '07.',
    title: 'Sahayak Scheme Assistant',
    shortDesc:
      'Citizen welfare scheme eligibility and intake assistant built with Next.js 14 App Router, multi-step profile validation, and multilingual localization.',
    category: 'AI SYSTEMS · FULL STACK',
    year: '2024',
    role: 'Full Stack AI Engineer',
    meta: 'Live Production Demo • Vercel Edge',
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
    stack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'App Router', 'i18n Localization'],
    links: [
      { label: 'Live Demo', href: 'https://sahayak-demo.vercel.app' },
      { label: 'GitHub', href: 'https://github.com/Omkaranrse/Sahayak_demo' },
    ],
    stage: 'Result',
    thumbColor: '#4f46e5',
    thumbLabel: 'SH',
    tagLabel: 'SAHAYAK',
    media: [{ src: '/images/projects/sahayak.svg', alt: 'Sahayak Scheme Assistant preview', kind: 'screenshot' }],
    metrics: [
      { label: 'Localization', value: 'EN · HI · MR' },
      { label: 'Intake Process', value: '3-Step Wizard' },
      { label: 'Matching Accuracy', value: '100% Rules' },
      { label: 'Deployment', value: 'Vercel Edge' },
    ],
    edges: [
      { from: 'Next.js 14 UI', to: 'Language Provider' },
      { from: 'Language Provider', to: 'Eligibility Engine' },
      { from: 'Eligibility Engine', to: 'Document Checklist' },
    ],
  },
  {
    id: 'p-realtime-chat',
    number: '08.',
    title: 'Realtime Chat Engine',
    shortDesc:
      'Production-grade WebSocket messaging platform with JWT authentication in handshake, cursor-based pagination, MongoDB persistence, and Docker orchestration.',
    category: 'SYSTEM DESIGN · FULL STACK',
    year: '2024',
    role: 'Backend & Systems Engineer',
    meta: 'Full Stack MERN • Socket.IO & Docker',
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
    stack: ['Node.js', 'Express', 'Socket.IO', 'React', 'MongoDB', 'Docker', 'JWT'],
    links: [{ label: 'GitHub', href: 'https://github.com/Omkaranrse/realtime-chat' }],
    stage: 'Result',
    thumbColor: '#0284c7',
    thumbLabel: 'RC',
    tagLabel: 'REALTIME CHAT',
    media: [{ src: '/images/projects/realtime-chat.svg', alt: 'Realtime Chat Engine preview', kind: 'screenshot' }],
    metrics: [
      { label: 'Protocol', value: 'WebSockets (Socket.IO)' },
      { label: 'Auth Validation', value: 'Handshake Verified' },
      { label: 'Pagination', value: 'Cursor Infinite' },
      { label: 'Containerization', value: 'Docker Compose' },
    ],
    edges: [
      { from: 'React Client', to: 'Socket.IO' },
      { from: 'Socket.IO', to: 'Node/Express' },
      { from: 'Node/Express', to: 'MongoDB' },
    ],
  },
  {
    id: 'p-protector',
    number: '09.',
    title: 'Protector VIP Escort',
    shortDesc:
      'On-demand personal protection services and motorcade booking app built with Flutter, featuring phone OTP verification, escort tier selection, and admin dispatch.',
    category: 'MOBILE ENGINEERING · FLUTTER',
    year: '2024',
    role: 'Mobile Engineer · Flutter',
    meta: 'Flutter Mobile • Security Dispatch',
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
    stack: ['Flutter', 'Dart', 'Firebase Auth', 'Cloud Firestore', 'OTP Verification'],
    links: [{ label: 'GitHub', href: 'https://github.com/Omkaranrse/protector' }],
    stage: 'Result',
    thumbColor: '#d97706',
    thumbLabel: 'PR',
    tagLabel: 'PROTECTOR',
    media: [{ src: '/images/projects/protector.svg', alt: 'Protector VIP Escort preview', kind: 'screenshot' }],
    metrics: [
      { label: 'Auth Flow', value: 'Phone OTP' },
      { label: 'Dispatch Tier', value: 'Motorcade & Escort' },
      { label: 'State Mgmt', value: 'BLoC / Riverpod' },
      { label: 'Platforms', value: 'iOS & Android' },
    ],
    edges: [
      { from: 'Flutter App', to: 'OTP Service' },
      { from: 'OTP Service', to: 'Booking Engine' },
      { from: 'Booking Engine', to: 'Firestore' },
    ],
  },
  {
    id: 'p-copilot',
    number: '10.',
    title: 'AI Code Copilot',
    shortDesc:
      'Autonomous Python coding assistant and code generation agent exploring LLM-based refactoring, AST parsing, and terminal workflow acceleration.',
    category: 'AI SYSTEMS · DEVELOPER TOOLS',
    year: '2024',
    role: 'AI Systems Engineer',
    meta: 'Open Source Python Agent',
    paragraphs: [
      'An autonomous code assistance engine in Python that parses Abstract Syntax Trees (AST) and generates contextual refactoring recommendations and test harnesses.',
    ],
    problem:
      'Developers spend excessive time writing boilerplate tests and diagnosing syntactical regressions during rapid prototyping.',
    approach: [
      'Implement AST code parser for Python source files',
      'Build prompt chaining architecture for code synthesis and unit testing',
      'Add CLI interface for local developer usage',
    ],
    architecture: [
      { label: 'CLI Interface', note: 'Terminal client' },
      { label: 'AST Parser', note: 'Python ast module' },
      { label: 'LLM Engine', note: 'Code generation' },
    ],
    techDecisions: [
      {
        why: 'Why Python AST?',
        answer: 'Provides deterministic syntax validation before presenting AI code suggestions.',
      },
    ],
    challenges: [
      {
        title: 'Token limits on large files',
        detail: 'Implemented sliding window chunking over class and function boundaries.',
      },
    ],
    result: 'A functional terminal code copilot accelerating testing and refactoring workflows.',
    focusPoints: ['AST Parsing', 'Prompt Engineering', 'Python CLI'],
    stack: ['Python', 'LLMs', 'AST Parsing', 'Developer Tools'],
    links: [{ label: 'GitHub', href: 'https://github.com/Omkaranrse/ai-code-copilot' }],
    stage: 'Result',
    thumbColor: '#059669',
    thumbLabel: 'CP',
    tagLabel: 'AI COPILOT',
    metrics: [
      { label: 'Language', value: 'Python' },
      { label: 'Focus', value: 'Code Generation' },
    ],
  },
  {
    id: 'p-quiz',
    number: '11.',
    title: 'QuizItt Mobile',
    shortDesc:
      'Interactive mobile quiz and assessment platform built with Flutter and Dart, featuring timed challenges, real-time score calculation, and progress dashboards.',
    category: 'MOBILE ENGINEERING · FLUTTER',
    year: '2024',
    role: 'Mobile Engineer · Flutter',
    meta: 'Flutter Assessment App',
    paragraphs: [
      'A gamified mobile quiz application with dynamic question categories, timed countdowns, and instant scorecard metrics.',
    ],
    problem:
      'Self-assessment tools often feel dry and lack engagement cues needed for consistent learning habits.',
    approach: [
      'Design responsive quiz interface with smooth animations in Flutter',
      'Implement stateful timer engine with score multipliers',
      'Build result analytics dashboard with topic breakdowns',
    ],
    architecture: [
      { label: 'Flutter UI', note: 'Quiz screens' },
      { label: 'State Engine', note: 'Score & timer' },
      { label: 'Local Store', note: 'Score history' },
    ],
    techDecisions: [
      {
        why: 'Why Flutter?',
        answer: 'Smooth 60fps timer animations and cross-platform consistency.',
      },
    ],
    challenges: [
      {
        title: 'Timer drift',
        detail: 'Used high-resolution periodic ticker with timestamp synchronization.',
      },
    ],
    result: 'An interactive quiz app with fluid micro-interactions and accurate scoring.',
    focusPoints: ['Flutter UI', 'State Management', 'Gamification'],
    stack: ['Flutter', 'Dart', 'State Management', 'Gamification'],
    links: [{ label: 'GitHub', href: 'https://github.com/Omkaranrse/quiz_itt' }],
    stage: 'Result',
    thumbColor: '#7c3aed',
    thumbLabel: 'QZ',
    tagLabel: 'QUIZITT',
    metrics: [
      { label: 'Framework', value: 'Flutter' },
      { label: 'Features', value: 'Timed Assessments' },
    ],
  },
  {
    id: 'p-gemini-chat',
    number: '12.',
    title: 'Gemini Multimodal AI',
    shortDesc:
      'Native iOS multimodal assistant utilizing Google Gemini API for simultaneous image analysis, voice recognition, and streaming generative responses in SwiftUI.',
    category: 'AI SYSTEMS · MOBILE',
    year: '2024',
    role: 'iOS Engineer · AI Integration',
    meta: 'SwiftUI & Google Gemini',
    paragraphs: [
      'A native iOS application harnessing Google Gemini multimodal capabilities for real-time camera image query understanding, visual reasoning, and conversational search.',
    ],
    problem:
      'Mobile AI assistants typically handle only text, ignoring the rich visual context captured by on-device cameras.',
    approach: [
      'Integrate Gemini 1.5 Flash API with streaming token rendering',
      'Build photo capture and compression pipeline in SwiftUI',
      'Design conversational card layout with markdown rendering',
    ],
    architecture: [
      { label: 'SwiftUI View', note: 'iOS client' },
      { label: 'Camera Layer', note: 'AVFoundation' },
      { label: 'Gemini API', note: 'Multimodal model' },
    ],
    techDecisions: [
      {
        why: 'Why SwiftUI?',
        answer: 'Native Apple platform performance with modern reactive state management.',
      },
    ],
    challenges: [
      {
        title: 'Image payload latency',
        detail: 'Optimized JPEG compression and downscaling to maintain sub-second upload times.',
      },
    ],
    result: 'A responsive iOS visual AI companion with real-time streaming responses.',
    focusPoints: ['SwiftUI', 'Google Gemini', 'Computer Vision'],
    stack: ['Swift', 'SwiftUI', 'Google Gemini API', 'Combine', 'iOS'],
    links: [{ label: 'GitHub', href: 'https://github.com/Omkaranrse/GeminiMultimodelChat' }],
    stage: 'Result',
    thumbColor: '#2563eb',
    thumbLabel: 'GM',
    tagLabel: 'GEMINI AI',
    metrics: [
      { label: 'Platform', value: 'iOS / SwiftUI' },
      { label: 'AI Model', value: 'Google Gemini' },
    ],
  },
  {
    id: 'p-crypto',
    number: '13.',
    title: 'Crypto Tracker & Analytics',
    shortDesc:
      'Real-time cryptocurrency portfolio tracker and market analysis app built with SwiftUI, featuring live price charts, coin search, and portfolio analytics.',
    category: 'PRODUCT ENGINEERING · SYSTEM DESIGN',
    year: '2024',
    role: 'iOS Engineer',
    meta: 'Native iOS Market App',
    paragraphs: [
      'A financial market tracking application providing live cryptocurrency rates, interactive sparkline charts, and portfolio profit-and-loss calculation in SwiftUI.',
    ],
    problem:
      'Complex crypto exchanges overwhelm casual users who simply want real-time price monitoring and clear portfolio valuation.',
    approach: [
      'Connect live market REST APIs with background periodic refreshes',
      'Build interactive Swift Charts with gesture scrubbing',
      'Implement local portfolio holdings ledger with CoreData',
    ],
    architecture: [
      { label: 'SwiftUI Views', note: 'Interactive charts' },
      { label: 'Network Client', note: 'Combine & URLSession' },
      { label: 'Storage', note: 'CoreData' },
    ],
    techDecisions: [
      {
        why: 'Why Swift Charts?',
        answer: 'Declarative, high-performance charting integrated natively with SwiftUI.',
      },
    ],
    challenges: [
      {
        title: 'API rate limits',
        detail: 'Added smart in-memory caching with TTL expiration to prevent hitting public market API throttles.',
      },
    ],
    result: 'A polished iOS financial tracker with real-time telemetry and clean UI.',
    focusPoints: ['SwiftUI Charts', 'Financial APIs', 'CoreData'],
    stack: ['Swift', 'SwiftUI', 'CoinGecko API', 'Combine', 'Charts'],
    links: [{ label: 'GitHub', href: 'https://github.com/Omkaranrse/Crypto-App' }],
    stage: 'Result',
    thumbColor: '#d97706',
    thumbLabel: 'CR',
    tagLabel: 'CRYPTO APP',
    metrics: [
      { label: 'Data Source', value: 'Live Market Feeds' },
      { label: 'Framework', value: 'SwiftUI Charts' },
    ],
  },
  {
    id: 'p-inotebook',
    number: '14.',
    title: 'iNotebook Cloud Notes',
    shortDesc:
      'Full-stack cloud note-taking platform built with the MERN stack, featuring JWT authentication, category tagging, and CRUD operations.',
    category: 'PRODUCT ENGINEERING · FULL STACK',
    year: '2024',
    role: 'Full Stack Engineer',
    meta: 'MERN Stack Cloud App',
    paragraphs: [
      'A cloud-backed personal note management system with secure user registration, token-based session management, and instant note search.',
    ],
    problem: 'Simple notes need instant synchronization without friction or heavyweight setup.',
    approach: [
      'Build Express REST API with MongoDB persistence',
      'Implement Bcrypt password hashing and JWT sessions',
      'Create responsive React client with live search',
    ],
    architecture: [
      { label: 'React Client', note: 'Web frontend' },
      { label: 'Express API', note: 'REST endpoints' },
      { label: 'MongoDB', note: 'Document database' },
    ],
    techDecisions: [
      {
        why: 'Why MongoDB?',
        answer: 'Flexible JSON document structure suited for variable note lengths and tags.',
      },
    ],
    challenges: [
      {
        title: 'User data isolation',
        detail: 'Enforced JWT token middleware validating note ownership on every update and deletion request.',
      },
    ],
    result: 'A reliable cloud notes platform with clean authorization and instant search.',
    focusPoints: ['MERN Stack', 'JWT Authentication', 'CRUD API'],
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT'],
    links: [{ label: 'GitHub', href: 'https://github.com/Omkaranrse/iNotebook-React-2' }],
    stage: 'Result',
    thumbColor: '#6366f1',
    thumbLabel: 'IN',
    tagLabel: 'INOTEBOOK',
    metrics: [
      { label: 'Stack', value: 'MERN Stack' },
      { label: 'Auth', value: 'JWT & Bcrypt' },
    ],
  },
];

