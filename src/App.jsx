import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

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
import CampusVideos from './components/CampusVideos';

import { Routes, Route, useLocation } from 'react-router-dom';

import { INITIAL_DEGREE_PROGRAMS, INITIAL_TOUR_SLIDES, INITIAL_CONTACT_INFO, INITIAL_HERO_CONFIG, INITIAL_ABOUT_US, INITIAL_GALLERY_IMAGES, INITIAL_ELECTIVES, INITIAL_EVENTS, INITIAL_VIDEOS } from './data/initialData';
import { loadCMSConfigFromStorage, loadTourConfigFromStorage, loadContactConfigFromStorage, loadHeroConfigFromStorage, loadAboutUsFromStorage, loadGalleryFromStorage, loadElectivesFromStorage, loadEventsFromStorage, loadVideosFromStorage } from './services/firebase';

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

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      offset: 100,
    });
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
  const [videos, setVideos] = useState(INITIAL_VIDEOS);

  useEffect(() => {
    const loadAllCMS = async () => {
      try {
        const [savedPrograms, savedTour, savedContact, savedHero, savedAbout, savedGallery, savedElectives, savedEvents, savedVideos] = await Promise.all([
          loadCMSConfigFromStorage(),
          loadTourConfigFromStorage(),
          loadContactConfigFromStorage(),
          loadHeroConfigFromStorage(),
          loadAboutUsFromStorage(),
          loadGalleryFromStorage(),
          loadElectivesFromStorage(),
          loadEventsFromStorage(),
          loadVideosFromStorage()
        ]);
        
        if (savedPrograms && savedPrograms.length > 0) setPrograms(savedPrograms);
        if (savedTour && savedTour.length > 0) setTourSlides(savedTour);
        if (savedContact) setContactInfo(savedContact);
        if (savedHero) setHeroConfig(savedHero);
        if (savedAbout) setAboutData(savedAbout);
        if (savedGallery && savedGallery.length > 0) setGalleryImages(savedGallery);
        if (savedElectives && savedElectives.length > 0) setElectives(savedElectives);
        if (savedEvents && savedEvents.length > 0) setEvents(savedEvents);
        if (savedVideos && savedVideos.length > 0) setVideos(savedVideos);
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

  // Global Scroll Reveal replaced by AOS

  // Handle hash routing scroll and scroll to top
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); // Allow time for loading screen & rendering
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [location.hash, location.pathname]);

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
            
            <AboutUs aboutData={aboutData} />
            <CampusVideos videos={videos} />
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
              videos={videos}
              onUpdateVideos={setVideos}
            />
        } />
      </Routes>

      {/* Footer & Accreditation */}
      {!isStandalonePage && <Footer contactInfo={contactInfo} />}
    </div>
  );
}
