import React, { useState } from 'react';
import { INITIAL_CONTACT_INFO } from '../data/initialData';

// 12 Guaranteed working Unsplash IDs for universities/education
const ALL_GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80'
];

export default function GalleryPage() {
  const [showAll, setShowAll] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const imagesToShow = showAll ? ALL_GALLERY_IMAGES : ALL_GALLERY_IMAGES.slice(0, 6);

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
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 40px', alignItems: 'center', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src="/assets/logo.jpg" alt="Logo" style={{ height: '40px', borderRadius: '50%' }} onError={(e) => { e.target.style.display='none' }}/>
          <span style={{ color: '#2c2a29', fontSize: '20px', fontWeight: 'bold', letterSpacing: '1px', fontFamily: 'var(--font-serif, serif)' }}>UNIVERSITY OF EAST FLORIDA</span>
        </div>
        <div style={{ color: '#2c2a29', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
          📞 {INITIAL_CONTACT_INFO.phone}
        </div>
      </header>

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

        {!showAll && (
          <div style={{ textAlign: 'center' }}>
            <button 
              onClick={() => setShowAll(true)}
              style={{ 
                background: 'transparent', 
                border: '1px solid #2c2a29', 
                color: '#2c2a29', 
                padding: '10px 28px', 
                borderRadius: '30px', 
                fontSize: '13px', 
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
