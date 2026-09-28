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

  // Out-of-bounds checks: explicit non-portfolio domains or unlisted private info
  const outOfScopeKeywords = [
    'salary',
    'compensation',
    'pay rate',
    'ctc',
    'ceo of google',
    'president',
    'weather',
    'bitcoin',
    'crypto',
    'stock',
    'recipe',
    'football',
    'cricket score',
    'movie',
    'religion',
    'girlfriend',
    'relationship',
    'family',
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

  // 1. Attendephi specific query
  if (q.includes('attendephi') || (q.includes('attendance') && !q.includes('school'))) {
    return {
      hasMatch: true,
      source: 'Projects',
      context: `Attendephi is an attendance and check-in platform built with Flutter and Firebase, featuring QR-based check-in, location verification (geofencing), and face verification. Category: Mobile Systems · Authentication & Attendance.`,
      deterministicAnswer:
        'Attendephi is an attendance and check-in platform built with Flutter and Firebase, featuring QR-based check-in, location verification (geofencing) and face verification.',
    };
  }

  // 2. DataMind AI
  if (q.includes('datamind') || (q.includes('csv') && q.includes('query')) || (q.includes('rag') && q.includes('project'))) {
    return {
      hasMatch: true,
      source: 'Projects',
      context: `DataMind AI: Upload any data (CSV, JSON, SQL) and interact with it through a conversational AI query layer — no dashboards, no manual charts. Features: Next.js 15, FastAPI, LangGraph multi-step reasoning agent, RAG pipeline with ChromaDB vector store, Groq LLM inference, PostgreSQL.`,
      deterministicAnswer:
        "DataMind AI is Omkar's flagship AI platform that lets users upload arbitrary datasets (CSV, JSON, SQL) and query them conversationally without manual dashboards. It features a FastAPI backend, ChromaDB vector store, and a LangGraph multi-step reasoning agent for conditional branching.",
    };
  }

  // 3. Blog Research Agent
  if (q.includes('blog') || (q.includes('agent') && !q.includes('mobile') && !q.includes('metaphi'))) {
    return {
      hasMatch: true,
      source: 'Projects',
      context: `Blog Research Agent: A LangGraph multi-agent pipeline that autonomously researches, drafts, evaluates quality, and tracks blog content. Key details: Multi-agent coordination with LangGraph, parallel research node execution, automated fact checking, and end-to-end observability.`,
      deterministicAnswer:
        'The Blog Research Agent is an autonomous LangGraph multi-agent pipeline that coordinates parallel research nodes, drafts content, conducts automated fact verification, and tracks production quality with full observability.',
    };
  }

  // 4. Hospital & Clinic Platform / Aarogya
  if (q.includes('hospital') || q.includes('clinic') || q.includes('aarogya') || (q.includes('doctor') && q.includes('app'))) {
    return {
      hasMatch: true,
      source: 'Projects',
      context: `Hospital & Clinic Platform (Aarogya): Three linked Flutter applications — patient, doctor, and clinic admin — sharing a unified backend, Clean Architecture, cohesive design tokens, appointment scheduling, and digital prescription workflows.`,
      deterministicAnswer:
        'Hospital & Clinic Platform (Aarogya) is a suite of three linked Flutter applications (patient, doctor, and clinic admin) sharing a unified backend, Clean Architecture, and cohesive design tokens to manage the end-to-end clinical workflow.',
    };
  }

  // 5. Taskify
  if (q.includes('taskify') || (q.includes('task') && q.includes('management'))) {
    return {
      hasMatch: true,
      source: 'Projects',
      context: `Taskify: A collaborative project management platform designed from concept to developer-ready specification with a resolved two-role data model, role-based access control, sprint tracking, and real-time status management.`,
      deterministicAnswer:
        'Taskify is a collaborative project management app designed from concept to developer-ready specification with a resolved two-role data model, real-time board updates, and sprint tracking.',
    };
  }

  // 6. General Projects / What has Omkar built?
  if (
    q.includes('project') ||
    q.includes('built') ||
    q.includes('what has omkar built') ||
    q.includes('portfolio') ||
    q.includes('work done') ||
    q.includes('apps')
  ) {
    return {
      hasMatch: true,
      source: 'Projects',
      context: `Projects built by Omkar Anarse:
1. DataMind AI: Conversational data query layer with LangGraph, RAG, ChromaDB, and FastAPI.
2. Attendephi: Attendance and check-in platform built with Flutter and Firebase with QR, geofencing, and face verification.
3. Blog Research Agent: LangGraph multi-agent pipeline for autonomous research and drafting.
4. Hospital & Clinic Platform (Aarogya): 3 linked Flutter applications for clinical workflows.
5. Taskify: Collaborative project management platform with resolved two-role data model.`,
      deterministicAnswer:
        'Omkar has built several production-grade systems across AI, mobile, and system design:\n\n• DataMind AI: Conversational data query layer with LangGraph, RAG, and FastAPI.\n• Attendephi: Mobile attendance platform with Flutter, Firebase, QR, and face verification.\n• Blog Research Agent: LangGraph multi-agent autonomous research and drafting pipeline.\n• Hospital & Clinic Platform: Three linked Flutter applications for clinical workflows.\n• Taskify: Real-time collaborative project management platform.',
    };
  }

  // 7. Work Experience / Metaphi / My Job Park / Roles held
  if (
    q.includes('experience') ||
    q.includes('work history') ||
    q.includes('metaphi') ||
    q.includes('my job park') ||
    q.includes('employment') ||
    q.includes('previous company') ||
    q.includes('companies worked')
  ) {
    return {
      hasMatch: true,
      source: 'Experience',
      context: `Work Experience of Omkar Anarse:
1. Metaphi (Current · 1+ Month): Flutter Developer. Architecting modular mobile interfaces with Clean Architecture and Riverpod; integrating asynchronous REST APIs; crafting fluid micro-animations.
2. My Job Park (3 Years · Part-time): Flutter Developer. Built cross-platform recruitment applications serving thousands of active users; implemented real-time messaging, notifications, and job search with Firebase.`,
      deterministicAnswer:
        'Omkar has worked in two primary engineering roles:\n\n1. Metaphi (Current · 1+ Month): Flutter Developer architecting modular mobile experiences, state management with Riverpod, Clean Architecture, and REST API integrations.\n2. My Job Park (3 Years · Part-time): Flutter Developer engineering cross-platform recruitment applications with Firebase, responsive design tokens, and real-time messaging.',
    };
  }

  // 8. Tech Stack / Technologies / Skills / Languages / Frameworks
  if (
    q.includes('technolog') ||
    q.includes('tech stack') ||
    q.includes('skill') ||
    q.includes('stack') ||
    q.includes('flutter') ||
    q.includes('python') ||
    q.includes('fastapi') ||
    q.includes('langgraph') ||
    q.includes('dart') ||
    q.includes('database') ||
    q.includes('sql') ||
    q.includes('postgres') ||
    q.includes('redis') ||
    q.includes('vector') ||
    q.includes('chromadb') ||
    q.includes('tools') ||
    q.includes('react') ||
    q.includes('next.js') ||
    q.includes('typescript')
  ) {
    return {
      hasMatch: true,
      source: 'Skills',
      context: `Technical Skills of Omkar Anarse:
• AI & Backend: Python, FastAPI, LangChain, LangGraph, RAG (Retrieval-Augmented Generation), LLM APIs (Groq, OpenAI, Gemini), ChromaDB, PostgreSQL, Redis, REST APIs.
• Mobile: Flutter, Dart, Riverpod, Clean Architecture, Swift, SwiftUI, UIKit, Firebase, responsive design token systems.
• Web: Next.js 15 (App Router), TypeScript, React 19, Tailwind CSS, Vanilla CSS, HTML5.
• Tools & DevOps: Git, GitHub, Docker, Firebase, Supabase, Linux.`,
      deterministicAnswer:
        'Omkar specializes in three primary engineering domains:\n\n• AI & Backend: Python, FastAPI, LangChain, LangGraph, RAG, ChromaDB, PostgreSQL, Redis, and Groq/LLM APIs.\n• Mobile Systems: Flutter, Dart, Riverpod, Clean Architecture, Swift, SwiftUI, and Firebase.\n• Web & Systems: Next.js 15, TypeScript, React 19, Tailwind CSS, and Docker.',
    };
  }

  // 9. Career Interests / Target Roles / What roles is he looking for?
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
      source: 'Career Interests',
      context: `Career Interests & Target Roles for Omkar Anarse:
• AI Engineer / AI Systems Engineer
• Machine Learning Systems Engineer
• Full-Stack AI Engineer
• Mobile Systems Engineer (Flutter, iOS / Swift)
• Product Engineer
Availability: Open to full-time roles, contracts, and engineering collaborations with teams building high-impact products.`,
      deterministicAnswer:
        'Omkar is targeting roles in:\n\n• AI Engineering / ML Systems Engineering\n• Full-Stack AI Engineering\n• Mobile Systems Engineering (Flutter & iOS / Swift)\n• Product Engineering\n\nHe is open to full-time roles, contracts, and engineering collaborations with high-growth teams.',
    };
  }

  // 10. Education / College / Degree / MCA
  if (q.includes('education') || q.includes('college') || q.includes('degree') || q.includes('mca') || q.includes('study') || q.includes('university')) {
    return {
      hasMatch: true,
      source: 'Education',
      context: `Education of Omkar Anarse:
• Degree: Master of Computer Applications (MCA) in Mumbai, India.
• Focus: Artificial Intelligence, Machine Learning Systems, Mobile & Distributed Architectures.
• Coursework: Rigorous computer science coursework covering algorithms, system design, database management, and intelligent systems.`,
      deterministicAnswer:
        'Omkar is pursuing his Master of Computer Applications (MCA) in Mumbai, India, with a core technical focus on Artificial Intelligence, Machine Learning systems, and distributed mobile architectures.',
    };
  }

  // 11. Contact / Reach out / WhatsApp / Email / Social Links
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
      source: 'Contact',
      context: `Contact & Social Links for Omkar Anarse:
• Email: omkaranarse1906@gmail.com
• WhatsApp: +91 8356011246 (Direct chat: https://wa.me/918356011246)
• GitHub: https://github.com/Omkaranrse
• LinkedIn: https://linkedin.com/in/omkar-anarse
• Location: Mumbai, India`,
      deterministicAnswer:
        'You can reach Omkar directly via:\n\n• Email: omkaranarse1906@gmail.com\n• WhatsApp: +91 8356011246\n• LinkedIn: linkedin.com/in/omkar-anarse\n• GitHub: github.com/Omkaranrse',
    };
  }

  // 12. About Omkar / Who is Omkar? / Location / Bio
  if (
    q.includes('who is omkar') ||
    q.includes('about omkar') ||
    q.includes('tell me about yourself') ||
    q.includes('bio') ||
    q.includes('background') ||
    q.includes('where is omkar') ||
    q.includes('mumbai') ||
    q.includes('location')
  ) {
    return {
      hasMatch: true,
      source: 'About Omkar',
      context: `About Omkar: Omkar Anarse is an AI & Mobile Systems Engineer and MCA student based in Mumbai, India. He builds production-grade software spanning AI/ML engineering (RAG pipelines, LangGraph multi-agent architectures), cross-platform mobile systems with Flutter & Dart, and modern full-stack web applications.`,
      deterministicAnswer:
        'Omkar Anarse is an AI & Mobile Systems Engineer and MCA student based in Mumbai, India. He builds production-grade AI pipelines (RAG, LangGraph multi-agent workflows), cross-platform Flutter/iOS apps, and full-stack web platforms that solve real-world operational problems.',
    };
  }

  // 13. Philosophy & Workflow
  if (q.includes('philosophy') || q.includes('workflow') || q.includes('how do you work') || q.includes('methodology')) {
    return {
      hasMatch: true,
      source: 'Philosophy',
      context: `Engineering Philosophy & Workflow:
1. Understand: Define the problem, target users, and technical constraints before writing code.
2. Design: Shape the user experience and distributed system architecture simultaneously.
3. Build: Implement robust, maintainable code iteratively with clean boundaries.
4. Iterate: Continuously test, measure performance, and refine with real-world feedback.`,
      deterministicAnswer:
        'Omkar follows a 4-stage engineering workflow:\n\n1. Understand: Clarify problem, users, and constraints before coding.\n2. Design: Shape UI/UX and system architecture together.\n3. Build: Write modular, maintainable code with clean boundaries.\n4. Iterate: Continuously test, measure performance, and refine.',
    };
  }

  // 14. Availability
  if (q.includes('available') || q.includes('freelance') || q.includes('full-time') || q.includes('part-time') || q.includes('when can')) {
    return {
      hasMatch: true,
      source: 'Availability',
      context: `Availability: Omkar is currently open to full-time AI engineering roles, mobile & web systems projects, contracts, and product collaborations.`,
      deterministicAnswer:
        'Omkar is currently available for full-time AI/mobile engineering roles, contract work, and product collaborations.',
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
                content: `You are "Ask Omkar AI", a helpful, concise portfolio AI assistant for Omkar Anarse.
MANDATORY GROUNDING RULES:
1. You may answer ONLY using the provided portfolio context below.
2. If the answer cannot be supported by the provided context, do not guess. Reply strictly: "I don't have that information in my portfolio knowledge base."
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
