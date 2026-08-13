import React from 'react';
import ResearchPapers from './ResearchPapers';
import UniversityBulletin from './UniversityBulletin';
import { INITIAL_CONTACT_INFO } from '../data/initialData';

const MOCK_EVENTS = [
  { id: 1, title: 'Annual Tech Symposium 2026', date: 'October 15, 2026', desc: 'Join industry leaders and our top researchers for a day of innovation and networking. Explore the latest advancements in AI and Quantum Computing.' },
  { id: 2, title: 'Global Business Leaders Panel', date: 'November 2, 2026', desc: 'A panel discussion featuring CEOs from top Fortune 500 companies sharing insights on the future of global markets and economic trends.' },
  { id: 3, title: 'Winter Alumni Gala', date: 'December 12, 2026', desc: 'Celebrate the achievements of our alumni community with an elegant evening of dining, entertainment, and the annual alumni awards.' },
];

export default function GalleryPage({ researchPapers, newsArticles }) {
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

      <main style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%', flex: 1 }}>
        <h1 style={{ fontSize: '46px', color: 'var(--gold-primary)', textAlign: 'center', marginBottom: '80px', fontFamily: 'var(--font-serif)', textShadow: '0 0 20px rgba(212, 175, 55, 0.3)' }}>University Gallery & Publications</h1>
        
        {/* Events Section */}
        <section style={{ marginBottom: '100px' }}>
          <h2 style={{ fontSize: '32px', color: 'var(--text-main)', borderBottom: '1px solid var(--border-gold)', paddingBottom: '15px', marginBottom: '40px', fontFamily: 'var(--font-serif)' }}>University Events</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            {MOCK_EVENTS.map(event => (
              <div key={event.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)', borderRadius: '16px', padding: '30px', transition: 'transform 0.3s, boxShadow 0.3s', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(212, 175, 55, 0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)'; }}>
                <h3 style={{ color: 'var(--gold-primary)', margin: '0 0 15px', fontSize: '22px', fontFamily: 'var(--font-serif)' }}>{event.title}</h3>
                <p style={{ color: '#9ca3af', fontSize: '14px', margin: '0 0 20px', fontWeight: 'bold' }}>📅 {event.date}</p>
                <p style={{ color: 'var(--text-main)', lineHeight: '1.7', margin: '0', fontSize: '15px' }}>{event.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <ResearchPapers researchPapers={researchPapers} />
        
        <div style={{ height: '60px' }}></div>
        
        <UniversityBulletin newsArticles={newsArticles} />
      </main>
      
      {/* Footer text */}
      <div style={{ textAlign: 'center', padding: '25px', color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'var(--font-body)', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        © University of East Florida. All Rights Reserved.
      </div>
    </div>
  );
}
