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
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach((el) => observer.observe(el));

    return () => elements.forEach((el) => observer.unobserve(el));
  }, [programs, categoryFilter, searchQuery]);

  const getCategoryColor = (cat) => {
    const colors = [
      { primary: '#8b5cf6', rgb: '139, 92, 246', gradient: ['rgba(46, 16, 101, 0.92)', 'rgba(91, 33, 182, 0.92)'] },
      { primary: '#ec4899', rgb: '236, 72, 153', gradient: ['rgba(80, 7, 36, 0.92)', 'rgba(157, 23, 77, 0.92)'] },
      { primary: '#f97316', rgb: '249, 115, 22', gradient: ['rgba(67, 20, 7, 0.92)', 'rgba(154, 52, 18, 0.92)'] },
      { primary: '#14b8a6', rgb: '20, 184, 166', gradient: ['rgba(4, 47, 46, 0.92)', 'rgba(17, 94, 89, 0.92)'] },
      { primary: '#eab308', rgb: '234, 179, 8', gradient: ['rgba(66, 32, 6, 0.92)', 'rgba(133, 77, 14, 0.92)'] },
      { primary: '#ef4444', rgb: '239, 68, 68', gradient: ['rgba(69, 10, 10, 0.92)', 'rgba(153, 27, 27, 0.92)'] },
    ];
    
    if (cat === 'technology' || cat === 'business' || cat === 'healthcare') return null;
    
    let hash = 0;
    for (let i = 0; i < cat.length; i++) {
      hash = cat.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getCategoryDisplayName = (cat) => {
    if (cat === 'all') return 'All Programs';
    if (cat === 'technology') return '💻 Computer & Data Tech';
    if (cat === 'business') return '📈 Business & FinTech';
    if (cat === 'healthcare') return '⚕️ Health Informatics';
    
    let title = cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    let emoji = '📚';
    const lower = cat.toLowerCase();
    if (lower.includes('art') || lower.includes('design')) emoji = '🎨';
    else if (lower.includes('science') || lower.includes('physics')) emoji = '🔬';
    else if (lower.includes('law') || lower.includes('legal')) emoji = '⚖️';
    else if (lower.includes('educat') || lower.includes('teach')) emoji = '🍎';
    else if (lower.includes('engineer')) emoji = '⚙️';
    else if (lower.includes('math')) emoji = '➗';
    else if (lower.includes('music')) emoji = '🎵';
    else if (lower.includes('sport') || lower.includes('athletic')) emoji = '⚽';
    else if (lower.includes('language') || lower.includes('linguistic')) emoji = '🗣️';
    
    return `${emoji} ${title}`;
  };

  const dynamicCategories = ['all'];
  const customStyles = [];
  
  programs.forEach(p => {
    if (p.category && !dynamicCategories.includes(p.category)) {
      dynamicCategories.push(p.category);
      
      const color = getCategoryColor(p.category);
      if (color) {
        const safeCat = p.category.replace(/[^a-zA-Z0-9-]/g, '');
        customStyles.push(`
          .program-card.category-${safeCat} { border: 2px solid rgba(${color.rgb}, 0.6) !important; }
          .program-card.category-${safeCat}:hover { border-color: ${color.primary} !important; box-shadow: 0 14px 35px rgba(${color.rgb}, 0.3) !important; }
          .program-card.category-${safeCat} .card-header { background: linear-gradient(135deg, ${color.gradient[0]} 0%, ${color.gradient[1]} 100%), url('/assets/home-bg-3.png') center/cover !important; border-bottom: 2px solid ${color.primary}; }
          .program-card.category-${safeCat} .program-degree { color: ${color.primary} !important; background: rgba(${color.rgb}, 0.25); border: 1px solid rgba(${color.rgb}, 0.4); }
        `);
      }
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
      <style>{customStyles.join('\n')}</style>
      <div className="section-header">
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
              {getCategoryDisplayName(cat)}
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
            className={`program-card category-${(prog.category || 'default').replace(/[^a-zA-Z0-9-]/g, '')} scroll-reveal`}
            style={{ transitionDelay: `${(idx % 4) * 110}ms` }}
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
                <button className="btn btn-maroon" style={{ width: '100%' }} onClick={() => handleDownloadBrochure(prog)}>
                  📄 PDF Brochure
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>


    </section>
  );
}
