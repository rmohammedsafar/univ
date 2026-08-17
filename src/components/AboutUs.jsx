import React from 'react';

export default function AboutUs({ aboutData }) {
  if (!aboutData) return null;

  return (
    <section id="aboutUs" style={{ 
      backgroundColor: '#f4ecd8', 
      padding: '100px 5%', 
      fontFamily: 'var(--font-body, sans-serif)',
      color: '#2c2a29'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ 
          fontSize: '48px', 
          fontFamily: 'var(--font-serif, serif)', 
          fontWeight: 'normal', 
          marginBottom: '50px',
          color: '#2c2a29'
        }}>
          About Us
        </h2>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1.5fr', 
          gap: '80px',
          alignItems: 'center'
        }} className="about-us-grid">
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <img 
              src={aboutData.logoUrl || "/assets/logo.jpg"} 
              alt="University Logo" 
              className="about-logo"
              onError={(e) => { e.target.style.display='none' }}
            />

            <p className="about-quote">
              {aboutData.quote}
            </p>
          </div>

          {/* Right Column */}
          <div>
            <h3 style={{ fontSize: '26px', fontWeight: '500', marginBottom: '20px', color: '#2c2a29' }}>{aboutData.title}</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#54504c', marginBottom: '40px', whiteSpace: 'pre-wrap' }}>
              {aboutData.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <img 
                src={aboutData.image1} 
                alt="About us visual 1" 
                style={{ width: '100%', height: '340px', objectFit: 'cover', borderRadius: '16px' }} 
              />
              <img 
                src={aboutData.image2} 
                alt="About us visual 2" 
                style={{ width: '100%', height: '340px', objectFit: 'cover', borderRadius: '16px' }} 
              />
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        .about-logo {
          width: 100%;
          maxWidth: 280px;
          height: auto;
          objectFit: contain;
          marginBottom: 40px;
        }
        .about-quote {
          fontSize: 24px;
          fontFamily: var(--font-serif, serif);
          lineHeight: 1.4;
          fontWeight: 500;
          color: #2c2a29;
        }
        @media (max-width: 900px) {
          .about-us-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .about-logo {
            maxWidth: 180px !important;
            marginBottom: 20px !important;
          }
          .about-quote {
            fontSize: 18px !important;
          }
        }
      `}</style>
    </section>
  );
}
