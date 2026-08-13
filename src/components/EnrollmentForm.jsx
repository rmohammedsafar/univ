import React, { useState, useRef } from 'react';
import { saveApplicationRecord, uploadDocument } from '../services/firebase';
import { sendConfirmationEmail } from '../services/emailService';
import { GLOBAL_COUNTRIES } from '../data/countryStateData';

export default function EnrollmentForm({ programs, selectedProgramId }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [phoneCode, setPhoneCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [previousSchool, setPreviousSchool] = useState('');
  const [targetProgram, setTargetProgram] = useState(selectedProgramId || '');
  const [highestQual, setHighestQual] = useState('');
  const [gpaPercent, setGpaPercent] = useState('82');
  const [marksheetFiles, setMarksheetFiles] = useState([]);
  const [idFiles, setIdFiles] = useState([]);
  const [marksheetActive, setMarksheetActive] = useState(false);
  const [idActive, setIdActive] = useState(false);
  const [submittedApp, setSubmittedApp] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const marksheetRef = useRef();
  const idRef = useRef();

  const handleDrop = (e, setter, setActive) => {
    e.preventDefault();
    setActive(false);
    const files = Array.from(e.dataTransfer.files);
    setter(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const prog = programs.find(p => p.id === targetProgram) || programs[0];
      const appData = {
        fullName,
        email,
        phone: `${phoneCode} ${phone}`,
        country,
        state,
        previousSchool,
        programId: prog?.id,
        programTitle: prog?.title || prog?.name || 'Selected Program',
        highestQual,
        gpaPercent: `${gpaPercent}%`,
        submittedAt: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      };

      // Instant UI transition to success view
      setSubmittedApp(appData);
      setIsSubmitting(false);
      
      // Parallel background save to Firebase & Nodemailer email dispatch
      Promise.all([
        saveApplicationRecord(appData),
        sendConfirmationEmail(appData)
      ]).catch(e => console.error("Background application dispatch error:", e));
      
      // Reset all form fields
      setFullName('');
      setEmail('');
      setCountry('');
      setState('');
      setPhoneCode('+1');
      setPhone('');
      setPreviousSchool('');
      setTargetProgram(selectedProgramId || '');
      setHighestQual('');

      alert('🎉 Application Submitted Successfully!');
    } catch (error) {
      console.error("Submission failed:", error);
      alert('Error submitting application: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-wrapper" id="applySection">
      <div className="section-header">
        <h2 className="section-title">ENROLL NOW</h2>
      </div>

      <div className="application-portal-box" style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <h3 style={{ fontSize: '18px', color: 'var(--gold-light)', fontFamily: 'var(--font-serif)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📝 STUDENT PROFILE & ACADEMIC DETAILS
        </h3>

        <form onSubmit={handleSubmit}>

          {/* Row 1 */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Full Legal Name *</label>
              <input type="text" className="form-control" placeholder="e.g. Alexander Hamilton"
                value={fullName} onChange={e => setFullName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input type="email" className="form-control" placeholder="alexander@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>

          {/* Row 2 */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select className="form-select" style={{ width: '135px', minWidth: '135px', padding: '12px 6px' }} value={phoneCode} onChange={e => setPhoneCode(e.target.value)}>
                  {GLOBAL_COUNTRIES.map(c => (
                    <option key={c.code} value={c.phoneCode}>
                      {c.flag} {c.phoneCode} ({c.code})
                    </option>
                  ))}
                </select>
                <input type="tel" className="form-control" placeholder="555-019-2834"
                  value={phone} onChange={e => setPhone(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Country of Residence *</label>
              <select className="form-select" value={country} onChange={handleCountryChange} required>
                <option value="" disabled hidden>-- Select Country of Residence --</option>
                {GLOBAL_COUNTRIES.map(c => (
                  <option key={c.code} value={`${c.flag} ${c.name}`}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">State / Province *</label>
              <select 
                className="form-select" 
                value={state} 
                onChange={e => setState(e.target.value)} 
                required
                disabled={!country}
              >
                <option value="" disabled hidden>
                  {country ? '-- Select State / Province --' : '-- Select Country First --'}
                </option>
                {availableStates.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3 */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Highest Qualification *</label>
              <select className="form-select" value={highestQual} onChange={e => setHighestQual(e.target.value)} required>
                <option value="" disabled hidden>-- Select Highest Qualification --</option>
                <option>SSLC / Secondary School (10th)</option>
                <option>Plus Two / Higher Secondary (12th)</option>
                <option>Bachelor's Degree / Graduation (B.A., B.Sc, B.Com)</option>
                <option>B.Tech / B.E. Engineering Degree</option>
                <option>Master's Degree / Post Graduation (M.A., M.Sc, M.Tech)</option>
                <option>Doctorate / Ph.D.</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Degree Program *</label>
              <select className="form-select" value={targetProgram} onChange={e => setTargetProgram(e.target.value)} required>
                <option value="" disabled hidden>-- Select Degree Program --</option>
                {programs.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.degree ? `${p.degree} in ` : ''}{p.title || p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4 */}
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Previous High School / College / University Name *</label>
            <input type="text" className="form-control" placeholder="e.g. St. Jude High School / State University"
              value={previousSchool} onChange={e => setPreviousSchool(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: '14px', fontSize: '15px' }} disabled={isSubmitting}>
            {isSubmitting ? '⏳ Submitting Application...' : '🎓 Submit Official Application'}
          </button>
        </form>

      </div>
    </section>
  );
}
