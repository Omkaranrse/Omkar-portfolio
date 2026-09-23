import { projects } from '@/data/projects';

export default function Overview() {
  return (
    <section id="overview" className="grid-bg">
      <div className="wrap">
        <h2 className="reveal">What I&apos;ve been building.</h2>
        <div className="overview-grid">
          {projects.map((p) => (
            <div className="ov-card reveal" key={p.id}>
              <div
                className="ov-thumb"
                style={{ background: p.thumbColor }}
              >
                {p.thumbLabel}
              </div>
              <span className="num">{p.number.replace('.', '')}</span>
              <h3>{p.title}</h3>
              <p>{p.meta.split('•')[0].trim()}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
