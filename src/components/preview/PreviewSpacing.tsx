'use client';

import { BrandSystem } from '@/types/brand-system';

interface PreviewSpacingProps {
  tokens: BrandSystem;
  colorMode: 'light' | 'dark';
}

export function PreviewSpacing({ tokens, colorMode }: PreviewSpacingProps) {
  // Get named spacing tokens (xs, sm, md, lg, xl, 2xl)
  const namedTokens = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
  const spacingEntries: Array<{ name: string; size: string }> = [];

  for (const name of namedTokens) {
    const value = tokens.spacing[name];
    if (typeof value === 'string') {
      spacingEntries.push({ name, size: value });
    }
  }

  if (spacingEntries.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {spacingEntries.map(({ name, size }) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          <div
            style={{
              width: size,
              height: size,
              minWidth: '8px',
              minHeight: '8px',
              backgroundColor: tokens.colors.accent[colorMode],
              borderRadius: '2px',
            }}
          />
          <span
            style={{
              fontSize: '0.625rem',
              color: tokens.colors.muted[colorMode],
              fontFamily: tokens.typography.fontFamily.mono,
            }}
          >
            {name}
          </span>
        </div>
      ))}
    </div>
  );
}
