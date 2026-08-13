import React from 'react';
import { INITIAL_DEGREE_PROGRAMS, INITIAL_CONTACT_INFO } from '../data/initialData';

export default function RegistrationPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-dark)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 24px', alignItems: 'center', border: '1px solid var(--border-gold)', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '50px', width: '96%', maxWidth: '1400px', margin: '16px auto', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src="/assets/logo.jpg" alt="Logo" style={{ height: '40px', borderRadius: '50%' }} onError={(e) => { e.target.style.display='none' }}/>
          <span style={{ color: 'var(--text-main)', fontSize: '22px', fontWeight: 'bold', letterSpacing: '1px', fontFamily: 'var(--font-serif)' }}>UNIVERSITY OF EAST FLORIDA</span>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
          📞 {INITIAL_CONTACT_INFO.phone}
        </div>
      </header>

      {/* Form Container */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }}>
        <div style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '750px', color: 'var(--text-main)', border: '1px solid var(--gold-primary)', boxShadow: '0 0 30px var(--gold-glow)' }}>
          <h2 style={{ margin: '0 0 25px', fontSize: '24px', color: 'var(--text-main)', fontWeight: '600', fontFamily: 'var(--font-body)' }}>
            Registration <span style={{ color: 'var(--gold-primary)', fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontWeight: '600' }}>Form</span>
          </h2>
          
          <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} onSubmit={(e) => { e.preventDefault(); alert('Registration submitted!'); }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>First Name <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="text" placeholder="Enter your first name" style={{ padding: '12px', border: '1px solid var(--border-gold)', borderRadius: '6px', outline: 'none', background: 'transparent', color: 'var(--text-main)' }} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Last Name <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="text" placeholder="Enter your last name" style={{ padding: '12px', border: '1px solid var(--border-gold)', borderRadius: '6px', outline: 'none', background: 'transparent', color: 'var(--text-main)' }} required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Email Address <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="email" style={{ padding: '12px', border: '1px solid var(--border-gold)', borderRadius: '6px', outline: 'none', background: 'transparent', color: 'var(--text-main)' }} required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Mobile Number <span style={{ color: '#ef4444' }}>*</span></label>
              <div style={{ display: 'flex', border: '1px solid var(--border-gold)', borderRadius: '6px', overflow: 'hidden' }}>
                <select style={{ padding: '12px', border: 'none', background: 'transparent', borderRight: '1px solid var(--border-gold)', width: '90px', outline: 'none', color: 'var(--text-main)' }}>
                  <option style={{ color: '#000' }}>🇺🇸 +1</option>
                  <option style={{ color: '#000' }}>🇬🇧 +44</option>
                  <option style={{ color: '#000' }}>🇮🇳 +91</option>
                </select>
                <input type="tel" style={{ padding: '12px', border: 'none', flex: 1, outline: 'none', background: 'transparent', color: 'var(--text-main)' }} required />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Nationality <span style={{ color: '#ef4444' }}>*</span></label>
              <select style={{ padding: '12px', border: '1px solid var(--border-gold)', borderRadius: '6px', outline: 'none', color: 'var(--text-main)', appearance: 'none', background: 'transparent url("data:image/svg+xml;utf8,<svg fill=\'%23d4af37\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>") no-repeat right 10px center/16px' }} required>
                <option value="" style={{ color: '#000' }}>Select a option</option>
                <option value="US" style={{ color: '#000' }}>United States</option>
                <option value="IN" style={{ color: '#000' }}>India</option>
                <option value="UK" style={{ color: '#000' }}>United Kingdom</option>
                <option value="Other" style={{ color: '#000' }}>Other</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>State <span style={{ color: '#ef4444' }}>*</span></label>
              <select style={{ padding: '12px', border: '1px solid var(--border-gold)', borderRadius: '6px', outline: 'none', color: 'var(--text-main)', appearance: 'none', background: 'transparent url("data:image/svg+xml;utf8,<svg fill=\'%23d4af37\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>") no-repeat right 10px center/16px' }} required>
                <option value="" style={{ color: '#000' }}>Select a option</option>
                <option value="FL" style={{ color: '#000' }}>Florida</option>
                <option value="NY" style={{ color: '#000' }}>New York</option>
                <option value="CA" style={{ color: '#000' }}>California</option>
                <option value="Other" style={{ color: '#000' }}>Other</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Program <span style={{ color: '#ef4444' }}>*</span></label>
              <select style={{ padding: '12px', border: '1px solid var(--gold-primary)', borderRadius: '6px', outline: 'none', color: 'var(--text-main)', appearance: 'none', background: 'transparent url("data:image/svg+xml;utf8,<svg fill=\'%23d4af37\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>") no-repeat right 10px center/16px' }} required>
                <option value="" style={{ color: '#000' }}>Select a option</option>
                {INITIAL_DEGREE_PROGRAMS.map(p => (
                  <option key={p.id} value={p.id} style={{ color: '#000' }}>{p.degree}</option>
                ))}
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Elective <span style={{ color: '#ef4444' }}>*</span></label>
              <select style={{ padding: '12px', border: '1px solid var(--border-gold)', borderRadius: '6px', outline: 'none', color: 'var(--text-main)', appearance: 'none', background: 'transparent url("data:image/svg+xml;utf8,<svg fill=\'%23d4af37\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>") no-repeat right 10px center/16px' }} required>
                <option value="" style={{ color: '#000' }}>Select a option</option>
                <option value="general" style={{ color: '#000' }}>General Track</option>
                <option value="advanced" style={{ color: '#000' }}>Advanced Honors</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '10px' }}>
              <input type="checkbox" id="consent" required style={{ marginTop: '3px', cursor: 'pointer' }}/>
              <label htmlFor="consent" style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.5', cursor: 'pointer' }}>
                I consent to receive communications from the University and its representatives via Email, SMS, WhatsApp, Call, or any other electronic medium for updates and notifications. This consent overrides DND/NDNC preferences.
              </label>
            </div>
            
            <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
              <button type="submit" style={{ width: '100%', padding: '16px', background: 'var(--gold-primary)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 0 15px var(--gold-glow)' }}>
                Submit Registration →
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Footer text */}
      <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'var(--font-body)' }}>
        © University of East Florida. All Rights Reserved.
      </div>
    </div>
  );
}
