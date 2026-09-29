import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { projects, type Project } from '@/data/projects';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ScrollProgressBar from '@/components/project-detail/ScrollProgressBar';
import {
  ProjectHero,
  Timeline,
  ArchitectureDiagram,
  DecisionAccordion,
  ChallengeCards,
  ResultPanel,
  TechStackMarquee,
} from '@/components/project-detail';
import {
  AlertCircle,
  Target,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Zap,
  Clock,
  Layers,
  FileSpreadsheet,
  Search,
} from 'lucide-react';

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return {
      title: 'Project Not Found — Omkar Anarse',
    };
  }

  return {
    title: `${project.title} — Case Study | Omkar Anarse`,
    description: project.shortDesc,
    openGraph: {
      title: `${project.title} — Case Study | Omkar Anarse`,
      description: project.shortDesc,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const projectIndex = projects.findIndex((p) => p.id === id);

  if (projectIndex === -1) {
    notFound();
  }

  const project: Project = projects[projectIndex];

  // Split problem statement to highlight the first sentence as a pull quote
  const problemSentences = project.problem.split(/(?<=[.?!])\s+/);
  const problemLead = problemSentences[0] || project.problem;
  const problemRemainder = problemSentences.slice(1).join(' ');

  return (
    <>
      {/* Scroll progress bar attached under navigation */}
      <ScrollProgressBar />

      {/* Global site navigation */}
      <Nav />

      <main
        id="main"
        className="relative min-h-screen bg-[#f8f8f5] text-[#111215] overflow-x-clip selection:bg-[#eb4c2a]/15 selection:text-[#111215]"
      >
        {/* Subtle crumpled paper texture overlay */}
        <div
          className="fixed inset-0 pointer-events-none opacity-35 mix-blend-multiply z-0 bg-repeat"
          style={{
            backgroundImage: "url('/textures/crumpled-paper.jpg')",
            backgroundSize: '800px 800px',
          }}
          aria-hidden="true"
        />

        {/* 1. Hero Section (Cleaned: no top pagination/back buttons, rich live UI showcase) */}
        <div className="relative z-10">
          <ProjectHero project={project} />
        </div>

        {/* Centered Symmetrical Content Container (Max-Width 1140px) */}
        <div className="relative z-10 max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 space-y-16 lg:space-y-24">
          {/* 2. Problem Section with Visual Architecture Contrast */}
          <section
            id="problem"
            aria-labelledby="problem-heading"
            className="scroll-mt-28 space-y-6"
          >
            <div className="space-y-1.5 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#eb4c2a]" />
                <span className="font-mono text-xs font-bold tracking-wider uppercase text-[#eb4c2a]">
                  01. THE PROBLEM
                </span>
              </div>
              <h2
                id="problem-heading"
                className="text-2xl sm:text-3xl font-extrabold text-[#111215] font-display tracking-tight"
              >
                Challenge &amp; Context
              </h2>
            </div>

            <div className="bg-white border border-[rgba(17,18,21,0.08)] rounded-[4px] p-6 sm:p-8 lg:p-10 shadow-[0_4px_20px_rgba(17,18,21,0.03)] hover:shadow-[0_10px_30px_rgba(17,18,21,0.06)] transition-all duration-300 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[rgba(17,18,21,0.06)] font-mono text-[10px] text-[#8a8c98] uppercase tracking-wider">
                <span>CORE BOTTLENECK</span>
                <span className="text-[#eb4c2a] font-bold">CRITICAL FRICTION POINT</span>
              </div>

              <blockquote className="border-l-3 border-[#eb4c2a] pl-5 sm:pl-7 my-2">
                <p className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-[#111215] leading-snug">
                  &ldquo;{problemLead}&rdquo;
                </p>
              </blockquote>

              {problemRemainder && (
                <p className="font-sans text-base text-[#565862] leading-relaxed pl-5 sm:pl-7">
                  {problemRemainder}
                </p>
              )}

              {/* Visual Workflow Contrast Diagram: Before vs After */}
              <div className="pt-6 border-t border-[rgba(17,18,21,0.08)]">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#565862] block mb-4">
                  OPERATIONAL PARADIGM COMPARISON
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Traditional Pain Point Workflow */}
                  <div className="p-5 rounded-[4px] bg-[#faf8f6] border border-[#ef4444]/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#ef4444] flex items-center gap-1.5">
                        <XCircle className="w-4 h-4" />
                        Traditional Dashboard Workflow
                      </span>
                      <span className="font-mono text-[10px] text-[#8a8c98]">Avg: 3 - 5 Hours</span>
                    </div>

                    <div className="space-y-2 text-xs font-mono text-[#565862]">
                      <div className="p-2 rounded bg-white border border-[rgba(17,18,21,0.06)] flex items-center gap-2">
                        <span className="text-[#8a8c98]">1.</span> Manual ETL, data cleanup, and column mapping
                      </div>
                      <div className="p-2 rounded bg-white border border-[rgba(17,18,21,0.06)] flex items-center gap-2">
                        <span className="text-[#8a8c98]">2.</span> Hand-craft SQL queries &amp; pivot aggregations
                      </div>
                      <div className="p-2 rounded bg-white border border-[rgba(17,18,21,0.06)] flex items-center gap-2">
                        <span className="text-[#8a8c98]">3.</span> Build rigid visual dashboard widgets
                      </div>
                      <div className="p-2 rounded bg-[#fff0f0] border border-[#ef4444]/20 text-[#ef4444] font-medium flex items-center gap-2">
                        <span className="font-bold">Result:</span> Fragile reports, high maintenance, stale data
                      </div>
                    </div>
                  </div>

                  {/* DataMind AI Modern Conversational Workflow */}
                  <div className="p-5 rounded-[4px] bg-[#f5faf8] border border-[#10b981]/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#10b981] flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        DataMind AI Conversational Pipeline
                      </span>
                      <span className="font-mono text-[10px] text-[#10b981] font-bold">Avg: &lt; 1.2 Seconds</span>
                    </div>

                    <div className="space-y-2 text-xs font-mono text-[#111215]">
                      <div className="p-2 rounded bg-white border border-[rgba(17,18,21,0.06)] flex items-center gap-2">
                        <span className="text-[#10b981] font-bold">1.</span> Drop any CSV / PDF / XLSX into upload zone
                      </div>
                      <div className="p-2 rounded bg-white border border-[rgba(17,18,21,0.06)] flex items-center gap-2">
                        <span className="text-[#10b981] font-bold">2.</span> Instant vectorization into local ChromaDB
                      </div>
                      <div className="p-2 rounded bg-white border border-[rgba(17,18,21,0.06)] flex items-center gap-2">
                        <span className="text-[#10b981] font-bold">3.</span> Ask plain-English questions via stream UI
                      </div>
                      <div className="p-2 rounded bg-[#e8f7f2] border border-[#10b981]/30 text-[#10b981] font-bold flex items-center gap-2">
                        <span>Outcome:</span> Instant verified insights with ground-truth citations
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Approach Section (Vertical Timeline) */}
          <section
            id="approach"
            aria-labelledby="approach-heading"
            className="scroll-mt-28 space-y-6"
          >
            <div className="space-y-1.5 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#eb4c2a]" />
                <span className="font-mono text-xs font-bold tracking-wider uppercase text-[#eb4c2a]">
                  02. ENGINEERING APPROACH
                </span>
              </div>
              <h2
                id="approach-heading"
                className="text-2xl sm:text-3xl font-extrabold text-[#111215] font-display tracking-tight"
              >
                Execution &amp; Phases
              </h2>
            </div>

            <div className="bg-white border border-[rgba(17,18,21,0.08)] rounded-[4px] p-6 sm:p-8 lg:p-10 shadow-[0_4px_20px_rgba(17,18,21,0.03)] hover:shadow-[0_10px_30px_rgba(17,18,21,0.06)] transition-all duration-300">
              <Timeline steps={project.approach} />
            </div>
          </section>

          {/* 4. Architecture Section (Interactive System Topology Diagram) */}
          <section
            id="architecture"
            aria-labelledby="architecture-heading"
            className="scroll-mt-28 space-y-6"
          >
            <div className="space-y-1.5 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#eb4c2a]" />
                <span className="font-mono text-xs font-bold tracking-wider uppercase text-[#eb4c2a]">
                  03. ARCHITECTURE &amp; DATA FLOW
                </span>
              </div>
              <h2
                id="architecture-heading"
                className="text-2xl sm:text-3xl font-extrabold text-[#111215] font-display tracking-tight"
              >
                System Topology &amp; Pipelines
              </h2>
            </div>

            <ArchitectureDiagram
              nodes={project.architecture}
              edges={project.edges}
            />
          </section>

          {/* 5. Key Technical Decisions (ADR Matrix) */}
          <section
            id="decisions"
            aria-labelledby="decisions-heading"
            className="scroll-mt-28 space-y-6"
          >
            <div className="space-y-1.5 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#eb4c2a]" />
                <span className="font-mono text-xs font-bold tracking-wider uppercase text-[#eb4c2a]">
                  04. KEY TECHNICAL DECISIONS
                </span>
              </div>
              <h2
                id="decisions-heading"
                className="text-2xl sm:text-3xl font-extrabold text-[#111215] font-display tracking-tight"
              >
                Architectural Trade-offs (ADRs)
              </h2>
            </div>

            <DecisionAccordion decisions={project.techDecisions} />
          </section>

          {/* 6. Challenges Section */}
          <section
            id="challenges"
            aria-labelledby="challenges-heading"
            className="scroll-mt-28 space-y-6"
          >
            <div className="space-y-1.5 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#eb4c2a]" />
                <span className="font-mono text-xs font-bold tracking-wider uppercase text-[#eb4c2a]">
                  05. THE HARD PART &amp; CHALLENGES
                </span>
              </div>
              <h2
                id="challenges-heading"
                className="text-2xl sm:text-3xl font-extrabold text-[#111215] font-display tracking-tight"
              >
                Obstacles &amp; Solutions
              </h2>
            </div>

            <ChallengeCards challenges={project.challenges} />
          </section>

          {/* 7. Result & Impact Section (With Live Verification Sandbox) */}
          <section
            id="result"
            aria-labelledby="result-heading"
            className="scroll-mt-28 space-y-6"
          >
            <div className="space-y-1.5 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#eb4c2a]" />
                <span className="font-mono text-xs font-bold tracking-wider uppercase text-[#eb4c2a]">
                  06. RESULT &amp; IMPACT
                </span>
              </div>
              <h2
                id="result-heading"
                className="text-2xl sm:text-3xl font-extrabold text-[#111215] font-display tracking-tight"
              >
                Outcomes &amp; Verification
              </h2>
            </div>

            <ResultPanel
              result={project.result}
              metrics={project.metrics}
              media={project.media}
            />
          </section>

          {/* 8. Technology Stack (Marquee / Grid) */}
          <section
            id="stack"
            aria-labelledby="stack-heading"
            className="scroll-mt-28 space-y-6"
          >
            <div className="space-y-1.5 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#eb4c2a]" />
                <span className="font-mono text-xs font-bold tracking-wider uppercase text-[#eb4c2a]">
                  07. TECHNOLOGY STACK
                </span>
              </div>
              <h2
                id="stack-heading"
                className="text-2xl sm:text-3xl font-extrabold text-[#111215] font-display tracking-tight"
              >
                Core Technologies &amp; Tooling
              </h2>
            </div>

            <TechStackMarquee stack={project.stack} />
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
