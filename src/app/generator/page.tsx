'use client';

import { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { useAuth } from '@/lib/auth-context';
import { DiscoveryInputs, BrandSystem } from '@/types/brand-system';

const defaultInputs: DiscoveryInputs = {
  companyName: 'Acme Labs',
  industry: 'Developer Tools',
  targetAudience: 'Software engineers and technical leaders',
  personalityAdjectives: ['innovative', 'reliable', 'clear'],
  colorMood: 'cool',
  colorBrightness: 'balanced',
  typographyStyle: 'modern',
  densityPreference: 'balanced',
};

function GeneratorContent() {
  const { user, signOut } = useAuth();
  const [inputs, setInputs] = useState<DiscoveryInputs>(defaultInputs);
  const [result, setResult] = useState<BrandSystem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
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
          {/* Input Form */}
          <div className="space-y-6">
            <div className="p-6 border border-[var(--card-border)] rounded-lg bg-[var(--card-bg)]">
              <h2 className="text-lg font-semibold mb-4">Brand Discovery</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <input
                    type="text"
                    value={inputs.companyName}
                    onChange={(e) => setInputs({ ...inputs, companyName: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--card-border)] rounded-md bg-transparent focus:border-[var(--accent)] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Industry</label>
                  <input
                    type="text"
                    value={inputs.industry}
                    onChange={(e) => setInputs({ ...inputs, industry: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--card-border)] rounded-md bg-transparent focus:border-[var(--accent)] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Target Audience</label>
                  <input
                    type="text"
                    value={inputs.targetAudience}
                    onChange={(e) => setInputs({ ...inputs, targetAudience: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--card-border)] rounded-md bg-transparent focus:border-[var(--accent)] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Personality (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={inputs.personalityAdjectives.join(', ')}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        personalityAdjectives: e.target.value.split(',').map((s) => s.trim()),
                      })
                    }
                    className="w-full px-3 py-2 border border-[var(--card-border)] rounded-md bg-transparent focus:border-[var(--accent)] focus:outline-none transition-colors"
                    placeholder="innovative, reliable, clear"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Existing Brand Color (optional)
                  </label>
                  <input
                    type="text"
                    value={inputs.existingBrandColor || ''}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        existingBrandColor: e.target.value || undefined,
                      })
                    }
                    className="w-full px-3 py-2 border border-[var(--card-border)] rounded-md bg-transparent focus:border-[var(--accent)] focus:outline-none transition-colors"
                    placeholder="#22c55e"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Color Mood</label>
                    <select
                      value={inputs.colorMood}
                      onChange={(e) =>
                        setInputs({ ...inputs, colorMood: e.target.value as DiscoveryInputs['colorMood'] })
                      }
                      className="w-full px-3 py-2 border border-[var(--card-border)] rounded-md bg-transparent focus:border-[var(--accent)] focus:outline-none transition-colors"
                    >
                      <option value="warm">Warm</option>
                      <option value="cool">Cool</option>
                      <option value="neutral">Neutral</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Brightness</label>
                    <select
                      value={inputs.colorBrightness}
                      onChange={(e) =>
                        setInputs({
                          ...inputs,
                          colorBrightness: e.target.value as DiscoveryInputs['colorBrightness'],
                        })
                      }
                      className="w-full px-3 py-2 border border-[var(--card-border)] rounded-md bg-transparent focus:border-[var(--accent)] focus:outline-none transition-colors"
                    >
                      <option value="vibrant">Vibrant</option>
                      <option value="muted">Muted</option>
                      <option value="balanced">Balanced</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Typography Style</label>
                    <select
                      value={inputs.typographyStyle}
                      onChange={(e) =>
                        setInputs({
                          ...inputs,
                          typographyStyle: e.target.value as DiscoveryInputs['typographyStyle'],
                        })
                      }
                      className="w-full px-3 py-2 border border-[var(--card-border)] rounded-md bg-transparent focus:border-[var(--accent)] focus:outline-none transition-colors"
                    >
                      <option value="modern">Modern</option>
                      <option value="classic">Classic</option>
                      <option value="geometric">Geometric</option>
                      <option value="humanist">Humanist</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Density</label>
                    <select
                      value={inputs.densityPreference}
                      onChange={(e) =>
                        setInputs({
                          ...inputs,
                          densityPreference: e.target.value as DiscoveryInputs['densityPreference'],
                        })
                      }
                      className="w-full px-3 py-2 border border-[var(--card-border)] rounded-md bg-transparent focus:border-[var(--accent)] focus:outline-none transition-colors"
                    >
                      <option value="spacious">Spacious</option>
                      <option value="balanced">Balanced</option>
                      <option value="compact">Compact</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full mt-6 py-3 bg-[var(--accent)] text-white font-medium rounded-md hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate Brand System'}
              </button>

              {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
            </div>
          </div>

          {/* Output Preview */}
          <div className="border border-[var(--card-border)] rounded-lg bg-[var(--card-bg)] overflow-hidden">
            <div className="p-4 border-b border-[var(--card-border)]">
              <h2 className="text-lg font-semibold">Generated Tokens</h2>
            </div>
            <div className="p-4 overflow-auto max-h-[700px]">
              {result ? (
                <pre className="text-xs whitespace-pre-wrap font-mono">
                  {JSON.stringify(result, null, 2)}
                </pre>
              ) : (
                <p className="text-muted">Generate a brand system to see results</p>
              )}
            </div>
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
