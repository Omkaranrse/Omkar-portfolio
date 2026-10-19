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
  ProjectPager,
} from '@/components/project-detail';

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamicParams = true;

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
  const prevProject = projects[(projectIndex - 1 + projects.length) % projects.length];
  const nextProject = projects[(projectIndex + 1) % projects.length];

  // Split problem statement to highlight the first sentence as a pull quote
  const problemSentences = project.problem.split(/(?<=[.?!])\s+/);
  const problemLead = problemSentences[0] || project.problem;
  const problemRemainder = problemSentences.slice(1).join(' ');

  return (
    <>
      {/* Scroll progress bar */}
      <ScrollProgressBar />

      {/* Navigation */}
      <Nav />

      <main
        id="main"
        className="relative min-h-screen bg-[#f8f8f5] text-[#111215] overflow-x-clip selection:bg-[#eb4c2a]/15 selection:text-[#111215]"
      >
        {/* Subtle paper texture overlay */}
        <div
          className="fixed inset-0 pointer-events-none opacity-30 mix-blend-multiply z-0 bg-repeat"
          style={{
            backgroundImage: "url('/textures/crumpled-paper.webp')",
            backgroundSize: '800px 800px',
          }}
          aria-hidden="true"
        />

        {/* ─── Section 1: Hero ─── */}
        <div className="relative z-10">
          <ProjectHero project={project} />
        </div>

        {/* ─── Section 2: The Story (Problem + Approach) ─── */}
        <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <section
            id="story"
            aria-labelledby="story-heading"
            className="space-y-12"
          >
            {/* Section header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#eb4c2a]" />
                <span className="font-mono text-xs font-bold tracking-wider uppercase text-[#eb4c2a]">
                  The Story
                </span>
              </div>
              <h2
                id="story-heading"
                className="text-2xl sm:text-3xl font-extrabold text-[#111215] font-display tracking-tight"
              >
                Problem &amp; Approach
              </h2>
            </div>

            {/* Two-column layout: Problem left, Approach right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Problem narrative */}
              <div className="space-y-5">
                <blockquote className="border-l-[3px] border-[#eb4c2a] pl-5">
                  <p className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-[#111215] leading-snug">
                    &ldquo;{problemLead}&rdquo;
                  </p>
                </blockquote>

                {problemRemainder && (
                  <p className="font-sans text-base text-[#565862] leading-relaxed pl-5">
                    {problemRemainder}
                  </p>
                )}

                {/* Quick paragraph descriptions */}
                {project.paragraphs.map((para, idx) => (
                  <p
                    key={idx}
                    className="font-sans text-sm text-[#6b6d78] leading-relaxed"
                  >
                    {para}
                  </p>
                ))}
              </div>

              {/* Approach timeline */}
              <div className="bg-white border border-[rgba(17,18,21,0.08)] rounded-2xl p-5 sm:p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[rgba(17,18,21,0.06)]">
                  <span className="w-2 h-2 rounded-full bg-[#eb4c2a]" />
                  <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-[#111215]">
                    How I built it
                  </span>
                </div>
                <Timeline steps={project.approach} />
              </div>
            </div>
          </section>
        </div>

        {/* ─── Section 3: How It Works (Architecture + Decisions) ─── */}
        <div className="relative z-10 bg-[#0e1015] py-16 lg:py-24">
          {/* Subtle dot grid for dark section */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* Section header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#eb4c2a]" />
                <span className="font-mono text-xs font-bold tracking-wider uppercase text-[#eb4c2a]">
                  Under the hood
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
                Architecture &amp; Key Decisions
              </h2>
            </div>

            {/* Architecture diagram */}
            <ArchitectureDiagram
              nodes={project.architecture}
              edges={project.edges}
            />

            {/* Tech decisions */}
            <div className="space-y-4">
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[#8a8c98]">
                Why these choices?
              </h3>
              <DecisionAccordion decisions={project.techDecisions} variant="dark" />
            </div>
          </div>
        </div>

        {/* ─── Section 4: Challenges & Results ─── */}
        <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 space-y-16">
          {/* Challenges */}
          <section
            id="challenges"
            aria-labelledby="challenges-heading"
            className="space-y-6"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#eb4c2a]" />
                <span className="font-mono text-xs font-bold tracking-wider uppercase text-[#eb4c2a]">
                  The hard parts
                </span>
              </div>
              <h2
                id="challenges-heading"
                className="text-2xl sm:text-3xl font-extrabold text-[#111215] font-display tracking-tight"
              >
                Challenges &amp; Solutions
              </h2>
            </div>

            <ChallengeCards challenges={project.challenges} />
          </section>

          {/* Results */}
          <section
            id="result"
            aria-labelledby="result-heading"
            className="space-y-6"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#eb4c2a]" />
                <span className="font-mono text-xs font-bold tracking-wider uppercase text-[#eb4c2a]">
                  Outcome
                </span>
              </div>
              <h2
                id="result-heading"
                className="text-2xl sm:text-3xl font-extrabold text-[#111215] font-display tracking-tight"
              >
                Results &amp; Impact
              </h2>
            </div>

            <ResultPanel
              result={project.result}
              metrics={project.metrics}
              media={project.media}
            />
          </section>
        </div>

        {/* ─── Section 5: Tech Stack + Project Navigation ─── */}
        <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24 space-y-8">
          <section
            id="stack"
            aria-labelledby="stack-heading"
            className="space-y-6"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#eb4c2a]" />
                <span className="font-mono text-xs font-bold tracking-wider uppercase text-[#eb4c2a]">
                  Tech Stack
                </span>
              </div>
              <h2
                id="stack-heading"
                className="text-2xl sm:text-3xl font-extrabold text-[#111215] font-display tracking-tight"
              >
                Built With
              </h2>
            </div>

            <TechStackMarquee stack={project.stack} />
          </section>

          {/* Project Navigation */}
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
