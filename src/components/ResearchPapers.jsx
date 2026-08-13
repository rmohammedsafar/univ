import React from 'react';
import { jsPDF } from 'jspdf';

export default function ResearchPapers({ researchPapers = [] }) {
  const handleDownload = (paper, idx) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(212, 175, 55); // Gold
    doc.text("UNIVERSITY OF EAST FLORIDA", 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("100% ONLINE GLOBAL ACCREDITED UNIVERSITY", 20, 28);
    
    // Line separator
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.5);
    doc.line(20, 32, 190, 32);
    
    // Paper Title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    const titleLines = doc.splitTextToSize(paper.title, 170);
    doc.text(titleLines, 20, 45);
    
    // Author & Journal
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    const metaY = 45 + (titleLines.length * 7);
    doc.text(`Author: ${paper.author}`, 20, metaY + 5);
    doc.text(`Published in: ${paper.journal}`, 20, metaY + 12);
    
    // Category
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Category: ${paper.category}`, 20, metaY + 19);

    // Abstract
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Abstract", 20, metaY + 32);
    
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    const abstractLines = doc.splitTextToSize(paper.abstract, 170);
    doc.text(abstractLines, 20, metaY + 40);
    
    // Footer watermark
    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.text("This document is a certified extract from the UEF Digital Research Library.", 20, 280);

    // Save PDF
    doc.save(`UEF_Research_Paper_${idx + 1}.pdf`);
  };

  return (
    <section className="section-wrapper" id="researchPapersSection">
      <div className="section-header">
        <span className="section-tag">Scholarship & White Papers</span>
        <h2 className="section-title">ACADEMIC RESEARCH</h2>
        <p className="section-desc">
          Browse peer-reviewed white papers, graduate dissertations, and theoretical monographs published by University of East Florida faculty and research scholars.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {researchPapers.map((paper, idx) => (
          <div key={idx} className="program-card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '12px' }}>
              <span className="usa-flag-badge" style={{ background: 'rgba(212,175,55,0.2)', color: 'var(--gold-light)', fontSize: '11px' }}>
                {paper.category}
              </span>
            </div>

            <h3 style={{ fontSize: '18px', color: 'var(--gold-light)', fontFamily: 'var(--font-serif)', marginBottom: '8px', lineHeight: '1.3' }}>
              {paper.title}
            </h3>

            <p style={{ fontSize: '12px', color: 'var(--gold-primary)', fontWeight: '600', marginBottom: '10px' }}>
              ✍️ {paper.author} • <span style={{ color: 'var(--text-muted)' }}>{paper.journal}</span>
            </p>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '20px' }}>
              {paper.abstract}
            </p>

            <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => handleDownload(paper, idx)}
                className="btn btn-gold" 
                style={{ flex: 1, padding: '10px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                📥 Download Full PDF
              </button>
              <button 
                className="btn btn-outline" 
                onClick={() => window.open(paper.link, '_blank')}
                style={{ padding: '8px 12px', fontSize: '12px' }}
              >
                🔗 Read / Cite Paper
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
