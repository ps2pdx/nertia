'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AuthGuard from '@/components/AuthGuard';
import { useAuth } from '@/lib/auth-context';
import { DiscoveryInputs, BrandSystem } from '@/types/brand-system';
import { WebsiteDiscoveryResult } from '@/types/website-discovery';
import { DiscoveryForm } from '@/components/DiscoveryForm';
import { WebsiteDiscovery } from '@/components/WebsiteDiscovery';
import { TokenPreview } from '@/components/TokenPreview';
import { GeneratingAnimation } from '@/components/GeneratingAnimation';
import { GenerationFeedback } from '@/components/GenerationFeedback';
import { TokenEditor } from '@/components/TokenEditor';

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
  const [isEditing, setIsEditing] = useState(false);
  const [discoveryStep, setDiscoveryStep] = useState<'url' | 'form'>('url');
  const [discoveredData, setDiscoveredData] = useState<WebsiteDiscoveryResult | null>(null);

  const handleDiscoveryComplete = (
    suggestedInputs: Partial<DiscoveryInputs>,
    raw: WebsiteDiscoveryResult
  ) => {
    setDiscoveredData(raw);
    setInputs((prev) => ({
      ...prev,
      ...suggestedInputs,
    }));
    setDiscoveryStep('form');
  };

  const handleSkipDiscovery = () => {
    setDiscoveryStep('form');
  };

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
            <Link
              href="/generator/history"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              History
            </Link>
            {user?.photoURL && (
              <Image
                src={user.photoURL}
                alt={user.displayName || 'User'}
                width={32}
                height={32}
                className="rounded-full"
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
              {discoveryStep === 'url' ? (
                <WebsiteDiscovery
                  onDiscoveryComplete={handleDiscoveryComplete}
                  onSkip={handleSkipDiscovery}
                />
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Brand Discovery</h2>
                    {discoveredData && (
                      <button
                        onClick={() => setDiscoveryStep('url')}
                        className="text-xs text-muted hover:text-foreground transition-colors"
                      >
                        Scan another URL
                      </button>
                    )}
                  </div>
                  {discoveredData && (
                    <div className="mb-4 p-3 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-md">
                      <p className="text-sm">
                        <span className="text-muted">Pre-filled from:</span>{' '}
                        <span className="font-medium">{discoveredData.url}</span>
                      </p>
                    </div>
                  )}
                  <DiscoveryForm
                    inputs={inputs}
                    setInputs={setInputs}
                    onGenerate={handleGenerate}
                    isLoading={loading}
                  />
                </>
              )}
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
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Generated System</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                        isEditing
                          ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                          : 'border-[var(--card-border)] hover:border-[var(--accent)]'
                      }`}
                    >
                      {isEditing ? 'Done Editing' : 'Edit Tokens'}
                    </button>
                  </div>
                  {isEditing ? (
                    <TokenEditor
                      tokens={result}
                      onTokensChange={(newTokens) => setResult({ ...newTokens, _generationId: result._generationId })}
                    />
                  ) : (
                    <TokenPreview tokens={result} />
                  )}
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
