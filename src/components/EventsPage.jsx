import React, { useEffect } from 'react';

export const EVENTS = [
  {
    id: 1,
    title: 'Global Scholars Symposium',
    desc: 'Celebrate the beauty of diversity at the Global Scholars Symposium! Indulge in a global feast of academic presentations, captivating performances, and lively discussions.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    day: '28',
    month: 'Sept',
    location: 'Virtual Conference Hall',
    time: '6:00 PM - 9:00 PM EST',
    link: 'https://un-mu.vercel.app/apply'
  },
  {
    id: 2,
    title: 'Tech Innovation Hackathon',
    desc: 'Unleash your coding skills at our annual online Hackathon! Whether you are a seasoned developer or a beginner, this hands-on session offers exciting challenges.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    day: '15',
    month: 'Oct',
    location: 'Online Dev Portal',
    time: '9:00 AM - 5:00 PM EST',
    link: 'https://un-mu.vercel.app/apply'
  },
  {
    id: 3,
    title: 'Alumni Networking Mixer',
    desc: 'Connect with successful UEF alumni from around the globe. Join us for an unforgettable evening of storytelling, career advice, and professional networking.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    day: '05',
    month: 'Nov',
    location: 'Networking Lounge',
    time: '7:00 PM - 9:00 PM EST',
    link: 'https://un-mu.vercel.app/apply'
  },
  {
    id: 4,
    title: 'Virtual Career Fair',
    desc: 'Meet top employers and explore internship and job opportunities. Prepare your resume and get ready to engage with recruiters from leading global companies.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    day: '20',
    month: 'Nov',
    location: 'Main Auditorium',
    time: '10:00 AM - 4:00 PM EST',
    link: 'https://un-mu.vercel.app/apply'
  },
  {
    id: 5,
    title: 'Cultural Exchange Night',
    desc: 'Lights, camera, culture! Watch films that highlight the uniqueness of different cultures and join our open panel discussions hosted by international students.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    day: '01',
    month: 'Dec',
    location: 'Student Union Hub',
    time: '6:00 PM - 10:00 PM EST',
    link: 'https://un-mu.vercel.app/apply'
  }
];

export default function EventsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5%' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '48px', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', margin: '15px 0' }}>
            All Upcoming Events
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Browse our full schedule of upcoming seminars, networking events, and academic symposiums.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '40px' 
        }}>
          {EVENTS.map(ev => (
            <div key={ev.id} style={{
              background: 'var(--bg-card)',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s ease'
            }}
            className="event-card-hover"
            >
              <img src={ev.image} alt={ev.title} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '20px', color: 'var(--text-main)', marginBottom: '12px', fontWeight: 600 }}>{ev.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', flex: 1, marginBottom: '24px' }}>
                  {ev.desc}
                </p>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-gold)', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '50px' }}>
                    <span style={{ fontSize: '28px', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', lineHeight: 1 }}>{ev.day}</span>
                    <span style={{ fontSize: '12px', color: 'var(--gold-primary)', fontWeight: 'bold', textTransform: 'uppercase' }}>{ev.month}</span>
                  </div>
                  <div style={{ width: '1px', height: '30px', backgroundColor: 'var(--border-gold)' }}></div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span>📍 {ev.location}</span>
                    <span>🕒 {ev.time}</span>
                  </div>
                </div>
                {ev.link && (
                  <a
                    href={ev.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '12px',
                      background: 'linear-gradient(135deg, var(--gold-primary), var(--gold-light))',
                      color: '#000',
                      fontWeight: '700',
                      fontSize: '14px',
                      textAlign: 'center',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      letterSpacing: '0.5px',
                      transition: 'opacity 0.2s ease'
                    }}
                    onMouseEnter={e => e.target.style.opacity = '0.85'}
                    onMouseLeave={e => e.target.style.opacity = '1'}
                  >
                    Register Now →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
      <style>{`
        .event-card-hover:hover {
          transform: translateY(-8px);
        }
      `}</style>
    </div>
  );
}