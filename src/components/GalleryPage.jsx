import React, { useState } from 'react';
import { INITIAL_CONTACT_INFO } from '../data/initialData';

export default function GalleryPage({ galleryImages }) {
  const [showAll, setShowAll] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const imagesToShow = showAll ? (galleryImages || []) : (galleryImages || []).slice(0, 6);

  const openLightbox = (idx) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  
  const nextImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % imagesToShow.length);
  };
  
  const prevImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? imagesToShow.length - 1 : prev - 1));
  };

  return (
    <div style={{ backgroundColor: '#f4ecd8', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-body, sans-serif)' }}>


      <main style={{ padding: '40px 40px 80px', maxWidth: '1200px', margin: '0 auto', width: '100%', flex: 1 }}>
        <h1 style={{ fontSize: '48px', color: '#2c2a29', textAlign: 'left', marginBottom: '40px', fontFamily: 'var(--font-serif, serif)', fontWeight: 'normal' }}>Gallery</h1>
        
        {/* Gallery Grid */}
        <div style={{ 
          columnCount: 3, 
          columnGap: '20px',
          marginBottom: '60px'
        }}>
          {imagesToShow.map((src, idx) => (
            <div 
              key={idx} 
              onClick={() => openLightbox(idx)}
              style={{ 
                breakInside: 'avoid', 
                marginBottom: '20px', 
                borderRadius: '6px', 
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img src={src} alt={`Gallery image ${idx + 1}`} style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
            </div>
          ))}
        </div>

        {!showAll && (galleryImages && galleryImages.length > 6) && (
          <div style={{ textAlign: 'center' }}>
            <button 
              onClick={() => setShowAll(true)}
              className="btn btn-gold"
              style={{ 
                background: 'transparent', 
                border: '1px solid #2c2a29', 
                color: '#2c2a29', 
                padding: '16px 32px', 
                borderRadius: '30px', 
                fontSize: '16px', 
                letterSpacing: '1px', 
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#2c2a29'; e.currentTarget.style.color = '#f4ecd8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#2c2a29'; }}
            >
              VIEW ALL IMAGES →
            </button>
          </div>
        )}
      </main>
      
      {/* Footer text */}
      <div style={{ textAlign: 'center', padding: '25px', color: '#2c2a29', fontSize: '13px', marginTop: 'auto', opacity: 0.6 }}>
        © University of East Florida. All Rights Reserved.
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div 
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <button 
            onClick={closeLightbox}
            style={{ position: 'absolute', top: '20px', right: '30px', background: 'none', border: 'none', color: 'white', fontSize: '36px', cursor: 'pointer' }}
          >
            ×
          </button>
          
          <button 
            onClick={prevImage}
            style={{ position: 'absolute', left: '30px', background: 'none', border: 'none', color: 'white', fontSize: '48px', cursor: 'pointer' }}
          >
            ‹
          </button>

          <img 
            src={imagesToShow[lightboxIndex]} 
            alt="Enlarged gallery view" 
            style={{ maxHeight: '90vh', maxWidth: '80vw', borderRadius: '4px', objectFit: 'contain' }} 
            onClick={(e) => e.stopPropagation()}
          />

          <button 
            onClick={nextImage}
            style={{ position: 'absolute', right: '30px', background: 'none', border: 'none', color: 'white', fontSize: '48px', cursor: 'pointer' }}
          >
            ›
          </button>
          
          <div style={{ position: 'absolute', bottom: '20px', color: 'white', fontSize: '14px', letterSpacing: '1px' }}>
            {lightboxIndex + 1} / {imagesToShow.length}
          </div>
        </div>
      )}
    </div>
  );
}
