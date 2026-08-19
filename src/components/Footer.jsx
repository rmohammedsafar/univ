import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export default function Footer({ contactInfo, onOpenAdminLogin }) {
  const [hoursExpanded, setHoursExpanded] = useState(false);
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const currentDayInfo = contactInfo?.dailyHours?.find(d => d.day === todayName) || contactInfo?.dailyHours?.[0] || { startTime: '8:00 AM', endTime: '6:00 PM' };

  return (
    <>
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
              <li><a href="/#programs">M.S. Computer Science &amp; AI</a></li>
              <li><a href="/#programs">M.S. Data Science</a></li>
              <li><a href="/#programs">Global MBA</a></li>
              <li><a href="/#programs">M.S. Cybersecurity Policy</a></li>
              <li><a href="/#programs">B.S. Software Engineering</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/#aboutUs">About Us</a></li>
              <li><a href="/#campusTour">Campus Tour</a></li>
              <li><a href="/gallery">Gallery</a></li>
            </ul>
          </div>

          {/* USA Office */}
          <div className="footer-col">
            <h4>USA Office</h4>
            <ul className="footer-links">
              <li><a href="/#usaHeadquarters">1200 University Blvd, Suite 500</a></li>
              <li><a href="/#usaHeadquarters">Orlando, FL 32816, USA</a></li>
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
