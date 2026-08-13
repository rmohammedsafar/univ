import React, { useState } from 'react';

export default function CampusTour({ tourSlides = [] }) {
  const [activeTab, setActiveTab] = useState(tourSlides[0]?.id || 'library');
  
  // Use the active tab or fallback to the first available slide
  const room = tourSlides.find(r => r.id === activeTab) || tourSlides[0];

  if (!room) return null; // Safe fallback if no slides exist

  return (
    <section className="section-wrapper" id="campusTour">
      <div className="section-header">
        <span className="section-tag">100% Digital Environment</span>
        <h2 className="section-title">VIRTUAL CAMPUS TOUR</h2>
        <p className="section-desc">
          Experience our state-of-the-art virtual university infrastructure. Explore the Digital Research Library, Virtual Lecture Halls, Student Portal, and USA Administration Offices.
        </p>
      </div>

      {/* INTERACTIVE ROOM TABS */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px', justifyContent: 'center' }}>
        {tourSlides.map(r => (
          <button
            key={r.id}
            className={`btn ${activeTab === r.id ? 'btn-gold' : 'btn-outline'}`}
            style={{ padding: '8px 16px', fontSize: '13px', transition: 'all 0.25s' }}
            onClick={() => setActiveTab(r.id)}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* ROOM DISPLAY */}
      <div className="scroll-reveal" style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-gold)',
        borderRadius: '16px',
        overflow: 'hidden',
        padding: '28px',
      }}>
        <div className="tour-grid-2">

          {/* Info Column */}
          <div>
            <h3 style={{ fontSize: '22px', color: 'var(--gold-light)', fontFamily: 'var(--font-serif)', marginBottom: '12px' }}>
              {room.title}
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '20px' }}>
              {room.desc}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'var(--bg-dark)', padding: '16px', borderRadius: '12px', marginBottom: '22px' }}>
              {room.stats.map(s => (
                <div key={s.label}>
                  <span style={{ fontSize: '11px', color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {s.label}
                  </span>
                  <div style={{ fontSize: s.green ? '14px' : '18px', fontWeight: 'bold', color: s.green ? 'var(--status-eligible)' : 'var(--text-main)', marginTop: '2px' }}>
                    {s.val}
                  </div>
                </div>
              ))}
            </div>

            <a href={room.cta.href} className="btn btn-gold" style={{ display: 'inline-flex', padding: '10px 20px', fontSize: '13px' }}>
              {room.cta.label}
            </a>
          </div>

          {/* Image Column */}
          <div>
            <img
              src={room.img}
              alt={room.imgAlt}
              style={{
                width: '100%',
                height: '320px',
                objectFit: 'cover',
                borderRadius: '14px',
                border: '1px solid var(--border-gold)',
                transition: 'opacity 0.3s',
              }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
