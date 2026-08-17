import React, { useState, useRef } from 'react';

export default function CampusTour({ tourSlides = [] }) {
  const [activeTab, setActiveTab] = useState(tourSlides[0]?.id || 'library');
  const carouselRef = useRef(null);
  
  if (!tourSlides || tourSlides.length === 0) return null;

  const handleScroll = () => {
    // Only apply scroll logic on mobile layout
    if (window.innerWidth > 768 || !carouselRef.current) return;
    
    const scrollLeft = carouselRef.current.scrollLeft;
    const width = carouselRef.current.offsetWidth;
    const activeIndex = Math.round(scrollLeft / width);
    const room = tourSlides[activeIndex];
    if (room && room.id !== activeTab) {
      setActiveTab(room.id);
    }
  };

  const scrollToSlide = (index, id) => {
    setActiveTab(id);
    if (carouselRef.current && window.innerWidth <= 768) {
      const width = carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({ left: width * index, behavior: 'smooth' });
    }
  };

  return (
    <section className="section-wrapper" id="campusTour">
      <div className="section-header">
        <h2 className="section-title">VIRTUAL CAMPUS TOUR</h2>
        <p className="section-desc">
          Experience our state-of-the-art virtual university infrastructure. Explore the Digital Research Library, Virtual Lecture Halls, Student Portal, and USA Administration Offices.
        </p>
      </div>

      {/* INTERACTIVE ROOM TABS (Desktop Only) */}
      <div className="tour-tabs-desktop" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px', justifyContent: 'center' }}>
        {tourSlides.map((r, idx) => (
          <button
            key={r.id}
            className={`btn ${activeTab === r.id ? 'btn-gold' : 'btn-outline'}`}
            style={{ padding: '8px 16px', fontSize: '13px', transition: 'all 0.25s' }}
            onClick={() => scrollToSlide(idx, r.id)}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* ROOM DISPLAY CAROUSEL */}
      <div 
        className="tour-carousel-container" 
        ref={carouselRef}
        onScroll={handleScroll}
      >
        {tourSlides.map(room => (
          <div key={room.id} className={`tour-slide ${activeTab === room.id ? 'active' : ''}`}>
            <div className="scroll-reveal tour-card-inner" style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-gold)',
              borderRadius: '16px',
              overflow: 'hidden',
              padding: '28px',
            }}>
              <div className="tour-grid-2">
                
                {/* Info Column */}
                <div>
                  <h3 className="tour-room-title" style={{ fontSize: '22px', color: 'var(--gold-light)', fontFamily: 'var(--font-serif)', marginBottom: '12px' }}>
                    {room.title}
                  </h3>
                  <p className="tour-room-desc" style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '20px' }}>
                    {room.desc}
                  </p>

                  <div className="tour-stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'var(--bg-dark)', padding: '16px', borderRadius: '12px', marginBottom: '22px' }}>
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

                  <a href={room.cta.href} className="btn btn-gold tour-room-btn" style={{ display: 'inline-flex', padding: '10px 20px', fontSize: '13px' }}>
                    {room.cta.label}
                  </a>
                </div>

                {/* Image Column */}
                <div>
                  <img
                    src={room.img}
                    alt={room.imgAlt}
                    className="tour-room-img"
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
          </div>
        ))}
      </div>

      {/* MOBILE PAGINATION DOTS */}
      <div className="tour-dots-mobile">
        {tourSlides.map((r, idx) => (
          <button 
            key={r.id} 
            className={`tour-dot ${activeTab === r.id ? 'active' : ''}`}
            onClick={() => scrollToSlide(idx, r.id)}
            aria-label={`Go to ${r.label}`}
          />
        ))}
      </div>
    </section>
  );
}
