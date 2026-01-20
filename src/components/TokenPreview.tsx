'use client';

import { useState } from 'react';
import { BrandSystem } from '@/types/brand-system';
import { ColorPalette } from './ColorSwatch';
import { ExportOptions } from './ExportOptions';
import {
  BrandPreviewMockup,
  IsolatedPreviewContainer,
  PreviewButtons,
  PreviewInput,
  PreviewAlerts,
  PreviewCard,
  PreviewTypeScale,
  PreviewSpacing,
  PreviewGrid,
} from './preview';

interface TokenPreviewProps {
  tokens: BrandSystem;
}

interface PreviewSectionProps {
  title: string;
  children: React.ReactNode;
  tokens: BrandSystem;
  colorMode: 'light' | 'dark';
}

function PreviewSection({ title, children, tokens, colorMode }: PreviewSectionProps) {
  return (
    <div>
      <h4
        style={{
          fontSize: '0.75rem',
          fontWeight: 500,
          color: tokens.colors.muted[colorMode],
          marginBottom: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {title}
      </h4>
      {children}
    </div>
  );
}

type ViewMode = 'mockup' | 'tokens';

export function TokenPreview({ tokens }: TokenPreviewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('mockup');

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Preview</h3>
        <div className="flex rounded-md overflow-hidden border border-[var(--card-border)]">
          <button
            type="button"
            onClick={() => setViewMode('mockup')}
            className={`px-3 py-1 text-sm transition-colors ${
              viewMode === 'mockup'
                ? 'bg-[var(--foreground)] text-[var(--background)]'
                : 'bg-transparent hover:bg-[var(--card-bg)]'
            }`}
          >
            Page Mockup
          </button>
          <button
            type="button"
            onClick={() => setViewMode('tokens')}
            className={`px-3 py-1 text-sm transition-colors ${
              viewMode === 'tokens'
                ? 'bg-[var(--foreground)] text-[var(--background)]'
                : 'bg-transparent hover:bg-[var(--card-bg)]'
            }`}
          >
            Token Details
          </button>
        </div>
      </div>

      {viewMode === 'mockup' ? (
        /* Full Page Mockup - Shows what a real page would look like */
        <BrandPreviewMockup tokens={tokens} />
      ) : (
        /* Token Details View - Shows individual token values and components */
        <div className="space-y-6">
          {/* Colors Preview */}
          <div>
            <h3 className="text-sm font-medium mb-3">Colors</h3>
            <ColorPalette colors={tokens.colors} />
          </div>

          {/* Isolated Preview Container - Component examples */}
          <div>
            <h3 className="text-sm font-medium mb-3">Components</h3>
            <IsolatedPreviewContainer tokens={tokens}>
              {(colorMode) => (
                <div className="space-y-6">
                  {/* Type Scale */}
                  <PreviewSection title="Typography" tokens={tokens} colorMode={colorMode}>
                    <PreviewTypeScale tokens={tokens} colorMode={colorMode} />
                  </PreviewSection>

                  {/* Components */}
                  {tokens.components && (
                    <PreviewSection title="Components" tokens={tokens} colorMode={colorMode}>
                      <div className="space-y-4">
                        {/* Buttons */}
                        {tokens.components.button && (
                          <div>
                            <p
                              style={{
                                fontSize: '0.625rem',
                                color: tokens.colors.muted[colorMode],
                                marginBottom: '0.5rem',
                              }}
                            >
                              Buttons
                            </p>
                            <PreviewButtons tokens={tokens} colorMode={colorMode} />
                          </div>
                        )}

                        {/* Input */}
                        {tokens.components.input && (
                          <div>
                            <p
                              style={{
                                fontSize: '0.625rem',
                                color: tokens.colors.muted[colorMode],
                                marginBottom: '0.5rem',
                              }}
                            >
                              Input
                            </p>
                            <PreviewInput tokens={tokens} colorMode={colorMode} />
                          </div>
                        )}

                        {/* Card */}
                        {tokens.components.card && (
                          <div>
                            <p
                              style={{
                                fontSize: '0.625rem',
                                color: tokens.colors.muted[colorMode],
                                marginBottom: '0.5rem',
                              }}
                            >
                              Card
                            </p>
                            <PreviewCard tokens={tokens} colorMode={colorMode} />
                          </div>
                        )}
                      </div>
                    </PreviewSection>
                  )}

                  {/* Alerts */}
                  {tokens.components?.alert && (
                    <PreviewSection title="Alerts" tokens={tokens} colorMode={colorMode}>
                      <PreviewAlerts tokens={tokens} colorMode={colorMode} />
                    </PreviewSection>
                  )}

                  {/* Layout */}
                  <PreviewSection title="Layout" tokens={tokens} colorMode={colorMode}>
                    <div className="space-y-4">
                      {/* Grid Info */}
                      {tokens.grid && (
                        <div>
                          <p
                            style={{
                              fontSize: '0.625rem',
                              color: tokens.colors.muted[colorMode],
                              marginBottom: '0.5rem',
                            }}
                          >
                            Grid System
                          </p>
                          <PreviewGrid tokens={tokens} colorMode={colorMode} />
                        </div>
                      )}

                      {/* Spacing Scale */}
                      <div>
                        <p
                          style={{
                            fontSize: '0.625rem',
                            color: tokens.colors.muted[colorMode],
                            marginBottom: '0.5rem',
                          }}
                        >
                          Spacing Scale
                        </p>
                        <PreviewSpacing tokens={tokens} colorMode={colorMode} />
                      </div>
                    </div>
                  </PreviewSection>

                  {/* Voice & Tone */}
                  {tokens.voiceAndTone && (
                    <PreviewSection title="Voice & Tone" tokens={tokens} colorMode={colorMode}>
                      <div className="space-y-3">
                        {/* Personality Tags */}
                        {tokens.voiceAndTone.personality && tokens.voiceAndTone.personality.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {tokens.voiceAndTone.personality.map((p) => (
                              <span
                                key={p}
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: tokens.borders.radius.md,
                                  fontSize: '0.75rem',
                                  backgroundColor: `${tokens.colors.accent[colorMode]}20`,
                                  color: tokens.colors.accent[colorMode],
                                }}
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Writing Style */}
                        {tokens.voiceAndTone.writingStyle && (
                          <p
                            style={{
                              fontSize: '0.875rem',
                              color: tokens.colors.muted[colorMode],
                            }}
                          >
                            {tokens.voiceAndTone.writingStyle}
                          </p>
                        )}

                        {/* Core Message */}
                        {tokens.voiceAndTone.coreMessage && (
                          <div
                            style={{
                              padding: '0.75rem',
                              borderRadius: tokens.borders.radius.md,
                              borderLeft: `3px solid ${tokens.colors.accent[colorMode]}`,
                              backgroundColor: `${tokens.colors.accent[colorMode]}10`,
                            }}
                          >
                            <p
                              style={{
                                fontSize: '0.875rem',
                                fontStyle: 'italic',
                                color: tokens.colors.foreground[colorMode],
                              }}
                            >
                              &ldquo;{tokens.voiceAndTone.coreMessage}&rdquo;
                            </p>
                          </div>
                        )}

                        {/* Example CTAs as styled buttons */}
                        {tokens.voiceAndTone.examples?.cta && tokens.voiceAndTone.examples.cta.length > 0 && (
                          <div>
                            <p
                              style={{
                                fontSize: '0.625rem',
                                color: tokens.colors.muted[colorMode],
                                marginBottom: '0.5rem',
                              }}
                            >
                              Example CTAs
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {tokens.voiceAndTone.examples.cta.slice(0, 3).map((cta, i) => (
                                <span
                                  key={i}
                                  style={{
                                    padding: `${tokens.components?.button?.paddingY || '0.5rem'} ${tokens.components?.button?.paddingX || '1rem'}`,
                                    borderRadius: tokens.components?.button?.borderRadius || tokens.borders.radius.md,
                                    fontSize: tokens.components?.button?.fontSize || '0.875rem',
                                    backgroundColor: tokens.colors.accent[colorMode],
                                    color: '#FFFFFF',
                                  }}
                                >
                                  {cta}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </PreviewSection>
                  )}

                  {/* Borders & Shadows */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1.5rem',
                    }}
                  >
                    <PreviewSection title="Border Radius" tokens={tokens} colorMode={colorMode}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                        {Object.entries(tokens.borders.radius)
                          .filter(([, value]) => typeof value === 'string')
                          .slice(0, 6)
                          .map(([name, value]) => (
                            <div key={name} style={{ textAlign: 'center' }}>
                              <div
                                style={{
                                  width: '2.5rem',
                                  height: '2.5rem',
                                  border: `2px solid ${tokens.colors.accent[colorMode]}`,
                                  backgroundColor: tokens.colors.cardBackground[colorMode],
                                  borderRadius: value,
                                }}
                              />
                              <span
                                style={{
                                  fontSize: '0.75rem',
                                  color: tokens.colors.muted[colorMode],
                                }}
                              >
                                {name}
                              </span>
                            </div>
                          ))}
                      </div>
                    </PreviewSection>
                    <PreviewSection title="Shadows" tokens={tokens} colorMode={colorMode}>
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {Object.entries(tokens.shadows).map(([name, value]) => (
                          <div key={name} style={{ textAlign: 'center' }}>
                            <div
                              style={{
                                width: '3rem',
                                height: '3rem',
                                borderRadius: tokens.borders.radius.md,
                                backgroundColor: tokens.colors.cardBackground[colorMode],
                                boxShadow: value,
                              }}
                            />
                            <span
                              style={{
                                fontSize: '0.75rem',
                                color: tokens.colors.muted[colorMode],
                              }}
                            >
                              {name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </PreviewSection>
                  </div>
                </div>
              )}
            </IsolatedPreviewContainer>
          </div>
        </div>
      )}

      {/* Export Options */}
      <ExportOptions tokens={tokens} />

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
