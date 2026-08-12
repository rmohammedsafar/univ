import React, { useState } from 'react';
import AdminPortal from './AdminPortal';
import { saveCMSConfigToStorage, saveTourConfigToStorage, saveResearchConfigToStorage } from '../services/firebase';

export default function AdminPage({ programs, onUpdatePrograms, tourSlides, onUpdateTour, researchPapers, onUpdateResearch }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');

  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    if (!adminEmail) {
      alert("Please enter your Registrar Admin email address.");
      return;
    }

    setIsAdminLoggedIn(true);
    alert(`🎉 Welcome back, Registrar Officer (${adminEmail})! Admin Portal loaded.`);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    alert("Signed out of Admin Portal.");
  };

  if (isAdminLoggedIn) {
    return (
      <AdminPortal 
        programs={programs} 
        onUpdatePrograms={(updatedProgs) => {
          onUpdatePrograms(updatedProgs);
          saveCMSConfigToStorage(updatedProgs);
        }}
        tourSlides={tourSlides}
        onUpdateTour={(updatedSlides) => {
          onUpdateTour(updatedSlides);
          saveTourConfigToStorage(updatedSlides);
        }}
        researchPapers={researchPapers}
        onUpdateResearch={(updatedResearch) => {
          onUpdateResearch(updatedResearch);
          saveResearchConfigToStorage(updatedResearch);
        }}
        onLogout={handleAdminLogout}
      />
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <div className="modal-box" style={{ maxWidth: '440px', width: '100%', position: 'relative', transform: 'none' }}>
        <div className="modal-header">
          <h3 className="modal-title">🔑 Sign In / Admin Portal</h3>
        </div>
        <form onSubmit={handleAdminLoginSubmit}>
          <div className="modal-body" style={{ padding: '24px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Sign in with your University Registrar email (<strong style={{ color: 'var(--gold-light)' }}>r.mohammedsafar@gmail.com</strong>) to manage student applications and course catalog pricing.
            </p>
            <div className="form-group">
              <label className="form-label">Registrar Admin Email *</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="r.mohammedsafar@gmail.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required 
                style={{ padding: '10px 14px' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="••••••••" 
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                required 
                style={{ padding: '10px 14px' }}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="submit" className="btn btn-gold" style={{ padding: '10px 20px', width: '100%' }}>
              🔑 Sign In to Admin Portal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
