'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { database } from '@/lib/firebase';
import { ref, query, orderByChild, get, push, set, remove, update } from 'firebase/database';
import { BrandSystem, DiscoveryInputs } from '@/types/brand-system';

interface Generation {
  id: string;
  inputs: DiscoveryInputs;
  tokens: BrandSystem;
  rating: number | null;
  createdAt: number;
}

interface GoldenExample {
  id: string;
  generationId: string | null;
  inputs: DiscoveryInputs;
  tokens: BrandSystem;
  industry: string;
  colorMood: string;
  notes: string;
  isActive: boolean;
  createdAt: number;
}

export default function GoldenExamplesPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [goldenExamples, setGoldenExamples] = useState<GoldenExample[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    if (!database) {
      setLoading(false);
      return;
    }

    try {
      // Fetch highly-rated generations
      const generationsRef = ref(database, 'generations');
      const generationsQuery = query(generationsRef, orderByChild('rating'));
      const genSnapshot = await get(generationsQuery);

      if (genSnapshot.exists()) {
        const data: Generation[] = [];
        genSnapshot.forEach((child) => {
          const gen = child.val();
          // Only show generations with positive rating
          if (gen.rating === 5) {
            data.push({ id: child.key!, ...gen });
          }
        });
        data.sort((a, b) => b.createdAt - a.createdAt);
        setGenerations(data);
      }

      // Fetch existing golden examples
      const examplesRef = ref(database, 'goldenExamples');
      const examplesSnapshot = await get(examplesRef);

      if (examplesSnapshot.exists()) {
        const examples: GoldenExample[] = [];
        examplesSnapshot.forEach((child) => {
          examples.push({ id: child.key!, ...child.val() });
        });
        examples.sort((a, b) => b.createdAt - a.createdAt);
        setGoldenExamples(examples);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function promoteToGolden(generation: Generation) {
    if (!database) return;

    try {
      const examplesRef = ref(database, 'goldenExamples');
      const newExampleRef = push(examplesRef);

      await set(newExampleRef, {
        generationId: generation.id,
        inputs: generation.inputs,
        tokens: generation.tokens,
        industry: generation.inputs.industry,
        colorMood: generation.inputs.colorMood,
        notes: notes,
        isActive: true,
        createdAt: Date.now(),
      });

      setNotes('');
      setSelectedGeneration(null);
      await fetchData();
    } catch (err) {
      console.error('Failed to promote generation:', err);
    }
  }

  async function toggleActive(example: GoldenExample) {
    if (!database) return;

    try {
      const exampleRef = ref(database, `goldenExamples/${example.id}`);
      await update(exampleRef, { isActive: !example.isActive });
      await fetchData();
    } catch (err) {
      console.error('Failed to toggle example:', err);
    }
  }

  async function deleteExample(exampleId: string) {
    if (!database) return;
    if (!confirm('Are you sure you want to delete this golden example?')) return;

    try {
      const exampleRef = ref(database, `goldenExamples/${exampleId}`);
      await remove(exampleRef);
      await fetchData();
    } catch (err) {
      console.error('Failed to delete example:', err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Golden Examples</h1>
            <p className="text-muted mt-1">Curate high-quality examples for few-shot prompting</p>
          </div>
          <Link
            href="/admin/generations"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            ← Back to Analytics
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Highly-rated generations to promote */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Highly-Rated Generations ({generations.length})
            </h2>
            <div className="space-y-3 max-h-[600px] overflow-auto">
              {generations.length === 0 ? (
                <p className="text-sm text-muted">No highly-rated generations yet</p>
              ) : (
                generations.map((gen) => (
                  <div
                    key={gen.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedGeneration?.id === gen.id
                        ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                        : 'border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--accent)]/50'
                    }`}
                    onClick={() => setSelectedGeneration(gen)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{gen.inputs.companyName}</p>
                        <p className="text-sm text-muted">{gen.inputs.industry}</p>
                      </div>
                      <span className="text-green-500">👍</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {gen.inputs.personalityAdjectives.slice(0, 3).map((adj) => (
                        <span
                          key={adj}
                          className="px-1.5 py-0.5 text-xs rounded border border-[var(--card-border)]"
                        >
                          {adj}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Promote Form */}
            {selectedGeneration && (
              <div className="mt-4 p-4 rounded-lg border border-[var(--accent)] bg-[var(--card-bg)]">
                <h3 className="font-medium mb-2">
                  Promote &quot;{selectedGeneration.inputs.companyName}&quot; to Golden Example
                </h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about why this is a good example..."
                  className="w-full p-2 text-sm rounded border border-[var(--card-border)] bg-[var(--background)] resize-none"
                  rows={2}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => promoteToGolden(selectedGeneration)}
                    className="px-3 py-1 text-sm rounded bg-[var(--accent)] text-white hover:opacity-90"
                  >
                    Promote
                  </button>
                  <button
                    onClick={() => setSelectedGeneration(null)}
                    className="px-3 py-1 text-sm rounded border border-[var(--card-border)] hover:border-[var(--accent)]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Current golden examples */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Active Golden Examples ({goldenExamples.filter((e) => e.isActive).length})
            </h2>
            <div className="space-y-3">
              {goldenExamples.length === 0 ? (
                <p className="text-sm text-muted">
                  No golden examples yet. Promote highly-rated generations from the left.
                </p>
              ) : (
                goldenExamples.map((example) => (
                  <div
                    key={example.id}
                    className={`p-4 rounded-lg border ${
                      example.isActive
                        ? 'border-green-500/50 bg-green-500/5'
                        : 'border-[var(--card-border)] bg-[var(--card-bg)] opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{example.inputs.companyName}</p>
                        <p className="text-sm text-muted">
                          {example.industry} • {example.colorMood}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleActive(example)}
                          className={`px-2 py-1 text-xs rounded ${
                            example.isActive
                              ? 'bg-green-500/20 text-green-500'
                              : 'bg-zinc-500/20 text-zinc-500'
                          }`}
                        >
                          {example.isActive ? 'Active' : 'Inactive'}
                        </button>
                        <button
                          onClick={() => deleteExample(example.id)}
                          className="px-2 py-1 text-xs rounded bg-red-500/20 text-red-500 hover:bg-red-500/30"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {example.notes && (
                      <p className="text-xs text-muted mt-2 italic">{example.notes}</p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {example.inputs.personalityAdjectives.map((adj) => (
                        <span
                          key={adj}
                          className="px-1.5 py-0.5 text-xs rounded border border-[var(--card-border)]"
                        >
                          {adj}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
