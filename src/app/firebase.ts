import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAO_aKEwjslPPOSh1PmhBRGw0Ht9IxEDDc",
  authDomain: "quecocino-f1afc.firebaseapp.com",
  projectId: "quecocino-f1afc",
  storageBucket: "quecocino-f1afc.firebasestorage.app",
  messagingSenderId: "38658939584",
  appId: "1:38658939584:web:d7cf8e3b46bf6e8466eb25"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);