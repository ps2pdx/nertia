import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase is properly configured
const isFirebaseConfigured =
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.databaseURL;

let database: Database | null = null;
let auth: Auth | null = null;
let app: FirebaseApp | null = null;

if (isFirebaseConfigured) {
  try {
    // Check if Firebase app already exists to avoid duplicate initialization
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    database = getDatabase(app);
    auth = getAuth(app);
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
  }
}

// Google Auth Provider - only create if we have an app
const googleProvider = new GoogleAuthProvider();
if (isFirebaseConfigured) {
  googleProvider.setCustomParameters({
    prompt: 'select_account',
  });
}

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
