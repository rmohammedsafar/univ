/* ==========================================================================
   UNIVERSITY OF EAST FLORIDA - FIREBASE FIRESTORE INTEGRATION SERVICE
   Project ID: university-8f798
   ========================================================================== */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCnVcAQOWjSYY9DatMNOIocSCLcAsPMaRE",
  authDomain: "uniusa-143f9.firebaseapp.com",
  projectId: "uniusa-143f9",
  storageBucket: "uniusa-143f9.firebasestorage.app",
  messagingSenderId: "645682227632",
  appId: "1:645682227632:web:35151151acf230c9a5ce75",
  measurementId: "G-WQSRH7REX5"
};

const app = initializeApp(FIREBASE_CONFIG);
export const db = getFirestore(app);
export const storage = getStorage(app);

const LOCAL_CMS_KEY = 'uef_cms_config';

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

const withTimeout = (promise, ms = 15000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Firebase operation timed out. Please check your Firebase rules and configuration.')), ms);
    promise.then(value => {
      clearTimeout(timer);
      resolve(value);
    }).catch(err => {
      clearTimeout(timer);
      reject(err);
    });
  });
};

export const uploadDocument = async (file, folderPath) => {
  if (!file) return null;
  const uniqueName = `${Date.now()}_${file.name}`;
  const storageRef = ref(storage, `${folderPath}/${uniqueName}`);
  await withTimeout(uploadBytes(storageRef, file));
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
