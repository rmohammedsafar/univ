import React, { useState, useEffect } from 'react';

export default function Navbar({ isLightTheme, toggleTheme, onOpenAdminLogin, isAdminLoggedIn, onOpenAdminPortal, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <>
      {/* ── TOP USA CONTACT BANNER ───────────────────────────────────────── */}
      <div className="usa-top-banner">
        <div className="banner-left">
          <span className="usa-flag-badge">📍 USA HEADQUARTERS</span>
          <span>DEAC &amp; SACSCOC Candidate Member</span>
          <span style={{ color: 'var(--gold-primary)' }}>•</span>
          <span>100% Online Remote Study (No Physical Labs Required)</span>
        </div>
        <div className="banner-right">
          <ClockWidget timezone="America/New_York" label="USA (Orlando/EST)" />
          <ClockWidget timezone="Europe/London" label="UK (GMT)" />
          <a href="tel:+18005558331" style={{ color: 'var(--gold-light)', textDecoration: 'none', fontWeight: 600 }}>
            📞 Toll-Free: +1 (800) 555-UEF1
          </a>
        </div>
      </div>

      {/* ── ANIMATED LIVE WORLD CLOCKS MARQUEE TICKER ─────────────────────── */}
      <div className="time-marquee-ticker">
        <div className="time-marquee-track">
          <MarqueeClocks />
          <MarqueeClocks />
        </div>
      </div>

      {/* ── STICKY MAIN NAV HEADER ─────────────────────────────────────────── */}
      <header className="app-header">
        <a href="#" className="brand-container">
          <img
            src="assets/logo.jpg"
            alt="University of East Florida Emblem"
            className="brand-logo-img"
            onError={(e) => {
              e.target.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='%236b111c' stroke='%23d4af37' stroke-width='5'/><text x='50' y='58' font-size='35' text-anchor='middle' fill='%23d4af37'>🏛️</text></svg>`;
            }}
          />
          <div className="brand-title-group">
            <h1 className="brand-font">UNIVERSITY OF EAST FLORIDA</h1>
            <p>100% Online Global Campus • Orlando, USA</p>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <ul className="nav-links">
          <li><a href="#programs"            className="nav-link">Program</a></li>
          <li><a href="#campusTour"          className="nav-link">Gallery</a></li>
          <li><a href="#usaHeadquarters"     className="nav-link">Contact</a></li>
          <li><a href="#applySection"        className="nav-link">Enroll Now</a></li>
        </ul>

        {/* Nav Actions */}
        <div className="nav-actions">
          <button 
            className="mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(true)}
            title="Open Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            id="themeToggleBtn"
            title="Toggle Light / Dark Mode"
            style={{ padding: '5px 10px', fontSize: '11.5px' }}
          >
            {isLightTheme ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>
      </header>

      {/* ── MOBILE MENU OVERLAY ────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-content">
            <button className="mobile-menu-close" onClick={closeMobile} title="Close Menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <ul className="mobile-nav-links">
              <li><a href="#programs" onClick={closeMobile}>Program</a></li>
              <li><a href="#campusTour" onClick={closeMobile}>Gallery</a></li>
              <li><a href="#usaHeadquarters" onClick={closeMobile}>Contact</a></li>
              <li><a href="#applySection" onClick={closeMobile}>Enroll Now</a></li>
              
              <li style={{ marginTop: '16px', borderTop: '1px solid rgba(212,175,55,0.2)', paddingTop: '16px' }}>
                <button
                  onClick={() => {
                    toggleTheme();
                    closeMobile();
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: isLightTheme ? '#e2e8f0' : 'rgba(212, 175, 55, 0.15)',
                    color: isLightTheme ? '#0f172a' : 'var(--gold-light)',
                    border: `1px solid ${isLightTheme ? '#cbd5e1' : 'var(--border-gold)'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {isLightTheme ? '🌙 Switch to Dark Mode' : '☀️ Switch to Light Mode'}
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

/* ── HELPERS ──────────────────────────────────────────────────────────────── */

function ClockWidget({ timezone, label }) {
  const [time, setTime] = useState('Loading...');
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timezone]);
  return <div className="time-widget">{label}: <strong>{time}</strong></div>;
}

function MarqueeClocks() {
  const zones = [
    { tz: 'America/New_York', label: '📍 USA (Orlando/EST)' },
    { tz: 'Europe/London',    label: '🌐 UK (London/GMT)' },
    { tz: 'Asia/Tokyo',       label: '🌐 Japan (Tokyo/JST)' },
    { tz: 'Asia/Kolkata',     label: '🌐 India (New Delhi/IST)' },
  ];
  const [times, setTimes] = useState({});
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const t = {};
      zones.forEach(z => {
        t[z.tz] = now.toLocaleTimeString('en-US', { timeZone: z.tz, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      });
      setTimes(t);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <span className="time-marquee-badge">⚡ LIVE WORLD CLOCKS</span>
      {zones.map(z => (
        <span key={z.tz} className="time-marquee-item">
          {z.label}: {times[z.tz] || '...'}
        </span>
      ))}
    </>
  );
}
