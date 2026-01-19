'use client';

import { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { useAuth } from '@/lib/auth-context';
import { DiscoveryInputs, BrandSystem } from '@/types/brand-system';
import { DiscoveryForm } from '@/components/DiscoveryForm';
import { TokenPreview } from '@/components/TokenPreview';
import { GeneratingAnimation } from '@/components/GeneratingAnimation';
import { GenerationFeedback } from '@/components/GenerationFeedback';

interface GenerationResult extends BrandSystem {
  _generationId?: string;
}

const defaultInputs: DiscoveryInputs = {
  companyName: '',
  industry: 'AI/ML Infrastructure',
  targetAudience: '',
  personalityAdjectives: [],
  colorMood: 'cool',
  colorBrightness: 'dark',
  typographyStyle: 'modern',
  densityPreference: 'balanced',
};

function GeneratorContent() {
  const { user, signOut } = useAuth();
  const [inputs, setInputs] = useState<DiscoveryInputs>(defaultInputs);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs,
          userId: user?.uid,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Generation failed');
      }

      const tokens = await response.json();
      setResult(tokens);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Brand Systems Generator</h1>
            <p className="text-muted mt-1">Generate AI-powered design token systems</p>
          </div>
          <div className="flex items-center gap-4">
            {user?.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-8 h-8 rounded-full"
              />
            )}
            <button
              onClick={signOut}
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Discovery Form */}
          <div>
            <div className="p-6 border border-[var(--card-border)] rounded-lg bg-[var(--card-bg)]">
              <h2 className="text-lg font-semibold mb-4">Brand Discovery</h2>
              <DiscoveryForm
                inputs={inputs}
                setInputs={setInputs}
                onGenerate={handleGenerate}
                isLoading={loading}
              />
              {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
            </div>
          </div>

          {/* Right: Output */}
          <div>
            <div className="border border-[var(--card-border)] rounded-lg bg-[var(--card-bg)] overflow-hidden min-h-[500px]">
              {loading ? (
                <GeneratingAnimation isGenerating={loading} />
              ) : result ? (
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Generated System</h2>
                  <TokenPreview tokens={result} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-[500px] text-muted">
                  <p>Fill out the form and generate a brand system</p>
                </div>
              )}
            </div>

            {/* Feedback */}
            {result && !loading && (
              <div className="mt-4">
                <GenerationFeedback generationId={result._generationId} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GeneratorPage() {
  return (
    <AuthGuard>
      <GeneratorContent />
    </AuthGuard>
  );
}
