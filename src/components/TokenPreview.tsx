'use client';

import { BrandSystem } from '@/types/brand-system';
import { ColorPalette } from './ColorSwatch';

interface TokenPreviewProps {
  tokens: BrandSystem;
}

export function TokenPreview({ tokens }: TokenPreviewProps) {
  return (
    <div className="space-y-6">
      {/* Colors Preview */}
      <div>
        <h3 className="text-sm font-medium mb-3">Colors</h3>
        <ColorPalette colors={tokens.colors} />
      </div>

      {/* Typography Preview */}
      <div>
        <h3 className="text-sm font-medium mb-3">Typography</h3>
        <div className="p-4 rounded-md border border-[var(--card-border)] bg-[var(--card-bg)]">
          <p className="text-xs text-muted mb-2">
            Font: {tokens.typography.fontFamily.sans}
          </p>
          <p
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: tokens.typography.fontFamily.sans }}
          >
            {tokens.voiceAndTone?.examples?.headlines?.[0] || 'Headline Example'}
          </p>
          <p
            className="text-base text-muted"
            style={{ fontFamily: tokens.typography.fontFamily.sans }}
          >
            {tokens.voiceAndTone?.examples?.descriptions?.[0] || 'Description text example'}
          </p>
        </div>
      </div>

      {/* Voice & Tone */}
      {tokens.voiceAndTone && (
        <div>
          <h3 className="text-sm font-medium mb-3">Voice & Tone</h3>
          <div className="p-4 rounded-md border border-[var(--card-border)] bg-[var(--card-bg)] space-y-3">
            <div className="flex flex-wrap gap-2">
              {tokens.voiceAndTone.personality?.map((p) => (
                <span
                  key={p}
                  className="px-2 py-1 rounded text-xs border border-[var(--card-border)]"
                >
                  {p}
                </span>
              ))}
            </div>
            {tokens.voiceAndTone.writingStyle && (
              <p className="text-sm text-muted">{tokens.voiceAndTone.writingStyle}</p>
            )}
            {tokens.voiceAndTone.examples?.cta && tokens.voiceAndTone.examples.cta.length > 0 && (
              <div>
                <p className="text-xs text-muted mb-1">Example CTAs:</p>
                <div className="flex flex-wrap gap-2">
                  {tokens.voiceAndTone.examples.cta.map((cta, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-md text-sm bg-[var(--accent)] text-white"
                    >
                      {cta}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Spacing & Borders Preview */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium mb-3">Border Radius</h3>
          <div className="flex gap-2 items-end">
            {Object.entries(tokens.borders.radius).map(([name, value]) => (
              <div key={name} className="text-center">
                <div
                  className="w-10 h-10 border-2 border-[var(--accent)] bg-[var(--card-bg)]"
                  style={{ borderRadius: value }}
                />
                <span className="text-xs text-muted">{name}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-3">Shadows</h3>
          <div className="flex gap-3">
            {Object.entries(tokens.shadows).map(([name, value]) => (
              <div key={name} className="text-center">
                <div
                  className="w-12 h-12 rounded-md bg-[var(--card-bg)]"
                  style={{ boxShadow: value }}
                />
                <span className="text-xs text-muted">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Raw JSON (collapsible) */}
      <details className="group">
        <summary className="text-sm font-medium cursor-pointer hover:text-[var(--accent)] transition-colors">
          View Raw JSON
        </summary>
        <pre className="mt-2 p-4 rounded-md border border-[var(--card-border)] bg-[var(--card-bg)] text-xs text-muted overflow-auto max-h-64">
          {JSON.stringify(tokens, null, 2)}
        </pre>
      </details>
    </div>
  );
}
