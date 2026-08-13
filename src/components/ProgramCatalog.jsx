import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';

export default function ProgramCatalog({ programs, onSelectProgramToApply }) {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach((el) => observer.observe(el));

    return () => elements.forEach((el) => observer.unobserve(el));
  }, [programs, categoryFilter, searchQuery]);

  const standardDisplayMap = {
    'technology': 'Computer & Data Tech',
    'business': 'Business & FinTech',
    'healthcare': 'Health Informatics'
  };

  const dynamicCategories = ['all'];
  programs.forEach(p => {
    if (p.category && !dynamicCategories.includes(p.category)) {
      dynamicCategories.push(p.category);
    }
  });

  const handleDownloadBrochure = (prog) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(212, 175, 55); // Gold
    doc.text("UNIVERSITY OF EAST FLORIDA", 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("OFFICIAL PROGRAM SYLLABUS & BROCHURE", 20, 28);
    
    // Line separator
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.5);
    doc.line(20, 32, 190, 32);
    
    // Program Title
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    const titleLines = doc.splitTextToSize(`${prog.degree} in ${prog.title || prog.name}`, 170);
    doc.text(titleLines, 20, 45);
    
    const metaY = 45 + (titleLines.length * 8);

    // Specs
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text(`Duration: ${prog.duration}`, 20, metaY + 5);
    doc.text(`Credits: ${prog.credits}`, 20, metaY + 12);
    doc.text(`Tuition: ${prog.tuition}`, 20, metaY + 19);
    doc.text(`Minimum Admission: ${prog.minGpa ? `${prog.minGpa} GPA (${prog.minPercent}%)` : '2.5 GPA (65%)'}`, 20, metaY + 26);
    
    // Description
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Program Overview", 20, metaY + 40);
    
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    const descLines = doc.splitTextToSize(prog.description, 170);
    doc.text(descLines, 20, metaY + 48);
    
    let modulesY = metaY + 48 + (descLines.length * 6) + 10;

    // Modules
    if (prog.modules && prog.modules.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Core Modules & Syllabus", 20, modulesY);
      
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      prog.modules.forEach((mod, i) => {
        const modLines = doc.splitTextToSize(`• ${mod}`, 160);
        doc.text(modLines, 25, modulesY + 8 + (i * 7));
      });
    }

    // Footer watermark
    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.text("This document is an officially verified syllabus from University of East Florida.", 20, 280);

    doc.save(`UEF_Brochure_${prog.id}.pdf`);
  };

  const filteredPrograms = programs.filter(p => {
    const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const titleStr = (p.title || p.name || '').toLowerCase();
    const degreeStr = (p.degree || '').toLowerCase();
    const descStr = (p.description || '').toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q || titleStr.includes(q) || degreeStr.includes(q) || descStr.includes(q);
    return matchCategory && matchSearch;
  });

  return (
    <section className="section-wrapper" id="programs">
      <div className="section-header">
        <span className="section-tag">Academic Excellence</span>
        <h2 className="section-title">100% ONLINE DEGREE CATALOG</h2>
        <p className="section-desc">
          Explore our curated non-practical theoretical &amp; digital programs. All courses are delivered via our secure Learning Management System (LMS) with 24/7 access to lecture notes, virtual research archives, and faculty guidance.
        </p>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="catalog-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search degree programs (e.g. Computer Science, MBA, Cybersecurity)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-pills">
          {dynamicCategories.map(cat => (
            <button
              key={cat}
              className={`filter-pill${categoryFilter === cat ? ' active' : ''}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat === 'all' ? 'All Programs' : standardDisplayMap[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* PROGRAMS GRID */}
      <div className="programs-grid">
        {filteredPrograms.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid var(--border-gold)' }}>
            <p style={{ color: 'var(--gold-light)', fontSize: '16px' }}>No programs found matching "{searchQuery}".</p>
          </div>
        ) : filteredPrograms.map((prog, idx) => (
          <div 
            key={prog.id} 
            className={`program-card category-${prog.category || 'default'} scroll-reveal`}
            style={{ transitionDelay: `${Math.min(idx * 100, 800)}ms` }}
          >
            <div className="card-header">
              <div className="program-degree">{prog.degree || 'Degree Program'}</div>
              <div className="program-name">{prog.title || prog.name}</div>
            </div>
            <div className="card-body">
              <p className="program-desc">{prog.description}</p>
              <div className="program-specs">
                <div className="spec-item">
                  <span className="spec-label">Duration</span>
                  <span className="spec-val">{prog.duration}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Credits</span>
                  <span className="spec-val">{prog.credits} Credits</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Tuition</span>
                  <span className="spec-val" style={{ color: '#34d399' }}>{prog.tuition}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Min Admission</span>
                  <span className="spec-val">{prog.minGpa ? `${prog.minGpa} GPA (${prog.minPercent}%)` : '2.5 GPA (65%)'}</span>
                </div>
              </div>
              <div className="card-actions">
                <button className="btn btn-maroon" onClick={() => handleDownloadBrochure(prog)}>
                  📄 PDF Brochure
                </button>
                <a href="#applySection" className="btn btn-gold" onClick={() => onSelectProgramToApply(prog.id)}>
                  ✍️ Apply &amp; Upload
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>


    </section>
  );
}
