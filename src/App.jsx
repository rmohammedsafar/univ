import React, { useState, useEffect } from 'react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProgramCatalog from './components/ProgramCatalog';
import AboutUs from './components/AboutUs';
import CampusTour from './components/CampusTour';
import UpcomingEvents from './components/UpcomingEvents';
import RegistrationPage from './components/RegistrationPage';
import GalleryPage from './components/GalleryPage';
import EventsPage from './components/EventsPage';
import AdminPage from './components/AdminPage';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';

import { Routes, Route, useLocation } from 'react-router-dom';

import { INITIAL_DEGREE_PROGRAMS, INITIAL_TOUR_SLIDES, INITIAL_CONTACT_INFO, INITIAL_HERO_CONFIG, INITIAL_ABOUT_US, INITIAL_GALLERY_IMAGES, INITIAL_ELECTIVES, INITIAL_EVENTS, INITIAL_THEME_CONFIG } from './data/initialData';
import { loadCMSConfigFromStorage, loadTourConfigFromStorage, loadContactConfigFromStorage, loadHeroConfigFromStorage, loadAboutUsFromStorage, loadGalleryFromStorage, loadElectivesFromStorage, loadEventsFromStorage, loadThemeConfigFromStorage } from './services/firebase';

export default function App() {
  const location = useLocation();
  const isStandalonePage = false;

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
  const [programs, setPrograms] = useState(INITIAL_DEGREE_PROGRAMS);
  const [aboutData, setAboutData] = useState(INITIAL_ABOUT_US);
  const [tourSlides, setTourSlides] = useState(INITIAL_TOUR_SLIDES);
  const [contactInfo, setContactInfo] = useState(INITIAL_CONTACT_INFO);
  const [heroConfig, setHeroConfig] = useState(INITIAL_HERO_CONFIG);
  const [galleryImages, setGalleryImages] = useState(INITIAL_GALLERY_IMAGES);
  const [electives, setElectives] = useState(INITIAL_ELECTIVES);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [themeConfig, setThemeConfig] = useState(INITIAL_THEME_CONFIG);

  useEffect(() => {
    const loadAllCMS = async () => {
      try {
        const [savedPrograms, savedTour, savedContact, savedHero, savedAbout, savedGallery, savedElectives, savedEvents, savedTheme] = await Promise.all([
          loadCMSConfigFromStorage(),
          loadTourConfigFromStorage(),
          loadContactConfigFromStorage(),
          loadHeroConfigFromStorage(),
          loadAboutUsFromStorage(),
          loadGalleryFromStorage(),
          loadElectivesFromStorage(),
          loadEventsFromStorage(),
          loadThemeConfigFromStorage()
        ]);
        
        if (savedPrograms && savedPrograms.length > 0) setPrograms(savedPrograms);
        if (savedTour && savedTour.length > 0) setTourSlides(savedTour);
        if (savedContact) setContactInfo(savedContact);
        if (savedHero) setHeroConfig(savedHero);
        if (savedAbout) setAboutData(savedAbout);
        if (savedGallery && savedGallery.length > 0) setGalleryImages(savedGallery);
        if (savedElectives && savedElectives.length > 0) setElectives(savedElectives);
        if (savedEvents && savedEvents.length > 0) setEvents(savedEvents);
        if (savedTheme) setThemeConfig(savedTheme);
      } catch (e) {
        console.error("Failed to load CMS data:", e);
      }
    };
    loadAllCMS();
  }, []);

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
          } else {
            entry.target.classList.remove('visible');
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
      {themeConfig && (
        <style>{`
          :root, body.light-theme {
            background: ${themeConfig.bgColor} !important;
            color: ${themeConfig.textColor} !important;
            --bg-dark: ${themeConfig.bgColor};
            --text-main: ${themeConfig.textColor};
          }
          body.light-theme .section-wrapper,
          body.light-theme section {
            background: ${themeConfig.bgColor} !important;
            color: ${themeConfig.textColor} !important;
          }
          body.light-theme h1,
          body.light-theme h2,
          body.light-theme h3,
          body.light-theme h4,
          body.light-theme h5,
          body.light-theme h6 {
            color: ${themeConfig.textColor} !important;
          }
        `}</style>
      )}

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
            
            <AboutUs aboutData={aboutData} />
            <ProgramCatalog programs={programs} />
            <CampusTour tourSlides={tourSlides} />
            <UpcomingEvents events={events} />
          </main>
        } />

        <Route path="/gallery" element={<GalleryPage galleryImages={galleryImages} />} />
        
        <Route path="/events" element={<EventsPage events={events} />} />

        <Route path="/apply" element={<RegistrationPage programs={programs} electives={electives} />} />
        
        <Route path="/admin" element={
            <AdminPage 
              programs={programs} 
              onUpdatePrograms={setPrograms} 
              tourSlides={tourSlides}
              onUpdateTour={setTourSlides}

              contactInfo={contactInfo}
              onUpdateContact={setContactInfo}
              heroConfig={heroConfig}
              onUpdateHero={setHeroConfig}
              aboutData={aboutData}
              onUpdateAbout={setAboutData}
              galleryImages={galleryImages}
              onUpdateGallery={setGalleryImages}
              electives={electives}
              onUpdateElectives={setElectives}
              events={events}
              onUpdateEvents={setEvents}
              themeConfig={themeConfig}
              onUpdateTheme={setThemeConfig}
            />
        } />
      </Routes>

      {/* Footer & Accreditation */}
      {!isStandalonePage && <Footer contactInfo={contactInfo} />}
    </div>
  );
}
