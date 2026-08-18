import React from 'react';

export default function CampusVideos({ videos }) {
  if (!videos || videos.length === 0) return null;

  return (
    <section id="campus-videos" className="section-padding" style={{ background: 'var(--bg-dark)' }}>
      <div className="section-container">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }} data-aos="fade-up">
          <div className="section-header" style={{ marginBottom: 0, textAlign: 'left' }}>
            <h2 className="section-title">Academic Classes</h2>
            <div className="section-line" style={{ margin: '20px 0' }}></div>
            <p className="section-subtitle" style={{ maxWidth: '600px', margin: 0 }}>
              Explore insights, lectures, and inspiring classes from our esteemed faculty.
            </p>
          </div>
          <a href="#campus-videos" className="btn btn-outline">
            See More →
          </a>
        </div>

        <div className="video-scroll-container" style={{ 
          display: 'flex', 
          overflowX: 'auto', 
          gap: '30px', 
          paddingBottom: '20px', 
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--gold-light) var(--bg-card)'
        }}>
          {videos.map((vid, idx) => (
            <div key={vid.id || idx} className="video-card" data-aos="fade-up" data-aos-delay={idx * 100} style={{ 
              background: 'var(--bg-card)', 
              borderRadius: '12px', 
              overflow: 'hidden', 
              border: '1px solid var(--border-gold)', 
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              minWidth: '340px',
              maxWidth: '340px',
              flexShrink: 0,
              scrollSnapAlign: 'start',
              display: 'flex',
              flexDirection: 'column'
            }}>
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
              <div className="video-info" style={{ padding: '20px', flexGrow: 1 }}>
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
