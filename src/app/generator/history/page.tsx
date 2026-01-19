'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import { useAuth } from '@/lib/auth-context';
import { database } from '@/lib/firebase';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { BrandSystem, DiscoveryInputs, ColorValue } from '@/types/brand-system';

// Helper to check if a value is a ColorValue
function isColorValue(value: unknown): value is ColorValue {
  return (
    typeof value === 'object' &&
    value !== null &&
    'light' in value &&
    'dark' in value &&
    typeof (value as ColorValue).light === 'string' &&
    typeof (value as ColorValue).dark === 'string'
  );
}

interface Generation {
  id: string;
  inputs: DiscoveryInputs;
  tokens: BrandSystem;
  rating: number | null;
  createdAt: number;
}

function HistoryContent() {
  const { user } = useAuth();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null);

  useEffect(() => {
    async function fetchGenerations() {
      if (!database || !user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const generationsRef = ref(database, 'generations');
        const userQuery = query(generationsRef, orderByChild('userId'), equalTo(user.uid));
        const snapshot = await get(userQuery);

        if (snapshot.exists()) {
          const data: Generation[] = [];
          snapshot.forEach((child) => {
            data.push({ id: child.key!, ...child.val() });
          });
          // Sort by createdAt descending
          data.sort((a, b) => b.createdAt - a.createdAt);
          setGenerations(data);
        }
      } catch (err) {
        console.error('Failed to fetch generations:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchGenerations();
  }, [user?.uid]);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Generation History</h1>
            <p className="text-muted mt-1">View and reuse your past brand systems</p>
          </div>
          <Link
            href="/generator"
            className="px-4 py-2 text-sm rounded-md border border-[var(--card-border)] hover:border-[var(--accent)] transition-colors"
          >
            ← Back to Generator
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted">Loading...</p>
          </div>
        ) : generations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-muted mb-4">No generations yet</p>
            <Link
              href="/generator"
              className="px-4 py-2 text-sm rounded-md bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
            >
              Create Your First Brand System
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: List */}
            <div className="lg:col-span-1 space-y-3">
              {generations.map((gen) => (
                <button
                  key={gen.id}
                  onClick={() => setSelectedGeneration(gen)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedGeneration?.id === gen.id
                      ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                      : 'border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--accent)]/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{gen.inputs.companyName}</p>
                      <p className="text-sm text-muted">{gen.inputs.industry}</p>
                    </div>
                    {gen.rating && (
                      <span className={gen.rating === 5 ? 'text-green-500' : 'text-red-500'}>
                        {gen.rating === 5 ? '👍' : '👎'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted mt-2">
                    {new Date(gen.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </button>
              ))}
            </div>

            {/* Right: Preview */}
            <div className="lg:col-span-2">
              {selectedGeneration ? (
                <div className="p-6 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold">{selectedGeneration.inputs.companyName}</h2>
                      <p className="text-sm text-muted">
                        {selectedGeneration.inputs.industry} • {selectedGeneration.inputs.targetAudience}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <CopyButton tokens={selectedGeneration.tokens} />
                    </div>
                  </div>

                  {/* Color Preview */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-3">Colors</h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(selectedGeneration.tokens.colors)
                        .filter(([, value]) => isColorValue(value))
                        .slice(0, 6)
                        .map(([name, value]) => (
                          <div key={name} className="text-center">
                            <div
                              className="w-12 h-12 rounded-md border border-[var(--card-border)]"
                              style={{ backgroundColor: (value as ColorValue).dark }}
                            />
                            <span className="text-xs text-muted">{name}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Typography Preview */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-3">Typography</h3>
                    <p className="text-sm text-muted">
                      {selectedGeneration.tokens.typography.fontFamily.sans}
                    </p>
                  </div>

                  {/* Personality */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Personality</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedGeneration.inputs.personalityAdjectives.map((adj) => (
                        <span
                          key={adj}
                          className="px-2 py-1 text-xs rounded-full border border-[var(--card-border)]"
                        >
                          {adj}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Raw JSON */}
                  <details className="mt-6">
                    <summary className="text-sm font-medium cursor-pointer hover:text-[var(--accent)]">
                      View Raw JSON
                    </summary>
                    <pre className="mt-2 p-4 rounded-md border border-[var(--card-border)] bg-[var(--background)] text-xs overflow-auto max-h-64">
                      {JSON.stringify(selectedGeneration.tokens, null, 2)}
                    </pre>
                  </details>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
                  <p className="text-muted">Select a generation to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CopyButton({ tokens }: { tokens: BrandSystem }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(tokens, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="px-3 py-1 text-sm rounded-md border border-[var(--card-border)] hover:border-[var(--accent)] transition-colors"
    >
      {copied ? 'Copied!' : 'Copy JSON'}
    </button>
  );
}

export default function HistoryPage() {
  return (
    <AuthGuard>
      <HistoryContent />
    </AuthGuard>
  );
}
