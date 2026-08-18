import React, { useState, useEffect } from 'react';
import { saveCMSConfigToStorage, getApplicationRecords, getInquiryRecords, uploadDocument } from '../services/firebase';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ImageUploadField = ({ label, value, onChange, folder, placeholder }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadDocument(file, folder);
      onChange(url);
    } catch (err) {
      alert("Upload failed: " + err.message);
    }
    setIsUploading(false);
  };

  return (
    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
      <label className="form-label">{label}</label>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input 
          className="form-control" 
          value={value || ''} 
          onChange={e => onChange(e.target.value)} 
          placeholder={placeholder || "Paste URL here"} 
          style={{ flex: 1, padding: '10px 14px' }}
        />
        <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
          <button type="button" className="btn btn-outline" style={{ margin: 0, height: '100%', padding: '0 20px', whiteSpace: 'nowrap' }} disabled={isUploading}>
            {isUploading ? '⏳...' : '📁 Upload'}
          </button>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleUpload} 
            style={{ position: 'absolute', top: 0, right: 0, minWidth: '100%', minHeight: '100%', fontSize: '100px', textAlign: 'right', filter: 'alpha(opacity=0)', opacity: 0, outline: 'none', background: 'white', cursor: 'pointer', display: 'block' }} 
            disabled={isUploading}
          />
        </div>
      </div>
    </div>
  );
};

export default function AdminPortal({ programs, onUpdatePrograms, tourSlides, onUpdateTour, contactInfo, onUpdateContact, heroConfig, onUpdateHero, aboutData, onUpdateAbout, galleryImages, onUpdateGallery, electives, onUpdateElectives, events, onUpdateEvents, onLogout }) {
  const [activeTab, setActiveTab] = useState('admissions');
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [editingProgramId, setEditingProgramId] = useState(null);
  const [showInlineAddPortal, setShowInlineAddPortal] = useState(false);
  const [applications, setApplications] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [admissionsSubTab, setAdmissionsSubTab] = useState('applications');

  const [editingElectiveId, setEditingElectiveId] = useState(null);
  const [newElectiveName, setNewElectiveName] = useState('');

  // Events CMS state
  const [editingEventId, setEditingEventId] = useState(null);
  const [evtTitle, setEvtTitle] = useState('');
  const [evtDesc, setEvtDesc] = useState('');
  const [evtImage, setEvtImage] = useState('');
  const [evtDay, setEvtDay] = useState('');
  const [evtMonth, setEvtMonth] = useState('');
  const [evtLocation, setEvtLocation] = useState('');
  const [evtTime, setEvtTime] = useState('');
  const [evtLink, setEvtLink] = useState('');
  const [evtButtonLabel, setEvtButtonLabel] = useState('KNOW MORE');
  const [showEvtForm, setShowEvtForm] = useState(false);
  const [isUploadingEvtImg, setIsUploadingEvtImg] = useState(false);
  const [evtImageFile, setEvtImageFile] = useState(null);

  const [contactFormData, setContactFormData] = React.useState(contactInfo || {});
  
  React.useEffect(() => {
    if (contactInfo) setContactFormData(contactInfo);
  }, [contactInfo]);

  const handleSaveContact = () => {
    onUpdateContact(contactFormData);
    alert('Contact information updated successfully!');
  };

  const handleAddElectiveSubmit = (e) => {
    e.preventDefault();
    if (!newElectiveName.trim()) {
      alert("Please enter an elective name.");
      return;
    }

    if (editingElectiveId) {
      const updated = electives.map(el => el.id === editingElectiveId ? { ...el, name: newElectiveName.trim() } : el);
      onUpdateElectives(updated);
      setEditingElectiveId(null);
    } else {
      const newEl = { id: 'track-' + Date.now(), name: newElectiveName.trim() };
      onUpdateElectives([...(electives || []), newEl]);
    }
    setNewElectiveName('');
  };

  const handleDeleteElective = (id) => {
    if (window.confirm("Are you sure you want to delete this elective track?")) {
      const updated = electives.filter(el => el.id !== id);
      onUpdateElectives(updated);
    }
  };

  // --- Events CMS handlers ---
  const resetEvtForm = () => {
    setEditingEventId(null);
    setEvtTitle(''); setEvtDesc(''); setEvtImage('');
    setEvtDay(''); setEvtMonth(''); setEvtLocation('');
    setEvtTime(''); setEvtLink(''); setEvtButtonLabel('KNOW MORE');
    setEvtImageFile(null);
    setShowEvtForm(false);
  };

  const handleEvtEdit = (ev) => {
    setEditingEventId(ev.id);
    setEvtTitle(ev.title || ''); setEvtDesc(ev.desc || '');
    setEvtImage(ev.image || ''); setEvtDay(ev.day || '');
    setEvtMonth(ev.month || ''); setEvtLocation(ev.location || '');
    setEvtTime(ev.time || ''); setEvtLink(ev.link || '');
    setEvtButtonLabel(ev.buttonLabel || 'KNOW MORE');
    setEvtImageFile(null);
    setShowEvtForm(true);
  };

  const handleEvtSubmit = async (e) => {
    e.preventDefault();
    let finalImage = evtImage;
    if (evtImageFile) {
      setIsUploadingEvtImg(true);
      try { finalImage = await uploadDocument(evtImageFile, 'event-images'); }
      catch (err) { alert('Image upload failed: ' + err.message); setIsUploadingEvtImg(false); return; }
      setIsUploadingEvtImg(false);
    }
    const evtData = {
      id: editingEventId || ('evt-' + Date.now()),
      title: evtTitle.trim(), desc: evtDesc.trim(), image: finalImage,
      day: evtDay.trim(), month: evtMonth.trim(), location: evtLocation.trim(),
      time: evtTime.trim(), link: evtLink.trim(), buttonLabel: evtButtonLabel.trim()
    };
    if (editingEventId) {
      onUpdateEvents((events || []).map(ev => ev.id === editingEventId ? evtData : ev));
    } else {
      onUpdateEvents([...(events || []), evtData]);
    }
    resetEvtForm();
  };

  const handleEvtDelete = (id) => {
    if (window.confirm('Delete this event?')) {
      onUpdateEvents((events || []).filter(ev => ev.id !== id));
    }
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
  const [newProgEmoji, setNewProgEmoji] = useState('🎓');
  const [newProgTuition, setNewProgTuition] = useState('14400');
  const [newProgColor, setNewProgColor] = useState('#8b5cf6');
  const [newProgTextColor, setNewProgTextColor] = useState('#ffffff');
  const [newProgTitleColor, setNewProgTitleColor] = useState('#ffffff');
  const [newProgDuration, setNewProgDuration] = useState('1.5 Years (100% Online)');
  const [newProgDesc, setNewProgDesc] = useState('Comprehensive 100% remote theoretical curriculum covering core principles, analytical modeling, and digital case studies.');
  const [customDegree, setCustomDegree] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [newProgBrochureFile, setNewProgBrochureFile] = useState(null);
  const [newProgBgImage, setNewProgBgImage] = useState(null);
  const [isUploadingBrochure, setIsUploadingBrochure] = useState(false);
  const [isUploadingProgBg, setIsUploadingProgBg] = useState(false);
  const [uploadingRowId, setUploadingRowId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const apps = await getApplicationRecords();
      setApplications(apps);
      const inqs = await getInquiryRecords();
      setInquiries(inqs);
    }
    fetchData();
  }, []);

  const handleAddProgramSubmit = async (e) => {
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

    const existingProg = editingProgramId ? programs.find(p => p.id === editingProgramId) : null;
    const tuitionVal = parseInt(newProgTuition) || 14400;
    
    let brochureUrl = existingProg ? existingProg.brochureUrl : null;
    if (newProgBrochureFile) {
      setIsUploadingBrochure(true);
      try {
        brochureUrl = await uploadDocument(newProgBrochureFile, 'brochures');
      } catch (err) {
        alert("Brochure upload failed: " + err.message);
        setIsUploadingBrochure(false);
        return;
      }
      setIsUploadingBrochure(false);
    }

    let finalBgImage = existingProg ? existingProg.bgImage : null;
    if (newProgBgImage && typeof newProgBgImage === 'object') {
      setIsUploadingProgBg(true);
      try {
        finalBgImage = await uploadDocument(newProgBgImage, 'program-bg');
      } catch (err) {
        alert("Background image upload failed: " + err.message);
        setIsUploadingProgBg(false);
        return;
      }
      setIsUploadingProgBg(false);
    } else if (typeof newProgBgImage === 'string') {
      finalBgImage = newProgBgImage;
    }

    const newProg = {
      id: 'uef-prog-' + Math.floor(100 + Math.random() * 900),
      name: newProgTitle.trim(),
      title: newProgTitle.trim(),
      degree: finalDegree,
      category: finalCategory,
      emoji: newProgEmoji,
      tuition: `$${tuitionVal.toLocaleString()} USD`,
      numericFee: tuitionVal,
      duration: newProgDuration,
      description: newProgDesc,
      format: "100% Remote / Asynchronous",
      credits: "36 US Credit Hours (12 Core Modules)",
      brochureUrl: brochureUrl,
      themeColor: newProgColor,
      textColor: newProgTextColor,
      titleColor: newProgTitleColor,
      bgImage: finalBgImage
    };

    if (editingProgramId) {
      const updated = programs.map(p => p.id === editingProgramId ? newProg : p);
      onUpdatePrograms(updated);
      saveCMSConfigToStorage(updated);
      setEditingProgramId(null);
    } else {
      const updated = [...programs, newProg];
      onUpdatePrograms(updated);
      saveCMSConfigToStorage(updated);
    }

    // Reset Form
    setNewProgTitle('');
    setNewProgDegree('Master of Science');
    setNewProgCategory('technology');
    setNewProgEmoji('🎓');
    setNewProgTuition('14400');
    setNewProgDuration('1.5 Years (100% Online)');
    setNewProgDesc('');
    setNewProgColor('#8b5cf6');
    setNewProgTextColor('#ffffff');
    setNewProgTitleColor('#ffffff');
    setCustomDegree('');
    setCustomCategory('');
    setNewProgBrochureFile(null);
    setNewProgBgImage(null);
    setShowInlineAddPortal(false);
    alert(`🎉 Success! Degree program '${newProgTitle}' has been saved successfully!`);
  };

  const handleEditProgram = (prog) => {
    setEditingProgramId(prog.id);
    setNewProgTitle(prog.title || prog.name || '');
    
    // Check if degree is in default list
    const defaultsDegree = ['Master of Science', 'Bachelor of Science', 'Master of Business Administration', 'Doctor of Philosophy'];
    if (defaultsDegree.includes(prog.degree)) {
      setNewProgDegree(prog.degree);
      setCustomDegree('');
    } else {
      setNewProgDegree('Other');
      setCustomDegree(prog.degree || '');
    }

    // Check if category is default
    const defaultsCat = ['technology', 'business', 'healthcare'];
    if (defaultsCat.includes(prog.category)) {
      setNewProgCategory(prog.category);
      setCustomCategory('');
    } else {
      setNewProgCategory('Other');
      setCustomCategory(prog.category || '');
    }

    setNewProgEmoji(prog.emoji || '🎓');
    setNewProgTuition(prog.numericFee ? prog.numericFee.toString() : (prog.tuition || '').replace(/\D/g, ''));
    setNewProgDuration(prog.duration || '');
    setNewProgDesc(prog.description || '');
    setNewProgColor(prog.themeColor || '#8b5cf6');
    setNewProgTextColor(prog.textColor || '#ffffff');
    setNewProgTitleColor(prog.titleColor || '#ffffff');
    setNewProgBgImage(null); // Clear file input
    setShowInlineAddPortal(true);
  };

  const handleRowPdfUpload = async (e, progId) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingRowId(progId);
    try {
      const url = await uploadDocument(file, 'brochures');
      const updated = programs.map(p => p.id === progId ? { ...p, brochureUrl: url } : p);
      onUpdatePrograms(updated);
      saveCMSConfigToStorage(updated);
      alert('PDF Brochure attached successfully!');
    } catch (err) {
      alert('Failed to upload PDF: ' + err.message);
    }
    setUploadingRowId(null);
    e.target.value = ''; // reset file input
  };

  const handleDeleteProgram = (progId) => {
    if (!window.confirm(`Are you sure you want to delete program ID '${progId}' from the catalog?`)) return;
    const updated = programs.filter(p => p.id !== progId);
    onUpdatePrograms(updated);
    saveCMSConfigToStorage(updated);
  };

  const handleGalleryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingGallery(true);
    try {
      const url = await uploadDocument(file, 'gallery');
      const newImages = [...galleryImages, url];
      onUpdateGallery(newImages);
    } catch (err) {
      alert('Failed to upload image: ' + err.message);
    }
    setIsUploadingGallery(false);
    e.target.value = ''; // reset file input
  };

  const handleDeleteGalleryImage = (indexToRemove) => {
    if (!window.confirm("Are you sure you want to delete this image from the gallery?")) return;
    const newImages = galleryImages.filter((_, idx) => idx !== indexToRemove);
    onUpdateGallery(newImages);
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

  const editViewRef = React.useRef(null);

  React.useEffect(() => {
    if (showInlineAddPortal || editingElectiveId || showEvtForm) {
      setTimeout(() => {
        if (editViewRef.current) {
          editViewRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [showInlineAddPortal, editingElectiveId, showEvtForm]);

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
            className={`filter-pill ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            🏢 About Us
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
            className={`filter-pill ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            📅 Events CMS
          </button>
          <button 
            className={`filter-pill ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            📞 Contact Info
          </button>
          <button 
            className={`filter-pill ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            🖼️ Gallery CMS
          </button>
          <button 
            className={`filter-pill ${activeTab === 'registration' ? 'active' : ''}`}
            onClick={() => setActiveTab('registration')}
          >
            📝 Registration CMS
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
              <div ref={editViewRef} style={{ background: 'var(--bg-card)', border: '1.5px solid var(--gold-primary)', borderRadius: '14px', padding: '24px', marginBottom: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-gold)', paddingBottom: '12px' }}>
                  <h4 style={{ fontSize: '18px', color: 'var(--gold-light)', fontFamily: 'var(--font-serif)', margin: 0 }}>
                    ✨ {editingProgramId ? 'Edit Degree Program' : 'Create & Publish New Degree Program'}
                  </h4>
                  <button className="btn btn-outline" onClick={() => {
                    setShowInlineAddPortal(false);
                    setEditingProgramId(null);
                  }} style={{ padding: '4px 10px', fontSize: '12px' }}>✕ Close Form</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
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
                            style={{ padding: '10px 14px', marginTop: '10px' }}
                          />
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Category Segment *</label>
                        <select className="form-select" value={newProgCategory} onChange={(e) => setNewProgCategory(e.target.value)} style={{ padding: '10px 14px' }}>
                          <option value="business">Business & Management</option>
                          <option value="engineering">Engineering & Technology</option>
                          <option value="arts">Arts & Humanities</option>
                          <option value="health">Health & Sciences</option>
                          <option value="law">Law & Policy</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label">Total Credits *</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          value={newProgCredits}
                          onChange={(e) => setNewProgCredits(e.target.value)}
                          required 
                          style={{ padding: '10px 14px', fontSize: '14px' }}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Emoji Icon (Optional)</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="e.g. 💻" 
                          value={newProgEmoji}
                          onChange={(e) => setNewProgEmoji(e.target.value)}
                          style={{ padding: '10px 14px', fontSize: '14px' }}
                        />
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

                    <div className="form-group">
                      <label className="form-label">Upload Brochure PDF (Optional)</label>
                      <input 
                        type="file" 
                        accept=".pdf"
                        className="form-control" 
                        onChange={(e) => setNewProgBrochureFile(e.target.files[0])}
                        style={{ padding: '10px 14px' }}
                      />
                      <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                        If provided, students will download this exact PDF instead of the auto-generated syllabus.
                      </small>
                    </div>

                    <ImageUploadField 
                      label="Grid Background Image URL (or upload)"
                      value={typeof newProgBgImage === 'string' ? newProgBgImage : ''}
                      onChange={(val) => setNewProgBgImage(val)}
                      folder="program-bg"
                      placeholder="Paste URL or upload image ->"
                    />
                    <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '-15px', marginBottom: '15px' }}>
                      Replaces the default background pattern for this program's card on the Programs catalog.
                    </small>

                    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '12px', marginTop: '20px' }}>
                      <button type="submit" className="btn btn-gold" style={{ padding: '10px 24px', fontSize: '14px' }} disabled={isUploadingBrochure || isUploadingProgBg}>
                        {isUploadingBrochure || isUploadingProgBg ? '⏳ Uploading...' : (editingProgramId ? '💾 Save Changes' : '🚀 Publish Degree Program Live')}
                      </button>
                      <button type="button" className="btn btn-outline" onClick={() => {
                        setShowInlineAddPortal(false);
                        setEditingProgramId(null);
                      }}>Cancel</button>
                    </div>
                  </form>

                  {/* LIVE PREVIEW CARD */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-gold)', borderRadius: '12px', padding: '24px' }}>
                    <h5 style={{ color: 'var(--gold-light)', margin: '0 0 16px 0', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Live Preview</h5>
                    <div style={{ width: '100%', maxWidth: '380px' }}>
                      <div className={`program-card category-${(newProgCategory || 'default').replace(/[^a-zA-Z0-9-]/g, '')}`}>
                        <div className="card-header" style={{ ...(typeof newProgBgImage === 'string' && newProgBgImage ? { backgroundImage: `url(${newProgBgImage})`, backgroundSize: 'cover' } : {}) }}>
                          <div className="program-degree">{newProgDegree === 'Other' ? customDegree : newProgDegree || 'Degree Program'}</div>
                          <div className="program-name">{newProgTitle || 'Degree Title'}</div>
                        </div>
                        <div className="card-body">
                          <p className="program-desc">{newProgDesc || 'Description of the program will appear here...'}</p>
                          <div className="program-specs">
                            <div className="spec-item">
                              <span className="spec-label">Duration</span>
                              <span className="spec-val">{newProgDuration || '-'}</span>
                            </div>
                            <div className="spec-item">
                              <span className="spec-label">Credits</span>
                              <span className="spec-val">{newProgCredits || '-'} Credits</span>
                            </div>
                            <div className="spec-item">
                              <span className="spec-label">Tuition</span>
                              <span className="spec-val" style={{ color: '#34d399' }}>{newProgTuition ? `$${newProgTuition}` : '-'}</span>
                            </div>
                            <div className="spec-item">
                              <span className="spec-label">Min Admission</span>
                              <span className="spec-val">{newProgMinGpa ? `${newProgMinGpa} GPA (${newProgMinPercent}%)` : '2.5 GPA (65%)'}</span>
                            </div>
                          </div>
                          <div className="card-actions">
                            <button type="button" className="btn btn-maroon" style={{ width: '100%', pointerEvents: 'none' }}>
                              Download PDF Brochure
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                      <td><span className="online-tag" style={{ position: 'static' }}>{prog.emoji || '🎓'} {prog.category}</span></td>
                      <td style={{ color: '#34d399', fontWeight: 700 }}>{prog.tuition}</td>
                      <td style={{ fontSize: '12px' }}>{prog.duration}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {uploadingRowId === prog.id ? (
                            <span style={{ fontSize: '11px', color: 'var(--gold-primary)', padding: '4px 0' }}>⏳ Uploading...</span>
                          ) : (
                            <label className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '11px', cursor: 'pointer', margin: 0 }}>
                              {prog.brochureUrl ? '📄 Replace PDF' : '📄 Upload PDF'}
                              <input 
                                type="file" 
                                accept=".pdf" 
                                style={{ display: 'none' }} 
                                onChange={(e) => handleRowPdfUpload(e, prog.id)}
                              />
                            </label>
                          )}
                          <button 
                            className="btn btn-outline" 
                            onClick={() => handleEditProgram(prog)} 
                            style={{ padding: '4px 10px', fontSize: '11px', borderColor: '#3b82f6', color: '#60a5fa' }}
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            className="btn btn-outline" 
                            onClick={() => handleDeleteProgram(prog.id)} 
                            style={{ padding: '4px 10px', fontSize: '11px', borderColor: '#ef4444', color: '#f87171' }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* GALLERY CMS TAB */}
        {activeTab === 'gallery' && (
          <div className="admin-panel">
            <div className="admin-header">
              <h2 className="section-title" style={{ fontSize: '24px' }}>🖼️ Gallery CMS</h2>
              <label className="btn btn-maroon" style={{ cursor: 'pointer', margin: 0 }}>
                {isUploadingGallery ? '⏳ Uploading...' : '➕ Upload New Image'}
                <input 
                  type="file" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={handleGalleryUpload}
                  disabled={isUploadingGallery}
                />
              </label>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              Upload high-quality images directly to the interactive masonry gallery.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {galleryImages && galleryImages.map((imgUrl, idx) => (
                <div key={idx} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                  <img src={imgUrl} alt={`Gallery ${idx}`} style={{ width: '100%', height: '150px', objectFit: 'contain', display: 'block' }} />
                  <button 
                    onClick={() => handleDeleteGalleryImage(idx)}
                    style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title="Delete Image"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
            {(!galleryImages || galleryImages.length === 0) && (
              <div style={{ padding: '40px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '8px' }}>
                No images in gallery. Upload one to get started!
              </div>
            )}
          </div>
        )}

        {/* HERO CONFIG TAB */}
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

                <ImageUploadField 
                  label="Background Image URL (or upload)"
                  value={heroFormData.backgroundImage}
                  onChange={(val) => setHeroFormData({...heroFormData, backgroundImage: val})}
                  folder="hero-bg"
                  placeholder="e.g. /assets/campus-bg.jpg or upload ->"
                />

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
                <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '1300px', maxHeight: '90vh', overflowY: 'auto' }}>
                  <h3 style={{ color: 'var(--gold-light)', marginBottom: '20px' }}>
                    {editingSlideIndex === -1 ? 'Add New Virtual Tour Slide' : 'Edit Virtual Tour Slide'}
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px' }}>
                    {/* LEFT: FORM */}
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                          <label className="form-label">Tab Label (e.g. 📚 Library)</label>
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
                        <ImageUploadField 
                          label="Image URL (or upload)"
                          value={typeof slideFormData.img === 'string' ? slideFormData.img : ''}
                          onChange={(val) => setSlideFormData({...slideFormData, img: val})}
                          folder="tour-slides"
                          placeholder="/assets/campus-2.jpg or upload ->"
                        />
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
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input 
                                  type="color" 
                                  value={stat.color || (stat.green ? '#10b981' : '#ffffff')} 
                                  onChange={e => {
                                    const newStats = [...slideFormData.stats];
                                    newStats[sIdx].color = e.target.value;
                                    newStats[sIdx].green = false;
                                    setSlideFormData({...slideFormData, stats: newStats});
                                  }} 
                                  title="Select Metric Color" 
                                  style={{ padding: '0', height: '36px', width: '40px', borderRadius: '4px', cursor: 'pointer', border: '1px solid var(--border-gold)', background: 'none' }} 
                                />
                                <span style={{ fontSize: '13px', color: 'var(--text-main)' }}>Color</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                        <button className="btn btn-gold" onClick={handleSaveSlide}>Save Slide</button>
                        <button className="btn btn-outline" onClick={() => setEditingSlideIndex(null)}>Cancel</button>
                      </div>
                    </div>

                    {/* RIGHT: PREVIEW */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-gold)', borderRadius: '12px', padding: '24px' }}>
                      <h5 style={{ color: 'var(--gold-light)', margin: '0 0 16px 0', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Live Preview</h5>
                      <div style={{ width: '100%', position: 'relative', height: '450px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-gold)' }}>
                        <img src={typeof slideFormData.img === 'string' && slideFormData.img ? slideFormData.img : 'https://via.placeholder.com/800x450?text=Tour+Slide'} alt={slideFormData.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.1) 100%)', display: 'flex', alignItems: 'center', padding: '40px' }}>
                          <div style={{ maxWidth: '500px', color: 'white' }}>
                            <div style={{ display: 'inline-block', padding: '6px 14px', background: 'rgba(212,175,55,0.2)', border: '1px solid var(--gold-primary)', color: 'var(--gold-light)', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', borderRadius: '4px', marginBottom: '16px' }}>{slideFormData.label || 'Tab Label'}</div>
                            <h3 style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', marginBottom: '16px', color: 'white' }}>{slideFormData.title || 'Slide Title'}</h3>
                            <p style={{ fontSize: '16px', color: '#ccc', lineHeight: '1.6', marginBottom: '30px' }}>{slideFormData.desc || 'Slide description will appear here...'}</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                              {slideFormData.stats.map((st, sIdx) => (
                                <div key={sIdx}>
                                  <div style={{ fontSize: '24px', fontFamily: 'var(--font-serif)', fontWeight: 'bold', color: st.color || (st.green ? 'var(--gold-light)' : 'var(--text-main)') }}>{st.val || '0'}</div>
                                  <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#aaa', letterSpacing: '1px', marginTop: '4px' }}>{st.label || 'Metric'}</div>
                                </div>
                              ))}
                            </div>
                            {slideFormData.cta && slideFormData.cta.label && (
                              <button className="btn btn-outline" style={{ pointerEvents: 'none' }}>{slideFormData.cta.label}</button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
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

                <ImageUploadField 
                  label="Logo Image URL (or upload)"
                  value={aboutFormData.logoUrl}
                  onChange={(val) => setAboutFormData({...aboutFormData, logoUrl: val})}
                  folder="about-images"
                  placeholder="/assets/logo.jpg or upload ->"
                />

                <ImageUploadField 
                  label="Image 1 URL (or upload)"
                  value={aboutFormData.image1}
                  onChange={(val) => setAboutFormData({...aboutFormData, image1: val})}
                  folder="about-images"
                  placeholder="Image 1 URL or upload ->"
                />

                <ImageUploadField 
                  label="Image 2 URL (or upload)"
                  value={aboutFormData.image2}
                  onChange={(val) => setAboutFormData({...aboutFormData, image2: val})}
                  folder="about-images"
                  placeholder="Image 2 URL or upload ->"
                />
              </div>
            </div>
          </div>
        )}
        {/* TAB: REGISTRATION CMS */}
        {activeTab === 'registration' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', color: 'var(--gold-light)', fontFamily: 'var(--font-serif)', margin: 0 }}>
                📝 Registration Form Configuration
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Manage the "Elective Tracks" that appear in the student Enrollment Application form. Degree Programs are automatically synced from the Courses & Tuition CMS.
              </p>
            </div>

            <div ref={editViewRef} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
              <form onSubmit={handleAddElectiveSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">{editingElectiveId ? 'Edit Elective Name' : 'New Elective Track Name'}</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Cybersecurity Analytics" 
                    value={newElectiveName}
                    onChange={(e) => setNewElectiveName(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-gold" style={{ height: '42px', padding: '0 24px' }}>
                  {editingElectiveId ? '💾 Save Changes' : '➕ Add Elective'}
                </button>
                {editingElectiveId && (
                  <button type="button" className="btn btn-outline" onClick={() => { setEditingElectiveId(null); setNewElectiveName(''); }} style={{ height: '42px', padding: '0 16px' }}>
                    Cancel
                  </button>
                )}
              </form>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr style={{ background: 'rgba(212,175,55,0.2)' }}>
                    <th>Elective Track Name</th>
                    <th style={{ width: '150px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(!electives || electives.length === 0) ? (
                    <tr>
                      <td colSpan="2" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No elective tracks available.</td>
                    </tr>
                  ) : electives.map(el => (
                    <tr key={el.id}>
                      <td style={{ fontWeight: 700 }}>{el.name}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="btn btn-outline" 
                            onClick={() => { setEditingElectiveId(el.id); setNewElectiveName(el.name); }} 
                            style={{ padding: '4px 10px', fontSize: '11px', borderColor: '#3b82f6', color: '#60a5fa' }}
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            className="btn btn-outline" 
                            onClick={() => handleDeleteElective(el.id)} 
                            style={{ padding: '4px 10px', fontSize: '11px', borderColor: '#ef4444', color: '#f87171' }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: EVENTS CMS */}
        {activeTab === 'events' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '20px', color: 'var(--gold-light)', fontFamily: 'var(--font-serif)', margin: 0 }}>📅 Events CMS</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Manage all upcoming events shown on the homepage and the Events page.</p>
              </div>
              <button className="btn btn-gold" onClick={() => { resetEvtForm(); setShowEvtForm(true); }} style={{ padding: '10px 20px', fontSize: '13px' }}>
                ➕ Add New Event
              </button>
            </div>

            {showEvtForm && (
              <div ref={editViewRef} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)', borderRadius: '12px', padding: '24px', marginBottom: '28px' }}>
                <h4 style={{ color: 'var(--gold-light)', marginBottom: '20px', fontFamily: 'var(--font-serif)' }}>{editingEventId ? '✏️ Edit Event' : '➕ Add New Event'}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                  <form onSubmit={handleEvtSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Event Title *</label>
                        <input className="form-control" required value={evtTitle} onChange={e => setEvtTitle(e.target.value)} placeholder="e.g. Global Scholars Symposium" />
                      </div>
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Description *</label>
                        <textarea className="form-control" required rows={3} value={evtDesc} onChange={e => setEvtDesc(e.target.value)} placeholder="Event description..." style={{ resize: 'vertical' }} />
                      </div>
                      <ImageUploadField 
                        label="Image URL (or upload)"
                        value={typeof evtImage === 'string' ? evtImage : ''}
                        onChange={(val) => setEvtImage(val)}
                        folder="event-images"
                        placeholder="Paste URL or upload image ->"
                      />
                      <div className="form-group">
                        <label className="form-label">Day (e.g. 28) *</label>
                        <input className="form-control" required value={evtDay} onChange={e => setEvtDay(e.target.value)} placeholder="28" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Month (e.g. Sept) *</label>
                        <input className="form-control" required value={evtMonth} onChange={e => setEvtMonth(e.target.value)} placeholder="Sept" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Location *</label>
                        <input className="form-control" required value={evtLocation} onChange={e => setEvtLocation(e.target.value)} placeholder="Virtual Conference Hall" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Time *</label>
                        <input className="form-control" required value={evtTime} onChange={e => setEvtTime(e.target.value)} placeholder="6:00 PM - 9:00 PM EST" />
                      </div>
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Know More Link URL</label>
                        <input className="form-control" value={evtLink} onChange={e => setEvtLink(e.target.value)} placeholder="https://example.com" />
                      </div>
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Button Label (e.g. KNOW MORE, REGISTER)</label>
                        <input className="form-control" value={evtButtonLabel} onChange={e => setEvtButtonLabel(e.target.value)} placeholder="KNOW MORE" />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '12px', marginTop: '20px' }}>
                      <button type="submit" className="btn btn-gold" disabled={isUploadingEvtImg}>
                        {isUploadingEvtImg ? '⏳ Uploading...' : (editingEventId ? '💾 Save Changes' : '🚀 Publish Event')}
                      </button>
                      <button type="button" className="btn btn-outline" onClick={resetEvtForm}>Cancel</button>
                    </div>
                  </form>

                  {/* LIVE PREVIEW CARD */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-gold)', borderRadius: '12px', padding: '24px' }}>
                    <h5 style={{ color: 'var(--gold-light)', margin: '0 0 16px 0', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Live Preview</h5>
                    <div style={{ width: '100%', maxWidth: '340px', background: 'var(--bg-dark)', border: '1px solid var(--border-gold)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                      <img src={typeof evtImage === 'string' && evtImage ? evtImage : 'https://via.placeholder.com/340x220?text=Event+Image'} alt={evtTitle || 'Event'} style={{ width: '100%', height: '220px', objectFit: 'contain', borderRadius: '12px', marginBottom: '20px' }} />
                      <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px', color: 'var(--text-main)', fontFamily: 'var(--font-body)' }}>{evtTitle || 'Event Title'}</h3>
                      <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-muted)', marginBottom: '25px' }}>{evtDesc || 'Event description will appear here...'}</p>
                      <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ fontSize: '36px', fontFamily: 'var(--font-serif, serif)' }}>{evtDay || '28'}</span>
                          <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>{evtMonth || 'Sept'}</span>
                        </div>
                        <div style={{ width: '1px', height: '30px', backgroundColor: 'var(--border-gold)' }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                          <div>📍 {evtLocation || 'Location'}</div>
                          <div>🕒 {evtTime || 'Time'}</div>
                        </div>
                      </div>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', letterSpacing: '1px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {evtButtonLabel || 'KNOW MORE'} <span style={{ fontSize: '16px' }}>↓</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr style={{ background: 'rgba(212,175,55,0.2)' }}>
                    <th style={{ width: '70px' }}>Image</th>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Button</th>
                    <th style={{ width: '130px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(!events || events.length === 0) ? (
                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No events found. Click "Add New Event" to create one.</td></tr>
                  ) : events.map(ev => (
                    <tr key={ev.id}>
                      <td><img src={ev.image} alt={ev.title} style={{ width: '60px', height: '45px', objectFit: 'contain', borderRadius: '6px' }} /></td>
                      <td style={{ fontWeight: 700 }}>{ev.title}</td>
                      <td>{ev.day} {ev.month}</td>
                      <td>{ev.location}</td>
                      <td><span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{ev.buttonLabel || 'KNOW MORE'}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-outline" onClick={() => handleEvtEdit(ev)} style={{ padding: '4px 10px', fontSize: '11px', borderColor: '#3b82f6', color: '#60a5fa' }}>✏️ Edit</button>
                          <button className="btn btn-outline" onClick={() => handleEvtDelete(ev.id)} style={{ padding: '4px 10px', fontSize: '11px', borderColor: '#ef4444', color: '#f87171' }}>🗑️ Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}


      </div>
    </section>
  );
}
