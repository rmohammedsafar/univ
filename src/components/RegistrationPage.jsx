import React from 'react';
import { INITIAL_DEGREE_PROGRAMS, INITIAL_CONTACT_INFO } from '../data/initialData';

export default function RegistrationPage() {
  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 40px', alignItems: 'center', borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src="/assets/logo.jpg" alt="Logo" style={{ height: '40px', borderRadius: '50%' }} onError={(e) => { e.target.style.display='none' }}/>
          <span style={{ color: '#0f172a', fontSize: '22px', fontWeight: 'bold', letterSpacing: '1px', fontFamily: 'var(--font-serif)' }}>UNIVERSITY OF EAST FLORIDA</span>
        </div>
        <div style={{ color: '#475569', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
          📞 {INITIAL_CONTACT_INFO.phone}
        </div>
      </header>

      {/* Form Container */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }}>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '750px', color: '#333', boxShadow: '0 10px 40px rgba(0,0,0,0.06)' }}>
          <h2 style={{ margin: '0 0 25px', fontSize: '18px', color: '#333', fontWeight: 'normal' }}>Registration Form</h2>
          
          <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} onSubmit={(e) => { e.preventDefault(); alert('Registration submitted!'); }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>First Name <span style={{ color: 'red' }}>*</span></label>
              <input type="text" placeholder="Enter your first name" style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none' }} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Last Name <span style={{ color: 'red' }}>*</span></label>
              <input type="text" placeholder="Enter your last name" style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none' }} required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Email Address <span style={{ color: 'red' }}>*</span></label>
              <input type="email" style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none' }} required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Mobile Number <span style={{ color: 'red' }}>*</span></label>
              <div style={{ display: 'flex', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                <select style={{ padding: '12px', border: 'none', background: '#f8fafc', borderRight: '1px solid #e2e8f0', width: '90px', outline: 'none' }}>
                  <option>🇺🇸 +1</option>
                  <option>🇬🇧 +44</option>
                  <option>🇮🇳 +91</option>
                </select>
                <input type="tel" style={{ padding: '12px', border: 'none', flex: 1, outline: 'none' }} required />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Nationality <span style={{ color: 'red' }}>*</span></label>
              <select style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none', color: '#333', appearance: 'none', background: 'url("data:image/svg+xml;utf8,<svg fill=\'%23999\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>") no-repeat right 10px center/16px' }} required>
                <option value="">Select a option</option>
                <option value="US">United States</option>
                <option value="IN">India</option>
                <option value="UK">United Kingdom</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>State <span style={{ color: 'red' }}>*</span></label>
              <select style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none', color: '#333', appearance: 'none', background: 'url("data:image/svg+xml;utf8,<svg fill=\'%23999\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>") no-repeat right 10px center/16px' }} required>
                <option value="">Select a option</option>
                <option value="FL">Florida</option>
                <option value="NY">New York</option>
                <option value="CA">California</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Program <span style={{ color: 'red' }}>*</span></label>
              <select style={{ padding: '12px', border: '1px solid #3b82f6', borderRadius: '6px', outline: 'none', color: '#333', appearance: 'none', background: 'url("data:image/svg+xml;utf8,<svg fill=\'%23999\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>") no-repeat right 10px center/16px' }} required>
                <option value="">Select a option</option>
                {INITIAL_DEGREE_PROGRAMS.map(p => (
                  <option key={p.id} value={p.id}>{p.degree}</option>
                ))}
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Elective <span style={{ color: 'red' }}>*</span></label>
              <select style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none', color: '#333', appearance: 'none', background: 'url("data:image/svg+xml;utf8,<svg fill=\'%23999\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>") no-repeat right 10px center/16px' }} required>
                <option value="">Select a option</option>
                <option value="general">General Track</option>
                <option value="advanced">Advanced Honors</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '10px' }}>
              <input type="checkbox" id="consent" required style={{ marginTop: '3px', cursor: 'pointer' }}/>
              <label htmlFor="consent" style={{ fontSize: '11px', color: '#475569', lineHeight: '1.5', cursor: 'pointer' }}>
                I consent to receive communications from the University and its representatives via Email, SMS, WhatsApp, Call, or any other electronic medium for updates and notifications. This consent overrides DND/NDNC preferences.
              </label>
            </div>
            
            <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
              <button type="submit" style={{ width: '100%', padding: '14px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
                Submit Registration
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Footer text */}
      <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '13px', fontFamily: 'var(--font-body)' }}>
        © University of East Florida. All Rights Reserved.
      </div>
    </div>
  );
}
