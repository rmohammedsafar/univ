import React, { useState, useEffect } from 'react';
import { saveCMSConfigToStorage, getApplicationRecords, getInquiryRecords } from '../services/firebase';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function AdminPortal({ programs, onUpdatePrograms, tourSlides, onUpdateTour, contactInfo, onUpdateContact, heroConfig, onUpdateHero, aboutData, onUpdateAbout, onLogout }) {
  const [activeTab, setActiveTab] = useState('admissions');
  const [editingProgramId, setEditingProgramId] = useState(null);
  const [showInlineAddPortal, setShowInlineAddPortal] = useState(false);
  const [applications, setApplications] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [admissionsSubTab, setAdmissionsSubTab] = useState('applications');

  const [contactFormData, setContactFormData] = React.useState(contactInfo || {});
  
  React.useEffect(() => {
    if (contactInfo) setContactFormData(contactInfo);
  }, [contactInfo]);

  const handleSaveContact = () => {
    onUpdateContact(contactFormData);
    alert('Contact information updated successfully!');
  };

  const [heroFormData, setHeroFormData] = React.useState(heroConfig || {});
  
  React.useEffect(() => {
    if (heroConfig) setHeroFormData(heroConfig);
  }, [heroConfig]);

  const handleSaveHero = () => {
    onUpdateHero(heroFormData);
    alert('Hero section updated successfully!');
  };

  const [aboutFormData, setAboutFormData] = React.useState(aboutData || {});
  
  React.useEffect(() => {
    if (aboutData) setAboutFormData(aboutData);
  }, [aboutData]);

  const handleSaveAbout = () => {
    onUpdateAbout(aboutFormData);
    alert('About Us section updated successfully!');
  };

  const [editingNewsIndex, setEditingNewsIndex] = useState(null);
  const [newsFormData, setNewsFormData] = useState(null);

  const handleEditNews = (index) => {
    setEditingNewsIndex(index);
    if (index === -1) {
      setNewsFormData({
        id: `news-${Date.now()}`,
        title: 'New University Announcement',
        category: 'UNIVERSITY ANNOUNCEMENT',
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        publisher: 'Internal Press',
        image: '',
        snippet: 'Brief news snippet...',
        link: '#'
      });
    } else {
      setNewsFormData(JSON.parse(JSON.stringify(newsArticles[index])));
    }
  };

  const handleSaveNews = () => {
    const updated = [...(newsArticles || [])];
    if (editingNewsIndex === -1) {
      updated.push(newsFormData);
    } else {
      updated[editingNewsIndex] = newsFormData;
    }
    onUpdateNews(updated);
    setEditingNewsIndex(null);
    setNewsFormData(null);
  };

  const handleDeleteNews = (index) => {
    if (window.confirm('Are you sure you want to delete this news article?')) {
      const updated = [...(newsArticles || [])];
      updated.splice(index, 1);
      onUpdateNews(updated);
    }
  };

  const [editingResearchIndex, setEditingResearchIndex] = useState(null);
  const [researchFormData, setResearchFormData] = useState(null);

  const handleEditResearch = (index) => {
    setEditingResearchIndex(index);
    if (index === -1) {
      setResearchFormData({
        id: `research-${Date.now()}`,
        title: 'New Research Paper Title',
        author: 'Author Name',
        journal: 'Journal/Publication Name (Year)',
        category: 'CATEGORY',
        abstract: 'Abstract text...',
        link: '#'
      });
    } else {
      setResearchFormData(JSON.parse(JSON.stringify(researchPapers[index])));
    }
  };

  const handleSaveResearch = () => {
    const updated = [...(researchPapers || [])];
    if (editingResearchIndex === -1) {
      updated.push(researchFormData);
    } else {
      updated[editingResearchIndex] = researchFormData;
    }
    onUpdateResearch(updated);
    setEditingResearchIndex(null);
    setResearchFormData(null);
  };

  const handleDeleteResearch = (index) => {
    if (window.confirm('Are you sure you want to delete this research paper?')) {
      const updated = [...(researchPapers || [])];
      updated.splice(index, 1);
      onUpdateResearch(updated);
    }
  };

  const [editingSlideIndex, setEditingSlideIndex] = useState(null);
  const [slideFormData, setSlideFormData] = useState(null);

  const handleEditSlide = (index) => {
    setEditingSlideIndex(index);
    if (index === -1) {
      setSlideFormData({
        id: `slide-${Date.now()}`,
        label: 'New Virtual Slide',
        title: 'Virtual Slide Title',
        desc: 'Description goes here.',
        img: '',
        imgAlt: 'Virtual Slide',
        cta: { label: 'Explore', href: '#' },
        stats: [
          { label: 'Stat 1', val: '0', green: false },
          { label: 'Stat 2', val: '0', green: false },
          { label: 'Stat 3', val: '0', green: true },
          { label: 'Stat 4', val: '0', green: true }
        ]
      });
    } else {
      setSlideFormData(JSON.parse(JSON.stringify(tourSlides[index])));
    }
  };

  const handleSaveSlide = () => {
    const updated = [...(tourSlides || [])];
    if (editingSlideIndex === -1) {
      updated.push(slideFormData);
    } else {
      updated[editingSlideIndex] = slideFormData;
    }
    onUpdateTour(updated);
    setEditingSlideIndex(null);
    setSlideFormData(null);
  };

  const handleDeleteSlide = (index) => {
    if (window.confirm('Are you sure you want to delete this virtual tour slide?')) {
      const updated = [...(tourSlides || [])];
      updated.splice(index, 1);
      onUpdateTour(updated);
    }
  };

  // New Program Form State
  const [newProgTitle, setNewProgTitle] = useState('');
  const [newProgDegree, setNewProgDegree] = useState('Master of Science');
  const [newProgCategory, setNewProgCategory] = useState('technology');
  const [newProgTuition, setNewProgTuition] = useState('14400');
  const [newProgDuration, setNewProgDuration] = useState('1.5 Years (100% Online)');
  const [newProgDesc, setNewProgDesc] = useState('Comprehensive 100% remote theoretical curriculum covering core principles, analytical modeling, and digital case studies.');
  const [customDegree, setCustomDegree] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  useEffect(() => {
    async function fetchData() {
      const apps = await getApplicationRecords();
      setApplications(apps);
      const inqs = await getInquiryRecords();
      setInquiries(inqs);
    }
    fetchData();
  }, []);

  const handleAddProgramSubmit = (e) => {
    e.preventDefault();
    if (!newProgTitle.trim()) {
      alert('Please enter a degree program title.');
      return;
    }

    const finalDegree = newProgDegree === 'Other' ? customDegree.trim() : newProgDegree;
    const finalCategory = newProgCategory === 'Other' ? customCategory.trim() : newProgCategory;

    if (newProgDegree === 'Other' && !finalDegree) {
      alert('Please enter a custom degree level.');
      return;
    }
    if (newProgCategory === 'Other' && !finalCategory) {
      alert('Please enter a custom category.');
      return;
    }

    const tuitionVal = parseInt(newProgTuition) || 14400;
    const newProg = {
      id: 'uef-prog-' + Math.floor(100 + Math.random() * 900),
      name: newProgTitle.trim(),
      title: newProgTitle.trim(),
      degree: finalDegree,
      category: finalCategory,
      tuition: `$${tuitionVal.toLocaleString()} USD`,
      numericFee: tuitionVal,
      duration: newProgDuration,
      description: newProgDesc,
      format: "100% Remote / Asynchronous",
      credits: "36 US Credit Hours (12 Core Modules)"
    };

    const updated = [...programs, newProg];
    onUpdatePrograms(updated);
    saveCMSConfigToStorage(updated);

    // Reset Form
    setNewProgTitle('');
    setShowInlineAddPortal(false);
    alert(`🎉 Success! Degree program '${newProgTitle}' has been added and published live!`);
  };

  const handleDeleteProgram = (progId) => {
    if (!window.confirm(`Are you sure you want to delete program ID '${progId}' from the catalog?`)) return;
    const updated = programs.filter(p => p.id !== progId);
    onUpdatePrograms(updated);
    saveCMSConfigToStorage(updated);
  };

  const handleExportExcel = () => {
    if (!applications || applications.length === 0) {
      alert("No applications to export.");
      return;
    }
    const formattedData = applications.map(app => ({
      ID: app.id,
      'Full Name': app.fullName,
      'Email': app.email,
      'Degree Program': app.program,
      'Submitted At': app.submittedAt,
      'Document URL': app.documentUrl
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");
    XLSX.writeFile(workbook, "UEF_Applications.xlsx");
  };

  const handleExportPDF = () => {
    if (!applications || applications.length === 0) {
      alert("No applications to export.");
      return;
    }
    const doc = new jsPDF();
    doc.text("UEF Applications Roster", 14, 15);
    
    const tableColumn = ["ID", "Full Name", "Email", "Degree Program"];
    const tableRows = [];

    applications.forEach(app => {
      const rowData = [
        app.id || 'N/A',
        app.fullName || 'N/A',
        app.email || 'N/A',
        app.program || 'N/A'
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [107, 17, 28] } // Maroon
    });

    doc.save("UEF_Applications.pdf");
  };

  return (
    <section className="section-wrapper" id="adminDashboardSection" style={{ display: 'block' }}>
      <div className="section-header">
        <span className="section-tag" style={{ color: '#34d399' }}>🔑 Administrative Portal</span>
        <h2 className="section-title">Official Student Application & Document Manager</h2>
        <p className="section-desc">
          Logged in as Registrar Officer (<strong style={{ color: 'var(--gold-light)' }}>r.mohammedsafar@gmail.com</strong>). View student profiles, inspect attached marksheets, update admission decisions, and export student roster data.
        </p>
      </div>

      <div className="admin-dashboard-container">
        {/* HEADER ROW */}
        <div className="admin-header-row" style={{ marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '24px', color: '#fff', fontFamily: 'var(--font-serif)', margin: 0 }}>
              📊 Admissions Overview & Student Records
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button className="btn btn-gold" onClick={handleExportExcel} style={{ padding: '8px 14px', fontSize: '13px' }}>
              📊 Export Excel
            </button>
            <button className="btn btn-maroon" onClick={handleExportPDF} style={{ padding: '8px 14px', fontSize: '13px' }}>
              📑 Export PDF
            </button>
            <button className="btn btn-outline" onClick={onLogout} style={{ borderColor: '#ef4444', color: '#f87171', padding: '8px 14px', fontSize: '13px' }}>
              🔒 Logout Admin
            </button>
          </div>
        </div>

        {/* STREAMLINED TAB PILLS */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '28px', borderBottom: '1px solid var(--border-gold)', paddingBottom: '16px' }}>
          <button 
            className={`filter-pill ${activeTab === 'admissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('admissions')}
          >
            📋 Admissions & Leads
          </button>

          <button 
            className={`filter-pill ${activeTab === 'hero' ? 'active' : ''}`}
            onClick={() => setActiveTab('hero')}
          >
            🖼️ Hero Config
          </button>
          <button 
            className={`filter-pill ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            📚 Courses & Tuition CMS
          </button>
          <button 
            className={`filter-pill ${activeTab === 'tour' ? 'active' : ''}`}
            onClick={() => setActiveTab('tour')}
          >
            🏛️ Virtual Tour
          </button>
          <button 
            className={`filter-pill ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            🏢 About Us
          </button>

          <button 
            className={`filter-pill ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            📞 Contact Info
          </button>
        </div>

        {/* TAB 1: ADMISSIONS */}
        {activeTab === 'admissions' && (
          <div>
            <div className="admin-kpi-grid">
              <div className="admin-kpi-card">
                <div className="kpi-icon">📋</div>
                <div>
                  <div className="kpi-val">{applications.length}</div>
                  <div className="kpi-lbl">Total Student Applications</div>
                </div>
              </div>
              <div className="admin-kpi-card">
                <div className="kpi-icon">💬</div>
                <div>
                  <div className="kpi-val">{inquiries ? inquiries.length : 0}</div>
                  <div className="kpi-lbl">General Inquiries</div>
                </div>
              </div>
              <div className="admin-kpi-card">
                <div className="kpi-icon">🎓</div>
                <div>
                  <div className="kpi-val">{programs ? programs.length : 0}</div>
                  <div className="kpi-lbl">Active Programs</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '30px', marginBottom: '15px' }}>
              <button 
                className={`filter-pill ${admissionsSubTab === 'applications' ? 'active' : ''}`}
                onClick={() => setAdmissionsSubTab('applications')}
              >
                📋 Student Applications
              </button>
              <button 
                className={`filter-pill ${admissionsSubTab === 'inquiries' ? 'active' : ''}`}
                onClick={() => setAdmissionsSubTab('inquiries')}
              >
                📧 General Inquiries
              </button>
            </div>

            <div className="admin-table-container">
              {admissionsSubTab === 'applications' ? (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Email &amp; Location</th>
                      <th>Phone Number</th>
                      <th>Target Program</th>
                      <th>Submitted Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                          No student application leads recorded yet.
                        </td>
                      </tr>
                    ) : (
                      applications.map(app => (
                        <tr key={app.id}>
                          <td style={{ fontWeight: 'bold' }}>{app.fullName}</td>
                          <td>{app.email} {app.country ? `(${app.country}${app.state ? `, ${app.state}` : ''})` : ''}</td>
                          <td>{app.phone || 'N/A'}</td>
                          <td><span style={{ color: 'var(--gold-primary)', fontWeight: '600' }}>{app.programTitle || app.program}</span></td>
                          <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{app.submittedAt || 'Recent'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr style={{ background: 'rgba(212,175,55,0.2)' }}>
                      <th>Date</th>
                      <th>Student Name</th>
                      <th>Email Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.length === 0 ? (
                      <tr>
                        <td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                          No inquiries received yet.
                        </td>
                      </tr>
                    ) : (
                      inquiries.map(inq => (
                        <tr key={inq.id}>
                          <td style={{ fontSize: '13px', color: '#888' }}>{inq.submittedAt}</td>
                          <td style={{ fontWeight: 700, color: '#fff' }}>{inq.name}</td>
                          <td>
                            <a href={`mailto:${inq.email}`} style={{ color: '#60a5fa', textDecoration: 'none' }}>
                              {inq.email}
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: COURSES CMS */}
        {activeTab === 'courses' && (
          <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-gold)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)', margin: 0, fontSize: '22px' }}>
                  📚 Degree Program Catalog & Pricing Manager
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Add, edit, or remove degree programs. Tuition fees, course duration, and credit hours update live across the entire website!
                </p>
              </div>
              <button 
                className="btn btn-gold" 
                onClick={() => setShowInlineAddPortal(!showInlineAddPortal)}
              >
                {showInlineAddPortal ? '✕ Close Creation Portal' : '➕ Add New Degree Program'}
              </button>
            </div>

            {/* EMBEDDED DEGREE PROGRAM CREATION PORTAL FORM */}
            {showInlineAddPortal && (
              <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--gold-primary)', borderRadius: '14px', padding: '24px', marginBottom: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-gold)', paddingBottom: '12px' }}>
                  <h4 style={{ fontSize: '18px', color: 'var(--gold-light)', fontFamily: 'var(--font-serif)', margin: 0 }}>
                    ✨ Create & Publish New Degree Program
                  </h4>
                  <button className="btn btn-outline" onClick={() => setShowInlineAddPortal(false)} style={{ padding: '4px 10px', fontSize: '12px' }}>✕ Close Form</button>
                </div>

                <form onSubmit={handleAddProgramSubmit}>
                  <div className="form-group">
                    <label className="form-label">Degree Title / Name *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Master of Science in Robotics & Autonomous Systems" 
                      value={newProgTitle}
                      onChange={(e) => setNewProgTitle(e.target.value)}
                      required 
                      style={{ padding: '10px 14px', fontSize: '14px' }}
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Degree Level *</label>
                      <select className="form-select" value={newProgDegree} onChange={(e) => setNewProgDegree(e.target.value)} style={{ padding: '10px 14px' }}>
                        <option value="Master of Science">Master of Science (M.S.)</option>
                        <option value="Bachelor of Science">Bachelor of Science (B.S.)</option>
                        <option value="Master of Business Administration">Master of Business Administration (MBA)</option>
                        <option value="Doctor of Philosophy">Doctor of Philosophy (Ph.D.)</option>
                        <option value="Other">Other (Specify manually)</option>
                      </select>
                      {newProgDegree === 'Other' && (
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="e.g. Master of Arts (M.A.)" 
                          value={customDegree}
                          onChange={(e) => setCustomDegree(e.target.value)}
                          required 
                          style={{ padding: '10px 14px', fontSize: '14px', marginTop: '10px' }}
                        />
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Category *</label>
                      <select className="form-select" value={newProgCategory} onChange={(e) => setNewProgCategory(e.target.value)} style={{ padding: '10px 14px' }}>
                        <option value="technology">Computer & Data Tech</option>
                        <option value="business">Business & FinTech</option>
                        <option value="healthcare">Health Informatics</option>
                        <option value="Other">Other (Specify manually)</option>
                      </select>
                      {newProgCategory === 'Other' && (
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="e.g. Engineering & Applied Sciences" 
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          required 
                          style={{ padding: '10px 14px', fontSize: '14px', marginTop: '10px' }}
                        />
                      )}
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Total Tuition ($ USD) *</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={newProgTuition}
                        onChange={(e) => setNewProgTuition(e.target.value)}
                        required 
                        style={{ padding: '10px 14px', color: '#34d399', fontWeight: 'bold' }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Duration *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={newProgDuration}
                        onChange={(e) => setNewProgDuration(e.target.value)}
                        required 
                        style={{ padding: '10px 14px' }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Program Overview & Description</label>
                    <textarea 
                      className="form-control" 
                      rows="3" 
                      value={newProgDesc}
                      onChange={(e) => setNewProgDesc(e.target.value)}
                      style={{ padding: '10px 14px', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                    <button type="button" className="btn btn-outline" onClick={() => setShowInlineAddPortal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-gold" style={{ padding: '10px 24px', fontSize: '14px' }}>
                      🚀 Publish Degree Program Live
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr style={{ background: 'rgba(212,175,55,0.2)' }}>
                    <th>Program ID</th>
                    <th>Degree Title</th>
                    <th>Category</th>
                    <th>Tuition ($ USD)</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {programs.map(prog => (
                    <tr key={prog.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--gold-light)' }}>{prog.id}</td>
                      <td style={{ fontWeight: 700 }}>{prog.title || prog.name}</td>
                      <td><span className="online-tag" style={{ position: 'static' }}>{prog.category}</span></td>
                      <td style={{ color: '#34d399', fontWeight: 700 }}>{prog.tuition}</td>
                      <td style={{ fontSize: '12px' }}>{prog.duration}</td>
                      <td>
                        <button 
                          className="btn btn-outline" 
                          onClick={() => handleDeleteProgram(prog.id)} 
                          style={{ padding: '4px 10px', fontSize: '11px', borderColor: '#ef4444', color: '#f87171' }}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}



        {/* TAB: HERO CONFIG */}
        {activeTab === 'hero' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--gold-light)' }}>Hero Section Configuration</h3>
              <button className="btn btn-gold" onClick={handleSaveHero}>
                💾 Save Changes
              </button>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '12px', border: '1px solid var(--border-gold)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Top Badge Text</label>
                  <input className="form-control" value={heroFormData.badge || ''} onChange={e => setHeroFormData({...heroFormData, badge: e.target.value})} />
                </div>
                
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Main Title</label>
                  <input className="form-control" value={heroFormData.title || ''} onChange={e => setHeroFormData({...heroFormData, title: e.target.value})} />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Background Image URL</label>
                  <input className="form-control" value={heroFormData.backgroundImage || ''} onChange={e => setHeroFormData({...heroFormData, backgroundImage: e.target.value})} placeholder="e.g. /assets/campus-bg.jpg or https://images.unsplash.com/..." />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Four Key Statistics</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    {[0, 1, 2, 3].map(i => (
                      <div key={`hero-stat-edit-${i}`} style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ marginBottom: '10px' }}>
                          <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Stat {i+1} Number</label>
                          <input className="form-control" value={heroFormData.stats?.[i]?.num || ''} onChange={e => {
                            const newStats = [...(heroFormData.stats || [])];
                            if(!newStats[i]) newStats[i] = {num: '', label: ''};
                            newStats[i].num = e.target.value;
                            setHeroFormData({...heroFormData, stats: newStats});
                          }} />
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Stat {i+1} Label</label>
                          <input className="form-control" value={heroFormData.stats?.[i]?.label || ''} onChange={e => {
                            const newStats = [...(heroFormData.stats || [])];
                            if(!newStats[i]) newStats[i] = {num: '', label: ''};
                            newStats[i].label = e.target.value;
                            setHeroFormData({...heroFormData, stats: newStats});
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: VIRTUAL TOUR */}
        {activeTab === 'tour' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--gold-light)' }}>Virtual Tour Slides</h3>
              <button className="btn btn-gold" onClick={() => handleEditSlide(-1)}>
                ➕ Add New Slide
              </button>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr style={{ background: 'rgba(212,175,55,0.2)' }}>
                    <th>Slide ID</th>
                    <th>Tab Label</th>
                    <th>Slide Title</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(tourSlides || []).map((slide, idx) => (
                    <tr key={slide.id}>
                      <td>{slide.id}</td>
                      <td>{slide.label}</td>
                      <td>{slide.title}</td>
                      <td>
                        <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '11px', marginRight: '8px' }} onClick={() => handleEditSlide(idx)}>Edit</button>
                        <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '11px', color: '#f87171', borderColor: '#ef4444' }} onClick={() => handleDeleteSlide(idx)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {(!tourSlides || tourSlides.length === 0) && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No slides configured.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* SLIDE EDIT FORM MODAL */}
            {editingSlideIndex !== null && slideFormData && (
              <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
              }}>
                <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
                  <h3 style={{ color: 'var(--gold-light)', marginBottom: '20px' }}>
                    {editingSlideIndex === -1 ? 'Add New Virtual Tour Slide' : 'Edit Virtual Tour Slide'}
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label className="form-label">Tab Label (e.g. 🏛️ Library)</label>
                      <input className="form-control" value={slideFormData.label} onChange={e => setSlideFormData({...slideFormData, label: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Slide Title</label>
                      <input className="form-control" value={slideFormData.title} onChange={e => setSlideFormData({...slideFormData, title: e.target.value})} />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Slide Description</label>
                      <textarea className="form-control" value={slideFormData.desc} onChange={e => setSlideFormData({...slideFormData, desc: e.target.value})} rows={3} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Image URL</label>
                      <input className="form-control" value={slideFormData.img} onChange={e => setSlideFormData({...slideFormData, img: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Call-To-Action (Label | URL)</label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input className="form-control" value={slideFormData.cta.label} onChange={e => setSlideFormData({...slideFormData, cta: {...slideFormData.cta, label: e.target.value}})} placeholder="Label" />
                        <input className="form-control" value={slideFormData.cta.href} onChange={e => setSlideFormData({...slideFormData, cta: {...slideFormData.cta, href: e.target.value}})} placeholder="#link" />
                      </div>
                    </div>
                  </div>

                  <h4 style={{ color: 'var(--gold-light)', marginTop: '20px', marginBottom: '10px' }}>Key Metrics (4 Required)</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    {slideFormData.stats.map((stat, sIdx) => (
                      <div key={sIdx} style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
                        <label className="form-label">Metric {sIdx + 1}</label>
                        <input className="form-control" style={{ marginBottom: '8px' }} value={stat.label} onChange={e => {
                          const newStats = [...slideFormData.stats];
                          newStats[sIdx].label = e.target.value;
                          setSlideFormData({...slideFormData, stats: newStats});
                        }} placeholder="Label (e.g. Licensed E-Books)" />
                        
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <input className="form-control" value={stat.val} onChange={e => {
                            const newStats = [...slideFormData.stats];
                            newStats[sIdx].val = e.target.value;
                            setSlideFormData({...slideFormData, stats: newStats});
                          }} placeholder="Value (e.g. 500,000+)" style={{ flex: 1 }} />
                          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-main)', fontSize: '13px' }}>
                            <input type="checkbox" checked={stat.green} onChange={e => {
                              const newStats = [...slideFormData.stats];
                              newStats[sIdx].green = e.target.checked;
                              setSlideFormData({...slideFormData, stats: newStats});
                            }} /> Green
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                    <button className="btn btn-gold" onClick={handleSaveSlide}>Save Slide</button>
                    <button className="btn btn-outline" onClick={() => setEditingSlideIndex(null)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}


        {/* TAB 7: CONTACT INFO */}
        {activeTab === 'contact' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--gold-light)' }}>Global Contact Information</h3>
              <button className="btn btn-gold" onClick={handleSaveContact}>
                💾 Save Changes
              </button>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '12px', border: '1px solid var(--border-gold)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Toll-Free USA Line</label>
                  <input className="form-control" value={contactFormData.phone || ''} onChange={e => setContactFormData({...contactFormData, phone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Registrar Email</label>
                  <input className="form-control" value={contactFormData.email || ''} onChange={e => setContactFormData({...contactFormData, email: e.target.value})} />
                </div>
                
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Physical Address</label>
                  <textarea className="form-control" value={contactFormData.address || ''} onChange={e => setContactFormData({...contactFormData, address: e.target.value})} rows={3} />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Office Hours Config (Daily)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                    {contactFormData.dailyHours && contactFormData.dailyHours.map((dayHour, index) => (
                      <div key={dayHour.day} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '10px', alignItems: 'center' }}>
                        <strong style={{ color: 'var(--gold-light)' }}>{dayHour.day}</strong>
                        <div>
                          <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Start Time</label>
                          <select className="form-control" value={dayHour.startTime} onChange={e => {
                            const newHours = [...contactFormData.dailyHours];
                            newHours[index].startTime = e.target.value;
                            setContactFormData({...contactFormData, dailyHours: newHours});
                          }}>
                            <option value="Closed">Closed</option>
                            {Array.from({length: 12}).map((_, i) => <option key={`am-${i+1}`} value={`${i+1}:00 AM`}>{`${i+1}:00 AM`}</option>)}
                            {Array.from({length: 12}).map((_, i) => <option key={`pm-${i+1}`} value={`${i+1}:00 PM`}>{`${i+1}:00 PM`}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>End Time</label>
                          <select className="form-control" value={dayHour.endTime} onChange={e => {
                            const newHours = [...contactFormData.dailyHours];
                            newHours[index].endTime = e.target.value;
                            setContactFormData({...contactFormData, dailyHours: newHours});
                          }}>
                            <option value="Closed">Closed</option>
                            {Array.from({length: 12}).map((_, i) => <option key={`am-${i+1}`} value={`${i+1}:00 AM`}>{`${i+1}:00 AM`}</option>)}
                            {Array.from({length: 12}).map((_, i) => <option key={`pm-${i+1}`} value={`${i+1}:00 PM`}>{`${i+1}:00 PM`}</option>)}
                          </select>
                        </div>
                      </div>
                    ))}
                    <div style={{ marginTop: '10px' }}>
                      <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Timezone</label>
                      <input className="form-control" value={contactFormData.timezone || ''} onChange={e => setContactFormData({...contactFormData, timezone: e.target.value})} placeholder="e.g. EST" style={{ maxWidth: '200px' }} />
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Footer Watermark / Security Banner</label>
                  <input className="form-control" value={contactFormData.watermark || ''} onChange={e => setContactFormData({...contactFormData, watermark: e.target.value})} />
                </div>
              </div>
            </div>
          </div>
        )}
        {/* TAB: ABOUT US */}
        {activeTab === 'about' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--gold-light)' }}>About Us Configuration</h3>
              <button className="btn btn-gold" onClick={handleSaveAbout}>
                💾 Save Changes
              </button>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '12px', border: '1px solid var(--border-gold)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Main Title</label>
                  <input className="form-control" value={aboutFormData.title || ''} onChange={e => setAboutFormData({...aboutFormData, title: e.target.value})} />
                </div>
                
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Quote Text</label>
                  <textarea className="form-control" value={aboutFormData.quote || ''} onChange={e => setAboutFormData({...aboutFormData, quote: e.target.value})} rows={2} />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Detailed Description</label>
                  <textarea className="form-control" value={aboutFormData.description || ''} onChange={e => setAboutFormData({...aboutFormData, description: e.target.value})} rows={5} />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Logo Image URL</label>
                  <input className="form-control" value={aboutFormData.logoUrl || ''} onChange={e => setAboutFormData({...aboutFormData, logoUrl: e.target.value})} placeholder="/assets/logo.jpg" />
                </div>

                <div className="form-group">
                  <label className="form-label">Image 1 URL</label>
                  <input className="form-control" value={aboutFormData.image1 || ''} onChange={e => setAboutFormData({...aboutFormData, image1: e.target.value})} />
                </div>

                <div className="form-group">
                  <label className="form-label">Image 2 URL</label>
                  <input className="form-control" value={aboutFormData.image2 || ''} onChange={e => setAboutFormData({...aboutFormData, image2: e.target.value})} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
