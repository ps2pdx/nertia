'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import type { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapFirebaseUser(firebaseUser: FirebaseUser | null): User | null {
  if (!firebaseUser) return null;
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.error('Firebase auth not initialized');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(mapFirebaseUser(firebaseUser));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) {
      throw new Error('Firebase auth not initialized');
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    if (!auth) {
      throw new Error('Firebase auth not initialized');
    }
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
