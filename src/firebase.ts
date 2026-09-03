import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAhcX0Ccz86PJ5eG51jjxADEurc4-bDT3o",
  authDomain: "crphotos.firebaseapp.com",
  projectId: "crphotos",
  storageBucket: "crphotos.firebasestorage.app",
  messagingSenderId: "753147493853",
  appId: "1:753147493853:web:c54275269645a3e4508a34",
  measurementId: "G-EVNFYHFENE"
};

// Inicializar Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
