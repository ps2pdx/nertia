'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // This page handles the OAuth redirect
    // Firebase auth state listener in AuthProvider will pick up the user
    // Just redirect to generator after a brief moment
    const timeout = setTimeout(() => {
      router.push('/generator');
    }, 1000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)] mx-auto mb-4"></div>
        <p className="text-muted">Completing sign in...</p>
      </div>
    </div>
  );
}
