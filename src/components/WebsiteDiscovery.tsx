'use client';

import { useState } from 'react';
import { DiscoveryInputs } from '@/types/brand-system';
import { WebsiteDiscoveryResult } from '@/types/website-discovery';
import { useWebsiteDiscovery } from '@/hooks/useWebsiteDiscovery';

interface WebsiteDiscoveryProps {
  onDiscoveryComplete: (
    inputs: Partial<DiscoveryInputs>,
    raw: WebsiteDiscoveryResult
  ) => void;
  onSkip: () => void;
}

export function WebsiteDiscovery({
  onDiscoveryComplete,
  onSkip,
}: WebsiteDiscoveryProps) {
  const [url, setUrl] = useState('');
  const { discover, result, suggestedInputs, loading, error, reset } =
    useWebsiteDiscovery();

  const handleDiscover = async () => {
    if (!url.trim()) return;

    // Add https:// if no protocol specified
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    await discover(normalizedUrl);
  };

  const handleApply = () => {
    if (result && suggestedInputs) {
      onDiscoveryComplete(suggestedInputs, result);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleDiscover();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Discover Your Brand</h3>
        <p className="text-sm text-muted mb-4">
          Enter your website URL to automatically extract brand colors, fonts, and more.
        </p>
      </div>

      {/* URL Input */}
      <div>
        <label className="block text-sm font-medium mb-2">Website URL</label>
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="yourcompany.com"
            disabled={loading}
            className="flex-1 px-3 py-2 border border-[var(--card-border)] rounded-md bg-transparent focus:border-[var(--accent)] focus:outline-none transition-colors disabled:opacity-50"
          />
          <button
            onClick={handleDiscover}
            disabled={loading || !url.trim()}
            className="px-4 py-2 bg-[var(--accent)] text-white rounded-md hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[100px]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner />
                Analyzing
              </span>
            ) : (
              'Analyze'
            )}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={reset}
            className="text-sm text-red-400 underline mt-1 hover:text-red-300"
          >
            Try again
          </button>
        </div>
      )}

      {/* Discovery Results Preview */}
      {result && (
        <DiscoveryPreview
          result={result}
          onApply={handleApply}
          onReset={() => {
            reset();
            setUrl('');
          }}
        />
      )}

      {/* Skip Option */}
      {!result && (
        <div className="text-center pt-4 border-t border-[var(--card-border)]">
          <button
            onClick={onSkip}
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Skip and enter details manually
          </button>
        </div>
      )}
    </div>
  );
}

interface DiscoveryPreviewProps {
  result: WebsiteDiscoveryResult;
  onApply: () => void;
  onReset: () => void;
}

function DiscoveryPreview({ result, onApply, onReset }: DiscoveryPreviewProps) {
  const hasColors = result.colors.primary || result.colors.secondary;
  const hasFonts = result.fonts.headings || result.fonts.body;

  return (
    <div className="border border-[var(--card-border)] rounded-lg p-4 space-y-4 bg-[var(--card-bg)]">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Discovered Brand</h4>
        <div className="flex items-center gap-2">
          <ConfidenceBadge
            label="Colors"
            score={result.confidence.colors}
          />
          <ConfidenceBadge
            label="Fonts"
            score={result.confidence.fonts}
          />
        </div>
      </div>

      {/* Company Name */}
      {result.title && (
        <div>
          <span className="text-xs text-muted uppercase tracking-wide">Company</span>
          <p className="font-medium">{result.title}</p>
        </div>
      )}

      {/* Colors */}
      {hasColors && (
        <div>
          <span className="text-xs text-muted uppercase tracking-wide">Colors</span>
          <div className="flex gap-2 mt-1">
            {result.colors.primary && (
              <ColorSwatch color={result.colors.primary} label="Primary" />
            )}
            {result.colors.secondary && (
              <ColorSwatch color={result.colors.secondary} label="Secondary" />
            )}
            {result.colors.accent && (
              <ColorSwatch color={result.colors.accent} label="Accent" />
            )}
          </div>
        </div>
      )}

      {/* Fonts */}
      {hasFonts && (
        <div>
          <span className="text-xs text-muted uppercase tracking-wide">Typography</span>
          <div className="flex gap-4 mt-1">
            {result.fonts.headings && (
              <span className="text-sm">
                <span className="text-muted">Headings:</span> {result.fonts.headings}
              </span>
            )}
            {result.fonts.body && result.fonts.body !== result.fonts.headings && (
              <span className="text-sm">
                <span className="text-muted">Body:</span> {result.fonts.body}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Description */}
      {result.description && (
        <div>
          <span className="text-xs text-muted uppercase tracking-wide">Description</span>
          <p className="text-sm text-muted mt-1 line-clamp-2">{result.description}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onApply}
          className="flex-1 py-2 bg-[var(--accent)] text-white rounded-md hover:bg-[var(--accent-hover)] transition-colors font-medium"
        >
          Apply & Continue
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 border border-[var(--card-border)] rounded-md hover:border-[var(--accent)] transition-colors"
        >
          Try Another
        </button>
      </div>
    </div>
  );
}

function ColorSwatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-8 h-8 rounded-md border border-[var(--card-border)]"
        style={{ backgroundColor: color }}
        title={color}
      />
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="text-xs font-mono">{color}</p>
      </div>
    </div>
  );
}

function ConfidenceBadge({ label, score }: { label: string; score: number }) {
  const level = score >= 0.7 ? 'high' : score >= 0.4 ? 'medium' : 'low';
  const colors = {
    high: 'bg-green-500/20 text-green-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    low: 'bg-gray-500/20 text-gray-400',
  };

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${colors[level]}`}>
      {label}: {Math.round(score * 100)}%
    </span>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
