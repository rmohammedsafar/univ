import React from 'react';

export default function LoadingScreen({ isFading }) {
  return (
    <div className={`loading-overlay ${isFading ? 'fade-out' : ''}`}>
      {/* Background Light Glow Aura */}
      <div className="loading-light-aura"></div>

      <div className="loading-content">
        {/* Square Logo Container with Center Zoom Animation */}
        <div className="loading-logo-wrapper">
          <div className="loading-logo-glow"></div>
          <img 
            src="/assets/logo.jpg" 
            alt="University of East Florida Logo" 
            className="loading-square-logo"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>

        {/* University Name & Loading Text */}
        <div className="loading-text-group">
          <h2 className="loading-univ-title">UNIVERSITY OF EAST FLORIDA</h2>
          <div className="loading-subtext">
            <span>Loading Official Portal</span>
            <span className="loading-dots">
              <span>.</span><span>.</span><span>.</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
