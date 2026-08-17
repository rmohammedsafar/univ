import React from 'react';

export default function AboutUs() {
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
          alignItems: 'start'
        }} className="about-us-grid">
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            {/* CSS Circular Seal */}
            <div style={{ 
              width: '280px', 
              height: '280px', 
              borderRadius: '50%', 
              border: '2px solid #d4c4af', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              position: 'relative',
              marginBottom: '40px',
              backgroundColor: '#e6dec8'
            }}>
              <div style={{
                width: '240px',
                height: '240px',
                borderRadius: '50%',
                border: '1px dashed #c0b09b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <span style={{ fontSize: '64px' }}>🌍</span>
                <svg viewBox="0 0 100 100" style={{ position: 'absolute', width: '100%', height: '100%', animation: 'spin 40s linear infinite' }}>
                  <path id="curve" d="M 10 50 A 40 40 0 1 1 90 50 A 40 40 0 1 1 10 50" fill="transparent" />
                  <text style={{ fontSize: '10px', fill: '#8c7b66', letterSpacing: '4px', fontWeight: '600' }}>
                    <textPath href="#curve" startOffset="50%" textAnchor="middle">
                      UNIVERSITY OF EAST FLORIDA • EST 2026 •
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>

            <p style={{ 
              fontSize: '24px', 
              fontFamily: 'var(--font-serif, serif)', 
              lineHeight: '1.4', 
              fontWeight: '500',
              color: '#2c2a29'
            }}>
              “Diversity is the one true thing we all have in common. Celebrate it every day with UEF.”
            </p>
          </div>

          {/* Right Column */}
          <div>
            <h3 style={{ fontSize: '26px', fontWeight: '500', marginBottom: '20px', color: '#2c2a29' }}>Who we are</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#54504c', marginBottom: '40px' }}>
              The University of East Florida (UEF) is a premier digital institution dedicated to fostering academic excellence and building meaningful relationships among international scholars. Founded in 2026, we bridge geographical gaps through rigorous, 100% online theoretical programs. At UEF, we celebrate intellectual diversity and create opportunities for students to connect, grow, and thrive globally in a completely asynchronous environment.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80" 
                alt="Students collaborating" 
                style={{ width: '100%', height: '340px', objectFit: 'cover', borderRadius: '16px' }} 
              />
              <img 
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80" 
                alt="University campus" 
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
        @media (max-width: 900px) {
          .about-us-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}
