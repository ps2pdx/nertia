'use client';

import { useState } from 'react';
import { BrandSystem } from '@/types/brand-system';
import { generateFullCss } from '@/utils/tokens-to-css';
import { ExportFormat as AdvancedExportFormat, ExportResult } from '@/generators/types';

interface ExportOptionsProps {
  tokens: BrandSystem;
}

type BasicExportFormat = 'json' | 'css' | 'tailwind';

interface AdvancedFormat {
  id: AdvancedExportFormat;
  name: string;
  description: string;
  icon: string;
}

const ADVANCED_FORMATS: AdvancedFormat[] = [
  { id: 'email-template', name: 'Email Template', description: 'Email-safe HTML with inline styles', icon: 'Mail' },
  { id: 'one-sheeter', name: 'One-Sheeter', description: 'Print-ready brand summary', icon: 'FileText' },
  { id: 'landing-page', name: 'Landing Page', description: 'Full landing page template', icon: 'Layout' },
  { id: 'social-media', name: 'Social Media', description: 'OG images & social cards', icon: 'Share2' },
  { id: 'slideshow', name: 'Slideshow', description: 'Brand presentation deck', icon: 'Presentation' },
];

export function ExportOptions({ tokens }: ExportOptionsProps) {
  const [copied, setCopied] = useState<BasicExportFormat | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generating, setGenerating] = useState<AdvancedExportFormat | null>(null);
  const [colorMode, setColorMode] = useState<'light' | 'dark' | 'both'>('dark');

  const handleCopy = async (format: BasicExportFormat, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(format);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownload = (format: BasicExportFormat, content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Delay URL revocation to ensure download completes
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleAdvancedExport = async (format: AdvancedExportFormat) => {
    setGenerating(format);

    try {
      const response = await fetch(`/api/export/${format}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokens, options: { colorMode } }),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const result: ExportResult = await response.json();

      // Download each file with staggered timing to avoid race conditions
      result.files.forEach((file, index) => {
        const mimeType = file.type === 'html' ? 'text/html' : file.type === 'css' ? 'text/css' : 'application/json';
        const blob = new Blob([file.content], { type: mimeType });
        const url = URL.createObjectURL(blob);

        // Stagger downloads to prevent browser blocking
        setTimeout(() => {
          const a = document.createElement('a');
          a.href = url;
          a.download = file.filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          // Delay URL revocation to ensure download completes
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        }, index * 100);
      });
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setGenerating(null);
    }
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
    <div className="space-y-4">
      {/* Basic Exports */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Token Exports</h3>
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

      {/* Advanced Exports */}
      <div className="space-y-3 pt-3 border-t border-[var(--card-border)]">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm font-medium hover:text-[var(--accent)] transition-colors"
        >
          <span className={`transform transition-transform ${showAdvanced ? 'rotate-90' : ''}`}>▶</span>
          Advanced Exports
        </button>

        {showAdvanced && (
          <div className="space-y-4">
            {/* Color Mode Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">Mode:</span>
              {(['light', 'dark', 'both'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setColorMode(mode)}
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    colorMode === mode
                      ? 'bg-[var(--accent)] text-[var(--background)]'
                      : 'bg-[var(--card-bg)] border border-[var(--card-border)] hover:bg-[var(--accent)]/10'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>

            {/* Export Format Cards */}
            <div className="grid grid-cols-1 gap-2">
              {ADVANCED_FORMATS.map((format) => (
                <button
                  key={format.id}
                  onClick={() => handleAdvancedExport(format.id)}
                  disabled={generating !== null}
                  className="flex items-center gap-3 p-3 rounded-md border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]/50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-8 h-8 rounded-md bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                    {format.icon === 'Mail' && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                    {format.icon === 'FileText' && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    {format.icon === 'Layout' && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                    )}
                    {format.icon === 'Share2' && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    )}
                    {format.icon === 'Presentation' && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{format.name}</p>
                    <p className="text-xs text-muted truncate">{format.description}</p>
                  </div>
                  {generating === format.id ? (
                    <div className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="text-xs text-muted">↓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
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
