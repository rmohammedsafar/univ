import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';

export default function ProgramCatalog({ programs, onSelectProgramToApply }) {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const gridRef = useRef(null);

  const handleScroll = () => {
    if (window.innerWidth > 768 || !gridRef.current) return;
    const child = gridRef.current.children[0];
    const itemWidth = child ? child.offsetWidth : (window.innerWidth * 0.85);
    const gap = 16;
    const index = Math.round(gridRef.current.scrollLeft / (itemWidth + gap));
    if (index !== activeIndex && index >= 0 && index < filteredPrograms.length) {
      setActiveIndex(index);
    }
  };

  const scrollToSlide = (index) => {
    setActiveIndex(index);
    if (gridRef.current && window.innerWidth <= 768) {
      const child = gridRef.current.children[0];
      const itemWidth = child ? child.offsetWidth : (window.innerWidth * 0.85);
      const gap = 16;
      gridRef.current.scrollTo({ left: (itemWidth + gap) * index, behavior: 'smooth' });
    }
  };

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

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 255, 255';
  };

  const getCategoryColor = (cat) => {
    const colors = [
      { primary: '#c4b5fd', rgb: '196, 181, 253', gradient: ['rgba(46, 16, 101, 0.92)', 'rgba(91, 33, 182, 0.92)'] },
      { primary: '#fbcfe8', rgb: '251, 207, 232', gradient: ['rgba(80, 7, 36, 0.92)', 'rgba(157, 23, 77, 0.92)'] },
      { primary: '#fdba74', rgb: '253, 186, 116', gradient: ['rgba(67, 20, 7, 0.92)', 'rgba(154, 52, 18, 0.92)'] },
      { primary: '#5eead4', rgb: '94, 234, 212', gradient: ['rgba(4, 47, 46, 0.92)', 'rgba(17, 94, 89, 0.92)'] },
      { primary: '#fde047', rgb: '253, 224, 71', gradient: ['rgba(66, 32, 6, 0.92)', 'rgba(133, 77, 14, 0.92)'] },
      { primary: '#fca5a5', rgb: '252, 165, 165', gradient: ['rgba(69, 10, 10, 0.92)', 'rgba(153, 27, 27, 0.92)'] },
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
    
    const progWithEmoji = programs.find(p => p.category === cat && p.emoji);
    const customEmoji = progWithEmoji ? progWithEmoji.emoji : null;

    if (cat === 'technology') return `${customEmoji || '💻'} Computer & Data Tech`;
    if (cat === 'business') return `${customEmoji || '📈'} Business & FinTech`;
    if (cat === 'healthcare') return `${customEmoji || '⚕️'} Health Informatics`;
    if (cat === 'default') return `${customEmoji || '🎓'} General Studies`;
    
    let title = cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    if (customEmoji) return `${customEmoji} ${title}`;

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
    const catValue = p.category || 'default';
    if (!dynamicCategories.includes(catValue)) {
      dynamicCategories.push(catValue);
      
      const color = getCategoryColor(catValue);
      if (color) {
        const safeCat = catValue.replace(/[^a-zA-Z0-9-]/g, '');
        customStyles.push(`
          body .program-card.category-${safeCat} { border: 2px solid rgba(${color.rgb}, 0.6) !important; }
          body .program-card.category-${safeCat}:hover { border-color: ${color.primary} !important; box-shadow: 0 14px 35px rgba(${color.rgb}, 0.3) !important; }
          body .program-card.category-${safeCat} .card-header { background: linear-gradient(135deg, ${color.gradient[0]} 0%, ${color.gradient[1]} 100%), url('/assets/home-bg-3.png') center/contain !important; border-bottom: 2px solid ${color.primary}; }
          body .program-card.category-${safeCat} .program-degree { color: ${color.primary} !important; background: rgba(${color.rgb}, 0.25); border: 1px solid rgba(${color.rgb}, 0.4); border-radius: 50px; padding: 4px 14px; display: inline-block; width: fit-content; text-transform: uppercase; font-size: 11px; font-weight: 700; letter-spacing: 1px; }
          body .program-card.category-${safeCat} .program-name { text-transform: capitalize; margin-top: 8px; }
        `);
      }
    }

    if (p.bgImage) {
      const rgb = '0, 0, 0';
      const bgImg = p.bgImage;
      
      customStyles.push(`
        body .program-card.program-${p.id} .card-header { background: linear-gradient(135deg, rgba(${rgb}, 0.8) 0%, rgba(${rgb}, 0.6) 100%), url('${bgImg}') center/contain !important; }
        body .program-card.program-${p.id} .program-degree { color: #ffffff !important; background: rgba(255, 255, 255, 0.15) !important; border: 1px solid rgba(255, 255, 255, 0.3) !important; }
        body .program-card.program-${p.id} .program-name { color: #ffffff !important; }
      `);
    }
  });

  const handleDownloadBrochure = (prog) => {
    if (prog.brochureUrl) {
      window.open(prog.brochureUrl, '_blank');
      return;
    }

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(212, 175, 55);
    doc.text("UNIVERSITY OF EAST FLORIDA", 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("OFFICIAL PROGRAM SYLLABUS & BROCHURE", 20, 28);
    
    // Line separator
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.5);
    doc.line(20, 32, 190, 32);
    
    // Program Title
    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59);
    doc.text(prog.title || prog.name, 20, 45);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Degree: ${prog.degree}`, 20, 55);
    doc.text(`Format: ${prog.format || '100% Online'}`, 20, 62);
    
    // Overview
    doc.setFontSize(14);
    doc.setTextColor(212, 175, 55);
    doc.text("Program Overview", 20, 80);
    
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    const splitDesc = doc.splitTextToSize(prog.description || "Detailed curriculum information currently under review by academic department.", 170);
    doc.text(splitDesc, 20, 90);
    
    // Tuition
    doc.setFontSize(14);
    doc.setTextColor(212, 175, 55);
    doc.text("Tuition & Fees", 20, 130);
    
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.text(`Total Tuition: ${prog.tuition}`, 20, 140);
    doc.text(`Duration: ${prog.duration}`, 20, 147);
    
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
      <div className="section-header" data-aos="fade-up">
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

      {searchQuery && filteredPrograms.length > 0 && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }} data-aos="fade-in">
          <h3 style={{ color: 'var(--gold-light)', fontFamily: 'var(--font-serif)', fontSize: '24px', margin: 0 }}>
            Search Results for: "{searchQuery}"
          </h3>
        </div>
      )}

      {/* PROGRAMS GRID */}
      <div className="programs-grid" ref={gridRef} onScroll={handleScroll}>
        {filteredPrograms.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid var(--border-gold)' }}>
            <p style={{ color: 'var(--gold-light)', fontSize: '16px' }}>No programs found matching "{searchQuery}".</p>
          </div>
        ) : filteredPrograms.map((prog, idx) => (
          <div 
            key={prog.id} 
            className={`program-card category-${(prog.category || 'default').replace(/[^a-zA-Z0-9-]/g, '')} program-${prog.id}`}
            data-aos="fade-up"
            data-aos-delay={(idx % 4) * 100}
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

      {/* MOBILE PAGINATION DOTS */}
      {filteredPrograms.length > 0 && (
        <div className="tour-dots-mobile" style={{ flexWrap: 'wrap', marginTop: '24px' }}>
          {filteredPrograms.map((prog, idx) => (
            <button 
              key={prog.id} 
              className={`tour-dot ${activeIndex === idx ? 'active' : ''}`}
              onClick={() => scrollToSlide(idx)}
              aria-label={`Go to ${prog.title || prog.name}`}
            />
          ))}
        </div>
      )}


    </section>
  );
}
