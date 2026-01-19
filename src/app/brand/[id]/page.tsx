'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { database } from '@/lib/firebase';
import { ref, get } from 'firebase/database';
import { BrandSystem, DiscoveryInputs } from '@/types/brand-system';
import { BrandSystemView } from '@/components/BrandSystemView';

interface Generation {
  inputs: DiscoveryInputs;
  tokens: BrandSystem;
  createdAt: number;
}

export default function BrandPage() {
  const params = useParams();
  const id = params.id as string;
  const [generation, setGeneration] = useState<Generation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGeneration() {
      if (!database || !id) {
        setError('Unable to load brand system');
        setLoading(false);
        return;
      }

      try {
        const generationRef = ref(database, `generations/${id}`);
        const snapshot = await get(generationRef);

        if (snapshot.exists()) {
          setGeneration(snapshot.val());
        } else {
          setError('Brand system not found');
        }
      } catch (err) {
        console.error('Failed to fetch generation:', err);
        setError('Failed to load brand system');
      } finally {
        setLoading(false);
      }
    }

    fetchGeneration();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted">Loading brand system...</p>
        </div>
      </div>
    );
  }

  if (error || !generation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Brand System Not Found</h1>
          <p className="text-muted mb-6">{error || 'The requested brand system could not be found.'}</p>
          <Link
            href="/"
            className="px-4 py-2 bg-[var(--accent)] text-white rounded-md hover:opacity-90 transition-opacity"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return <BrandSystemView tokens={generation.tokens} inputs={generation.inputs} />;
}
