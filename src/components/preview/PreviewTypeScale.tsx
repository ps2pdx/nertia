'use client';

import { BrandSystem } from '@/types/brand-system';

interface PreviewTypeScaleProps {
  tokens: BrandSystem;
  colorMode: 'light' | 'dark';
}

// Map type scale keys to display names
const TYPE_SCALE_LABELS: Record<string, string> = {
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  body: 'Body',
  small: 'Small',
  caption: 'Caption',
  overline: 'Overline',
};

export function PreviewTypeScale({ tokens, colorMode }: PreviewTypeScaleProps) {
  const scale = tokens.typography.scale;
  if (!scale) return null;

  // Show key type scale entries
  const keyEntries = ['h1', 'h2', 'h3', 'body', 'small'] as const;

  return (
    <div className="space-y-3">
      {keyEntries.map((name) => {
        const spec = scale[name];
        if (!spec) return null;

        return (
          <div
            key={name}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <span
              style={{
                fontSize: spec.size,
                fontWeight: spec.weight,
                lineHeight: spec.lineHeight,
                letterSpacing: spec.letterSpacing,
                color: tokens.colors.foreground[colorMode],
                fontFamily:
                  spec.font === 'display'
                    ? tokens.typography.fontFamily.display
                    : tokens.typography.fontFamily.body,
              }}
            >
              {TYPE_SCALE_LABELS[name] || name}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                color: tokens.colors.muted[colorMode],
                fontFamily: tokens.typography.fontFamily.mono,
                whiteSpace: 'nowrap',
              }}
            >
              {spec.size}
            </span>
          </div>
        );
      })}
    </div>
  );
}
