import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// ─────────────────────────────────────────────────────────────
// In-Memory Rate Limiting (Server-side sliding window)
// Allows up to 25 requests per 60 seconds per IP address.
// ─────────────────────────────────────────────────────────────
interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 25;

// Periodically purge stale records to prevent memory growth
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    record.timestamps = record.timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (record.timestamps.length === 0) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { timestamps: [] };
  record.timestamps = record.timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (record.timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false; // Rate limit exceeded
  }

  record.timestamps.push(now);
  rateLimitMap.set(ip, record);
  return true;
}

// ─────────────────────────────────────────────────────────────
// Authoritative Grounding & Retrieval Engine
// Single Source of Truth: src/data/portfolio-knowledge.txt
// ─────────────────────────────────────────────────────────────
interface RetrievalResult {
  hasMatch: boolean;
  context: string;
  source: string;
  deterministicAnswer?: string;
}

// Read and cache the approved portfolio knowledge source file
let cachedKnowledgeText = '';
function getAuthoritativeKnowledge(): string {
  if (!cachedKnowledgeText) {
    try {
      const filePath = path.join(process.cwd(), 'src/data/portfolio-knowledge.txt');
      cachedKnowledgeText = fs.readFileSync(filePath, 'utf-8');
    } catch (err) {
      console.error('Error reading portfolio-knowledge.txt:', err);
      cachedKnowledgeText = '';
    }
  }
  return cachedKnowledgeText;
}

/**
 * Deterministically identify relevant sections of portfolio-knowledge.txt
 * based strictly on the user question.
 *
 * If the query is unrelated, out-of-scope, or requests unknown info
 * (e.g. salary, CEO of Google, weather, crypto, hobbies not listed),
 * this function returns hasMatch: false so NO LLM is called and the
 * standard fallback is returned.
 */
function retrieveAuthoritativeContext(query: string, knowledge: string): RetrievalResult {
  const q = query.trim().toLowerCase();

  // Out-of-bounds checks: only explicit non-portfolio spam or personal private domains
  const outOfScopeKeywords = [
    'ceo of google',
    'president',
    'weather',
    'bitcoin',
    'crypto',
    'stock market',
    'recipe',
    'football',
    'cricket score',
    'movie',
    'religion',
    'girlfriend',
    'boyfriend',
    'dating',
    'relationship',
    'family members',
    'age',
    'birthday',
    'birthdate',
  ];

  for (const oos of outOfScopeKeywords) {
    if (q.includes(oos)) {
      return {
        hasMatch: false,
        context: '',
        source: '',
      };
    }
  }

  // 1. Resume / CV Download
  if (
    q.includes('resume') ||
    q.includes('cv') ||
    q.includes('curriculum vitae') ||
    q.includes('download resume') ||
    q.includes('profile pdf') ||
    q.includes('biodata')
  ) {
    return {
      hasMatch: true,
      source: 'Resume & Credentials',
      context: `Official Resume for Omkar Anarse: Available at /Omkar.pdf. Omkar has 3+ years engineering experience, B.Sc. CS and MCA from Mumbai University, production Flutter development at Metaphi and My Job Park, and applied AI systems (LangGraph, RAG, ChromaDB, FastAPI).`,
      deterministicAnswer:
        `You can view and download my official resume here:

📄 **[Download Omkar Anarse - Resume (PDF)](/Omkar.pdf)**

• **Direct Profiles**: [LinkedIn Profile](https://linkedin.com/in/omkar-anarse) · [GitHub Profile](https://github.com/Omkaranrse)
• **Key Highlights**: 3+ years software engineering experience, B.Sc. CS & MCA from Mumbai University (MU), production Flutter & Clean Architecture at **Metaphi** and **My Job Park**, plus Applied Agentic AI engineering (**DataMind AI**, LangGraph, RAG, ChromaDB, FastAPI).

Feel free to save a copy or reach out directly at [omkaranarse1906@gmail.com](mailto:omkaranarse1906@gmail.com)!`,
    };
  }

  // 2. Years of Experience (YoE) / Total Experience / Seniority
  if (
    q.includes('years of experience') ||
    q.includes('year of experience') ||
    q.includes('how much experience') ||
    q.includes('how many years') ||
    q.includes('total experience') ||
    q.includes('yoe') ||
    q.includes('experience do you have') ||
    q.includes('level of experience') ||
    q.includes('seniority')
  ) {
    return {
      hasMatch: true,
      source: 'Experience & Seniority',
      context: `Omkar Anarse has 3+ years of practical software engineering experience: 3 years part-time Flutter engineering at My Job Park building recruitment apps for thousands of users + current role as Flutter Developer at Metaphi (Clean Architecture & Riverpod) + extensive production AI systems engineering (LangGraph, RAG, FastAPI).`,
      deterministicAnswer:
        `I have **3+ years of practical software engineering experience**:

• **My Job Park** (3 Years · Part-time Flutter Developer):
  Engineered and scaled cross-platform recruitment applications serving thousands of active users, implementing real-time messaging, notifications, and job search with Firebase.
• **Metaphi** (Current · Flutter Developer):
  Architecting modular mobile interfaces with Clean Architecture and Riverpod, integrating asynchronous REST APIs, and crafting fluid design systems.
• **Applied AI Systems**:
  Extensive production experience building autonomous AI systems (like **DataMind AI** and multi-agent **LangGraph** research pipelines with ChromaDB and FastAPI).`,
    };
  }

  // 3. Notice Period & Availability to Start / Immediate Joiner
  if (
    q.includes('notice period') ||
    q.includes('how soon can you join') ||
    q.includes('when can you join') ||
    q.includes('when can you start') ||
    q.includes('immediate joiner') ||
    q.includes('start date') ||
    q.includes('joining date') ||
    q.includes('join immediately') ||
    q.includes('earliest start')
  ) {
    return {
      hasMatch: true,
      source: 'Availability & Notice Period',
      context: `Notice Period & Availability: Omkar Anarse has an immediate / short notice period and can onboard rapidly for full-time engineering roles, contracts, and collaborations.`,
      deterministicAnswer:
        `• **Notice Period**: **Immediate / Short notice** — I am available to onboard rapidly for the right full-time role or contract.
• **Current Status**: Actively open to full-time engineering roles (AI Systems, Full-Stack, Mobile/Flutter) and high-impact product contracts.
• **Next Steps**: Let's connect via email ([omkaranarse1906@gmail.com](mailto:omkaranarse1906@gmail.com)) or [WhatsApp (+91 8356011246)](https://wa.me/918356011246) to align on your team's timeline!`,
    };
  }

  // 4. Location, Remote / Hybrid / On-site & Relocation
  if (
    q.includes('relocate') ||
    q.includes('relocation') ||
    q.includes('remote') ||
    q.includes('hybrid') ||
    q.includes('on-site') ||
    q.includes('onsite') ||
    q.includes('wfh') ||
    q.includes('work from home') ||
    q.includes('where are you located') ||
    q.includes('where do you live') ||
    q.includes('where are you based') ||
    q.includes('city') ||
    q.includes('bangalore') ||
    q.includes('pune') ||
    q.includes('hyderabad') ||
    q.includes('gurgaon') ||
    q.includes('delhi') ||
    q.includes('work mode') ||
    q.includes('open to relocate')
  ) {
    return {
      hasMatch: true,
      source: 'Location & Work Preferences',
      context: `Location & Work Mode: Based in Mumbai, India. Open to Remote worldwide, Hybrid/On-site in Mumbai, and actively open to Relocation to major tech hubs (Bangalore, Pune, Hyderabad, international) for compelling full-time roles.`,
      deterministicAnswer:
        `• **Current Location**: Mumbai, Maharashtra, India.
• **Work Mode Preference**:
  - **Remote**: Fully open to remote roles worldwide (comfortable collaborating across US, European, and APAC time zones).
  - **Hybrid / On-site**: Open to on-site and hybrid roles in Mumbai.
• **Relocation**: **Yes**, I am actively open to relocation for compelling full-time engineering opportunities in major tech hubs (Bangalore, Pune, Hyderabad, Gurgaon, or internationally).`,
    };
  }

  // 5. Compensation / Salary / CTC Expectations
  if (
    q.includes('salary') ||
    q.includes('compensation') ||
    q.includes('ctc') ||
    q.includes('expected ctc') ||
    q.includes('current ctc') ||
    q.includes('pay rate') ||
    q.includes('package') ||
    q.includes('remuneration') ||
    q.includes('expected salary')
  ) {
    return {
      hasMatch: true,
      source: 'Compensation & Expectations',
      context: `Compensation Philosophy: Open to discussing competitive compensation and CTC aligned with industry standards, role scope, and whether the position is remote or on-site. Contact directly via email or WhatsApp.`,
      deterministicAnswer:
        `• **Compensation Philosophy**: I am open to discussing competitive compensation and CTC aligned with industry benchmarks, the scope of the role, team expectations, and whether the position is remote or on-site.
• **Direct Discussion**: For specific current/expected numbers and benefits, feel free to reach out directly:
  - **Email**: [omkaranarse1906@gmail.com](mailto:omkaranarse1906@gmail.com)
  - **WhatsApp**: [+91 8356011246](https://wa.me/918356011246)
  - **LinkedIn**: [linkedin.com/in/omkar-anarse](https://linkedin.com/in/omkar-anarse)`,
    };
  }

  // 6. Why Hire Omkar / Key Strengths / Selling Points
  if (
    q.includes('why should we hire you') ||
    q.includes('why hire') ||
    q.includes('key strength') ||
    q.includes('strengths') ||
    q.includes('why you') ||
    q.includes('what makes you unique') ||
    q.includes('why choose you') ||
    q.includes('differentiator') ||
    q.includes('best fit') ||
    q.includes('stand out') ||
    q.includes('value you bring')
  ) {
    return {
      hasMatch: true,
      source: 'Key Strengths & Differentiators',
      context: `Why Hire Omkar Anarse:
1. Dual-Threat Systems Capability: Production mobile engineering (Clean Architecture, Flutter, Riverpod) combined with applied AI (LangGraph multi-agent systems, RAG, ChromaDB, FastAPI).
2. Proven Track Record of Shipping: Production mobile apps with thousands of users at My Job Park + full-stack AI apps like DataMind AI.
3. Clean Architecture & Rigor: Decoupled, type-safe, maintainable code with design tokens.
4. Speed & Adaptability: B.Sc. CS & MCA degrees from Mumbai University, quick learner.`,
      deterministicAnswer:
        `Here are the top reasons I make a high-impact addition to your engineering team:

1. **Dual-Threat Systems Capability**: I bridge the gap between production cross-platform mobile engineering (**Flutter**, **Clean Architecture**, **Riverpod**) and cutting-edge Applied AI (**LangGraph multi-agent pipelines**, **RAG**, **ChromaDB**, **FastAPI**).
2. **Proven Track Record of Shipping**: I don't just prototype; I ship production-grade code that scales — from recruitment apps with thousands of active users at **My Job Park** to end-to-end AI applications like **DataMind AI**.
3. **Rigorous Architecture & Clean Code**: I write modular, decoupled, type-safe software with clean boundaries, comprehensive design token systems, and robust error handling.
4. **Speed & Adaptability**: Strong computer science foundation (B.Sc. CS & MCA from Mumbai University) allows me to master new stacks, tools, and paradigms rapidly.`,
    };
  }

  // 7. Most Challenging Project / Technical Problem Solved
  if (
    q.includes('challenging project') ||
    q.includes('hardest problem') ||
    q.includes('most complex') ||
    q.includes('complex problem') ||
    q.includes('difficult bug') ||
    q.includes('technical challenge') ||
    q.includes('proudest project') ||
    q.includes('best project')
  ) {
    return {
      hasMatch: true,
      source: 'Engineering Deep Dive: DataMind AI',
      context: `Most challenging project: DataMind AI. Non-technical users upload arbitrary datasets (CSV, JSON, SQL) and run conversational queries without manual charts or hallucinated SQL. Solution: Multi-step LangGraph reasoning agent with conditional branching, ChromaDB vector store for schema understanding, FastAPI backend, Next.js 15 streaming interface with Groq LLM inference.`,
      deterministicAnswer:
        `My most technically demanding project is **DataMind AI**:

• **The Challenge**: Enabling non-technical business users to upload arbitrary unstructured datasets (CSV, JSON, SQL) and run conversational queries without generating hallucinations or invalid database queries.
• **The Solution**:
  1. Engineered a multi-step reasoning agent using **LangGraph** with conditional branching to validate queries before execution.
  2. Designed a hybrid **RAG pipeline** using **ChromaDB** vector embeddings to index dataset metadata and schema definitions.
  3. Backed by a high-throughput asynchronous **FastAPI** server and Next.js 15 streaming UI with sub-second Groq LLM inference.
• **The Impact**: Eliminated manual dashboard configuration and reduced ad-hoc data analysis cycles from hours to seconds.`,
    };
  }

  // 8. Architecture, Clean Architecture, Design Patterns & Code Quality
  if (
    q.includes('clean architecture') ||
    q.includes('design pattern') ||
    q.includes('solid principle') ||
    q.includes('how do you structure') ||
    q.includes('code quality') ||
    q.includes('riverpod') ||
    q.includes('state management') ||
    q.includes('folder structure') ||
    q.includes('bloc')
  ) {
    return {
      hasMatch: true,
      source: 'Architecture & Design Principles',
      context: `Engineering Architecture & Design Principles:
Clean Architecture: Presentation (Widgets/UI) -> Domain (Use Cases/Entities) -> Data (Repositories/DataSources).
State Management: Riverpod & BLoC in Flutter for unidirectional data flows.
Backend: FastAPI modular routers, Pydantic validation, dependency injection, type safety with TypeScript/Zod.`,
      deterministicAnswer:
        `I design systems around **Clean Architecture** and SOLID principles to ensure testability, scalability, and maintainability:

• **Layered Separation**:
  - **Presentation Layer**: Flutter Widgets / React Components + Controllers & ViewModels.
  - **Domain Layer**: Business Logic, Use Cases, and Pure Entities (strictly independent of UI and third-party libraries).
  - **Data Layer**: Repositories, Data Sources (REST, Firestore, Local SQLite/Hive), and DTO mappers.
• **Predictable State Management**: Riverpod and BLoC in Flutter for unidirectional data flows, immutable state, and zero side-effects.
• **Backend Separation**: Modular FastAPI routes, dependency injection, and strict schema validation with Pydantic and Zod.`,
    };
  }

  // 9. Teamwork, Git Workflow, Agile / Scrum
  if (
    q.includes('git workflow') ||
    q.includes('how do you work in a team') ||
    q.includes('team collaboration') ||
    q.includes('agile') ||
    q.includes('scrum') ||
    q.includes('code review') ||
    q.includes('collaborat') ||
    q.includes('cross-functional') ||
    q.includes('teamwork') ||
    q.includes('git branching')
  ) {
    return {
      hasMatch: true,
      source: 'Teamwork & Engineering Practices',
      context: `Teamwork & Agile Workflow: Feature branching, conventional commits, pull request code reviews, daily standups, sprint planning, cross-functional collaboration with designers (Figma tokens) and product managers.`,
      deterministicAnswer:
        `I thrive in collaborative, high-velocity engineering environments:

• **Git & Version Control**: Structured feature branching, conventional commits, concise Pull Requests, and thorough peer code reviews.
• **Agile & Sprint Cycles**: Daily standups, sprint grooming, backlog prioritization, and iterative retro enhancements.
• **Design & Product Synergy**: Working closely with UI/UX designers using Figma design tokens and partnering with product managers to clarify edge cases before writing code.`,
    };
  }

  // 10. Interview Scheduling / Screening Call / Phone
  if (
    q.includes('schedule an interview') ||
    q.includes('schedule interview') ||
    q.includes('set up a call') ||
    q.includes('schedule a call') ||
    q.includes('screening call') ||
    q.includes('phone number') ||
    q.includes('interview') ||
    q.includes("let's talk") ||
    q.includes("let's chat") ||
    q.includes('calendar')
  ) {
    return {
      hasMatch: true,
      source: 'Interview Scheduling & Direct Contact',
      context: `Schedule Interview with Omkar: Email: omkaranarse1906@gmail.com, WhatsApp/Phone: +91 8356011246, LinkedIn: https://linkedin.com/in/omkar-anarse, Resume: /Omkar.pdf. Open to introductory screening calls and technical discussions.`,
      deterministicAnswer:
        `I would love to set up an introductory screening or technical interview!

• **Email**: [omkaranarse1906@gmail.com](mailto:omkaranarse1906@gmail.com)
• **WhatsApp / Direct Line**: [+91 8356011246](https://wa.me/918356011246)
• **LinkedIn**: [linkedin.com/in/omkar-anarse](https://linkedin.com/in/omkar-anarse)
• **Official Resume**: [Download PDF](/Omkar.pdf)

Feel free to email me a calendar invite or ping me directly on WhatsApp — I typically respond within a few hours!`,
    };
  }

  // 11. AI / ML / LangGraph / RAG Stack
  if (
    q.includes('langgraph') ||
    q.includes('rag') ||
    q.includes('chromadb') ||
    q.includes('vector db') ||
    q.includes('agentic') ||
    q.includes('multi-agent') ||
    q.includes('fastapi') ||
    q.includes('llm') ||
    q.includes('ai stack') ||
    q.includes('embeddings') ||
    q.includes('generative ai') ||
    q.includes('prompt') ||
    q.includes('langchain')
  ) {
    return {
      hasMatch: true,
      source: 'Applied AI & Machine Learning Stack',
      context: `AI & Machine Learning Engineering Stack: Python, FastAPI, LangGraph (multi-agent workflows, state machines, parallel research nodes), LangChain, RAG (Retrieval-Augmented Generation), ChromaDB vector store, Groq, OpenAI, Gemini LLM inference, PostgreSQL.`,
      deterministicAnswer:
        `My Applied AI engineering stack centers around production autonomy, state machines, and high-performance retrieval:

• **Agent Orchestration**: **LangGraph** for cyclical multi-agent workflows, stateful conditional branching, parallel worker nodes, and automated quality evaluation.
• **RAG & Vector Search**: Hybrid Retrieval-Augmented Generation, chunking algorithms, semantic similarity search, and **ChromaDB** vector storage.
• **Inference & Serving**: High-throughput **FastAPI** backends with asynchronous workers, streaming responses (SSE), and integrations with **Groq**, **OpenAI**, and **Gemini**.`,
    };
  }

  // 12. Mobile / Flutter / iOS Stack
  if (
    q.includes('flutter') ||
    q.includes('dart') ||
    q.includes('mobile stack') ||
    q.includes('ios') ||
    q.includes('swift') ||
    q.includes('swiftui') ||
    q.includes('cross-platform') ||
    q.includes('android') ||
    q.includes('mobile engineering')
  ) {
    return {
      hasMatch: true,
      source: 'Mobile Engineering Stack',
      context: `Mobile Engineering Stack: Flutter, Dart, Riverpod, BLoC, Clean Architecture, Swift, SwiftUI, UIKit, Firebase (Auth, Firestore, Cloud Functions, Messaging), responsive design tokens, MethodChannels for native features.`,
      deterministicAnswer:
        `My mobile development expertise is centered on production cross-platform systems:

• **Flutter & Dart**: 3+ years engineering production apps with **Riverpod**, **Clean Architecture**, custom animations, and responsive design token systems.
• **Native Bridges & iOS**: Experience with **Swift / SwiftUI**, writing MethodChannels for native camera, geofencing, and biometric device capabilities.
• **Cloud & Integrations**: Real-time Firebase Firestore, Auth, Cloud Messaging (FCM), push notifications, and resilient offline synchronization.`,
    };
  }

  // 13. Web & Full-Stack Development
  if (
    q.includes('next.js') ||
    q.includes('nextjs') ||
    q.includes('react') ||
    q.includes('typescript') ||
    q.includes('full-stack') ||
    q.includes('fullstack') ||
    q.includes('frontend') ||
    q.includes('tailwind') ||
    q.includes('node') ||
    q.includes('postgres') ||
    q.includes('sql')
  ) {
    return {
      hasMatch: true,
      source: 'Web & Full-Stack Systems',
      context: `Web & Full-Stack Stack: Next.js 15 (App Router), React 19, TypeScript, Node.js, Tailwind CSS, Vanilla CSS, PostgreSQL, Redis, Docker, RESTful microservices.`,
      deterministicAnswer:
        `My full-stack web stack is modern, fast, and type-safe:

• **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, and Vanilla CSS.
• **Backend & APIs**: Node.js, Python (FastAPI), RESTful microservices, and streaming endpoints.
• **Databases & DevOps**: PostgreSQL, Redis caching, ChromaDB vector store, Docker containers, and Git/GitHub CI/CD.`,
    };
  }

  // 14. Elevator Pitch / Tell me about yourself / Greetings
  if (
    q === 'hi' ||
    q === 'hello' ||
    q === 'hey' ||
    q.startsWith('hi ') ||
    q.startsWith('hello ') ||
    q.startsWith('hey ') ||
    q.includes('greeting') ||
    q.includes('introduce') ||
    q.includes('myself') ||
    q.includes('who are you') ||
    q.includes('tell me about yourself') ||
    q.includes('about yourself') ||
    q.includes('walk me through your resume') ||
    q.includes('elevator pitch')
  ) {
    const currentHour = new Date().getHours();
    const timeGreeting = currentHour >= 5 && currentHour < 12 ? 'Good morning' : currentHour >= 12 && currentHour < 17 ? 'Good afternoon' : 'Good evening';

    return {
      hasMatch: true,
      source: 'Elevator Pitch & Overview',
      context: `Omkar Anarse: AI & Mobile Systems Engineer with a B.Sc. in Computer Science and an MCA from Mumbai University (MU). Works across Flutter (State Management, Clean Architecture), Next.js 15, Node.js, and Agentic AI projects (LangGraph multi-agent systems, RAG pipelines, ChromaDB, FastAPI). Experience: Flutter developer at Metaphi + 3 years of part-time experience building production mobile apps at My Job Park.`,
      deterministicAnswer:
        `${timeGreeting}! 👋 Myself Omkar Anarse.

I am an **AI & Mobile Systems Engineer** based in Mumbai, India, with a B.Sc. in Computer Science and an MCA from Mumbai University (MU).

Over the past **3+ years**, I have focused on building production software that solves real operational problems:
• **Mobile Systems**: Flutter & Dart with Clean Architecture, Riverpod, and Firebase (production apps at **Metaphi** and **My Job Park**).
• **Applied AI Engineering**: Autonomous multi-agent pipelines with **LangGraph**, RAG with **ChromaDB**, and **FastAPI** microservices (**DataMind AI**).
• **Modern Full-Stack**: Next.js 15, TypeScript, React 19, Tailwind CSS, and PostgreSQL.

Feel free to ask me anything about my projects, architecture decisions, tech stack, notice period, or career opportunities!`,
    };
  }

  // 15. Attendephi specific query
  if (q.includes('attendephi') || (q.includes('attendance') && !q.includes('school'))) {
    return {
      hasMatch: true,
      source: 'Projects · Mobile Systems',
      context: `Attendephi is an attendance and check-in platform built with Flutter and Firebase, featuring QR-based check-in, location verification (geofencing), and face verification. Category: Mobile Systems · Authentication & Attendance.`,
      deterministicAnswer:
        'I built **Attendephi**, a mobile attendance and check-in platform using Flutter and Firebase. It features QR-based check-in, location verification (geofencing), and face verification to ensure tamper-proof attendance workflows.',
    };
  }

  // 16. DataMind AI
  if (q.includes('datamind') || (q.includes('csv') && q.includes('query'))) {
    return {
      hasMatch: true,
      source: 'Projects · AI Engineering',
      context: `DataMind AI: Upload any data (CSV, JSON, SQL) and interact with it through a conversational AI query layer — no dashboards, no manual charts. Features: Next.js 15, FastAPI, LangGraph multi-step reasoning agent, RAG pipeline with ChromaDB vector store, Groq LLM inference, PostgreSQL.`,
      deterministicAnswer:
        'I built **DataMind AI**, my flagship AI platform that lets users upload arbitrary datasets (CSV, JSON, SQL) and query them conversationally without manual dashboards. It features a FastAPI backend, ChromaDB vector store, and a LangGraph multi-step reasoning agent for conditional branching.',
    };
  }

  // 17. Blog Research Agent
  if (q.includes('blog') || (q.includes('agent') && !q.includes('mobile') && !q.includes('metaphi'))) {
    return {
      hasMatch: true,
      source: 'Projects · Multi-Agent AI',
      context: `Blog Research Agent: A LangGraph multi-agent pipeline that autonomously researches, drafts, evaluates quality, and tracks blog content. Key details: Multi-agent coordination with LangGraph, parallel research node execution, automated fact checking, and end-to-end observability.`,
      deterministicAnswer:
        'I built the **Blog Research Agent**, an autonomous LangGraph multi-agent pipeline that coordinates parallel research nodes, drafts content, conducts automated fact verification, and tracks production quality with full observability.',
    };
  }

  // 18. Hospital & Clinic Platform / Aarogya
  if (q.includes('hospital') || q.includes('clinic') || q.includes('aarogya') || (q.includes('doctor') && q.includes('app'))) {
    return {
      hasMatch: true,
      source: 'Projects · Healthcare Mobile',
      context: `Hospital & Clinic Platform (Aarogya): Three linked Flutter applications — patient, doctor, and clinic admin — sharing a unified backend, Clean Architecture, cohesive design tokens, appointment scheduling, and digital prescription workflows.`,
      deterministicAnswer:
        'I engineered the **Hospital & Clinic Platform (Aarogya)**, a suite of three linked Flutter applications (patient, doctor, and clinic admin) sharing a unified backend, Clean Architecture, and cohesive design tokens to manage the end-to-end clinical workflow.',
    };
  }

  // 19. Taskify
  if (q.includes('taskify') || (q.includes('task') && q.includes('management'))) {
    return {
      hasMatch: true,
      source: 'Projects · Product Engineering',
      context: `Taskify: A collaborative project management platform designed from concept to developer-ready specification with a resolved two-role data model, role-based access control, sprint tracking, and real-time status management.`,
      deterministicAnswer:
        'I designed and engineered **Taskify**, a collaborative project management platform with a resolved two-role data model, role-based access control, real-time board updates, and sprint tracking.',
    };
  }

  // 20. General Projects / What has Omkar built?
  if (
    q.includes('project') ||
    q.includes('built') ||
    q.includes('what has omkar built') ||
    q.includes('what have you built') ||
    q.includes('portfolio') ||
    q.includes('work done') ||
    q.includes('apps')
  ) {
    return {
      hasMatch: true,
      source: 'Flagship Projects',
      context: `Projects built by Omkar Anarse:
1. DataMind AI: Conversational data query layer with LangGraph, RAG, ChromaDB, and FastAPI.
2. Attendephi: Attendance and check-in platform built with Flutter and Firebase with QR, geofencing, and face verification.
3. Blog Research Agent: LangGraph multi-agent pipeline for autonomous research and drafting.
4. Hospital & Clinic Platform (Aarogya): 3 linked Flutter applications for clinical workflows.
5. Taskify: Collaborative project management platform with resolved two-role data model.`,
      deterministicAnswer:
        `Here are the flagship production-grade systems I have built across AI, mobile, and full-stack engineering:

• **DataMind AI**: Conversational data query layer with LangGraph, RAG, ChromaDB, and FastAPI.
• **Attendephi**: Mobile attendance platform with Flutter, Firebase, QR, and face verification.
• **Blog Research Agent**: LangGraph multi-agent autonomous research and drafting pipeline.
• **Hospital & Clinic Platform (Aarogya)**: Three linked Flutter applications for clinical healthcare workflows.
• **Taskify**: Real-time collaborative project management platform.`,
    };
  }

  // 21. Work Experience / Metaphi / My Job Park / Roles held
  if (
    q.includes('experience') ||
    q.includes('work history') ||
    q.includes('metaphi') ||
    q.includes('my job park') ||
    q.includes('employment') ||
    q.includes('previous company') ||
    q.includes('companies worked') ||
    q.includes('part-time') ||
    q.includes('part time')
  ) {
    return {
      hasMatch: true,
      source: 'Work Experience',
      context: `Work Experience of Omkar Anarse:
1. Metaphi (Current · 1+ Month): Flutter Developer. Architecting modular mobile interfaces with Clean Architecture and Riverpod; integrating asynchronous REST APIs; crafting fluid micro-animations.
2. My Job Park (3 Years · Part-time): Flutter Developer. Built cross-platform recruitment applications serving thousands of active users; implemented real-time messaging, notifications, and job search with Firebase.`,
      deterministicAnswer:
        `Here is a breakdown of my engineering experience:

1. **Metaphi** (Current · Flutter Developer):
   I architect modular mobile interfaces with Clean Architecture and Riverpod, integrate asynchronous REST APIs, and craft fluid micro-animations.

2. **My Job Park** (3 Years · Part-time Flutter Developer):
   I engineered cross-platform recruitment applications serving thousands of active users, implementing real-time messaging, notifications, and job search with Firebase.`,
    };
  }

  // 22. Tech Stack / Technologies / Skills
  if (
    q.includes('technolog') ||
    q.includes('tech stack') ||
    q.includes('skill') ||
    q.includes('stack') ||
    q.includes('tools')
  ) {
    return {
      hasMatch: true,
      source: 'Core Tech Stack',
      context: `Technical Skills of Omkar Anarse:
• AI & Backend: Python, FastAPI, LangChain, LangGraph, RAG (Retrieval-Augmented Generation), LLM APIs (Groq, OpenAI, Gemini), ChromaDB, PostgreSQL, Redis, REST APIs.
• Mobile: Flutter, Dart, State Management, Clean Architecture, Swift, SwiftUI, UIKit, Firebase, responsive design token systems.
• Web: Next.js 15 (App Router), Node.js, TypeScript, React 19, Tailwind CSS, Vanilla CSS, HTML5.
• Tools & DevOps: Git, GitHub, Docker, Firebase, Supabase, Linux.`,
      deterministicAnswer:
        `My core technical stack centers around three main domains:

• **AI & Backend**: Python, FastAPI, LangGraph multi-agent pipelines, RAG, ChromaDB, PostgreSQL, Redis, and Groq/LLM APIs.
• **Mobile Systems**: Flutter, Dart, State Management (Riverpod/BLoC), Clean Architecture, Swift, SwiftUI, and Firebase.
• **Web & Full-Stack**: Next.js 15, Node.js, TypeScript, React 19, Tailwind CSS, and Docker.`,
    };
  }

  // 23. Career Interests / Target Roles / What roles is he looking for?
  if (
    q.includes('role') ||
    q.includes('looking for') ||
    q.includes('target role') ||
    q.includes('hire') ||
    q.includes('opportunity') ||
    q.includes('open to') ||
    q.includes('job') ||
    q.includes('career')
  ) {
    return {
      hasMatch: true,
      source: 'Target Roles & Objectives',
      context: `Career Interests & Target Roles for Omkar Anarse:
• AI Engineer / AI Systems Engineer
• Machine Learning Systems Engineer
• Full-Stack AI Engineer
• Mobile Systems Engineer (Flutter, iOS / Swift)
• Product Engineer
Availability: Open to full-time roles, contracts, and engineering collaborations with teams building high-impact products.`,
      deterministicAnswer:
        `I am actively targeting engineering roles in:

• **AI Engineering / ML Systems Engineering**
• **Full-Stack AI Engineering**
• **Mobile Systems Engineering** (Flutter & iOS / Swift)
• **Product Engineering**

I am open to full-time roles, contracts, and high-impact engineering collaborations.`,
    };
  }

  // 24. Education / College / Degree / MCA / BSC
  if (
    q.includes('education') ||
    q.includes('college') ||
    q.includes('degree') ||
    q.includes('mca') ||
    q.includes('bsc') ||
    q.includes('bachelor') ||
    q.includes('master') ||
    q.includes('study') ||
    q.includes('university') ||
    q.includes('mu')
  ) {
    return {
      hasMatch: true,
      source: 'Education & Academics',
      context: `Education of Omkar Anarse:
• Degree: Master of Computer Applications (MCA) & Bachelor of Science in Computer Science (B.Sc. CS)
• University: Mumbai University (MU), Mumbai, India.
• Focus: Artificial Intelligence, Machine Learning Systems, Mobile & Distributed Architectures, and Full-Stack Engineering.`,
      deterministicAnswer:
        `I completed my **Bachelor of Science in Computer Science (B.Sc. CS)** and **Master of Computer Applications (MCA)** from **Mumbai University (MU)**. My academic and practical coursework emphasized AI/ML systems, distributed mobile architectures, algorithms, and full-stack software development.`,
    };
  }

  // 25. Contact / Reach out / WhatsApp / Email / Social Links
  if (
    q.includes('contact') ||
    q.includes('email') ||
    q.includes('whatsapp') ||
    q.includes('phone') ||
    q.includes('reach') ||
    q.includes('social') ||
    q.includes('github') ||
    q.includes('linkedin')
  ) {
    return {
      hasMatch: true,
      source: 'Direct Contact Channels',
      context: `Contact & Social Links for Omkar Anarse:
• Email: omkaranarse1906@gmail.com
• WhatsApp: +91 8356011246 (Direct chat: https://wa.me/918356011246)
• GitHub: https://github.com/Omkaranrse
• LinkedIn: https://linkedin.com/in/omkar-anarse
• Location: Mumbai, India`,
      deterministicAnswer:
        `You can reach me directly via:

• **Email**: [omkaranarse1906@gmail.com](mailto:omkaranarse1906@gmail.com)
• **WhatsApp**: [+91 8356011246](https://wa.me/918356011246)
• **LinkedIn**: [linkedin.com/in/omkar-anarse](https://linkedin.com/in/omkar-anarse)
• **GitHub**: [github.com/Omkaranrse](https://github.com/Omkaranrse)
• **Resume (PDF)**: [Download Resume](/Omkar.pdf)`,
    };
  }

  // 26. About Omkar / Who is Omkar? / Location / Bio
  if (
    q.includes('who is omkar') ||
    q.includes('about omkar') ||
    q.includes('bio') ||
    q.includes('background') ||
    q.includes('mumbai')
  ) {
    return {
      hasMatch: true,
      source: 'About Omkar Anarse',
      context: `About Omkar: Omkar Anarse is an AI & Mobile Systems Engineer with a B.Sc. in Computer Science and an MCA from Mumbai University (MU). Based in Mumbai, India. He builds production-grade software spanning AI/ML engineering (RAG pipelines, LangGraph multi-agent architectures), cross-platform mobile systems with Flutter & Dart, and modern full-stack web applications.`,
      deterministicAnswer:
        `I am **Omkar Anarse**, an AI & Mobile Systems Engineer based in Mumbai, India. I hold a B.Sc. CS and MCA from Mumbai University (MU). I specialize in building production-grade software across agentic AI pipelines (RAG, LangGraph multi-agent workflows), cross-platform Flutter/iOS apps, and modern full-stack web applications.`,
    };
  }

  // 27. Philosophy & Workflow
  if (q.includes('philosophy') || q.includes('workflow') || q.includes('how do you work') || q.includes('methodology')) {
    return {
      hasMatch: true,
      source: 'Engineering Methodology',
      context: `Engineering Philosophy & Workflow:
1. Understand: Define the problem, target users, and technical constraints before writing code.
2. Design: Shape the user experience and distributed system architecture simultaneously.
3. Build: Implement robust, maintainable code iteratively with clean boundaries.
4. Iterate: Continuously test, measure performance, and refine with real-world feedback.`,
      deterministicAnswer:
        `I follow a 4-stage engineering workflow:

1. **Understand**: Clarify problem, users, and constraints before coding.
2. **Design**: Shape UI/UX and system architecture together.
3. **Build**: Write modular, maintainable code with clean boundaries.
4. **Iterate**: Continuously test, measure performance, and refine with real-world feedback.`,
    };
  }

  // 28. General Availability
  if (q.includes('available') || q.includes('freelance') || q.includes('full-time') || q.includes('part-time') || q.includes('when can')) {
    return {
      hasMatch: true,
      source: 'Availability',
      context: `Availability: Omkar is currently open to full-time AI engineering roles, mobile & web systems projects, contracts, and product collaborations. Immediate / short notice.`,
      deterministicAnswer:
        `I am currently available on **immediate / short notice** and actively open to full-time AI/mobile engineering roles, contract projects, and high-impact product collaborations.`,
    };
  }

  // Fallback: No relevant portfolio context found
  return {
    hasMatch: false,
    context: '',
    source: '',
  };
}

// ─────────────────────────────────────────────────────────────
// POST Handler: Server-side validation, rate limiting, and grounded generation
// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Basic Server-Side Rate Limiting
  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1';

  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      { status: 429 }
    );
  }

  try {
    // 2. Server-side Request & Question Validation
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON request body' },
        { status: 400 }
      );
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Request body must be an object' },
        { status: 400 }
      );
    }

    const { question, history } = body as { question?: unknown; history?: unknown };

    if (typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question must be a string' },
        { status: 400 }
      );
    }

    const trimmedQuestion = question.trim();

    // Reject empty questions
    if (!trimmedQuestion) {
      return NextResponse.json(
        { error: 'Question cannot be empty' },
        { status: 400 }
      );
    }

    // Enforce maximum question length (1000 characters)
    if (trimmedQuestion.length > 1000) {
      return NextResponse.json(
        { error: 'Question exceeds maximum length of 1000 characters' },
        { status: 400 }
      );
    }

    // 3. Grounding & Knowledge Retrieval
    const knowledgeText = getAuthoritativeKnowledge();
    const retrieval = retrieveAuthoritativeContext(trimmedQuestion, knowledgeText);

    // Mandatory Rule: If NO relevant context exists in portfolio-knowledge.txt,
    // NEVER ask the LLM to guess. Return the exact fallback string immediately.
    if (!retrieval.hasMatch) {
      return NextResponse.json({
        answer: "I don't have that information in my portfolio knowledge base.",
      });
    }

    // 4. Grounded LLM Generation (if external API key is configured)
    const groqKey = process.env.GROQ_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (groqKey || openaiKey) {
      try {
        const endpoint = groqKey
          ? 'https://api.groq.com/openai/v1/chat/completions'
          : 'https://api.openai.com/v1/chat/completions';
        const apiKey = groqKey || openaiKey;
        const modelName = groqKey ? 'llama-3.1-8b-instant' : 'gpt-4o-mini';

        const llmResponse = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              {
                role: 'system',
                content: `You are Omkar Anarse, responding directly to visitors on your personal portfolio website in the first person ("I", "my", "myself", "I built", "my experience").
TONE & STYLE:
- Speak directly as Omkar: authentic, articulate, technically proficient, and warm.
- Never refer to Omkar in the third person ("Omkar is", "he has"). Always say "I am", "I built", "my experience".
- Format responses beautifully using clean markdown: use bold text for key names/tech, bullet points for lists, and concise paragraphs.

MANDATORY GROUNDING RULES:
1. You may answer ONLY using the provided portfolio context below.
2. If the answer cannot be supported by the provided context, do not guess. Reply strictly: "I don't have that information in my portfolio knowledge base, but feel free to ask me about my projects, stack, or experience!"
3. Do NOT hallucinate companies, years, salaries, technologies, or achievements.
4. Keep answers concise, clear, and professional.

PORTFOLIO CONTEXT:
"""
${retrieval.context}
"""`,
              },
              ...(Array.isArray(history) ? history.slice(-4) : []),
              { role: 'user', content: trimmedQuestion },
            ],
            temperature: 0.1,
            max_tokens: 300,
          }),
        });

        if (llmResponse.ok) {
          const llmData = await llmResponse.json();
          const rawAnswer: string = llmData.choices?.[0]?.message?.content?.trim() || '';
          if (rawAnswer) {
            return NextResponse.json({
              answer: rawAnswer,
              source: retrieval.source,
            });
          }
        }
      } catch (err) {
        console.warn('External LLM call failed or timed out; falling back to deterministic answer:', err);
      }
    }

    // 5. Default Deterministic Grounded Engine (offline & instantaneous)
    return NextResponse.json({
      answer: retrieval.deterministicAnswer || retrieval.context,
      source: retrieval.source,
    });
  } catch (error) {
    // Never expose internal stack traces to the client
    console.error('Unhandled error in /api/ask:', error);
    return NextResponse.json(
      {
        answer: "I don't have that information in my portfolio knowledge base.",
      },
      { status: 500 }
    );
  }
}
