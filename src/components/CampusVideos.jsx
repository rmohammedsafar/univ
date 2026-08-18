import React from 'react';

export default function CampusVideos({ videos }) {
  if (!videos || videos.length === 0) return null;

  return (
    <section id="campus-videos" className="section-padding" style={{ background: 'var(--bg-dark)' }}>
      <div className="section-container">
        <div className="section-header" data-aos="fade-up">
          <h2 className="section-title">Academic Classes</h2>
          <div className="section-line"></div>
          <p className="section-subtitle">
            Explore insights, lectures, and inspiring classes from our esteemed faculty.
          </p>
        </div>

        <div className="video-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
          {videos.map((vid, idx) => (
            <div key={vid.id || idx} className="video-card" data-aos="fade-up" data-aos-delay={idx * 100} style={{ background: 'var(--bg-card)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-gold)', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
              <div className="video-wrapper" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                {vid.url.includes("youtube.com") || vid.url.includes("youtu.be") ? (
                  <iframe 
                    src={vid.url} 
                    title={vid.title} 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video 
                    src={vid.url} 
                    controls 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', objectFit: 'cover' }}
                  ></video>
                )}
              </div>
              <div className="video-info" style={{ padding: '20px' }}>
                <h3 className="video-title" style={{ color: 'var(--gold-light)', fontSize: '18px', marginBottom: '10px', fontFamily: 'var(--font-serif)' }}>{vid.title}</h3>
                <p className="video-desc" style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>{vid.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
