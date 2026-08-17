import React, { useState, useEffect } from 'react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProgramCatalog from './components/ProgramCatalog';
import AboutUs from './components/AboutUs';
import CampusTour from './components/CampusTour';
import RegistrationPage from './components/RegistrationPage';
import GalleryPage from './components/GalleryPage';
import AdminPage from './components/AdminPage';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';

import { Routes, Route, useLocation } from 'react-router-dom';

import { INITIAL_DEGREE_PROGRAMS, INITIAL_TOUR_SLIDES, INITIAL_RESEARCH_PAPERS, INITIAL_NEWS, INITIAL_CONTACT_INFO, INITIAL_HERO_CONFIG } from './data/initialData';
import { loadCMSConfigFromStorage, loadTourConfigFromStorage, loadResearchConfigFromStorage, loadNewsConfigFromStorage, loadContactConfigFromStorage, loadHeroConfigFromStorage, saveCMSConfigToStorage, saveContactConfigToStorage } from './services/firebase';

export default function App() {
  const location = useLocation();
  const isStandalonePage = location.pathname === '/apply' || location.pathname === '/gallery';

  const [showLoading, setShowLoading] = useState(true);
  const [isFadingLoading, setIsFadingLoading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFadingLoading(true);
    }, 1100);

    const removeTimer = setTimeout(() => {
      setShowLoading(false);
    }, 1700);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  const [isLightTheme, setIsLightTheme] = useState(true);
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
  const [contactInfo, setContactInfo] = useState(() => {
    let saved = loadContactConfigFromStorage();
    if (saved) {
      if (!saved.dailyHours) {
        saved.dailyHours = INITIAL_CONTACT_INFO.dailyHours;
        saveContactConfigToStorage(saved);
      } else if (saved.dailyHours.length === 5) {
        saved.dailyHours.push({ day: "Saturday", startTime: "Closed", endTime: "Closed" });
        saved.dailyHours.push({ day: "Sunday", startTime: "Closed", endTime: "Closed" });
        saveContactConfigToStorage(saved);
      }
    }
    return saved || INITIAL_CONTACT_INFO;
  });
  const [heroConfig, setHeroConfig] = useState(() => {
    const saved = loadHeroConfigFromStorage();
    return saved || INITIAL_HERO_CONFIG;
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

  // Global Scroll Reveal Observer for Grid Cards
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

    const observeElements = () => {
      const elements = document.querySelectorAll('.scroll-reveal');
      elements.forEach((el) => observer.observe(el));
    };

    observeElements();
    const timer = setTimeout(observeElements, 250);

    return () => {
      clearTimeout(timer);
      const elements = document.querySelectorAll('.scroll-reveal');
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [location.pathname]);

  const toggleTheme = () => {
    setIsLightTheme(!isLightTheme);
  };

  return (
    <div className="app-main-wrapper">
      {showLoading && <LoadingScreen isFading={isFadingLoading} />}

      {/* Navigation Header */}
      {!isStandalonePage && (
        <Navbar 
          isLightTheme={isLightTheme} 
          toggleTheme={toggleTheme}
        />
      )}

      <Routes>
        <Route path="/" element={
          <main className="home-page-main">
            <Hero 
              heroConfig={heroConfig}
              stats={tourSlides.length} 
              onApplyNow={() => window.open('/apply', '_blank')} 
              onExplorePrograms={() => document.getElementById('programs').scrollIntoView({ behavior: 'smooth' })} 
            />
            
            <ProgramCatalog programs={programs} />
            <AboutUs />
            <CampusTour tourSlides={tourSlides} />
          </main>
        } />

        <Route path="/gallery" element={
          <GalleryPage 
            tourSlides={tourSlides} 
            researchPapers={researchPapers} 
            newsArticles={newsArticles} 
          />
        } />

        <Route path="/apply" element={<RegistrationPage />} />
        
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
              contactInfo={contactInfo}
              onUpdateContact={setContactInfo}
              heroConfig={heroConfig}
              onUpdateHero={setHeroConfig}
            />
        } />
      </Routes>

      {/* Footer & Accreditation */}
      {!isStandalonePage && <Footer contactInfo={contactInfo} />}
    </div>
  );
}
