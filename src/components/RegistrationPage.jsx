import React, { useState } from 'react';
import { INITIAL_DEGREE_PROGRAMS, INITIAL_CONTACT_INFO } from '../data/initialData';
import { GLOBAL_COUNTRIES } from '../data/countryStateData';
import { saveApplicationRecord } from '../services/firebase';
import { sendConfirmationEmail } from '../services/emailService';

export default function RegistrationPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCode, setPhoneCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [program, setProgram] = useState('');
  const [elective, setElective] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedCountryObj = GLOBAL_COUNTRIES.find(c => `${c.flag} ${c.name}` === country || c.name === country);
  const availableStates = selectedCountryObj ? selectedCountryObj.states : [];

  const handleCountryChange = (e) => {
    const val = e.target.value;
    setCountry(val);
    setState('');
    const matched = GLOBAL_COUNTRIES.find(c => `${c.flag} ${c.name}` === val || c.name === val);
    if (matched && matched.phoneCode) {
      setPhoneCode(matched.phoneCode);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    const fullName = `${firstName} ${lastName}`.trim();
    const fullPhone = `${phoneCode} ${phone}`.trim();
    const selectedProgObj = INITIAL_DEGREE_PROGRAMS.find(p => p.id === program || p.name === program || p.title === program);
    const programTitle = selectedProgObj ? `${selectedProgObj.degree} in ${selectedProgObj.name || selectedProgObj.title}` : (program || 'Degree Program');

    const appData = {
      fullName,
      email,
      phone: fullPhone,
      country,
      state,
      programTitle,
      highestQual: elective === 'advanced' ? 'Advanced Honors' : 'General Undergraduate Track',
      submittedAt: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    try {
      await saveApplicationRecord(appData);
      await sendConfirmationEmail(appData);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Registration error:", err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 16px', boxSizing: 'border-box', width: '100%' }}>
        <div style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: '36px 30px', width: '100%', maxWidth: '720px', color: 'var(--text-main)', border: '1px solid var(--gold-primary)', boxShadow: '0 0 30px var(--gold-glow)', boxSizing: 'border-box' }}>
          
          {isSubmitted ? (
            <div className="golden-tick-container">
              <div className="golden-tick-circle">
                <svg className="golden-tick-svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 className="golden-tick-title">REGISTRATION SUBMITTED!</h3>
              <p className="golden-tick-subtitle">
                Thank you <strong>{firstName} {lastName}</strong>!<br />
                Your official application has been received. A confirmation email has been dispatched to <strong>{email}</strong>.
              </p>
              <button 
                className="enquiry-submit-btn" 
                style={{ marginTop: 20, width: '100%', background: 'var(--gold-primary)', color: '#000', padding: '14px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                onClick={() => {
                  setIsSubmitted(false);
                  setFirstName('');
                  setLastName('');
                  setEmail('');
                  setPhone('');
                  setCountry('');
                  setState('');
                  setProgram('');
                }}
              >
                Register Another Student →
              </button>
            </div>
          ) : (
            <>
              <h2 style={{ margin: '0 0 25px', fontSize: '24px', color: 'var(--text-main)', fontWeight: '600', fontFamily: 'var(--font-body)' }}>
                Registration <span style={{ color: 'var(--gold-primary)', fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontWeight: '600' }}>Form</span>
              </h2>
              
              <form style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', width: '100%', boxSizing: 'border-box' }} onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, boxSizing: 'border-box' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>First Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input 
                    type="text" 
                    placeholder="Enter your first name" 
                    style={{ padding: '12px', border: '1px solid var(--border-gold)', borderRadius: '6px', outline: 'none', background: 'transparent', color: 'var(--text-main)', width: '100%', boxSizing: 'border-box' }} 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required 
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, boxSizing: 'border-box' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Last Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input 
                    type="text" 
                    placeholder="Enter your last name" 
                    style={{ padding: '12px', border: '1px solid var(--border-gold)', borderRadius: '6px', outline: 'none', background: 'transparent', color: 'var(--text-main)', width: '100%', boxSizing: 'border-box' }} 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required 
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gridColumn: '1 / -1', minWidth: 0, boxSizing: 'border-box' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Email Address <span style={{ color: '#ef4444' }}>*</span></label>
                  <input 
                    type="email" 
                    placeholder="student@example.com"
                    style={{ padding: '12px', border: '1px solid var(--border-gold)', borderRadius: '6px', outline: 'none', background: 'transparent', color: 'var(--text-main)', width: '100%', boxSizing: 'border-box' }} 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gridColumn: '1 / -1', minWidth: 0, boxSizing: 'border-box' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Mobile Number <span style={{ color: '#ef4444' }}>*</span></label>
                  <div style={{ display: 'flex', border: '1px solid var(--border-gold)', borderRadius: '6px', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
                    <select 
                      style={{ padding: '12px 6px', border: 'none', background: 'transparent', borderRight: '1px solid var(--border-gold)', width: '120px', minWidth: '120px', flexShrink: 0, outline: 'none', color: 'var(--text-main)', fontSize: '13px', boxSizing: 'border-box' }}
                      value={phoneCode}
                      onChange={(e) => setPhoneCode(e.target.value)}
                    >
                      {GLOBAL_COUNTRIES.map(c => (
                        <option key={c.code} value={c.phoneCode} style={{ color: '#000' }}>
                          {c.flag} {c.phoneCode} ({c.code})
                        </option>
                      ))}
                    </select>
                    <input 
                      type="tel" 
                      placeholder="Phone number"
                      style={{ padding: '12px', border: 'none', flex: 1, minWidth: 0, width: '100%', outline: 'none', background: 'transparent', color: 'var(--text-main)', boxSizing: 'border-box' }} 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, boxSizing: 'border-box' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Country of Residence <span style={{ color: '#ef4444' }}>*</span></label>
                  <select 
                    style={{ padding: '12px 30px 12px 12px', border: '1px solid var(--border-gold)', borderRadius: '6px', outline: 'none', color: 'var(--text-main)', width: '100%', boxSizing: 'border-box', appearance: 'none', background: 'transparent url("data:image/svg+xml;utf8,<svg fill=\'%23d4af37\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>") no-repeat right 10px center/16px' }} 
                    value={country}
                    onChange={handleCountryChange}
                    required
                  >
                    <option value="" style={{ color: '#000' }}>Select Country</option>
                    {GLOBAL_COUNTRIES.map(c => (
                      <option key={c.code} value={`${c.flag} ${c.name}`} style={{ color: '#000' }}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, boxSizing: 'border-box' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>State / Province <span style={{ color: '#ef4444' }}>*</span></label>
                  <select 
                    style={{ padding: '12px 30px 12px 12px', border: '1px solid var(--border-gold)', borderRadius: '6px', outline: 'none', color: 'var(--text-main)', width: '100%', boxSizing: 'border-box', appearance: 'none', background: 'transparent url("data:image/svg+xml;utf8,<svg fill=\'%23d4af37\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>") no-repeat right 10px center/16px' }} 
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    disabled={!country}
                    required
                  >
                    <option value="" style={{ color: '#000' }}>
                      {country ? 'Select State / Province' : 'Select Country First'}
                    </option>
                    {availableStates.map(st => (
                      <option key={st} value={st} style={{ color: '#000' }}>{st}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, boxSizing: 'border-box' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Degree Program <span style={{ color: '#ef4444' }}>*</span></label>
                  <select 
                    style={{ padding: '12px 30px 12px 12px', border: '1px solid var(--gold-primary)', borderRadius: '6px', outline: 'none', color: 'var(--text-main)', width: '100%', boxSizing: 'border-box', appearance: 'none', background: 'transparent url("data:image/svg+xml;utf8,<svg fill=\'%23d4af37\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>") no-repeat right 10px center/16px' }} 
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    required
                  >
                    <option value="" style={{ color: '#000' }}>Select Program</option>
                    {INITIAL_DEGREE_PROGRAMS.map(p => (
                      <option key={p.id} value={p.id} style={{ color: '#000' }}>{p.degree} in {p.name || p.title}</option>
                    ))}
                  </select>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, boxSizing: 'border-box' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Elective Track <span style={{ color: '#ef4444' }}>*</span></label>
                  <select 
                    style={{ padding: '12px 30px 12px 12px', border: '1px solid var(--border-gold)', borderRadius: '6px', outline: 'none', color: 'var(--text-main)', width: '100%', boxSizing: 'border-box', appearance: 'none', background: 'transparent url("data:image/svg+xml;utf8,<svg fill=\'%23d4af37\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>") no-repeat right 10px center/16px' }} 
                    value={elective}
                    onChange={(e) => setElective(e.target.value)}
                    required
                  >
                    <option value="general" style={{ color: '#000' }}>General Track</option>
                    <option value="advanced" style={{ color: '#000' }}>Advanced Honors</option>
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '10px', minWidth: 0, boxSizing: 'border-box' }}>
                  <input type="checkbox" id="consent" required style={{ marginTop: '3px', cursor: 'pointer' }}/>
                  <label htmlFor="consent" style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.5', cursor: 'pointer' }}>
                    I consent to receive communications from the University and its representatives via Email, SMS, WhatsApp, Call, or any other electronic medium for updates and notifications. This consent overrides DND/NDNC preferences.
                  </label>
                </div>
                
                <div style={{ gridColumn: '1 / -1', marginTop: '10px', minWidth: 0, boxSizing: 'border-box' }}>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    style={{ width: '100%', padding: '16px', background: 'var(--gold-primary)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 0 15px var(--gold-glow)', boxSizing: 'border-box' }}
                  >
                    {isSubmitting ? 'Sending Confirmation Email...' : 'Submit Registration →'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
      
      {/* Footer text */}
      <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'var(--font-body)' }}>
        © University of East Florida. All Rights Reserved.
      </div>
    </div>
  );
}
