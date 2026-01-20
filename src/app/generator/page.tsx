'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  const { user } = useAuth();
  const [inputs, setInputs] = useState<DiscoveryInputs>(defaultInputs);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [discoveryStep, setDiscoveryStep] = useState<'url' | 'form'>('url');
  const [, setDiscoveredData] = useState<WebsiteDiscoveryResult | null>(null);
  const [copied, setCopied] = useState(false);

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

  const getShareUrl = () => {
    if (result?._generationId) {
      return `${window.location.origin}/brand/${result._generationId}`;
    }
    return null;
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    if (url) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenInNewTab = () => {
    const url = getShareUrl();
    if (url) {
      window.open(url, '_blank');
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
          {user && (
            <Link
              href="/generator/history"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              History
            </Link>
          )}
        </div>

        {/* Single column layout */}
        <div className="space-y-8">
          {/* Discovery Step */}
          {discoveryStep === 'url' && !result && (
            <div className="p-6 border border-[var(--card-border)] rounded-lg bg-[var(--card-bg)]">
              <WebsiteDiscovery
                onDiscoveryComplete={handleDiscoveryComplete}
                onSkip={handleSkipDiscovery}
              />
            </div>
          )}

          {/* Discovery Form */}
          {discoveryStep === 'form' && !result && (
            <div className="p-6 border border-[var(--card-border)] rounded-lg bg-[var(--card-bg)]">
              <DiscoveryForm
                inputs={inputs}
                setInputs={setInputs}
                onGenerate={handleGenerate}
                isLoading={loading}
              />
              {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
              <div className="mt-4 pt-4 border-t border-[var(--card-border)]">
                <button
                  onClick={() => {
                    setDiscoveryStep('url');
                    setInputs(defaultInputs);
                  }}
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  &larr; Back to URL discovery
                </button>
              </div>
            </div>
          )}

          {/* Output */}
          {loading ? (
            <div className="border border-[var(--card-border)] rounded-lg bg-[var(--card-bg)] overflow-hidden">
              <GeneratingAnimation isGenerating={loading} />
            </div>
          ) : result ? (
            <div className="border border-[var(--card-border)] rounded-lg bg-[var(--card-bg)] overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    {result.metadata?.name || 'Generated'} Brand System
                  </h2>
                  <div className="flex items-center gap-2">
                    {/* Share options - only show if we have a generation ID */}
                    {result._generationId && (
                      <>
                        <button
                          onClick={handleCopyLink}
                          className="px-3 py-1.5 text-sm rounded-md border border-[var(--card-border)] hover:border-[var(--accent)] transition-colors flex items-center gap-1.5"
                          title="Copy link to clipboard"
                        >
                          {copied ? (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              Copied!
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                              </svg>
                              Copy Link
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleOpenInNewTab}
                          className="px-3 py-1.5 text-sm rounded-md border border-[var(--card-border)] hover:border-[var(--accent)] transition-colors flex items-center gap-1.5"
                          title="Open in new tab"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                          Open in Tab
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                        isEditing
                          ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                          : 'border-[var(--card-border)] hover:border-[var(--accent)]'
                      }`}
                    >
                      {isEditing ? 'Done Editing' : 'Edit Tokens'}
                    </button>
                    <button
                      onClick={() => {
                        setResult(null);
                        setDiscoveryStep('url');
                        setInputs(defaultInputs);
                      }}
                      className="px-3 py-1.5 text-sm rounded-md border border-[var(--card-border)] hover:border-[var(--accent)] transition-colors"
                    >
                      New Brand
                    </button>
                  </div>
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

              {/* Feedback */}
              {result._generationId && (
                <div className="border-t border-[var(--card-border)] p-6">
                  <GenerationFeedback generationId={result._generationId} />
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function GeneratorPage() {
  // No auth guard - allow anonymous access for demo mode
  // Users can sign in to save their generations
  return <GeneratorContent />;
}
