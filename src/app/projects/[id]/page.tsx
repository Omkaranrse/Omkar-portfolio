import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { projects, type Project } from '@/data/projects';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ScrollProgressBar from '@/components/project-detail/ScrollProgressBar';
import {
  ProjectHero,
  SectionToc,
  Timeline,
  ArchitectureDiagram,
  DecisionAccordion,
  ChallengeCards,
  ResultPanel,
  TechStackMarquee,
  ProjectPager,
} from '@/components/project-detail';
import { AlertCircle, Target, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

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
  const nextProject = projects[(projectIndex + 1) % projects.length];
  const prevProject = projects[(projectIndex - 1 + projects.length) % projects.length];

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

        {/* 1. Hero Section */}
        <div className="relative z-10">
          <ProjectHero
            project={project}
            prevProject={prevProject}
            nextProject={nextProject}
          />
        </div>

        {/* 12-Column Centered Container (Max-Width 1200px) */}
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14">
            {/* 2. Sticky Left Mini Table of Contents (3 cols on md+, hidden <768px) */}
            <div className="hidden md:block md:col-span-3">
              <SectionToc />
            </div>

            {/* Deep Dive Content Sections (9 cols on md+, single col on mobile) */}
            <div className="col-span-1 md:col-span-9 space-y-16 lg:space-y-24 min-w-0">
              {/* 3. Problem Section */}
              <section
                id="problem"
                aria-labelledby="problem-heading"
                className="scroll-mt-28 space-y-4"
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

                <div className="bg-white border border-[rgba(17,18,21,0.08)] rounded-[2px] p-6 sm:p-8 lg:p-10 shadow-[0_4px_20px_rgba(17,18,21,0.03)] hover:shadow-[0_10px_30px_rgba(17,18,21,0.06)] hover:-translate-y-0.5 transition-all duration-300">
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-[rgba(17,18,21,0.06)] font-mono text-[10px] text-[#8a8c98] uppercase tracking-wider">
                    <span>CORE BOTTLENECK</span>
                    <span className="text-[#eb4c2a] font-bold">CRITICAL FRICTION POINT</span>
                  </div>

                  <blockquote className="border-l-3 border-[#eb4c2a] pl-5 sm:pl-7 my-3">
                    <p className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-[#111215] leading-snug">
                      &ldquo;{problemLead}&rdquo;
                    </p>
                  </blockquote>

                  {problemRemainder && (
                    <p className="mt-6 font-sans text-base text-[#565862] leading-relaxed pl-5 sm:pl-7">
                      {problemRemainder}
                    </p>
                  )}
                </div>
              </section>

              {/* 4. Approach Section (Vertical Timeline) */}
              <section
                id="approach"
                aria-labelledby="approach-heading"
                className="scroll-mt-28 space-y-5"
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

                <div className="bg-white border border-[rgba(17,18,21,0.08)] rounded-[2px] p-6 sm:p-8 lg:p-10 shadow-[0_4px_20px_rgba(17,18,21,0.03)] hover:shadow-[0_10px_30px_rgba(17,18,21,0.06)] transition-all duration-300">
                  <Timeline steps={project.approach} />
                </div>
              </section>

              {/* 5. Architecture Section */}
              <section
                id="architecture"
                aria-labelledby="architecture-heading"
                className="scroll-mt-28 space-y-5"
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
                    System Topology
                  </h2>
                </div>

                <ArchitectureDiagram
                  nodes={project.architecture}
                  edges={project.edges}
                />
              </section>

              {/* 6. Key Technical Decisions (Accordion) */}
              <section
                id="decisions"
                aria-labelledby="decisions-heading"
                className="scroll-mt-28 space-y-5"
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
                    Architectural Trade-offs
                  </h2>
                </div>

                <DecisionAccordion decisions={project.techDecisions} />
              </section>

              {/* 7. Challenges Section */}
              <section
                id="challenges"
                aria-labelledby="challenges-heading"
                className="scroll-mt-28 space-y-5"
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

              {/* 8. Result & Impact Section */}
              <section
                id="result"
                aria-labelledby="result-heading"
                className="scroll-mt-28 space-y-5"
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

              {/* 9. Technology Stack (Marquee / Grid) */}
              <section
                id="stack"
                aria-labelledby="stack-heading"
                className="scroll-mt-28 space-y-5"
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
          </div>

          {/* 10. Footer Prev/Next Cards + All Projects Index Strip */}
          <ProjectPager
            currentProject={project}
            prevProject={prevProject}
            nextProject={nextProject}
            allProjects={projects}
          />
        </div>
      </main>

      <Footer />
    </>
  );
}
