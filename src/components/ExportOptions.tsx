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
  const config = {
    theme: {
      extend: {
        colors: {
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
        },
        fontFamily: {
          sans: [tokens.typography.fontFamily.sans],
          mono: [tokens.typography.fontFamily.mono],
        },
        fontSize: tokens.typography.fontSize,
        fontWeight: tokens.typography.fontWeight,
        lineHeight: tokens.typography.lineHeight,
        spacing: tokens.spacing,
        borderRadius: tokens.borders.radius,
        borderWidth: tokens.borders.width,
        boxShadow: tokens.shadows,
        transitionDuration: tokens.motion.duration,
        transitionTimingFunction: tokens.motion.easing,
      },
    },
  };

  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  // Add your content paths here
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: ${JSON.stringify(config.theme.extend, null, 6).replace(/^/gm, '    ').trim()},
  },
  plugins: [],
};
`;
}
