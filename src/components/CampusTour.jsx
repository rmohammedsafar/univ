import React, { useState } from 'react';

const ROOMS = [
  {
    id: 'library',
    label: '🏛️ Digital Research Library',
    title: '📚 Digital Research Library & E-Archives',
    desc: 'Access over 500,000 academic e-books, peer-reviewed journals, doctoral dissertations, and digitized historical research databases 24 hours a day, 7 days a week.',
    stats: [
      { label: 'Licensed E-Books',    val: '500,000+' },
      { label: 'Research Databases',  val: '120+' },
      { label: 'Access Protocol',     val: '24/7 Unlimited SSO', green: true },
      { label: 'Librarian Support',   val: 'Live Chat Active',   green: true },
    ],
    cta: { label: '🔬 Explore Academic Research Papers', href: '#researchPapersSection' },
    img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
    imgAlt: 'Digital Research Library',
  },
  {
    id: 'lms',
    label: '💻 LMS Virtual Auditorium',
    title: '💻 LMS Virtual Lecture Auditorium',
    desc: 'Our state-of-the-art Learning Management System streams HD recorded lectures, live virtual seminars, and asynchronous coursework accessible from any device globally.',
    stats: [
      { label: 'Recorded Lectures',  val: '8,000+' },
      { label: 'Live Seminars/Year', val: '240+' },
      { label: 'HD Stream Quality',  val: '1080p 60fps', green: true },
      { label: 'LMS Platform',       val: 'Canvas / Moodle', green: true },
    ],
    cta: { label: '📚 Browse Degree Programs', href: '#programs' },
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    imgAlt: 'Virtual Lecture Hall',
  },
  {
    id: 'portal',
    label: '📊 Student Advisory Portal',
    title: '📊 Student Advisory & Marks Portal',
    desc: 'A personalised dashboard where enrolled students track grades, submit coursework, access financial statements, download transcripts, and communicate with faculty advisors.',
    stats: [
      { label: 'Active Students',    val: '15,000+' },
      { label: 'Course Modules',     val: '340+' },
      { label: 'GPA Tracking',       val: 'Real-Time', green: true },
      { label: 'Advisor Response',   val: '< 24 Hours', green: true },
    ],
    cta: { label: '✍️ Apply & Upload Marksheets', href: '#applySection' },
    img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
    imgAlt: 'Student Advisory Portal',
  },
  {
    id: 'hq',
    label: '📍 USA Headquarters Offices',
    title: '📍 USA Administrative Headquarters',
    desc: 'Our Orlando, Florida headquarters houses the Registrar Office, Admissions Department, and International Degree Verification Unit. All transcript authentication and official correspondence is processed here.',
    stats: [
      { label: 'HQ Location',       val: 'Orlando, FL 32816' },
      { label: 'Staff Members',     val: '120+ Faculty' },
      { label: 'Office Hours',      val: 'Mon–Fri 8AM–6PM EST', green: true },
      { label: 'Toll-Free Line',    val: '+1 (800) 555-UEF1', green: true },
    ],
    cta: { label: '📍 View USA Headquarters', href: '#usaHeadquarters' },
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1200&q=80',
    imgAlt: 'USA Headquarters Office Building',
  },
];

export default function CampusTour() {
  const [activeTab, setActiveTab] = useState('library');
  const room = ROOMS.find(r => r.id === activeTab);

  return (
    <section className="section-wrapper" id="campusTour">
      <div className="section-header">
        <span className="section-tag">100% Digital Environment</span>
        <h2 className="section-title">VIRTUAL CAMPUS TOUR</h2>
        <p className="section-desc">
          Experience our state-of-the-art virtual university infrastructure. Explore the Digital Research Library, Virtual Lecture Halls, Student Portal, and USA Administration Offices.
        </p>
      </div>

      {/* INTERACTIVE ROOM TABS */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px', justifyContent: 'center' }}>
        {ROOMS.map(r => (
          <button
            key={r.id}
            className={`btn ${activeTab === r.id ? 'btn-gold' : 'btn-outline'}`}
            style={{ padding: '8px 16px', fontSize: '13px', transition: 'all 0.25s' }}
            onClick={() => setActiveTab(r.id)}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* ROOM DISPLAY */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-gold)',
        borderRadius: '16px',
        overflow: 'hidden',
        padding: '28px',
      }}>
        <div className="tour-grid-2">

          {/* Info Column */}
          <div>
            <h3 style={{ fontSize: '22px', color: 'var(--gold-light)', fontFamily: 'var(--font-serif)', marginBottom: '12px' }}>
              {room.title}
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '20px' }}>
              {room.desc}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'var(--bg-dark)', padding: '16px', borderRadius: '12px', marginBottom: '22px' }}>
              {room.stats.map(s => (
                <div key={s.label}>
                  <span style={{ fontSize: '11px', color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {s.label}
                  </span>
                  <div style={{ fontSize: s.green ? '14px' : '18px', fontWeight: 'bold', color: s.green ? '#34d399' : '#fff', marginTop: '2px' }}>
                    {s.val}
                  </div>
                </div>
              ))}
            </div>

            <a href={room.cta.href} className="btn btn-gold" style={{ display: 'inline-flex', padding: '10px 20px', fontSize: '13px' }}>
              {room.cta.label}
            </a>
          </div>

          {/* Image Column */}
          <div>
            <img
              src={room.img}
              alt={room.imgAlt}
              style={{
                width: '100%',
                height: '320px',
                objectFit: 'cover',
                borderRadius: '14px',
                border: '1px solid var(--border-gold)',
                transition: 'opacity 0.3s',
              }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
