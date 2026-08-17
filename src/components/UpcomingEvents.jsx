import React, { useRef } from 'react';

const EVENTS = [
  {
    id: 1,
    title: 'Global Scholars Symposium',
    desc: 'Celebrate the beauty of diversity at the Global Scholars Symposium! Indulge in a global feast of academic presentations, captivating performances, and lively discussions.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    day: '28',
    month: 'Sept',
    location: 'Virtual Conference Hall',
    time: '6:00 PM - 9:00 PM EST'
  },
  {
    id: 2,
    title: 'Tech Innovation Hackathon',
    desc: 'Unleash your coding skills at our annual online Hackathon! Whether you are a seasoned developer or a beginner, this hands-on session offers exciting challenges.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    day: '15',
    month: 'Oct',
    location: 'Online Dev Portal',
    time: '9:00 AM - 5:00 PM EST'
  },
  {
    id: 3,
    title: 'Alumni Networking Mixer',
    desc: 'Connect with successful UEF alumni from around the globe. Join us for an unforgettable evening of storytelling, career advice, and professional networking.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    day: '05',
    month: 'Nov',
    location: 'Networking Lounge',
    time: '7:00 PM - 9:00 PM EST'
  },
  {
    id: 4,
    title: 'Virtual Career Fair',
    desc: 'Meet top employers and explore internship and job opportunities. Prepare your resume and get ready to engage with recruiters from leading global companies.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    day: '20',
    month: 'Nov',
    location: 'Main Auditorium',
    time: '10:00 AM - 4:00 PM EST'
  },
  {
    id: 5,
    title: 'Cultural Exchange Night',
    desc: 'Lights, camera, culture! Watch films that highlight the uniqueness of different cultures and join our open panel discussions hosted by international students.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    day: '01',
    month: 'Dec',
    location: 'Student Union Hub',
    time: '6:00 PM - 10:00 PM EST'
  }
];

export default function UpcomingEvents() {
  const scrollRef = useRef(null);
  const [showAllModal, setShowAllModal] = React.useState(false);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <section style={{ 
      backgroundColor: '#f4ecd8', 
      padding: '80px 5%', 
      fontFamily: 'var(--font-body, sans-serif)',
      color: '#2c2a29',
      borderTop: '1px solid #e2d7c1'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header Area */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end', 
          marginBottom: '40px' 
        }} className="scroll-reveal">
          <h2 style={{ 
            fontSize: '42px', 
            fontFamily: 'var(--font-serif, serif)', 
            fontWeight: 'normal',
            margin: 0
          }}>
            Upcoming Events
          </h2>
          <button 
            onClick={() => setShowAllModal(true)}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              letterSpacing: '1px',
              cursor: 'pointer',
              color: '#2c2a29',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            VIEW ALL <span>→</span>
          </button>
        </div>

        {/* Scrollable Events Container */}
        <div 
          ref={scrollRef}
          style={{ 
            display: 'flex', 
            gap: '30px', 
            overflowX: 'auto', 
            paddingBottom: '20px',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none'  /* IE/Edge */
          }}
          className="hide-scrollbar scroll-reveal"
        >
          {EVENTS.map((ev) => (
            <div 
              key={ev.id} 
              style={{ 
                minWidth: '340px', 
                maxWidth: '340px', 
                flex: '0 0 auto',
                scrollSnapAlign: 'start',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <img 
                src={ev.image} 
                alt={ev.title} 
                style={{ 
                  width: '100%', 
                  height: '220px', 
                  objectFit: 'cover', 
                  borderRadius: '12px',
                  marginBottom: '20px'
                }} 
              />
              
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                marginBottom: '10px',
                color: '#2c2a29'
              }}>
                {ev.title}
              </h3>
              
              <p style={{ 
                fontSize: '14px', 
                lineHeight: '1.6', 
                color: '#54504c', 
                marginBottom: '25px',
                flex: 1
              }}>
                {ev.desc}
              </p>

              {/* Date & Location Block */}
              <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', alignItems: 'center' }}>
                {/* Date */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ fontSize: '36px', fontFamily: 'var(--font-serif, serif)' }}>{ev.day}</span>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', flexDirection: 'column' }}>
                    <span>{ev.month}</span>
                  </span>
                </div>
                
                {/* Vertical Divider */}
                <div style={{ width: '1px', height: '30px', backgroundColor: '#d4c4af' }}></div>

                {/* Location & Time */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#54504c' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>📍</span> {ev.location}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🕒</span> {ev.time}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* MODAL FOR VIEW ALL EVENTS */}
      {showAllModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-card, #fff)',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '80vh',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-gold, #e2d7c1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-dark, #1f2937)' }}>
              <h3 style={{ margin: 0, fontSize: '20px', color: 'var(--gold-light, #d4af37)', fontFamily: 'var(--font-serif, serif)' }}>All Upcoming Events</h3>
              <button 
                onClick={() => setShowAllModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted, #9ca3af)', fontSize: '24px', cursor: 'pointer', lineHeight: 1 }}
              >
                &times;
              </button>
            </div>
            
            {/* Modal Body */}
            <div style={{ padding: '20px', overflowY: 'auto', background: 'var(--bg-main, #111827)' }} className="hide-scrollbar">
              {EVENTS.map((ev) => (
                <div key={ev.id} style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', paddingBottom: '20px' }}>
                  <img src={ev.image} alt={ev.title} style={{ width: '120px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: 'var(--text-main, #f3f4f6)', fontWeight: 600 }}>{ev.title}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-muted, #9ca3af)', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--gold-primary, #d4af37)', fontWeight: 'bold' }}>{ev.day} {ev.month}</span>
                      <span>•</span>
                      <span>{ev.time}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted, #9ca3af)' }}>
                      📍 {ev.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
