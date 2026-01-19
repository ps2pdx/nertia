'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { database } from '@/lib/firebase';
import { ref, query, orderByChild, limitToLast, get } from 'firebase/database';
import { DiscoveryInputs } from '@/types/brand-system';

interface Generation {
  id: string;
  inputs: DiscoveryInputs;
  rating: number | null;
  feedbackText: string | null;
  promptVersion: string;
  modelVersion: string;
  generationTimeMs: number;
  createdAt: number;
}

export default function GenerationsAdminPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGenerations() {
      if (!database) {
        setError('Database not initialized');
        setLoading(false);
        return;
      }

      try {
        const generationsRef = ref(database, 'generations');
        const generationsQuery = query(generationsRef, orderByChild('createdAt'), limitToLast(50));
        const snapshot = await get(generationsQuery);

        if (snapshot.exists()) {
          const data: Generation[] = [];
          snapshot.forEach((child) => {
            data.push({ id: child.key!, ...child.val() });
          });
          // Reverse to show newest first
          setGenerations(data.reverse());
        }
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    }

    fetchGenerations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  const total = generations.length;
  const rated = generations.filter((g) => g.rating !== null);
  const positive = rated.filter((g) => g.rating === 5).length;
  const negative = rated.filter((g) => g.rating === 1).length;
  const avgTime =
    total > 0 ? generations.reduce((acc, g) => acc + (g.generationTimeMs || 0), 0) / total : 0;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Generation Analytics</h1>
          <Link
            href="/admin/golden-examples"
            className="px-4 py-2 text-sm rounded-md border border-[var(--card-border)] hover:border-[var(--accent)] transition-colors"
          >
            Manage Golden Examples
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
            <p className="text-sm text-muted">Total</p>
            <p className="text-2xl font-bold">{total}</p>
          </div>
          <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
            <p className="text-sm text-muted">Positive</p>
            <p className="text-2xl font-bold text-green-500">{positive}</p>
          </div>
          <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
            <p className="text-sm text-muted">Negative</p>
            <p className="text-2xl font-bold text-red-500">{negative}</p>
          </div>
          <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
            <p className="text-sm text-muted">Avg Time</p>
            <p className="text-2xl font-bold">{(avgTime / 1000).toFixed(1)}s</p>
          </div>
        </div>

        {/* Generations List */}
        <div className="space-y-4">
          {generations.length === 0 ? (
            <p className="text-muted text-center py-8">No generations yet</p>
          ) : (
            generations.map((gen) => (
              <div
                key={gen.id}
                className={`border rounded-lg p-4 ${
                  gen.rating === 5
                    ? 'border-green-500/50 bg-green-500/5'
                    : gen.rating === 1
                      ? 'border-red-500/50 bg-red-500/5'
                      : 'border-[var(--card-border)] bg-[var(--card-bg)]'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium">{gen.inputs?.companyName || 'Unknown'}</span>
                    <span className="text-sm text-muted ml-2">{gen.inputs?.industry}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {gen.rating === 5 && <span className="text-green-500">👍</span>}
                    {gen.rating === 1 && <span className="text-red-500">👎</span>}
                    <span className="text-xs text-muted">
                      {new Date(gen.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 text-xs text-muted">
                  <span>Model: {gen.modelVersion || 'unknown'}</span>
                  <span>•</span>
                  <span>Time: {((gen.generationTimeMs || 0) / 1000).toFixed(1)}s</span>
                </div>

                {gen.feedbackText && (
                  <p className="text-sm text-muted mt-2 p-2 rounded border border-[var(--card-border)]">
                    {gen.feedbackText}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
