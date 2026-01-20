'use client';

import { useState } from 'react';
import { BrandSystem } from '@/types/brand-system';
import { generateFullCss } from '@/utils/tokens-to-css';

interface ExportOptionsProps {
  tokens: BrandSystem;
}

type ExportFormat = 'json' | 'css' | 'tailwind';

export function ExportOptions({ tokens }: ExportOptionsProps) {
  const [copied, setCopied] = useState<ExportFormat | null>(null);

  const handleCopy = async (format: ExportFormat, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(format);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownload = (format: ExportFormat, content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getJsonContent = () => {
    const exportTokens = { ...tokens };
    // Remove internal fields
    delete (exportTokens as Record<string, unknown>)._generationId;
    return JSON.stringify(exportTokens, null, 2);
  };

  const getCssContent = () => {
    return generateFullCss(tokens);
  };

  const getTailwindContent = () => {
    return generateTailwindConfig(tokens);
  };

  const companySlug = tokens.metadata?.name?.toLowerCase().replace(/\s+/g, '-') || 'brand';

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Export</h3>
      <div className="flex flex-wrap gap-2">
        {/* JSON Export */}
        <div className="flex gap-1">
          <button
            onClick={() => handleCopy('json', getJsonContent())}
            className="px-3 py-1.5 text-sm rounded-l-md border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--accent)]/10 transition-colors"
          >
            {copied === 'json' ? 'Copied!' : 'JSON'}
          </button>
          <button
            onClick={() => handleDownload('json', getJsonContent(), `${companySlug}-tokens.json`)}
            className="px-2 py-1.5 text-sm rounded-r-md border border-l-0 border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--accent)]/10 transition-colors"
            title="Download JSON"
          >
            ↓
          </button>
        </div>

        {/* CSS Export */}
        <div className="flex gap-1">
          <button
            onClick={() => handleCopy('css', getCssContent())}
            className="px-3 py-1.5 text-sm rounded-l-md border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--accent)]/10 transition-colors"
          >
            {copied === 'css' ? 'Copied!' : 'CSS'}
          </button>
          <button
            onClick={() => handleDownload('css', getCssContent(), `${companySlug}-tokens.css`)}
            className="px-2 py-1.5 text-sm rounded-r-md border border-l-0 border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--accent)]/10 transition-colors"
            title="Download CSS"
          >
            ↓
          </button>
        </div>

        {/* Tailwind Export */}
        <div className="flex gap-1">
          <button
            onClick={() => handleCopy('tailwind', getTailwindContent())}
            className="px-3 py-1.5 text-sm rounded-l-md border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--accent)]/10 transition-colors"
          >
            {copied === 'tailwind' ? 'Copied!' : 'Tailwind'}
          </button>
          <button
            onClick={() => handleDownload('tailwind', getTailwindContent(), `${companySlug}-tailwind.config.js`)}
            className="px-2 py-1.5 text-sm rounded-r-md border border-l-0 border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--accent)]/10 transition-colors"
            title="Download Tailwind config"
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  );
}

function generateTailwindConfig(tokens: BrandSystem): string {
  // Build colors object with core and extended (v2) colors
  const colors: Record<string, unknown> = {
    background: {
      light: tokens.colors.background.light,
      dark: tokens.colors.background.dark,
      DEFAULT: 'var(--background)',
    },
    foreground: {
      light: tokens.colors.foreground.light,
      dark: tokens.colors.foreground.dark,
      DEFAULT: 'var(--foreground)',
    },
    muted: {
      light: tokens.colors.muted.light,
      dark: tokens.colors.muted.dark,
      DEFAULT: 'var(--muted)',
    },
    accent: {
      light: tokens.colors.accent.light,
      dark: tokens.colors.accent.dark,
      DEFAULT: 'var(--accent)',
      hover: {
        light: tokens.colors.accentHover.light,
        dark: tokens.colors.accentHover.dark,
        DEFAULT: 'var(--accent-hover)',
      },
    },
    card: {
      bg: {
        light: tokens.colors.cardBackground.light,
        dark: tokens.colors.cardBackground.dark,
        DEFAULT: 'var(--card-bg)',
      },
      border: {
        light: tokens.colors.cardBorder.light,
        dark: tokens.colors.cardBorder.dark,
        DEFAULT: 'var(--card-border)',
      },
    },
    success: {
      light: tokens.colors.success.light,
      dark: tokens.colors.success.dark,
      DEFAULT: 'var(--success)',
    },
    warning: {
      light: tokens.colors.warning.light,
      dark: tokens.colors.warning.dark,
      DEFAULT: 'var(--warning)',
    },
    error: {
      light: tokens.colors.error.light,
      dark: tokens.colors.error.dark,
      DEFAULT: 'var(--error)',
    },
  };

  // v2: Surface colors
  if (tokens.colors.surface) {
    colors.surface = {
      DEFAULT: 'var(--surface-default)',
      default: {
        light: tokens.colors.surface.default.light,
        dark: tokens.colors.surface.default.dark,
      },
      elevated: {
        light: tokens.colors.surface.elevated.light,
        dark: tokens.colors.surface.elevated.dark,
        DEFAULT: 'var(--surface-elevated)',
      },
      sunken: {
        light: tokens.colors.surface.sunken.light,
        dark: tokens.colors.surface.sunken.dark,
        DEFAULT: 'var(--surface-sunken)',
      },
    };
  }

  // v2: Border colors
  if (tokens.colors.border) {
    colors.borderColor = {
      DEFAULT: 'var(--border-color-default)',
      default: {
        light: tokens.colors.border.default.light,
        dark: tokens.colors.border.default.dark,
      },
      subtle: {
        light: tokens.colors.border.subtle.light,
        dark: tokens.colors.border.subtle.dark,
        DEFAULT: 'var(--border-color-subtle)',
      },
      strong: {
        light: tokens.colors.border.strong.light,
        dark: tokens.colors.border.strong.dark,
        DEFAULT: 'var(--border-color-strong)',
      },
      focus: {
        light: tokens.colors.border.focus.light,
        dark: tokens.colors.border.focus.dark,
        DEFAULT: 'var(--border-color-focus)',
      },
    };
  }

  // v2: Overlay color
  if (tokens.colors.overlay) {
    colors.overlay = {
      light: tokens.colors.overlay.light,
      dark: tokens.colors.overlay.dark,
      DEFAULT: 'var(--overlay)',
    };
  }

  // Build fontFamily with v2 display/body fonts
  const fontFamily: Record<string, string[]> = {
    sans: [tokens.typography.fontFamily.sans],
    mono: [tokens.typography.fontFamily.mono],
  };
  if (tokens.typography.fontFamily.display) {
    fontFamily.display = [tokens.typography.fontFamily.display];
  }
  if (tokens.typography.fontFamily.body) {
    fontFamily.body = [tokens.typography.fontFamily.body];
  }

  // Build spacing - filter out semantic object
  const spacing: Record<string, string> = {};
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    if (typeof value === 'string') {
      spacing[key] = value;
    }
  });

  // Build motion duration - filter non-string values
  const transitionDuration: Record<string, string> = {};
  Object.entries(tokens.motion.duration).forEach(([key, value]) => {
    if (typeof value === 'string') {
      transitionDuration[key] = value;
    }
  });

  // Build config object
  const config: Record<string, unknown> = {
    theme: {
      extend: {
        colors,
        fontFamily,
        fontSize: tokens.typography.fontSize,
        fontWeight: tokens.typography.fontWeight,
        lineHeight: tokens.typography.lineHeight,
        spacing,
        borderRadius: tokens.borders.radius,
        borderWidth: tokens.borders.width,
        boxShadow: tokens.shadows,
        transitionDuration,
        transitionTimingFunction: tokens.motion.easing,
      },
    },
  };

  // v2: Add letter spacing
  if (tokens.typography.letterSpacing) {
    (config.theme as Record<string, unknown>).extend = {
      ...(config.theme as Record<string, unknown>).extend as Record<string, unknown>,
      letterSpacing: tokens.typography.letterSpacing,
    };
  }

  // v2: Add zIndex
  if (tokens.zIndex) {
    (config.theme as Record<string, unknown>).extend = {
      ...(config.theme as Record<string, unknown>).extend as Record<string, unknown>,
      zIndex: tokens.zIndex,
    };
  }

  // v2: Add breakpoints as screens
  if (tokens.breakpoints) {
    (config.theme as Record<string, unknown>).extend = {
      ...(config.theme as Record<string, unknown>).extend as Record<string, unknown>,
      screens: tokens.breakpoints,
    };
  }

  const extendConfig = (config.theme as Record<string, unknown>).extend;

  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  // Add your content paths here
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: ${JSON.stringify(extendConfig, null, 6).replace(/^/gm, '    ').trim()},
  },
  plugins: [],
};
`;
}
