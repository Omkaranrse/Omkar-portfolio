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
];

