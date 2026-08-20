/* ==========================================================================
   UNIVERSITY OF EAST FLORIDA - FIREBASE FIRESTORE INTEGRATION SERVICE
   Project ID: american-board-online
   ========================================================================== */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, orderBy, query, doc, setDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyC5aK_bNcjjfVrSTpMk21kdOQCHci9vM8w",
  authDomain: "american-board-online.firebaseapp.com",
  projectId: "american-board-online",
  storageBucket: "american-board-online.firebasestorage.app",
  messagingSenderId: "534691734340",
  appId: "1:534691734340:web:3fcc482f648b0d9fd32d11",
  measurementId: "G-XRGW1FG2WX"
};

export const app = initializeApp(FIREBASE_CONFIG);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// ============================================================
// Generic Firestore CMS helpers (single-document per section)
// ============================================================

const CMS_COLLECTION = "cms_config";

const saveCMSDoc = async (docId, data) => {
  try {
    await setDoc(doc(db, CMS_COLLECTION, docId), { ...data, updatedAt: new Date().toISOString() });
  } catch (e) {
    console.warn("Firestore save warning:", e);
  }
};

const loadCMSDoc = async (docId) => {
  try {
    const snap = await getDoc(doc(db, CMS_COLLECTION, docId));
    if (snap.exists()) return snap.data();
  } catch (e) {
    console.warn("Firestore load warning:", e);
  }
  return null;
};

// ============================================================
// Programs (Courses)
// ============================================================
export const saveCMSConfigToStorage = async (programs) => {
  await saveCMSDoc("programs", { programs });
};
export const loadCMSConfigFromStorage = async () => {
  const data = await loadCMSDoc("programs");
  return data && Array.isArray(data.programs) ? data.programs : null;
};

// ============================================================
// Virtual Tour Slides
// ============================================================
export const saveTourConfigToStorage = async (tourSlides) => {
  await saveCMSDoc("tour", { tourSlides });
};
export const loadTourConfigFromStorage = async () => {
  const data = await loadCMSDoc("tour");
  return data && Array.isArray(data.tourSlides) ? data.tourSlides : null;
};

// ============================================================
// Research Papers
// ============================================================
export const saveResearchConfigToStorage = async (researchPapers) => {
  await saveCMSDoc("research", { researchPapers });
};
export const loadResearchConfigFromStorage = async () => {
  const data = await loadCMSDoc("research");
  return data && Array.isArray(data.researchPapers) ? data.researchPapers : null;
};

// ============================================================
// News Articles
// ============================================================
export const saveNewsConfigToStorage = async (newsArticles) => {
  await saveCMSDoc("news", { newsArticles });
};
export const loadNewsConfigFromStorage = async () => {
  const data = await loadCMSDoc("news");
  return data && Array.isArray(data.newsArticles) ? data.newsArticles : null;
};

// ============================================================
// Contact Info
// ============================================================
export const saveContactConfigToStorage = async (contactInfo) => {
  await saveCMSDoc("contact", { contactInfo });
};
export const loadContactConfigFromStorage = async () => {
  const data = await loadCMSDoc("contact");
  return data && data.contactInfo ? data.contactInfo : null;
};

// ============================================================
// Hero Config
// ============================================================
export const saveHeroConfigToStorage = async (heroConfig) => {
  await saveCMSDoc("hero", { heroConfig });
};
export const loadHeroConfigFromStorage = async () => {
  const data = await loadCMSDoc("hero");
  return data && data.heroConfig ? data.heroConfig : null;
};

// ============================================================
// Gallery Images
// ============================================================
export const saveGalleryToStorage = async (galleryImages) => {
  await saveCMSDoc("gallery", { galleryImages });
};
export const loadGalleryFromStorage = async () => {
  const data = await loadCMSDoc("gallery");
  return data && data.galleryImages ? data.galleryImages : null;
};

// ============================================================
// About Us
// ============================================================
export const saveAboutUsToStorage = async (aboutData) => {
  await saveCMSDoc("about", { aboutData });
};
export const loadAboutUsFromStorage = async () => {
  const data = await loadCMSDoc("about");
  return data && data.aboutData ? data.aboutData : null;
};

// ============================================================
// Electives
// ============================================================
export const saveElectivesToStorage = async (electives) => {
  await saveCMSDoc("electives", { electives });
};
export const loadElectivesFromStorage = async () => {
  const data = await loadCMSDoc("electives");
  return data && Array.isArray(data.electives) ? data.electives : null;
};

// ============================================================
// Events
// ============================================================
export const saveEventsToStorage = async (events) => {
  await saveCMSDoc("events", { events });
};

export const loadEventsFromStorage = async () => {
  const data = await loadCMSDoc("events");
  return data && Array.isArray(data.events) ? data.events : null;
};

// ============================================================
// File Upload to Firebase Storage
// ============================================================
const withTimeout = (promise, ms = 60000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const err = new Error("Firebase operation timed out.");
      alert("Error: " + err.message);
      reject(err);
    }, ms);
    promise.then(value => { clearTimeout(timer); resolve(value); })
           .catch(err => { clearTimeout(timer); reject(err); });
  });
};

export const uploadDocument = async (file, folderPath, onProgress) => {
  if (!file) return null;
  const uniqueName = `${Date.now()}_${file.name}`;
  const storageRef = ref(storage, `${folderPath}/${uniqueName}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  if (onProgress) {
    uploadTask.on("state_changed", snapshot => {
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      onProgress(progress);
    });
  }
  await withTimeout(uploadTask);
  return await withTimeout(getDownloadURL(storageRef));
};

// ============================================================
// Student Applications
// ============================================================
export const saveApplicationRecord = async (appData) => {
  try {
    const colRef = collection(db, "student_applications");
    const docRef = await withTimeout(addDoc(colRef, { ...appData, createdAt: new Date().toISOString() }));
    return docRef.id;
  } catch (e) {
    console.error("Firestore save error:", e);
    throw e;
  }
};

export const getApplicationRecords = async () => {
  try {
    const colRef = collection(db, "student_applications");
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snapshot = await withTimeout(getDocs(q));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Firestore get error:", e);
    return [];
  }
};

export const saveInquiryRecord = async (inquiryData) => {
  try {
    const colRef = collection(db, "student_inquiries");
    const docRef = await withTimeout(addDoc(colRef, { ...inquiryData, createdAt: new Date().toISOString() }));
    return docRef.id;
  } catch (e) {
    console.error("Firestore inquiry save error:", e);
    throw e;
  }
};

export const getInquiryRecords = async () => {
  try {
    const colRef = collection(db, "student_inquiries");
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snapshot = await withTimeout(getDocs(q));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Firestore inquiry get error:", e);
    return [];
  }
};

export const loadVideosFromStorage = async () => {
  try {
    const docRef = doc(db, "cms_config", "videos");
    const docSnap = await withTimeout(getDoc(docRef));
    if (docSnap.exists()) return docSnap.data().videos || null;
  } catch (e) { console.error("Firestore get error:", e); }
  return null;
};

export const saveVideosToStorage = async (data) => {
  try {
    const docRef = doc(db, "cms_config", "videos");
    await withTimeout(setDoc(docRef, { videos: data }, { merge: true }));
  } catch (e) { console.error("Firestore save error:", e); throw e; }
};
