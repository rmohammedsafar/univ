/* ==========================================================================
   UNIVERSITY OF EAST FLORIDA - FIREBASE FIRESTORE INTEGRATION SERVICE
   Project ID: university-8f798
   ========================================================================== */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyC5aK_bNcjjfVrSTpMk21kdOQCHci9vM8w",
  authDomain: "american-board-online.firebaseapp.com",
  projectId: "american-board-online",
  storageBucket: "american-board-online.firebasestorage.app",
  messagingSenderId: "534691734340",
  appId: "1:534691734340:web:3fcc482f648b0d9fd32d11",
  measurementId: "G-XRGW1FG2WX"
};

const app = initializeApp(FIREBASE_CONFIG);
export const db = getFirestore(app);
export const storage = getStorage(app);

const LOCAL_CMS_KEY = 'uef_cms_config';
const LOCAL_GALLERY_KEY = 'uef_gallery_config';

export const saveCMSConfigToStorage = (programs) => {
  try {
    const configData = {
      programs,
      isCustomized: true,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(LOCAL_CMS_KEY, JSON.stringify(configData));
  } catch (e) {
    console.warn("LocalStorage save warning:", e);
  }
};

export const loadCMSConfigFromStorage = () => {
  try {
    const raw = localStorage.getItem(LOCAL_CMS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.programs)) {
        return parsed.programs;
      }
    }
  } catch (e) {
    console.warn("LocalStorage load warning:", e);
  }
  return null;
};

const LOCAL_TOUR_KEY = 'uef_tour_config';

export const saveTourConfigToStorage = (tourSlides) => {
  try {
    const configData = {
      tourSlides,
      isCustomized: true,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(LOCAL_TOUR_KEY, JSON.stringify(configData));
  } catch (e) {
    console.warn("LocalStorage save warning (Tour):", e);
  }
};

export const loadTourConfigFromStorage = () => {
  try {
    const raw = localStorage.getItem(LOCAL_TOUR_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.tourSlides)) {
        return parsed.tourSlides;
      }
    }
  } catch (e) {
    console.warn("LocalStorage load warning (Tour):", e);
  }
  return null;
};

const LOCAL_RESEARCH_KEY = 'uef_research_config';

export const saveResearchConfigToStorage = (researchPapers) => {
  try {
    const configData = {
      researchPapers,
      isCustomized: true,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(LOCAL_RESEARCH_KEY, JSON.stringify(configData));
  } catch (e) {
    console.warn("LocalStorage save warning (Research):", e);
  }
};

export const loadResearchConfigFromStorage = () => {
  try {
    const raw = localStorage.getItem(LOCAL_RESEARCH_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.researchPapers)) {
        return parsed.researchPapers;
      }
    }
  } catch (e) {
    console.warn("LocalStorage load warning (Research):", e);
  }
  return null;
};

const LOCAL_NEWS_KEY = 'uef_news_config';

export const saveNewsConfigToStorage = (newsArticles) => {
  try {
    const configData = {
      newsArticles,
      isCustomized: true,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(LOCAL_NEWS_KEY, JSON.stringify(configData));
  } catch (e) {
    console.warn("LocalStorage save warning (News):", e);
  }
};

export const loadNewsConfigFromStorage = () => {
  try {
    const raw = localStorage.getItem(LOCAL_NEWS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.newsArticles)) {
        return parsed.newsArticles;
      }
    }
  } catch (e) {
    console.warn("LocalStorage load warning (News):", e);
  }
  return null;
};

const LOCAL_CONTACT_KEY = 'uef_contact_config';

export const saveContactConfigToStorage = (contactInfo) => {
  try {
    const configData = {
      contactInfo,
      isCustomized: true,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(LOCAL_CONTACT_KEY, JSON.stringify(configData));
  } catch (e) {
    console.warn("LocalStorage save warning (Contact):", e);
  }
};

export const loadContactConfigFromStorage = () => {
  try {
    const raw = localStorage.getItem(LOCAL_CONTACT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.contactInfo) {
        return parsed.contactInfo;
      }
    }
  } catch (e) {
    console.warn("LocalStorage load warning (Contact):", e);
  }
  return null;
};

const LOCAL_HERO_KEY = 'uef_hero_config';

export const saveHeroConfigToStorage = (heroConfig) => {
  try {
    const configData = {
      heroConfig,
      isCustomized: true,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(LOCAL_HERO_KEY, JSON.stringify(configData));
  } catch (e) {
    console.warn("LocalStorage save warning (Hero):", e);
  }
};

export const loadHeroConfigFromStorage = () => {
  try {
    const raw = localStorage.getItem(LOCAL_HERO_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.heroConfig) {
        return parsed.heroConfig;
      }
    }
  } catch (e) {
    console.warn("LocalStorage load warning (Hero):", e);
  }
  return null;
};

export const saveGalleryToStorage = (galleryImages) => {
  try {
    const data = { galleryImages, updatedAt: new Date().toISOString() };
    localStorage.setItem(LOCAL_GALLERY_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("LocalStorage save warning (Gallery):", e);
  }
};

export const loadGalleryFromStorage = () => {
  try {
    const raw = localStorage.getItem(LOCAL_GALLERY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.galleryImages) {
        return parsed.galleryImages;
      }
    }
  } catch (e) {
    console.warn("LocalStorage load warning (Gallery):", e);
  }
  return null;
};

const withTimeout = (promise, ms = 60000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const err = new Error('Firebase operation timed out. Please check your Firebase rules and configuration.');
      alert('Error submitting application: ' + err.message);
      reject(err);
    }, ms);
    promise.then(value => {
      clearTimeout(timer);
      resolve(value);
    }).catch(err => {
      clearTimeout(timer);
      reject(err);
    });
  });
};

export const uploadDocument = async (file, folderPath, onProgress) => {
  if (!file) return null;
  const uniqueName = `${Date.now()}_${file.name}`;
  const storageRef = ref(storage, `${folderPath}/${uniqueName}`);
  
  const uploadTask = uploadBytesResumable(storageRef, file);
  
  if (onProgress) {
    uploadTask.on('state_changed', snapshot => {
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      onProgress(progress);
    });
  }

  await withTimeout(uploadTask);

  return await withTimeout(getDownloadURL(storageRef));
};

export const saveApplicationRecord = async (appData) => {
  try {
    const colRef = collection(db, 'student_applications');
    const docRef = await withTimeout(addDoc(colRef, {
      ...appData,
      createdAt: new Date().toISOString()
    }));
    return docRef.id;
  } catch (e) {
    console.error("Firestore save error:", e);
    throw e;
  }
};

export const getApplicationRecords = async () => {
  try {
    const colRef = collection(db, 'student_applications');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await withTimeout(getDocs(q));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Firestore get error:", e);
    return [];
  }
};

export const saveInquiryRecord = async (inquiryData) => {
  try {
    const colRef = collection(db, 'student_inquiries');
    const docRef = await withTimeout(addDoc(colRef, {
      ...inquiryData,
      createdAt: new Date().toISOString()
    }));
    return docRef.id;
  } catch (e) {
    console.error("Firestore inquiry save error:", e);
    throw e;
  }
};

export const getInquiryRecords = async () => {
  try {
    const colRef = collection(db, 'student_inquiries');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await withTimeout(getDocs(q));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Firestore inquiry get error:", e);
    return [];
  }
};

const LOCAL_ABOUT_KEY = 'uef_about_config';

export const saveAboutUsToStorage = (aboutData) => {
  try {
    const configData = {
      aboutData,
      isCustomized: true,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(LOCAL_ABOUT_KEY, JSON.stringify(configData));
  } catch (e) {
    console.warn("LocalStorage save warning:", e);
  }
};

export const loadAboutUsFromStorage = () => {
  try {
    const raw = localStorage.getItem(LOCAL_ABOUT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.aboutData) {
        return parsed.aboutData;
      }
    }
  } catch (e) {
    console.warn("LocalStorage load warning:", e);
  }
  return null;
};

const LOCAL_ELECTIVES_KEY = 'uef_electives_config';

export const saveElectivesToStorage = (electives) => {
  try {
    const configData = {
      electives,
      isCustomized: true,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(LOCAL_ELECTIVES_KEY, JSON.stringify(configData));
  } catch (e) {
    console.warn("LocalStorage save warning:", e);
  }
};

export const loadElectivesFromStorage = () => {
  try {
    const raw = localStorage.getItem(LOCAL_ELECTIVES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.electives) {
        return parsed.electives;
      }
    }
  } catch (e) {
    console.warn("LocalStorage load warning:", e);
  }
  return null;
};
