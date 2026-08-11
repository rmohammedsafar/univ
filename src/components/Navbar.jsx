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
            src="assets/logo.svg"
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
          <li><a href="#programs"            className="nav-link">Programs</a></li>
          <li><a href="#campusTour"          className="nav-link">Campus Tour</a></li>
          <li><a href="#researchPapersSection" className="nav-link">Research</a></li>
          <li><a href="#globalNewsSection"   className="nav-link">News</a></li>
          <li><a href="#applySection"        className="nav-link">Enroll Now</a></li>
        </ul>

        {/* Nav Actions */}
        <div className="nav-actions">
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            id="themeToggleBtn"
            title="Toggle Light / Dark Mode"
            style={{ padding: '5px 10px', fontSize: '11.5px' }}
          >
            {isLightTheme ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>

          <a
            href="/#applySection"
            className="btn btn-gold"
            style={{ padding: '5px 12px', fontSize: '11.5px', gap: 4, whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Apply
          </a>
        </div>
      </header>

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
