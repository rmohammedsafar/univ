import React from 'react';

export default function Hero({ heroConfig, onExplorePrograms, onApplyNow }) {
  return (
    <section className="hero-section">
      <div className="hero-badge">
        <span>{heroConfig?.badge}</span>
      </div>

      <h1 className="hero-title">
        {heroConfig?.title}
      </h1>

      <p className="hero-desc">
        {heroConfig?.description}
      </p>

      <div className="hero-cta-group">
        <a href="#programs" className="btn btn-gold" onClick={onExplorePrograms} style={{ padding: '14px 28px', fontSize: '15px' }}>
          📑 Explore 100% Online Programs
        </a>
        <a href="#applySection" className="btn btn-maroon" onClick={onApplyNow} style={{ padding: '14px 28px', fontSize: '15px' }}>
          🎓 Apply Now
        </a>
      </div>

      <div className="hero-stats-row">
        {heroConfig?.stats?.map((stat, idx) => (
          <div className="stat-card" key={`hero-stat-${idx}`}>
            <div className="stat-num">{stat.num}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
