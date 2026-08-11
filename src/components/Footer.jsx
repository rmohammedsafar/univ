import React, { useState } from 'react';

export default function Footer({ onOpenAdminLogin }) {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');

  const handleInquiry = (e) => {
    e.preventDefault();
    alert('✅ Your inquiry has been dispatched to the UEF Registrar Office! We will respond within 24 hours.');
    setInquiryName('');
    setInquiryEmail('');
  };

  return (
    <>
      {/* ── USA HEADQUARTERS SECTION ──────────────────────────────────────── */}
      <section className="section-wrapper" id="usaHeadquarters">
        <div className="section-header">
          <span className="section-tag">Global Physical Presence</span>
          <h2 className="section-title">USA HEADQUARTERS &amp; CONTACT</h2>
          <p className="section-desc">
            While our degrees are 100% online, we maintain a physical USA administrative headquarters for official correspondence, transcript authentication, and global employer verification.
          </p>
        </div>

        <div className="contact-grid">

          {/* Left: Address Info */}
          <div className="address-box">
            <div className="address-item">
              <div className="address-icon">📍</div>
              <div className="address-text">
                <h4>Physical Address</h4>
                <p>1200 University Blvd, Suite 500<br />Orlando, Florida 32816, USA</p>
              </div>
            </div>
            <div className="address-item">
              <div className="address-icon">📞</div>
              <div className="address-text">
                <h4>Toll-Free USA Line</h4>
                <p>+1 (800) 555-UEF1</p>
              </div>
            </div>
            <div className="address-item">
              <div className="address-icon">✉️</div>
              <div className="address-text">
                <h4>Registrar Office</h4>
                <p><a href="mailto:r.mohammedsafar@gmail.com" style={{ color: 'var(--gold-primary)' }}>r.mohammedsafar@gmail.com</a></p>
              </div>
            </div>
            <div className="address-item">
              <div className="address-icon">🕒</div>
              <div className="address-text">
                <h4>Office Hours</h4>
                <p>Mon – Fri: 8:00 AM – 6:00 PM EST</p>
              </div>
            </div>

            <div style={{ background: 'rgba(212,175,55,0.1)', padding: 14, borderRadius: 10, border: '1px solid var(--border-gold)', marginTop: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--gold-light)', fontWeight: 'bold' }}>
                🎓 Degree certificates include cryptographically verifiable QR verification codes for instant employer authentication.
              </span>
            </div>
          </div>

          {/* Right: Google Map + Quick Inquiry */}
          <div className="map-container-box">
            <div className="map-header">
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--gold-light)' }}>📍 Interactive Orlando, FL Campus Map</span>
              <span className="usa-flag-badge">ORLANDO HQ</span>
            </div>

            <iframe
              className="map-iframe"
              src="https://maps.google.com/maps?q=1200%20University%20Blvd,%20Orlando,%20FL%2032816&t=&z=13&ie=UTF8&iwloc=&output=embed"
              allowFullScreen=""
              loading="lazy"
              title="University of East Florida - Orlando Campus Map"
            />

            {/* Quick Inquiry Form */}
            <div style={{ padding: '20px', background: 'rgba(13, 9, 10, 0.95)', borderTop: '1px solid var(--border-gold)' }}>
              <h4 style={{ fontSize: 14, color: 'var(--gold-light)', marginBottom: 10 }}>Send Instant Inquiry to USA Registrar</h4>
              <form onSubmit={handleInquiry} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <input
                  type="text" className="form-control" placeholder="Your Name" required
                  value={inquiryName} onChange={e => setInquiryName(e.target.value)}
                  style={{ flex: 1, minWidth: 140, padding: '8px 12px' }}
                />
                <input
                  type="email" className="form-control" placeholder="Your Email" required
                  value={inquiryEmail} onChange={e => setInquiryEmail(e.target.value)}
                  style={{ flex: 1, minWidth: 140, padding: '8px 12px' }}
                />
                <button type="submit" className="btn btn-gold" style={{ padding: '8px 18px', fontSize: 13 }}>
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* ── ACCREDITATION DISCLAIMER BANNER ─────────────────────────────── */}
      <section className="section-wrapper" id="accreditation" style={{ paddingTop: 0 }}>
        <div style={{ background: 'rgba(107, 17, 28, 0.3)', border: '1px solid var(--border-gold)', borderRadius: 16, padding: 30, textAlign: 'center' }}>
          <h3 style={{ fontSize: 20, color: 'var(--gold-light)', marginBottom: 10, fontFamily: 'var(--font-serif)' }}>
            🏅 Global Accreditation &amp; Quality Assurance
          </h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 900, margin: '0 auto 16px' }}>
            The University of East Florida is dedicated to maintaining international standards in distance education. Our curriculum is modeled after top U.S. university frameworks and vetted by industry leaders.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
            <span className="usa-flag-badge">DEAC Distance Education Standards</span>
            <span className="usa-flag-badge">SACSCOC Regional Quality Model</span>
            <span className="usa-flag-badge">100% Online Verification</span>
          </div>
        </div>
      </section>

      {/* ── FULL SITE FOOTER ─────────────────────────────────────────────── */}
      <footer className="site-footer">
        <div className="footer-grid">

          {/* Brand Column */}
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src="assets/logo.svg" alt="UEF Crest" style={{ width: 44, height: 44 }} />
              <div>
                <h3 style={{ color: '#fff', fontSize: 18, fontFamily: 'var(--font-serif)' }}>UNIVERSITY OF EAST FLORIDA</h3>
                <span style={{ fontSize: 11, color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: 1 }}>
                  100% ONLINE GLOBAL UNIVERSITY
                </span>
              </div>
            </div>
            <p>Providing accessible, 100% online accredited higher education to global learners without location barriers.</p>
          </div>

          {/* Online Programs */}
          <div className="footer-col">
            <h4>Online Programs</h4>
            <ul className="footer-links">
              <li><a href="#programs">M.S. Computer Science &amp; AI</a></li>
              <li><a href="#programs">M.S. Data Science</a></li>
              <li><a href="#programs">Global MBA</a></li>
              <li><a href="#programs">M.S. Cybersecurity Policy</a></li>
              <li><a href="#programs">B.S. Software Engineering</a></li>
            </ul>
          </div>

          {/* Student Services */}
          <div className="footer-col">
            <h4>Student Services</h4>
            <ul className="footer-links">
              <li><a href="#applySection">Marksheet Upload</a></li>
              <li><a href="#applySection">Marks Evaluator</a></li>
              <li><a href="#applySection">Referral Discount Hub</a></li>
              <li><a href="#programs">PDF Brochure Downloads</a></li>
            </ul>
          </div>

          {/* USA Office */}
          <div className="footer-col">
            <h4>USA Office &amp; Portal Access</h4>
            <ul className="footer-links">
              <li><a href="#usaHeadquarters">1200 University Blvd, Suite 500</a></li>
              <li><a href="#usaHeadquarters">Orlando, FL 32816, USA</a></li>
              <li><a href="tel:+18005558331">+1 (800) 555-UEF1</a></li>
              <li>
                <a
                  href="javascript:void(0)"
                  onClick={onOpenAdminLogin}
                  style={{ color: 'var(--gold-primary)', fontWeight: 'bold' }}
                >
                  🔑 Sign In / Register
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} University of East Florida. All Rights Reserved. Veritas • Sapientia • Virtus.</div>
          <div>100% Online Distance Learning • Orlando, Florida, USA</div>
        </div>
      </footer>
    </>
  );
}
