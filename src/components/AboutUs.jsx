import React from 'react';

export default function AboutUs({ aboutData }) {
  if (!aboutData) return null;

  return (
    <section id="aboutUs" className="about-section" style={{ 
      backgroundColor: '#f4ecd8', 
      fontFamily: 'var(--font-body, sans-serif)',
      color: '#2c2a29'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 className="about-title">
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
            <h3 className="about-subtitle">{aboutData.title}</h3>
            <p className="about-desc">
              {aboutData.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <img 
                src={aboutData.image1} 
                alt="About us visual 1" 
                style={{ width: '100%', height: '340px', objectFit: 'contain', borderRadius: '16px' }} 
              />
              <img 
                src={aboutData.image2} 
                alt="About us visual 2" 
                style={{ width: '100%', height: '340px', objectFit: 'contain', borderRadius: '16px' }} 
              />
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        .about-section {
          padding: 100px 5%;
        }
        .about-title {
          font-size: 48px;
          font-family: var(--font-serif, serif);
          font-weight: normal;
          margin-bottom: 50px;
          color: #2c2a29;
        }
        .about-subtitle {
          font-size: 26px;
          font-weight: 500;
          margin-bottom: 20px;
          color: #2c2a29;
        }
        .about-desc {
          font-size: 16px;
          line-height: 1.7;
          color: #54504c;
          margin-bottom: 40px;
          white-space: pre-wrap;
          text-align: justify;
        }
        .about-logo {
          width: 100%;
          max-width: 280px;
          height: auto;
          object-fit: contain;
          margin-bottom: 40px;
        }
        .about-quote {
          font-size: 24px;
          font-family: var(--font-serif, serif);
          line-height: 1.4;
          font-weight: 500;
          color: #2c2a29;
        }
        @media (max-width: 900px) {
          .about-section {
            padding: 50px 5%;
          }
          .about-title {
            font-size: 32px;
            margin-bottom: 30px;
            text-align: center;
          }
          .about-subtitle {
            font-size: 20px;
            margin-bottom: 15px;
            text-align: center;
          }
          .about-desc {
            font-size: 14px;
            margin-bottom: 25px;
            text-align: justify;
          }
          .about-us-grid {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
          .about-logo {
            max-width: 130px !important;
            margin-bottom: 15px !important;
          }
          .about-quote {
            font-size: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
