'use client';

import { BrandSystem } from '@/types/brand-system';

interface PreviewGridProps {
  tokens: BrandSystem;
  colorMode: 'light' | 'dark';
}

export function PreviewGrid({ tokens, colorMode }: PreviewGridProps) {
  const grid = tokens.grid;
  if (!grid) return null;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
      }}
    >
      {/* Desktop Grid Info */}
      <div
        style={{
          padding: '0.75rem',
          borderRadius: '0.375rem',
          backgroundColor: tokens.colors.surface?.default?.[colorMode] || tokens.colors.cardBackground[colorMode],
          border: `1px solid ${tokens.colors.border?.subtle?.[colorMode] || tokens.colors.cardBorder?.[colorMode] || 'transparent'}`,
        }}
      >
        <p
          style={{
            fontSize: '0.75rem',
            color: tokens.colors.muted[colorMode],
            marginBottom: '0.5rem',
          }}
        >
          Desktop
        </p>
        <div
          style={{
            fontSize: '0.875rem',
            color: tokens.colors.foreground[colorMode],
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Columns</span>
            <span style={{ fontFamily: tokens.typography.fontFamily.mono }}>
              {grid.desktop.columns}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Gutter</span>
            <span style={{ fontFamily: tokens.typography.fontFamily.mono }}>
              {grid.desktop.gutter}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Grid Info */}
      <div
        style={{
          padding: '0.75rem',
          borderRadius: '0.375rem',
          backgroundColor: tokens.colors.surface?.default?.[colorMode] || tokens.colors.cardBackground[colorMode],
          border: `1px solid ${tokens.colors.border?.subtle?.[colorMode] || tokens.colors.cardBorder?.[colorMode] || 'transparent'}`,
        }}
      >
        <p
          style={{
            fontSize: '0.75rem',
            color: tokens.colors.muted[colorMode],
            marginBottom: '0.5rem',
          }}
        >
          Mobile
        </p>
        <div
          style={{
            fontSize: '0.875rem',
            color: tokens.colors.foreground[colorMode],
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Columns</span>
            <span style={{ fontFamily: tokens.typography.fontFamily.mono }}>
              {grid.mobile.columns}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Gutter</span>
            <span style={{ fontFamily: tokens.typography.fontFamily.mono }}>
              {grid.mobile.gutter}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
