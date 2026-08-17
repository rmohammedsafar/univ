import React, { useState } from 'react';
import { INITIAL_CONTACT_INFO } from '../data/initialData';

const ALL_GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80',
  
  // Additional Images
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1427504494785-319ce8372ac0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
];

export default function GalleryPage() {
  const [showAll, setShowAll] = useState(false);

  const imagesToShow = showAll ? ALL_GALLERY_IMAGES : ALL_GALLERY_IMAGES.slice(0, 6);

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
            <div key={idx} style={{ breakInside: 'avoid', marginBottom: '20px', borderRadius: '6px', overflow: 'hidden' }}>
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
                padding: '8px 24px', 
                borderRadius: '24px', 
                fontSize: '12px', 
                letterSpacing: '1px', 
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              VIEW ALL →
            </button>
          </div>
        )}
      </main>
      
      {/* Footer text */}
      <div style={{ textAlign: 'center', padding: '25px', color: '#2c2a29', fontSize: '13px', marginTop: 'auto', opacity: 0.6 }}>
        © University of East Florida. All Rights Reserved.
      </div>
    </div>
  );
}
