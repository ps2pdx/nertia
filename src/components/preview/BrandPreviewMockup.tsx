'use client';

import { BrandSystem } from '@/types/brand-system';
import { useState, useEffect } from 'react';

interface BrandPreviewMockupProps {
  tokens: BrandSystem;
}

/**
 * A complete visual mockup of a landing page built with the generated tokens.
 * This shows what a real UI would look like, not just token values.
 */
export function BrandPreviewMockup({ tokens }: BrandPreviewMockupProps) {
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('dark');
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load Google Fonts dynamically based on token font families
  useEffect(() => {
    const fontFamilies = [
      tokens.typography.fontFamily.display,
      tokens.typography.fontFamily.body,
      tokens.typography.fontFamily.sans,
    ].filter(Boolean);

    // Extract font names and load from Google Fonts
    const googleFonts = fontFamilies
      .map((f) => f?.split(',')[0]?.trim())
      .filter((f) => f && !f.includes('system-ui') && !f.includes('sans-serif') && !f.includes('serif') && !f.includes('monospace'));

    if (googleFonts.length > 0) {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?${googleFonts.map((f) => `family=${encodeURIComponent(f!)}:wght@400;500;600;700`).join('&')}&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      link.onload = () => setFontsLoaded(true);
    } else {
      setFontsLoaded(true);
    }
  }, [tokens.typography.fontFamily]);

  const colors = tokens.colors;
  const typography = tokens.typography;
  const spacing = tokens.spacing;
  const btn = tokens.components?.button;
  const card = tokens.components?.card;
  const input = tokens.components?.input;
  const borders = tokens.borders;
  const shadows = tokens.shadows;

  // Helper to get color value
  const c = (colorValue: { light: string; dark: string }) => colorValue[colorMode];

  // Base styles for the mockup
  const mockupStyles: React.CSSProperties = {
    backgroundColor: c(colors.background),
    color: c(colors.foreground),
    fontFamily: typography.fontFamily.body || typography.fontFamily.sans,
    minHeight: '600px',
    borderRadius: borders.radius.lg,
    overflow: 'hidden',
    position: 'relative',
  };

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">Preview your brand system as a landing page</span>
        <div className="flex rounded-md overflow-hidden border border-[var(--card-border)]">
          <button
            type="button"
            onClick={() => setColorMode('light')}
            className={`px-3 py-1 text-sm transition-colors ${
              colorMode === 'light'
                ? 'bg-[var(--foreground)] text-[var(--background)]'
                : 'bg-transparent hover:bg-[var(--card-bg)]'
            }`}
          >
            Light
          </button>
          <button
            type="button"
            onClick={() => setColorMode('dark')}
            className={`px-3 py-1 text-sm transition-colors ${
              colorMode === 'dark'
                ? 'bg-[var(--foreground)] text-[var(--background)]'
                : 'bg-transparent hover:bg-[var(--card-bg)]'
            }`}
          >
            Dark
          </button>
        </div>
      </div>

      {/* Mockup Container */}
      <div style={mockupStyles}>
        {/* Navigation Bar */}
        <nav
          style={{
            padding: `${spacing.md} ${spacing.lg}`,
            borderBottom: `1px solid ${c(colors.cardBorder)}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: c(colors.surface?.elevated || colors.cardBackground),
          }}
        >
          <div
            style={{
              fontFamily: typography.fontFamily.display || typography.fontFamily.sans,
              fontWeight: typography.fontWeight.bold,
              fontSize: typography.fontSize.lg,
              color: c(colors.foreground),
            }}
          >
            {tokens.metadata?.name || 'Brand'}
          </div>
          <div style={{ display: 'flex', gap: spacing.lg, alignItems: 'center' }}>
            <span style={{ color: c(colors.muted), fontSize: typography.fontSize.sm }}>Features</span>
            <span style={{ color: c(colors.muted), fontSize: typography.fontSize.sm }}>Pricing</span>
            <span style={{ color: c(colors.muted), fontSize: typography.fontSize.sm }}>About</span>
            {btn && (
              <button
                style={{
                  backgroundColor: c(btn.primary.background),
                  color: c(btn.primary.foreground),
                  padding: `${btn.paddingY} ${btn.paddingX}`,
                  fontSize: btn.fontSize,
                  fontWeight: btn.fontWeight,
                  borderRadius: btn.borderRadius,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Get Started
              </button>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section
          style={{
            padding: `${spacing['3xl'] || spacing['16']} ${spacing.lg}`,
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          <h1
            style={{
              fontFamily: typography.fontFamily.display || typography.fontFamily.sans,
              fontSize: typography.scale?.h1?.size || typography.fontSize['4xl'],
              fontWeight: typography.scale?.h1?.weight || typography.fontWeight.bold,
              lineHeight: typography.scale?.h1?.lineHeight || typography.lineHeight.tight,
              marginBottom: spacing.md,
              color: c(colors.foreground),
            }}
          >
            Build something amazing
          </h1>
          <p
            style={{
              fontSize: typography.scale?.body?.size || typography.fontSize.lg,
              color: c(colors.muted),
              marginBottom: spacing.xl,
              lineHeight: typography.lineHeight.relaxed,
            }}
          >
            The next generation platform for teams who want to move fast and ship quality products.
          </p>
          <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'center' }}>
            {btn && (
              <>
                <button
                  style={{
                    backgroundColor: c(btn.primary.background),
                    color: c(btn.primary.foreground),
                    padding: `${btn.paddingY} ${btn.paddingX}`,
                    fontSize: btn.fontSize,
                    fontWeight: btn.fontWeight,
                    borderRadius: btn.borderRadius,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {tokens.voiceAndTone?.examples?.cta?.[0] || 'Start Free Trial'}
                </button>
                <button
                  style={{
                    backgroundColor: 'transparent',
                    color: c(btn.outline?.foreground || colors.accent),
                    padding: `${btn.paddingY} ${btn.paddingX}`,
                    fontSize: btn.fontSize,
                    fontWeight: btn.fontWeight,
                    borderRadius: btn.borderRadius,
                    border: `1px solid ${c(btn.outline?.border || colors.accent)}`,
                    cursor: 'pointer',
                  }}
                >
                  Learn More
                </button>
              </>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section
          style={{
            padding: `${spacing.xl} ${spacing.lg}`,
            backgroundColor: c(colors.surface?.sunken || colors.background),
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: spacing.lg,
              maxWidth: '1000px',
              margin: '0 auto',
            }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  backgroundColor: c(card?.variants?.feature?.background || colors.cardBackground),
                  border: `1px solid ${c(card?.variants?.feature?.border || colors.cardBorder)}`,
                  borderRadius: card?.borderRadius || borders.radius.lg,
                  padding: card?.variants?.feature?.padding || spacing.lg,
                  boxShadow: shadows.sm,
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: borders.radius.md,
                    backgroundColor: c(colors.accent),
                    marginBottom: spacing.md,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: typography.fontSize.lg,
                  }}
                >
                  {i === 1 ? '⚡' : i === 2 ? '🎯' : '🚀'}
                </div>
                <h3
                  style={{
                    fontFamily: typography.fontFamily.display || typography.fontFamily.sans,
                    fontSize: typography.scale?.h4?.size || typography.fontSize.lg,
                    fontWeight: typography.scale?.h4?.weight || typography.fontWeight.semibold,
                    marginBottom: spacing.sm,
                    color: c(colors.foreground),
                  }}
                >
                  Feature {i}
                </h3>
                <p
                  style={{
                    fontSize: typography.scale?.body?.size || typography.fontSize.sm,
                    color: c(colors.muted),
                    lineHeight: typography.lineHeight.normal,
                  }}
                >
                  A powerful capability that helps your team achieve more in less time.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section with Input */}
        <section
          style={{
            padding: `${spacing.xl} ${spacing.lg}`,
            textAlign: 'center',
            backgroundColor: c(colors.surface?.elevated || colors.cardBackground),
          }}
        >
          <h2
            style={{
              fontFamily: typography.fontFamily.display || typography.fontFamily.sans,
              fontSize: typography.scale?.h3?.size || typography.fontSize['2xl'],
              fontWeight: typography.scale?.h3?.weight || typography.fontWeight.semibold,
              marginBottom: spacing.md,
              color: c(colors.foreground),
            }}
          >
            Ready to get started?
          </h2>
          <div
            style={{
              display: 'flex',
              gap: spacing.sm,
              justifyContent: 'center',
              maxWidth: '400px',
              margin: '0 auto',
            }}
          >
            {input && (
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  flex: 1,
                  backgroundColor: c(input.background),
                  border: `1px solid ${c(input.border)}`,
                  borderRadius: input.borderRadius,
                  padding: `${input.paddingY} ${input.paddingX}`,
                  fontSize: input.fontSize,
                  color: c(colors.foreground),
                  outline: 'none',
                }}
              />
            )}
            {btn && (
              <button
                style={{
                  backgroundColor: c(btn.primary.background),
                  color: c(btn.primary.foreground),
                  padding: `${btn.paddingY} ${btn.paddingX}`,
                  fontSize: btn.fontSize,
                  fontWeight: btn.fontWeight,
                  borderRadius: btn.borderRadius,
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Subscribe
              </button>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            padding: `${spacing.lg} ${spacing.lg}`,
            borderTop: `1px solid ${c(colors.cardBorder)}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: typography.fontSize.sm,
            color: c(colors.muted),
          }}
        >
          <span>© 2026 {tokens.metadata?.name || 'Brand'}. All rights reserved.</span>
          <div style={{ display: 'flex', gap: spacing.lg }}>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Contact</span>
          </div>
        </footer>
      </div>

      {/* Loading indicator for fonts */}
      {!fontsLoaded && (
        <p className="text-xs text-muted text-center">Loading fonts...</p>
      )}
    </div>
  );
}
