import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export default function ContactSection({ contactInfo }) {
  const [hoursExpanded, setHoursExpanded] = useState(false);
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const currentDayInfo = contactInfo?.dailyHours?.find(d => d.day === todayName) || contactInfo?.dailyHours?.[0] || { startTime: '8:00 AM', endTime: '6:00 PM' };

  return (
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
        </div>
      </div>
    </section>
  );
}
