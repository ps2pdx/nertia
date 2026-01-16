import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyAMNLbRC_TbVE6_e6f1azjW7Rvl5H4af68',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'battlezone-e5deb.firebaseapp.com',
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 'https://battlezone-e5deb-default-rtdb.firebaseio.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'battlezone-e5deb',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'battlezone-e5deb.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '219118222920',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:219118222920:web:8208fc75279c5ba02a627d',
};

let database: Database | null = null;
let auth: Auth | null = null;

try {
  // Check if Firebase app already exists to avoid duplicate initialization
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  database = getDatabase(app);
  auth = getAuth(app);
} catch (error) {
  console.error('Firebase initialization failed:', error);
}

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export { database, auth, googleProvider };

// Suppress Firebase errors in console
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (String(args[0]).includes('Firebase')) {
      return;
    }
    originalWarn(...args);
  };
}
