'use client';

import { BrandSystem } from '@/types/brand-system';

interface PreviewInputProps {
  tokens: BrandSystem;
  colorMode: 'light' | 'dark';
}

export function PreviewInput({ tokens, colorMode }: PreviewInputProps) {
  const input = tokens.components?.input;
  if (!input) return null;

  return (
    <input
      type="text"
      placeholder="Input preview..."
      readOnly
      style={{
        width: '100%',
        maxWidth: '300px',
        backgroundColor: input.background[colorMode],
        border: `1px solid ${input.border[colorMode]}`,
        padding: `${input.paddingY} ${input.paddingX}`,
        fontSize: input.fontSize,
        borderRadius: input.borderRadius,
        color: tokens.colors.foreground[colorMode],
        outline: 'none',
        transition: 'border-color 150ms ease',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = input.borderFocus[colorMode];
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = input.border[colorMode];
      }}
    />
  );
}
