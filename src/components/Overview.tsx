import { projects } from '@/data/projects';

export default function Overview() {
  return (
    <section id="overview" className="grid-bg">
      <div className="wrap">
        <header className="overview-header reveal">
          <span className="overview-eyebrow">Index</span>
          <h2 className="overview-title">Selected Projects.</h2>
        </header>

        <div className="overview-grid">
          {projects.map((p) => (
            <a href={`#${p.id}`} className="ov-card reveal" key={p.id}>
              <div className="ov-card-top">
                <div className="ov-thumb" style={{ background: p.thumbColor }}>
                  {p.thumbLabel}
                </div>
                <span className="ov-num">{p.number}</span>
              </div>
              <h3>{p.title}</h3>
              <p>{p.meta.split('•')[0].trim()}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
