import React, { useRef } from 'react';

export default function CampusVideos({ videos }) {
  const scrollRef = useRef(null);

  if (!videos || videos.length === 0) return null;

  const handleScrollRight = (e) => {
    e.preventDefault();
    if (scrollRef.current) {
      // scroll by one card width + gap
      scrollRef.current.scrollBy({ left: 370, behavior: 'smooth' });
    }
  };

  return (
    <section style={{ backgroundColor: "var(--bg-dark)", padding: "80px 5% 10px", fontFamily: "var(--font-body, sans-serif)", color: "var(--text-main)", borderTop: "1px solid var(--border-gold)" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }} data-aos="fade-up">
          <h2 style={{ fontSize: "42px", fontFamily: "var(--font-serif, serif)", fontWeight: "normal", margin: 0, color: "var(--text-main)" }}>
            Academic Classes
          </h2>
          <button
            onClick={handleScrollRight}
            style={{ background: "transparent", border: "none", fontSize: "14px", fontWeight: "600", letterSpacing: "1px", cursor: "pointer", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "8px" }}
          >
            VIEW ALL <span>&#8594;</span>
          </button>
        </div>

        <div className="hide-scrollbar" ref={scrollRef} style={{ 
          display: "flex", 
          gap: "30px", 
          overflowX: "auto", 
          paddingBottom: "20px", 
          scrollSnapType: "x mandatory", 
          scrollbarWidth: "none", 
          msOverflowStyle: "none"
        }}>
          {videos.map((vid, idx) => (
            <div key={vid.id || idx} style={{ minWidth: "340px", maxWidth: "340px", flex: "0 0 auto", scrollSnapAlign: "start", display: "flex", flexDirection: "column" }} data-aos="fade-left" data-aos-delay={idx * 100}>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', marginBottom: '20px' }}>
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
              <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "10px", color: "var(--text-main)" }}>{vid.title}</h3>
              <p style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--text-muted)", marginBottom: "25px", flex: 1 }}>{vid.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
