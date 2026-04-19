'use client';

import { useState, useMemo, ReactNode } from 'react';
import { BrandSystem } from '@/types/brand-system';
import { tokensToCssVariables } from '@/utils/tokens-to-css';

interface IsolatedPreviewContainerProps {
  tokens: BrandSystem;
  children: (colorMode: 'light' | 'dark') => ReactNode;
  className?: string;
}

export function IsolatedPreviewContainer({
  tokens,
  children,
  className = '',
}: IsolatedPreviewContainerProps) {
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('dark');

  // Generate CSS variables from tokens for the current color mode
  const cssVars = useMemo(() => {
    return tokensToCssVariables(tokens, colorMode);
  }, [tokens, colorMode]);

  // Convert CSS variable object to React inline style format
  const containerStyle = useMemo(() => {
    const style: Record<string, string> = {};
    Object.entries(cssVars).forEach(([key, value]) => {
      // CSS custom properties work directly in React style objects
      style[key] = value;
    });
    // Add base styling from tokens
    style.backgroundColor = tokens.colors.background[colorMode];
    style.color = tokens.colors.foreground[colorMode];
    style.fontFamily = tokens.typography.fontFamily.sans;
    return style;
  }, [cssVars, tokens, colorMode]);

  return (
    <div className="space-y-4">
      {/* Color Mode Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted">Preview Mode:</span>
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

      {/* Isolated Preview Container with token-based styling */}
      <div
        style={containerStyle}
        className={`rounded-lg p-6 transition-colors ${className}`}
      >
        {children(colorMode)}
      </div>
    </div>
  );
}
