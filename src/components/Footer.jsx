import React, { useState } from 'react';
import { sendInquiryEmail } from '../services/emailService';
import { saveInquiryRecord } from '../services/firebase';
import { MapPin, Phone, Mail, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export default function Footer({ contactInfo, onOpenAdminLogin }) {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const [hoursExpanded, setHoursExpanded] = useState(false);
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const currentDayInfo = contactInfo?.dailyHours?.find(d => d.day === todayName) || contactInfo?.dailyHours?.[0] || { startTime: '8:00 AM', endTime: '6:00 PM' };

  const handleInquiry = async (e) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail) return;
    setIsSending(true);
    try {
      await saveInquiryRecord({
        name: inquiryName,
        email: inquiryEmail,
        submittedAt: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      });
      await sendInquiryEmail(inquiryName, inquiryEmail);
      alert('✅ Your inquiry has been dispatched to the UEF Registrar Office! We will respond within 24 hours.');
      setInquiryName('');
      setInquiryEmail('');
    } catch (err) {
      alert('⚠️ Error sending inquiry. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* ── USA HEADQUARTERS SECTION ──────────────────────────────────────── */}
      <section className="section-wrapper" id="usaHeadquarters">
        <div className="section-header">
          <h2 className="section-title">USA HEADQUARTERS &amp; CONTACT</h2>
          <p className="section-desc">
            While our degrees are 100% online, we maintain a physical USA administrative headquarters for official correspondence, transcript authentication, and global employer verification.
          </p>
        </div>

        <div className="contact-grid">

          {/* Left: Address Info */}
          <div className="address-box">
            <div className="address-item">
              <div className="address-icon"><MapPin size={22} /></div>
              <div className="address-text">
                <h4>Physical Address</h4>
                <p style={{ whiteSpace: 'pre-wrap' }}>{contactInfo?.address}</p>
              </div>
            </div>
            <div className="address-item">
              <div className="address-icon"><Phone size={22} /></div>
              <div className="address-text">
                <h4>Toll-Free USA Line</h4>
                <p>{contactInfo?.phone}</p>
              </div>
            </div>
            <div className="address-item">
              <div className="address-icon"><Mail size={22} /></div>
              <div className="address-text">
                <h4>Registrar Office</h4>
                <p><a href={`mailto:${contactInfo?.email}`} style={{ color: 'var(--gold-primary)' }}>{contactInfo?.email}</a></p>
              </div>
            </div>
            <div className="address-item" style={{ alignItems: 'flex-start' }}>
              <div className="address-icon" style={{ marginTop: '4px' }}><Clock size={22} /></div>
              <div className="address-text" style={{ width: '100%', maxWidth: '280px' }}>
                <div 
                  onClick={() => setHoursExpanded(!hoursExpanded)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: '6px' }}
                >
                  <h4 style={{ margin: 0 }}>Office Hours {contactInfo?.timezone && <span style={{fontSize: 12, fontWeight: 'normal', color: 'var(--text-muted)'}}>({contactInfo.timezone})</span>}</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                    {hoursExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </div>
                
                {!hoursExpanded ? (
                  <div 
                    onClick={() => setHoursExpanded(true)}
                    style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', cursor: 'pointer' }}
                  >
                    <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{todayName}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{currentDayInfo.startTime === 'Closed' ? 'Closed' : `${currentDayInfo.startTime} – ${currentDayInfo.endTime}`}</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', marginTop: '8px' }}>
                    {daysOfWeek.map(day => {
                      const dayInfo = contactInfo?.dailyHours?.find(d => d.day === day) || { startTime: 'Closed', endTime: 'Closed' };
                      const isToday = day === todayName;
                      return (
                        <div key={day} style={{ display: 'flex', justifyContent: 'space-between', fontWeight: isToday ? '600' : 'normal', color: isToday ? 'var(--text-main)' : 'var(--text-muted)' }}>
                          <span>{day}</span>
                          <span>{dayInfo.startTime === 'Closed' ? 'Closed' : `${dayInfo.startTime} – ${dayInfo.endTime}`}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div style={{ background: 'rgba(212,175,55,0.1)', padding: 14, borderRadius: 10, border: '1px solid var(--border-gold)', marginTop: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--gold-light)', fontWeight: 'bold' }}>
                🎓 {contactInfo?.watermark}
              </span>
            </div>
          </div>

          {/* Right: Google Map + Quick Inquiry */}
          <div className="map-container-box">
            <div className="map-header">
              <span style={{ fontSize: 14, fontWeight: 600, color: '#d4af37' }}>📍 Interactive Orlando, FL Campus Map</span>
              <span className="usa-flag-badge" style={{ color: '#ffffff', borderColor: '#d4af37' }}>ORLANDO HQ</span>
            </div>

            <iframe
              className="map-iframe"
              src="https://maps.google.com/maps?q=28.602428,-81.200055+(University+of+East+Florida+HQ)&t=&z=15&ie=UTF8&iwloc=A&output=embed"
              allowFullScreen=""
              loading="lazy"
              title="University of East Florida - Orlando Campus Map"
            />

            {/* Quick Inquiry Form */}
            <div style={{ padding: '20px', background: 'rgba(13, 9, 10, 0.95)', borderTop: '1px solid var(--border-gold)' }}>
              <h4 style={{ fontSize: 14, color: '#d4af37', marginBottom: 10 }}>Send Instant Inquiry to USA Registrar</h4>
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
                <button type="submit" className="btn btn-gold" style={{ padding: '8px 18px', fontSize: 13 }} disabled={isSending}>
                  {isSending ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* ── ACCREDITATION DISCLAIMER BANNER ─────────────────────────────── */}
      <section className="section-wrapper" id="accreditation" style={{ paddingTop: 0 }}>
        <div className="accreditation-banner">
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

      {/* STICKY ACCREDITATION BANNER */}
      
      {/* MAIN FOOTER */}
      <footer className="site-footer" id="contactSection">
        <div className="footer-grid">

          {/* Brand Column */}
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src="assets/logo.jpg" alt="UEF Crest" style={{ width: 44, height: 44 }} />
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
            <h4>USA Office</h4>
            <ul className="footer-links">
              <li><a href="#usaHeadquarters">1200 University Blvd, Suite 500</a></li>
              <li><a href="#usaHeadquarters">Orlando, FL 32816, USA</a></li>
              <li><a href="tel:+18005558331">+1 (800) 555-UEF1</a></li>
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
