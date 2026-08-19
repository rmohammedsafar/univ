import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPortal from './AdminPortal';
import { saveCMSConfigToStorage, saveTourConfigToStorage, saveContactConfigToStorage, saveHeroConfigToStorage, saveAboutUsToStorage, saveGalleryToStorage, saveElectivesToStorage, saveEventsToStorage, saveVideosToStorage } from '../services/firebase';

export default function AdminPage({ programs, onUpdatePrograms, tourSlides, onUpdateTour, contactInfo, onUpdateContact, heroConfig, onUpdateHero, aboutData, onUpdateAbout, galleryImages, onUpdateGallery, electives, onUpdateElectives, events, onUpdateEvents, videos, onUpdateVideos }) {
  const navigate = useNavigate();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    if (!adminEmail || !adminPass) {
      setLoginError("Please enter both your Admin email and password.");
      return;
    }

    if (adminEmail !== 'r.mohammedsafar@gmail.com' || adminPass !== 'Admin@2026') {
      setLoginError("Invalid username or password.");
      return;
    }

    setLoginError('');
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    navigate('/');
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
        contactInfo={contactInfo}
        onUpdateContact={(updatedContact) => {
          onUpdateContact(updatedContact);
          saveContactConfigToStorage(updatedContact);
        }}
        heroConfig={heroConfig}
        onUpdateHero={(updatedHero) => {
          onUpdateHero(updatedHero);
          saveHeroConfigToStorage(updatedHero);
        }}
        aboutData={aboutData}
        onUpdateAbout={(updatedAbout) => {
          onUpdateAbout(updatedAbout);
          saveAboutUsToStorage(updatedAbout);
        }}
        galleryImages={galleryImages}
        onUpdateGallery={(updatedGallery) => {
          onUpdateGallery(updatedGallery);
          saveGalleryToStorage(updatedGallery);
        }}
        electives={electives}
        onUpdateElectives={(updatedElectives) => {
          onUpdateElectives(updatedElectives);
          saveElectivesToStorage(updatedElectives);
        }}
        events={events}
        onUpdateEvents={(updatedEvents) => {
          onUpdateEvents(updatedEvents);
          saveEventsToStorage(updatedEvents);
        }}
        videos={videos}
        onUpdateVideos={(updatedVideos) => {
          onUpdateVideos(updatedVideos);
          saveVideosToStorage(updatedVideos);
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
                placeholder=""
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required 
                style={{ padding: '10px 14px' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="form-control" 
                  placeholder="" 
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  required 
                  style={{ padding: '10px 14px', paddingRight: '40px' }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--text-muted)' }}
                  title={showPassword ? "Hide Password" : "Show Password"}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            {loginError && (
              <div style={{ color: '#ef4444', fontSize: '14px', marginTop: '16px', textAlign: 'center', fontWeight: 'bold' }}>
                {loginError}
              </div>
            )}
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
