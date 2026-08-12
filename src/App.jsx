import React, { useState, useEffect } from 'react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProgramCatalog from './components/ProgramCatalog';
import CampusTour from './components/CampusTour';
import ResearchPapers from './components/ResearchPapers';
import UniversityBulletin from './components/UniversityBulletin';
import EnrollmentForm from './components/EnrollmentForm';
import AdminPage from './components/AdminPage';
import Footer from './components/Footer';

import { Routes, Route } from 'react-router-dom';

import { INITIAL_DEGREE_PROGRAMS, INITIAL_TOUR_SLIDES, INITIAL_RESEARCH_PAPERS, INITIAL_NEWS } from './data/initialData';
import { loadCMSConfigFromStorage, loadTourConfigFromStorage, loadResearchConfigFromStorage, loadNewsConfigFromStorage, saveCMSConfigToStorage } from './services/firebase';

export default function App() {
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [programs, setPrograms] = useState(() => {
    const saved = loadCMSConfigFromStorage();
    return saved && saved.length > 0 ? saved : INITIAL_DEGREE_PROGRAMS;
  });
  const [tourSlides, setTourSlides] = useState(() => {
    const saved = loadTourConfigFromStorage();
    return saved && saved.length > 0 ? saved : INITIAL_TOUR_SLIDES;
  });
  const [researchPapers, setResearchPapers] = useState(() => {
    const saved = loadResearchConfigFromStorage();
    return saved && saved.length > 0 ? saved : INITIAL_RESEARCH_PAPERS;
  });
  const [newsArticles, setNewsArticles] = useState(() => {
    const saved = loadNewsConfigFromStorage();
    return saved && saved.length > 0 ? saved : INITIAL_NEWS;
  });
  const [selectedProgramToApply, setSelectedProgramToApply] = useState('');

  // Synchronize body class for Light Mode / Dark Mode
  useEffect(() => {
    if (isLightTheme) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [isLightTheme]);

  const toggleTheme = () => {
    setIsLightTheme(!isLightTheme);
  };

  return (
    <div className="app-main-wrapper">
      {/* Navigation Header */}
      <Navbar 
        isLightTheme={isLightTheme} 
        toggleTheme={toggleTheme}
      />

      <Routes>
        <Route path="/" element={
          <main>
            <Hero 
              onExplorePrograms={() => {
                const el = document.getElementById("programs");
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onApplyNow={() => {
                const el = document.getElementById("applySection");
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <ProgramCatalog 
              programs={programs} 
              onSelectProgramToApply={(progId) => setSelectedProgramToApply(progId)}
            />

            <CampusTour tourSlides={tourSlides} />

            <ResearchPapers researchPapers={researchPapers} />

            <UniversityBulletin newsArticles={newsArticles} />

            <EnrollmentForm 
              programs={programs} 
              selectedProgramId={selectedProgramToApply}
            />
          </main>
        } />
        
        <Route path="/admin" element={
            <AdminPage 
              programs={programs} 
              onUpdatePrograms={setPrograms} 
              tourSlides={tourSlides}
              onUpdateTour={setTourSlides}
              researchPapers={researchPapers}
              onUpdateResearch={setResearchPapers}
              newsArticles={newsArticles}
              onUpdateNews={setNewsArticles}
            />
        } />
      </Routes>

      {/* Footer & Accreditation */}
      <Footer />
    </div>
  );
}
