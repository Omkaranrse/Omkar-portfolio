import { projects } from '@/data/projects';
import ProjectCard from './ProjectCard';

export default function Work() {
  return (
    <section id="work" className="work-section grid-bg">
      <div className="wrap">
        {/* Editorial section header */}
        <header className="work-header reveal">
          <div className="work-header-top">
            <span className="work-eyebrow">Case Studies</span>
            <span className="work-count">0{projects.length} PROJECTS</span>
          </div>
          <h2 className="work-title">Featured systems &amp; engineering work.</h2>
        </header>

        {/* Project list */}
        <div className="work-list">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
