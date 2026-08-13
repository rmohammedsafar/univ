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
    setUploadProgress(0);

    try {
      const totalFiles = marksheetFiles.length + idFiles.length;
      const progressMap = new Map();

      const handleProgress = (fileId, prog) => {
        progressMap.set(fileId, prog);
        if (totalFiles > 0) {
          let sum = 0;
          progressMap.forEach(v => sum += v);
          setUploadProgress(Math.round(sum / totalFiles));
        }
      };

      // 1. Upload files to Firebase Storage concurrently
      const marksheetUploads = marksheetFiles.map((file, idx) => uploadDocument(file, 'applications/marksheets', p => handleProgress(`m_${idx}`, p)));
      const idUploads = idFiles.map((file, idx) => uploadDocument(file, 'applications/ids', p => handleProgress(`i_${idx}`, p)));

      const marksheetUrls = await Promise.all(marksheetUploads);
      const idUrls = await Promise.all(idUploads);

      const prog = programs.find(p => p.id === targetProgram) || programs[0];
      const score = parseInt(gpaPercent);
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
        submittedAt: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        marksheetCount: marksheetFiles.length || 0,
        marksheetUrls: marksheetUrls.filter(url => url !== null),
        idUploaded: idFiles.length > 0 ? 'Verified Passport/ID' : 'Pending Verification',
        idUrls: idUrls.filter(url => url !== null)
      };

      await saveApplicationRecord(appData);
      // Run email dispatch in the background so the user doesn't have to wait
      sendConfirmationEmail(appData).catch(e => console.error("Background email error:", e));
      setSubmittedApp(appData);
      
      // Reset all form fields
      setFullName('');
      setEmail('');
      setCountry('');
      setPhoneCode('+1');
      setPhone('');
      setPreviousSchool('');
      setTargetProgram(selectedProgramId || '');
      setHighestQual('');
      setMarksheetFiles([]);
      setIdFiles([]);

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
                <select className="form-select" style={{ width: '130px', padding: '12px' }} value={phoneCode} onChange={e => setPhoneCode(e.target.value)}>
                  <option value="+1">+1 (US/CA)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+91">+91 (IN)</option>
                  <option value="+61">+61 (AU)</option>
                  <option value="+971">+971 (AE)</option>
                  <option value="+966">+966 (SA)</option>
                  <option value="+20">+20 (EG)</option>
                  <option value="+234">+234 (NG)</option>
                  <option value="+27">+27 (ZA)</option>
                  <option value="+86">+86 (CN)</option>
                  <option value="+81">+81 (JP)</option>
                  <option value="+49">+49 (DE)</option>
                  <option value="+33">+33 (FR)</option>
                  <option value="+39">+39 (IT)</option>
                  <option value="+34">+34 (ES)</option>
                  <option value="+55">+55 (BR)</option>
                  <option value="+52">+52 (MX)</option>
                  <option value="+65">+65 (SG)</option>
                  <option value="+60">+60 (MY)</option>
                  <option value="+62">+62 (ID)</option>
                  <option value="+63">+63 (PH)</option>
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
          <div className="form-group">
            <label className="form-label">Previous High School / College / University Name *</label>
            <input type="text" className="form-control" placeholder="e.g. St. Jude High School / State University"
              value={previousSchool} onChange={e => setPreviousSchool(e.target.value)} required />
          </div>

          {/* Row 5: SIDE-BY-SIDE STYLED DROP ZONES */}
          <div className="form-grid-2" style={{ marginBottom: '24px' }}>

            {/* Marksheet Uploader */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', minHeight: '42px' }}>
                <span style={{ color: '#d4af37' }}>📁</span> UPLOAD MARKSHEET / TRANSCRIPTS *
              </label>
              <div
                className={`drop-zone${marksheetActive ? ' drop-zone-active' : ''}`}
                onClick={() => marksheetRef.current.click()}
                onDragOver={e => { e.preventDefault(); setMarksheetActive(true); }}
                onDragLeave={() => setMarksheetActive(false)}
                onDrop={e => handleDrop(e, setMarksheetFiles, setMarksheetActive)}
                style={{ minHeight: '120px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <div className="drop-icon" style={{ fontSize: '30px', margin: 0 }}>📚</div>
                <input
                  ref={marksheetRef}
                  type="file"
                  multiple
                  className="hidden-file-input"
                  onChange={e => setMarksheetFiles(Array.from(e.target.files))}
                />
                {marksheetFiles.length > 0 && (
                  <div style={{ position: 'absolute', bottom: '10px' }}>
                    {marksheetFiles.map((f, i) => (
                      <div key={i} style={{ fontSize: '11px', color: '#34d399', background: 'rgba(16,185,129,0.1)', padding: '3px 8px', borderRadius: '4px', marginTop: '4px' }}>
                        ✅ {f.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Nationality ID Uploader */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', minHeight: '42px' }}>
                <span style={{ color: '#63b3ed' }}>🪪</span> UPLOAD PASSPORT / GOVT ID (NATIONALITY VERIFICATION) *
              </label>
              <div
                className={`drop-zone${idActive ? ' drop-zone-active' : ''}`}
                onClick={() => idRef.current.click()}
                onDragOver={e => { e.preventDefault(); setIdActive(true); }}
                onDragLeave={() => setIdActive(false)}
                onDrop={e => handleDrop(e, setIdFiles, setIdActive)}
                style={{ minHeight: '120px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <div className="drop-icon" style={{ fontSize: '30px', margin: 0 }}>🪪</div>
                <input
                  ref={idRef}
                  type="file"
                  className="hidden-file-input"
                  onChange={e => setIdFiles(Array.from(e.target.files))}
                />
                {idFiles.length > 0 && (
                  <div style={{ position: 'absolute', bottom: '10px' }}>
                    {idFiles.map((f, i) => (
                      <div key={i} style={{ fontSize: '11px', color: '#34d399', background: 'rgba(16,185,129,0.1)', padding: '3px 8px', borderRadius: '4px', marginTop: '4px' }}>
                        ✅ {f.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: '14px', fontSize: '15px' }} disabled={isSubmitting}>
            {isSubmitting ? (uploadProgress > 0 && uploadProgress < 100 ? `⏳ Uploading Documents... (${uploadProgress}%)` : '⏳ Finalizing Submission...') : '🎓 Submit Official Application'}
          </button>
        </form>

      </div>
    </section>
  );
}
