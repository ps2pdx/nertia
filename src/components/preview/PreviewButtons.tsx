'use client';

import { BrandSystem } from '@/types/brand-system';

interface PreviewButtonsProps {
  tokens: BrandSystem;
  colorMode: 'light' | 'dark';
}

export function PreviewButtons({ tokens, colorMode }: PreviewButtonsProps) {
  const btn = tokens.components?.button;
  if (!btn) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {/* Primary Button */}
      <button
        type="button"
        style={{
          backgroundColor: btn.primary.background[colorMode],
          color: btn.primary.foreground[colorMode],
          padding: `${btn.paddingY} ${btn.paddingX}`,
          fontSize: btn.fontSize,
          fontWeight: btn.fontWeight,
          borderRadius: btn.borderRadius,
          letterSpacing: btn.letterSpacing,
          border: `1px solid ${btn.primary.border[colorMode]}`,
          transition: 'all 150ms ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = btn.primary.backgroundHover[colorMode];
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = btn.primary.background[colorMode];
        }}
      >
        Primary
      </button>

      {/* Secondary Button */}
      <button
        type="button"
        style={{
          backgroundColor: btn.secondary.background[colorMode],
          color: btn.secondary.foreground[colorMode],
          padding: `${btn.paddingY} ${btn.paddingX}`,
          fontSize: btn.fontSize,
          fontWeight: btn.fontWeight,
          borderRadius: btn.borderRadius,
          border: `1px solid ${btn.secondary.border[colorMode]}`,
          transition: 'all 150ms ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = btn.secondary.backgroundHover[colorMode];
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = btn.secondary.background[colorMode];
        }}
      >
        Secondary
      </button>

      {/* Outline Button */}
      {btn.outline && (
        <button
          type="button"
          style={{
            backgroundColor: 'transparent',
            color: btn.outline.foreground[colorMode],
            padding: `${btn.paddingY} ${btn.paddingX}`,
            fontSize: btn.fontSize,
            fontWeight: btn.fontWeight,
            borderRadius: btn.borderRadius,
            border: `1px solid ${btn.outline.border[colorMode]}`,
            transition: 'all 150ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = btn.outline!.backgroundHover[colorMode];
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Outline
        </button>
      )}
    </div>
  );
}
