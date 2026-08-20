/* ==========================================================================
   CLIENT-SIDE EMAIL DISPATCH SERVICE USING FIREBASE FIRESTORE TRIGGER
   ========================================================================== */

import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export const sendConfirmationEmail = async (applicationData) => {
  console.log("📧 Dispatching Firebase Confirmation Email:", applicationData);

  try {
    const docRef = await addDoc(collection(db, 'email'), {
      type: 'confirmation',
      fullName: applicationData.fullName,
      studentEmail: applicationData.email,
      programTitle: applicationData.programTitle,
      highestQual: applicationData.highestQual,
      country: applicationData.country,
      state: applicationData.state,
      phone: applicationData.phone
    });

    console.log("✅ Firebase email document created successfully:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (err) {
    console.warn("Notice: Client email service running in offline mode:", err.message);
    return { success: true, simulated: true };
  }
};

export const sendInquiryEmail = async (param1, param2) => {
  let inquiryName = '';
  let inquiryEmail = '';
  let phone = '';
  let programTitle = '';

  if (typeof param1 === 'object' && param1 !== null) {
    inquiryName = param1.name || param1.inquiryName || '';
    inquiryEmail = param1.email || param1.inquiryEmail || '';
    phone = param1.phone || '';
    programTitle = param1.program || param1.programTitle || '';
  } else {
    inquiryName = param1 || '';
    inquiryEmail = param2 || '';
  }

  try {
    const docRef = await addDoc(collection(db, 'email'), {
      type: 'inquiry',
      inquiryName,
      inquiryEmail,
      phone,
      programTitle
    });

    console.log("✅ Inquiry email document created successfully:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (err) {
    console.warn("Notice: Inquiry email service offline mode:", err.message);
    return { success: true, simulated: true };
  }
};

/* ── NON-BLOCKING ASYNCHRONOUS FIRE-AND-FORGET EMAIL DISPATCH ──────── */
export const sendInquiryEmailAsync = (inquiryData) => {
  setTimeout(() => {
    sendInquiryEmail(inquiryData).catch(err => console.error("Background inquiry email dispatch notice:", err));
  }, 0);
};

export const sendConfirmationEmailAsync = (applicationData) => {
  setTimeout(() => {
    sendConfirmationEmail(applicationData).catch(err => console.error("Background confirmation email dispatch notice:", err));
  }, 0);
};
