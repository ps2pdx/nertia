'use client';

import { BrandSystem } from '@/types/brand-system';

interface PreviewCardProps {
  tokens: BrandSystem;
  colorMode: 'light' | 'dark';
}

export function PreviewCard({ tokens, colorMode }: PreviewCardProps) {
  const card = tokens.components?.card;
  // Use feature variant as default since the schema doesn't have 'default'
  const cardVariant = card?.variants?.feature;

  if (!card || !cardVariant) return null;

  return (
    <div
      style={{
        backgroundColor: cardVariant.background[colorMode],
        border: `1px solid ${cardVariant.border[colorMode]}`,
        borderRadius: card.borderRadius,
        padding: cardVariant.padding,
        boxShadow: tokens.shadows.sm,
      }}
    >
      <h4
        style={{
          fontSize: tokens.typography.scale?.h4?.size || '1.125rem',
          fontWeight: tokens.typography.scale?.h4?.weight || 600,
          marginBottom: '0.5rem',
          color: tokens.colors.foreground[colorMode],
        }}
      >
        Card Title
      </h4>
      <p
        style={{
          fontSize: tokens.typography.scale?.body?.size || '1rem',
          color: tokens.colors.muted[colorMode],
          lineHeight: 1.5,
        }}
      >
        This is a preview card component styled with your generated design tokens.
      </p>
    </div>
  );
}
