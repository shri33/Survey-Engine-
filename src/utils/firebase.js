// src/utils/firebase.js

import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFilIK4sX_C9eqQ8asUoAD85ka8aie1ow",
  authDomain: "survey-engine-bf27d.firebaseapp.com",
  projectId: "survey-engine-bf27d",
  storageBucket: "survey-engine-bf27d.appspot.com", // fixed incorrect domain
  messagingSenderId: "1093342221126",
  appId: "1:1093342221126:web:4ac5b0aadff8804288cb47",
  measurementId: "G-DLSK4LMKHR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Analytics (only on client side)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Connect to Firestore emulator in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('Connected to Firestore emulator');
  } catch (error) {
    console.error('Firestore emulator connection failed:', error.message);
  }
}

export { db, analytics };
export default app;
