'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BrandSystem, DiscoveryInputs, ColorValue } from '@/types/brand-system';
import { ExportOptions } from './ExportOptions';
import { tokensToCssVariables, applyCssVariables } from '@/utils/tokens-to-css';

interface BrandSystemViewProps {
  tokens: BrandSystem;
  inputs?: DiscoveryInputs;
}

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'colors', label: 'Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'spacing', label: 'Spacing & Grid' },
  { id: 'logo', label: 'Logo' },
  { id: 'components', label: 'Components' },
  { id: 'data-viz', label: 'Data Viz' },
  { id: 'animation', label: 'Animation' },
  { id: 'motion', label: 'Motion' },
  { id: 'imagery', label: 'Imagery' },
  { id: 'voice', label: 'Voice & Tone' },
  { id: 'utilities', label: 'Utilities' },
] as const;

function ColorSwatch({ name, value, mode }: { name: string; value: ColorValue; mode: 'light' | 'dark' }) {
  const color = value[mode];
  return (
    <div className="flex flex-col">
      <div
        className="w-full h-16 rounded-lg border border-[var(--card-border)]"
        style={{ backgroundColor: color }}
      />
      <p className="text-sm font-medium mt-2">{name}</p>
      <p className="text-xs text-muted font-mono">{color}</p>
    </div>
  );
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold">{title}</h2>
      {description && <p className="text-muted mt-1">{description}</p>}
    </div>
  );
}

export function BrandSystemView({ tokens, inputs }: BrandSystemViewProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('dark');

  // Apply brand CSS variables to document root
  useEffect(() => {
    const cssVars = tokensToCssVariables(tokens, colorMode);
    applyCssVariables(cssVars);
  }, [tokens, colorMode]);

  useEffect(() => {
    // Cache section references for better performance
    let sectionRefs: (HTMLElement | null)[] = [];

    const updateSectionRefs = () => {
      sectionRefs = SECTIONS.map((s) => document.getElementById(s.id));
    };

    const handleScroll = () => {
      // Initialize refs if not yet cached
      if (sectionRefs.length === 0) {
        updateSectionRefs();
      }

      const scrollPosition = window.scrollY + 100;

      for (let i = sectionRefs.length - 1; i >= 0; i--) {
        const section = sectionRefs[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };

    // Initial setup
    updateSectionRefs();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--card-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-bold">{tokens.metadata?.name || 'Brand System'}</h1>
              <span className="text-xs text-muted px-2 py-0.5 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)]">
                v{tokens.metadata?.version || '2.0.0'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              {/* Color Mode Toggle */}
              <div className="flex items-center gap-2 text-sm">
                <button
                  onClick={() => setColorMode('light')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    colorMode === 'light'
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--card-bg)] border border-[var(--card-border)]'
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => setColorMode('dark')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    colorMode === 'dark'
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--card-bg)] border border-[var(--card-border)]'
                  }`}
                >
                  Dark
                </button>
              </div>
            </div>
          </div>
          {/* Section Links */}
          <div className="flex items-center gap-1 pb-2 overflow-x-auto">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`px-3 py-1.5 text-sm rounded-md whitespace-nowrap transition-colors ${
                  activeSection === section.id
                    ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Overview Section */}
        <section id="overview" className="mb-20">
          <SectionHeader title="Brand Overview" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
              <h3 className="text-lg font-semibold mb-4">Brand Identity</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-muted">Company</dt>
                  <dd className="font-medium">{tokens.metadata?.name || inputs?.companyName}</dd>
                </div>
                {inputs?.industry && (
                  <div>
                    <dt className="text-sm text-muted">Industry</dt>
                    <dd className="font-medium">{inputs.industry}</dd>
                  </div>
                )}
                {inputs?.targetAudience && (
                  <div>
                    <dt className="text-sm text-muted">Target Audience</dt>
                    <dd className="font-medium">{inputs.targetAudience}</dd>
                  </div>
                )}
                {tokens.voiceAndTone?.personality && (
                  <div>
                    <dt className="text-sm text-muted">Personality</dt>
                    <dd className="flex flex-wrap gap-2 mt-1">
                      {tokens.voiceAndTone.personality.map((trait) => (
                        <span
                          key={trait}
                          className="px-2 py-0.5 text-sm rounded-full bg-[var(--accent)]/10 text-[var(--accent)]"
                        >
                          {trait}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
            <div className="p-6 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
              <h3 className="text-lg font-semibold mb-4">Export</h3>
              <ExportOptions tokens={tokens} />
            </div>
          </div>
        </section>

        {/* Colors Section */}
        <section id="colors" className="mb-20">
          <SectionHeader title="Colors" description="Core and extended color palette" />

          {/* Core Colors */}
          <h3 className="text-lg font-semibold mb-4">Core Colors</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
            <ColorSwatch name="Background" value={tokens.colors.background} mode={colorMode} />
            <ColorSwatch name="Foreground" value={tokens.colors.foreground} mode={colorMode} />
            <ColorSwatch name="Muted" value={tokens.colors.muted} mode={colorMode} />
            <ColorSwatch name="Accent" value={tokens.colors.accent} mode={colorMode} />
            <ColorSwatch name="Accent Hover" value={tokens.colors.accentHover} mode={colorMode} />
          </div>

          {/* Semantic Colors */}
          <h3 className="text-lg font-semibold mb-4">Semantic Colors</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
            <ColorSwatch name="Success" value={tokens.colors.success} mode={colorMode} />
            <ColorSwatch name="Warning" value={tokens.colors.warning} mode={colorMode} />
            <ColorSwatch name="Error" value={tokens.colors.error} mode={colorMode} />
            <ColorSwatch name="Card Background" value={tokens.colors.cardBackground} mode={colorMode} />
          </div>

          {/* Surface Colors (v2) */}
          {tokens.colors.surface && (
            <>
              <h3 className="text-lg font-semibold mb-4">Surface Colors</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                <ColorSwatch name="Default" value={tokens.colors.surface.default} mode={colorMode} />
                <ColorSwatch name="Elevated" value={tokens.colors.surface.elevated} mode={colorMode} />
                <ColorSwatch name="Sunken" value={tokens.colors.surface.sunken} mode={colorMode} />
              </div>
            </>
          )}

          {/* Border Colors (v2) */}
          {tokens.colors.border && (
            <>
              <h3 className="text-lg font-semibold mb-4">Border Colors</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <ColorSwatch name="Default" value={tokens.colors.border.default} mode={colorMode} />
                <ColorSwatch name="Subtle" value={tokens.colors.border.subtle} mode={colorMode} />
                <ColorSwatch name="Strong" value={tokens.colors.border.strong} mode={colorMode} />
                <ColorSwatch name="Focus" value={tokens.colors.border.focus} mode={colorMode} />
              </div>
            </>
          )}

          {/* Usage Ratios */}
          {tokens.colors.usageRatios && (
            <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
              <h3 className="text-sm font-semibold mb-3">Color Usage Ratios</h3>
              <div className="flex h-6 rounded-md overflow-hidden">
                <div
                  className="flex items-center justify-center text-xs font-medium"
                  style={{
                    width: `${tokens.colors.usageRatios.background}%`,
                    backgroundColor: tokens.colors.background[colorMode],
                    color: tokens.colors.foreground[colorMode],
                  }}
                >
                  {tokens.colors.usageRatios.background}%
                </div>
                <div
                  className="flex items-center justify-center text-xs font-medium"
                  style={{
                    width: `${tokens.colors.usageRatios.surface}%`,
                    backgroundColor: tokens.colors.cardBackground[colorMode],
                    color: tokens.colors.foreground[colorMode],
                  }}
                >
                  {tokens.colors.usageRatios.surface}%
                </div>
                <div
                  className="flex items-center justify-center text-xs font-medium"
                  style={{
                    width: `${tokens.colors.usageRatios.accent}%`,
                    backgroundColor: tokens.colors.accent[colorMode],
                    color: '#FFFFFF',
                  }}
                >
                  {tokens.colors.usageRatios.accent}%
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted mt-2">
                <span>Background</span>
                <span>Surface</span>
                <span>Accent</span>
              </div>
            </div>
          )}
        </section>

        {/* Typography Section */}
        <section id="typography" className="mb-20">
          <SectionHeader title="Typography" description="Font families, sizes, and type scale" />

          {/* Font Families */}
          <h3 className="text-lg font-semibold mb-4">Font Families</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {tokens.typography.fontFamily.display && (
              <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
                <p className="text-sm text-muted mb-2">Display</p>
                <p className="text-2xl" style={{ fontFamily: tokens.typography.fontFamily.display }}>
                  {tokens.typography.fontFamily.display.split(',')[0]}
                </p>
              </div>
            )}
            {tokens.typography.fontFamily.body && (
              <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
                <p className="text-sm text-muted mb-2">Body</p>
                <p className="text-2xl" style={{ fontFamily: tokens.typography.fontFamily.body }}>
                  {tokens.typography.fontFamily.body.split(',')[0]}
                </p>
              </div>
            )}
            <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
              <p className="text-sm text-muted mb-2">Sans</p>
              <p className="text-2xl" style={{ fontFamily: tokens.typography.fontFamily.sans }}>
                {tokens.typography.fontFamily.sans.split(',')[0]}
              </p>
            </div>
            <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
              <p className="text-sm text-muted mb-2">Mono</p>
              <p className="text-2xl font-mono" style={{ fontFamily: tokens.typography.fontFamily.mono }}>
                {tokens.typography.fontFamily.mono.split(',')[0]}
              </p>
            </div>
          </div>

          {/* Type Scale (v2) */}
          {tokens.typography.scale && (
            <>
              <h3 className="text-lg font-semibold mb-4">Type Scale</h3>
              <div className="space-y-4 mb-8">
                {Object.entries(tokens.typography.scale).map(([name, spec]) => (
                  <div
                    key={name}
                    className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] flex items-center justify-between"
                  >
                    <div
                      style={{
                        fontSize: spec.size,
                        fontWeight: spec.weight,
                        lineHeight: spec.lineHeight,
                        letterSpacing: spec.letterSpacing,
                        textTransform: spec.textTransform,
                        fontFamily:
                          spec.font === 'display'
                            ? tokens.typography.fontFamily.display
                            : tokens.typography.fontFamily.body,
                      }}
                    >
                      {name.toUpperCase()}
                    </div>
                    <div className="text-xs text-muted text-right">
                      <p>{spec.size} / {spec.weight}</p>
                      <p>Line height: {spec.lineHeight}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Font Sizes */}
          <h3 className="text-lg font-semibold mb-4">Font Sizes</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(tokens.typography.fontSize).map(([name, size]) => (
              <div key={name} className="p-3 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
                <p className="text-xs text-muted mb-1">{name}</p>
                <p style={{ fontSize: size as string }}>{size}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Spacing & Grid Section */}
        <section id="spacing" className="mb-20">
          <SectionHeader title="Spacing & Grid" description="Spacing scale and grid system" />

          {/* Grid System (v2) */}
          {tokens.grid && (
            <>
              <h3 className="text-lg font-semibold mb-4">Grid System</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
                  <h4 className="text-sm font-medium mb-3">Desktop</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted">Columns</dt>
                      <dd className="font-mono">{tokens.grid.desktop.columns}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted">Gutter</dt>
                      <dd className="font-mono">{tokens.grid.desktop.gutter}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted">Max Width</dt>
                      <dd className="font-mono">{tokens.grid.desktop.maxWidth}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted">Margin</dt>
                      <dd className="font-mono">{tokens.grid.desktop.margin}</dd>
                    </div>
                  </dl>
                </div>
                <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
                  <h4 className="text-sm font-medium mb-3">Mobile</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted">Columns</dt>
                      <dd className="font-mono">{tokens.grid.mobile.columns}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted">Gutter</dt>
                      <dd className="font-mono">{tokens.grid.mobile.gutter}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted">Margin</dt>
                      <dd className="font-mono">{tokens.grid.mobile.margin}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </>
          )}

          {/* Spacing Scale */}
          <h3 className="text-lg font-semibold mb-4">Spacing Scale</h3>
          <div className="flex flex-wrap gap-3 mb-8">
            {Object.entries(tokens.spacing)
              .filter((entry): entry is [string, string] => typeof entry[1] === 'string')
              .map(([name, size]) => (
                <div
                  key={name}
                  className="p-3 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] text-center"
                >
                  <div
                    className="bg-[var(--accent)] mx-auto mb-2"
                    style={{ width: size, height: size, minWidth: '4px', minHeight: '4px' }}
                  />
                  <p className="text-xs text-muted">{name}</p>
                  <p className="text-xs font-mono">{size}</p>
                </div>
              ))}
          </div>

          {/* Semantic Spacing (v2) */}
          {tokens.spacing.semantic && (
            <>
              <h3 className="text-lg font-semibold mb-4">Semantic Spacing</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(tokens.spacing.semantic).map(([name, values]) => (
                  <div key={name} className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
                    <h4 className="text-sm font-medium mb-2 capitalize">{name}</h4>
                    <dl className="space-y-1 text-sm">
                      {Object.entries(values).map(([prop, value]) => (
                        <div key={prop} className="flex justify-between">
                          <dt className="text-muted">{prop}</dt>
                          <dd className="font-mono">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Logo Section */}
        <section id="logo" className="mb-20">
          <SectionHeader title="Logo" description="Logo variants, sizing, and usage guidelines" />

          {tokens.logo ? (
            <div className="space-y-8">
              {/* Logo Variants */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Logo Variants</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(tokens.logo.variants).map(([name, variant]) => (
                    <div key={name} className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium capitalize">{name}</h4>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          variant.background === 'dark' ? 'bg-gray-800 text-white' :
                          variant.background === 'light' ? 'bg-gray-100 text-gray-800' :
                          'bg-[var(--card-bg)] border border-[var(--card-border)]'
                        }`}>
                          {variant.background} bg
                        </span>
                      </div>
                      <p className="text-sm text-muted mb-2">{variant.description}</p>
                      <p className="text-xs text-muted italic">{variant.usage}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clear Space & Sizing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
                  <h3 className="text-sm font-semibold mb-3">Clear Space</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted">Unit</dt>
                      <dd className="font-mono">{tokens.logo.clearSpace.unit}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted">Minimum</dt>
                      <dd className="font-mono">{tokens.logo.clearSpace.minimum}</dd>
                    </div>
                  </dl>
                </div>
                <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
                  <h3 className="text-sm font-semibold mb-3">Sizing</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted">Minimum</dt>
                      <dd className="font-mono">{tokens.logo.sizing.minimum}</dd>
                    </div>
                    {Object.entries(tokens.logo.sizing.recommended).map(([context, size]) => (
                      <div key={context} className="flex justify-between">
                        <dt className="text-muted capitalize">{context}</dt>
                        <dd className="font-mono">{size}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              {/* Logo Guidelines */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
                  <h3 className="text-sm font-semibold mb-3 text-green-500">Do</h3>
                  <ul className="space-y-2">
                    {tokens.logo.guidelines.do.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-green-500 mt-0.5">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                  <h3 className="text-sm font-semibold mb-3 text-red-500">Don&apos;t</h3>
                  <ul className="space-y-2">
                    {tokens.logo.guidelines.dont.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-red-500 mt-0.5">✗</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted">No logo specifications available.</p>
          )}
        </section>

        {/* Components Section */}
        <section id="components" className="mb-20">
          <SectionHeader title="Components" description="UI component specifications" />

          {/* Button Component (v2) */}
          {tokens.components?.button && (
            <>
              <h3 className="text-lg font-semibold mb-4">Buttons</h3>
              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  className="transition-colors"
                  style={{
                    backgroundColor: tokens.components.button.primary.background[colorMode],
                    color: tokens.components.button.primary.foreground[colorMode],
                    padding: `${tokens.components.button.paddingY} ${tokens.components.button.paddingX}`,
                    fontSize: tokens.components.button.fontSize,
                    fontWeight: tokens.components.button.fontWeight,
                    borderRadius: tokens.components.button.borderRadius,
                    letterSpacing: tokens.components.button.letterSpacing,
                  }}
                >
                  Primary Button
                </button>
                <button
                  className="transition-colors"
                  style={{
                    backgroundColor: tokens.components.button.secondary.background[colorMode],
                    color: tokens.components.button.secondary.foreground[colorMode],
                    border: `1px solid ${tokens.components.button.secondary.border[colorMode]}`,
                    padding: `${tokens.components.button.paddingY} ${tokens.components.button.paddingX}`,
                    fontSize: tokens.components.button.fontSize,
                    fontWeight: tokens.components.button.fontWeight,
                    borderRadius: tokens.components.button.borderRadius,
                  }}
                >
                  Secondary Button
                </button>
                {tokens.components.button.outline && (
                  <button
                    className="transition-colors"
                    style={{
                      backgroundColor: 'transparent',
                      color: tokens.components.button.outline.foreground[colorMode],
                      border: `1px solid ${tokens.components.button.outline.border[colorMode]}`,
                      padding: `${tokens.components.button.paddingY} ${tokens.components.button.paddingX}`,
                      fontSize: tokens.components.button.fontSize,
                      fontWeight: tokens.components.button.fontWeight,
                      borderRadius: tokens.components.button.borderRadius,
                    }}
                  >
                    Outline Button
                  </button>
                )}
              </div>
            </>
          )}

          {/* Input Component (v2) */}
          {tokens.components?.input && (
            <>
              <h3 className="text-lg font-semibold mb-4">Input</h3>
              <div className="max-w-md mb-8">
                <input
                  type="text"
                  placeholder="Placeholder text..."
                  className="w-full transition-colors"
                  style={{
                    backgroundColor: tokens.components.input.background[colorMode],
                    border: `1px solid ${tokens.components.input.border[colorMode]}`,
                    padding: `${tokens.components.input.paddingY} ${tokens.components.input.paddingX}`,
                    fontSize: tokens.components.input.fontSize,
                    borderRadius: tokens.components.input.borderRadius,
                    color: tokens.colors.foreground[colorMode],
                  }}
                />
              </div>
            </>
          )}

          {/* Alert Component (v2) */}
          {tokens.components?.alert && (
            <>
              <h3 className="text-lg font-semibold mb-4">Alerts</h3>
              <div className="space-y-3 mb-8">
                {Object.entries(tokens.components.alert.variants).map(([variant, styles]) => (
                  <div
                    key={variant}
                    style={{
                      backgroundColor: styles.background[colorMode],
                      borderLeft: `${tokens.components!.alert!.borderLeftWidth} solid ${styles.border[colorMode]}`,
                      padding: tokens.components!.alert!.padding,
                      borderRadius: '0.375rem',
                    }}
                  >
                    <p className="font-medium capitalize">{variant}</p>
                    <p className="text-sm text-muted">This is a {variant} alert message.</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Icons (v2) */}
          {tokens.icons && (
            <>
              <h3 className="text-lg font-semibold mb-4">Icons</h3>
              <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] mb-8">
                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <dt className="text-muted">Stroke Weight</dt>
                    <dd className="font-mono">{tokens.icons.strokeWeight}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Bounding Box</dt>
                    <dd className="font-mono">{tokens.icons.boundingBox}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Stroke Caps</dt>
                    <dd className="font-mono">{tokens.icons.strokeCaps}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Sizes</dt>
                    <dd className="font-mono">{Object.values(tokens.icons.sizes).join(', ')}</dd>
                  </div>
                </dl>
                {tokens.icons.categories && tokens.icons.categories.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[var(--card-border)]">
                    <p className="text-sm text-muted mb-2">Suggested Categories</p>
                    <div className="flex flex-wrap gap-2">
                      {tokens.icons.categories.map((cat) => (
                        <span
                          key={cat}
                          className="px-2 py-0.5 text-xs rounded-full bg-[var(--card-bg)] border border-[var(--card-border)]"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Tags (v2.1) */}
          {tokens.components?.tag && (
            <>
              <h3 className="text-lg font-semibold mb-4">Tags / Badges</h3>
              <div className="space-y-4 mb-8">
                {/* Tag Variants */}
                <div className="flex flex-wrap gap-3">
                  {Object.entries(tokens.components.tag.variants).map(([variant, styles]) => (
                    <span
                      key={variant}
                      className="transition-colors"
                      style={{
                        backgroundColor: styles.background[colorMode],
                        color: styles.foreground[colorMode],
                        border: `1px solid ${styles.border[colorMode]}`,
                        padding: `${tokens.components!.tag!.sizes.md.paddingY} ${tokens.components!.tag!.sizes.md.paddingX}`,
                        fontSize: tokens.components!.tag!.sizes.md.fontSize,
                        fontWeight: tokens.components!.tag!.fontWeight,
                        borderRadius: tokens.components!.tag!.borderRadius,
                      }}
                    >
                      {variant}
                    </span>
                  ))}
                </div>
                {/* Tag Sizes */}
                <div className="flex items-end gap-3">
                  {Object.entries(tokens.components.tag.sizes).map(([size, sizeSpec]) => (
                    <span
                      key={size}
                      style={{
                        backgroundColor: tokens.components!.tag!.variants.default.background[colorMode],
                        color: tokens.components!.tag!.variants.default.foreground[colorMode],
                        border: `1px solid ${tokens.components!.tag!.variants.default.border[colorMode]}`,
                        padding: `${sizeSpec.paddingY} ${sizeSpec.paddingX}`,
                        fontSize: sizeSpec.fontSize,
                        fontWeight: tokens.components!.tag!.fontWeight,
                        borderRadius: tokens.components!.tag!.borderRadius,
                      }}
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Tabs (v2.1) */}
          {tokens.components?.tabs && (
            <>
              <h3 className="text-lg font-semibold mb-4">Navigation Tabs</h3>
              <div className="space-y-6 mb-8">
                {Object.entries(tokens.components.tabs.variants).map(([variant, styles]) => (
                  <div key={variant}>
                    <p className="text-sm text-muted mb-2 capitalize">{variant} style</p>
                    <div
                      className="inline-flex"
                      style={{ gap: tokens.components!.tabs!.gap }}
                    >
                      {['Active', 'Tab 2', 'Tab 3'].map((tab, i) => (
                        <button
                          key={tab}
                          style={{
                            backgroundColor: i === 0 ? styles.activeBackground[colorMode] : styles.background[colorMode],
                            color: i === 0 ? styles.activeForeground[colorMode] : styles.foreground[colorMode],
                            borderBottom: variant === 'underline'
                              ? `2px solid ${i === 0 ? styles.activeBorder[colorMode] : 'transparent'}`
                              : undefined,
                            border: variant === 'bordered'
                              ? `1px solid ${i === 0 ? styles.activeBorder[colorMode] : styles.border[colorMode]}`
                              : variant === 'pill'
                              ? 'none'
                              : undefined,
                            padding: tokens.components!.tabs!.padding,
                            borderRadius: variant === 'pill' ? '9999px' : variant === 'bordered' ? '0.375rem' : '0',
                          }}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Form Elements (v2.1) */}
          {tokens.components?.form && (
            <>
              <h3 className="text-lg font-semibold mb-4">Form Elements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Textarea */}
                <div>
                  <label className="text-sm text-muted mb-2 block">Textarea</label>
                  <textarea
                    placeholder="Enter text..."
                    rows={3}
                    className="w-full transition-colors"
                    style={{
                      backgroundColor: tokens.components.form.textarea.background[colorMode],
                      border: `1px solid ${tokens.components.form.textarea.border[colorMode]}`,
                      minHeight: tokens.components.form.textarea.minHeight,
                      padding: tokens.components.form.textarea.padding,
                      borderRadius: tokens.components.form.textarea.borderRadius,
                      color: tokens.colors.foreground[colorMode],
                    }}
                  />
                </div>

                {/* Checkbox & Radio & Toggle */}
                <div className="space-y-4">
                  {/* Checkbox */}
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: tokens.components.form.checkbox.size,
                        height: tokens.components.form.checkbox.size,
                        borderRadius: tokens.components.form.checkbox.borderRadius,
                        backgroundColor: tokens.components.form.checkbox.checkedBackground[colorMode],
                        border: `2px solid ${tokens.components.form.checkbox.checkedBorder[colorMode]}`,
                      }}
                    >
                      <svg viewBox="0 0 12 12" fill="none" style={{ width: '60%', height: '60%' }}>
                        <path d="M2 6L5 9L10 3" stroke={tokens.components.form.checkbox.checkmarkColor[colorMode]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-sm">Checkbox (checked)</span>
                  </div>

                  {/* Radio */}
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: tokens.components.form.radio.size,
                        height: tokens.components.form.radio.size,
                        borderRadius: '50%',
                        backgroundColor: tokens.components.form.radio.checkedBackground[colorMode],
                        border: `2px solid ${tokens.components.form.radio.checkedBorder[colorMode]}`,
                      }}
                    >
                      <div
                        style={{
                          width: '40%',
                          height: '40%',
                          borderRadius: '50%',
                          backgroundColor: tokens.components.form.radio.dotColor[colorMode],
                        }}
                      />
                    </div>
                    <span className="text-sm">Radio (selected)</span>
                  </div>

                  {/* Toggle */}
                  <div className="flex items-center gap-3">
                    <div
                      className="relative"
                      style={{
                        width: tokens.components.form.toggle.width,
                        height: tokens.components.form.toggle.height,
                        borderRadius: tokens.components.form.toggle.borderRadius,
                        backgroundColor: tokens.components.form.toggle.onBackground[colorMode],
                      }}
                    >
                      <div
                        className="absolute"
                        style={{
                          width: `calc(${tokens.components.form.toggle.height} - 4px)`,
                          height: `calc(${tokens.components.form.toggle.height} - 4px)`,
                          borderRadius: '50%',
                          backgroundColor: tokens.components.form.toggle.thumbColor[colorMode],
                          top: '2px',
                          right: '2px',
                        }}
                      />
                    </div>
                    <span className="text-sm">Toggle (on)</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Table Variants (v2.1) */}
          {tokens.components?.tableVariants && (
            <>
              <h3 className="text-lg font-semibold mb-4">Table Variants</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {Object.entries(tokens.components.tableVariants).map(([variant, styles]) => (
                  <div key={variant} className="overflow-hidden rounded-lg border border-[var(--card-border)]">
                    <p className="text-sm font-medium p-2 bg-[var(--card-bg)] border-b border-[var(--card-border)] capitalize">
                      {variant}
                    </p>
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ backgroundColor: styles.headerBackground[colorMode] }}>
                          <th className="p-2 text-left">Header</th>
                          <th className="p-2 text-left">Header</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[0, 1, 2].map((row) => (
                          <tr
                            key={row}
                            style={{
                              backgroundColor:
                                variant === 'striped'
                                  ? (row % 2 === 0 ? (styles as typeof tokens.components.tableVariants.striped).rowEven[colorMode] : (styles as typeof tokens.components.tableVariants.striped).rowOdd[colorMode])
                                  : variant === 'comparison' && row === 1
                                  ? (styles as typeof tokens.components.tableVariants.comparison).highlightColumn[colorMode]
                                  : 'rowBackground' in styles
                                  ? (styles as typeof tokens.components.tableVariants.basic).rowBackground[colorMode]
                                  : undefined,
                              borderBottom: `1px solid ${styles.borderColor[colorMode]}`,
                            }}
                          >
                            <td className="p-2">Row {row + 1}</td>
                            <td className="p-2">Data</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Data Visualization Section */}
        <section id="data-viz" className="mb-20">
          <SectionHeader title="Data Visualization" description="Stat cards, progress bars, timelines, and code blocks" />

          {tokens.dataVisualization ? (
            (() => {
              const dv = tokens.dataVisualization;
              return (
                <div className="space-y-8">
                  {/* Stat Cards */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Stat Cards</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Default Stat Card */}
                      <div
                        style={{
                          backgroundColor: dv.statCard.default.background[colorMode],
                          border: `1px solid ${dv.statCard.default.border[colorMode]}`,
                          padding: dv.statCard.default.padding,
                          borderRadius: dv.statCard.default.borderRadius,
                        }}
                      >
                        <p
                          className="text-sm mb-1"
                          style={{ color: dv.statCard.default.labelColor[colorMode] }}
                        >
                          Default Stat Card
                        </p>
                        <p
                          className="text-3xl font-bold"
                          style={{ color: dv.statCard.default.valueColor[colorMode] }}
                        >
                          2,847
                        </p>
                      </div>
                      {/* Hero Stat Card */}
                      {dv.statCard.hero && (
                        <div
                          style={{
                            backgroundColor: dv.statCard.hero.background[colorMode],
                            border: `1px solid ${dv.statCard.hero.border[colorMode]}`,
                            padding: dv.statCard.hero.padding,
                            borderRadius: dv.statCard.hero.borderRadius,
                          }}
                        >
                          <p
                            className="text-sm mb-1"
                            style={{ color: dv.statCard.hero.labelColor[colorMode] }}
                          >
                            Hero Stat Card
                          </p>
                          <p
                            className="text-4xl font-bold"
                            style={{ color: dv.statCard.hero.valueColor[colorMode] }}
                          >
                            $1.2M
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Progress Bar</h3>
                    <div className="max-w-md space-y-3">
                      {[75, 45, 90].map((value, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted">Progress {i + 1}</span>
                            <span>{value}%</span>
                          </div>
                          <div
                            style={{
                              backgroundColor: dv.progress.track[colorMode],
                              height: dv.progress.height,
                              borderRadius: dv.progress.borderRadius,
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                backgroundColor: dv.progress.fill[colorMode],
                                height: '100%',
                                width: `${value}%`,
                                borderRadius: dv.progress.borderRadius,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Timeline</h3>
                    <div className="relative pl-6 space-y-4">
                      {['Event 1', 'Event 2', 'Event 3'].map((event, i, arr) => (
                        <div key={event} className="relative">
                          {/* Line */}
                          {i < arr.length - 1 && (
                            <div
                              className="absolute"
                              style={{
                                left: `calc(-1.5rem + ${dv.timeline.dotSize} / 2 - ${dv.timeline.lineWidth} / 2)`,
                                top: dv.timeline.dotSize,
                                width: dv.timeline.lineWidth,
                                height: 'calc(100% + 1rem)',
                                backgroundColor: dv.timeline.lineColor[colorMode],
                              }}
                            />
                          )}
                          {/* Dot */}
                          <div
                            className="absolute"
                            style={{
                              left: `calc(-1.5rem)`,
                              top: '2px',
                              width: dv.timeline.dotSize,
                              height: dv.timeline.dotSize,
                              borderRadius: '50%',
                              backgroundColor: dv.timeline.dotColor[colorMode],
                            }}
                          />
                          {/* Content */}
                          <div>
                            <p className="font-medium">{event}</p>
                            <p className="text-sm text-muted">Description for {event.toLowerCase()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Code Block */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Code Block</h3>
                    <div
                      style={{
                        backgroundColor: dv.codeBlock.background[colorMode],
                        border: `1px solid ${dv.codeBlock.border[colorMode]}`,
                        color: dv.codeBlock.textColor[colorMode],
                        padding: dv.codeBlock.padding,
                        borderRadius: dv.codeBlock.borderRadius,
                        fontFamily: dv.codeBlock.fontFamily,
                        fontSize: '0.875rem',
                      }}
                    >
                      <pre className="whitespace-pre-wrap">
{`const brandSystem = {
  colors: { ... },
  typography: { ... },
  components: { ... }
};`}
                      </pre>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <p className="text-muted">No data visualization specifications available.</p>
          )}
        </section>

        {/* Animation Section (v3.0) */}
        <section id="animation" className="mb-20">
          <SectionHeader title="Animation System" description="Keyframes, animation presets, and reduced motion support" />

          {tokens.animation ? (() => {
            const anim = tokens.animation;
            return (
              <div className="space-y-8">
                {/* Keyframes */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Keyframes</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Object.entries(anim.keyframes).map(([name, keyframe]) => (
                      <div
                        key={name}
                        className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-sm">{name}</span>
                        </div>
                        <div
                          className="w-8 h-8 rounded bg-[var(--accent)]"
                          style={{
                            animation: name === 'spin' ? 'spin 1s linear infinite' :
                                       name === 'pulse' ? 'pulse 2s ease-in-out infinite' :
                                       name === 'bounce' ? 'bounce 1s ease-in-out infinite' :
                                       `${name} 1s ease-in-out infinite alternate`,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Animation Presets */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Animation Presets</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(anim.presets).map(([name, preset]) => (
                      <div
                        key={name}
                        className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{preset.name}</span>
                          <span className="text-xs text-muted font-mono">{preset.duration}</span>
                        </div>
                        <p className="text-sm text-muted mb-2">{preset.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {preset.usage.map((use, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)]"
                            >
                              {use}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reduced Motion */}
                <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
                  <h3 className="text-lg font-semibold mb-4">Reduced Motion Support</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm mb-2">
                        <span className="font-medium">Respects User Preference:</span>{' '}
                        {anim.reducedMotion.respectsUserPreference ? 'Yes' : 'No'}
                      </p>
                      <p className="text-sm mb-2">
                        <span className="font-medium">Fallback Duration:</span>{' '}
                        <code className="font-mono text-xs bg-[var(--muted)]/20 px-1 rounded">
                          {anim.reducedMotion.fallbackDuration}
                        </code>
                      </p>
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-2">Disabled Animations:</p>
                        <div className="flex flex-wrap gap-1">
                          {anim.reducedMotion.disabledAnimations.map((name) => (
                            <span
                              key={name}
                              className="text-xs px-2 py-0.5 rounded bg-[var(--error)]/10 text-[var(--error)] font-mono"
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Alternative Effects:</p>
                      <dl className="space-y-1">
                        {Object.entries(anim.reducedMotion.alternativeEffects).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <dt className="font-mono text-muted">{key}</dt>
                            <dd className="text-right">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                </div>

                {/* Page Transitions */}
                {anim.pageTransitions && (
                  <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
                    <h3 className="text-lg font-semibold mb-4">Page Transitions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Enter</p>
                        <p className="text-xs text-muted">{anim.pageTransitions.enter.description}</p>
                        <p className="text-xs font-mono mt-1">{anim.pageTransitions.enter.duration}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Exit</p>
                        <p className="text-xs text-muted">{anim.pageTransitions.exit.description}</p>
                        <p className="text-xs font-mono mt-1">{anim.pageTransitions.exit.duration}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stagger */}
                {anim.stagger && (
                  <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
                    <h3 className="text-lg font-semibold mb-4">Stagger Patterns</h3>
                    <div className="flex gap-8">
                      <p className="text-sm">
                        <span className="font-medium">Base Delay:</span>{' '}
                        <code className="font-mono">{anim.stagger.baseDelay}</code>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Increment:</span>{' '}
                        <code className="font-mono">{anim.stagger.increment}</code>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Max Items:</span>{' '}
                        <code className="font-mono">{anim.stagger.maxItems}</code>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })() : (
            <p className="text-muted">No animation system specifications available.</p>
          )}
        </section>

        {/* Motion Section */}
        <section id="motion" className="mb-20">
          <SectionHeader title="Motion" description="Animation durations, easings, and principles" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Durations */}
            <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
              <h3 className="text-sm font-semibold mb-4">Durations</h3>
              <dl className="space-y-2">
                {Object.entries(tokens.motion.duration).map(([name, value]) => (
                  <div key={name} className="flex justify-between items-center">
                    <dt className="text-muted capitalize">{name}</dt>
                    <dd className="font-mono text-sm">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Easings */}
            <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
              <h3 className="text-sm font-semibold mb-4">Easings</h3>
              <dl className="space-y-2">
                {Object.entries(tokens.motion.easing).map(([name, value]) => (
                  <div key={name} className="flex justify-between items-center">
                    <dt className="text-muted capitalize">{name}</dt>
                    <dd className="font-mono text-xs">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Principles (v2) */}
          {tokens.motion.principles && tokens.motion.principles.length > 0 && (
            <div className="mt-8 p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
              <h3 className="text-sm font-semibold mb-3">Motion Principles</h3>
              <ul className="space-y-2">
                {tokens.motion.principles.map((principle, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                    {principle}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Loading States (v2.1) */}
          {tokens.motion.loading && (() => {
            const loading = tokens.motion.loading;
            return (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Loading States</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Spinner */}
                  <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
                    <h4 className="text-sm font-medium mb-4">Spinner</h4>
                    <div className="flex items-center justify-center gap-4 mb-4">
                      {(['sm', 'md', 'lg'] as const).map((size) => (
                        <div
                          key={size}
                          className="animate-spin"
                          style={{
                            width: loading.spinner.size[size],
                            height: loading.spinner.size[size],
                            border: `${loading.spinner.borderWidth} solid ${loading.spinner.trackColor[colorMode]}`,
                            borderTopColor: loading.spinner.color[colorMode],
                            borderRadius: '50%',
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted text-center">
                      Duration: {loading.spinner.duration}
                    </p>
                  </div>

                  {/* Skeleton */}
                  <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
                    <h4 className="text-sm font-medium mb-4">Skeleton</h4>
                    <div className="space-y-2 mb-4">
                      <div
                        className="h-4 w-full animate-pulse"
                        style={{
                          backgroundColor: loading.skeleton.background[colorMode],
                          borderRadius: loading.skeleton.borderRadius,
                        }}
                      />
                      <div
                        className="h-4 w-3/4 animate-pulse"
                        style={{
                          backgroundColor: loading.skeleton.background[colorMode],
                          borderRadius: loading.skeleton.borderRadius,
                        }}
                      />
                      <div
                        className="h-4 w-1/2 animate-pulse"
                        style={{
                          backgroundColor: loading.skeleton.background[colorMode],
                          borderRadius: loading.skeleton.borderRadius,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted text-center">
                      Duration: {loading.skeleton.duration}
                    </p>
                  </div>

                  {/* Pulse */}
                  <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
                    <h4 className="text-sm font-medium mb-4">Pulse</h4>
                    <div className="flex items-center justify-center mb-4">
                      <div
                        className="w-12 h-12 rounded-full animate-pulse"
                        style={{
                          backgroundColor: loading.pulse.color[colorMode],
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted text-center">
                      Scale: {loading.pulse.scale[0]} - {loading.pulse.scale[1]}
                    </p>
                  </div>

                  {/* Dots */}
                  <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
                    <h4 className="text-sm font-medium mb-4">Dots</h4>
                    <div
                      className="flex items-center justify-center mb-4"
                      style={{ gap: loading.dots.gap }}
                    >
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="rounded-full animate-bounce"
                          style={{
                            width: loading.dots.size,
                            height: loading.dots.size,
                            backgroundColor: loading.dots.color[colorMode],
                            animationDelay: `${i * 150}ms`,
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted text-center">
                      Duration: {loading.dots.duration}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </section>

        {/* Imagery Section */}
        <section id="imagery" className="mb-20">
          <SectionHeader title="Imagery" description="Photography style and guidelines" />

          {tokens.imagery ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Styles */}
              <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
                <h3 className="text-sm font-semibold mb-3">Image Styles</h3>
                <ul className="space-y-2">
                  {tokens.imagery.styles.map((style, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                      {style}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Photo Treatment */}
              <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
                <h3 className="text-sm font-semibold mb-3">Photo Treatment</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-muted">Color Grading</dt>
                    <dd>{tokens.imagery.photoTreatment.colorGrading}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Contrast</dt>
                    <dd>{tokens.imagery.photoTreatment.contrast}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Style</dt>
                    <dd>{tokens.imagery.photoTreatment.style}</dd>
                  </div>
                </dl>
              </div>

              {/* Guidelines */}
              <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
                <h3 className="text-sm font-semibold mb-3 text-green-500">Do</h3>
                <ul className="space-y-2">
                  {tokens.imagery.guidelines.do.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                <h3 className="text-sm font-semibold mb-3 text-red-500">Don&apos;t</h3>
                <ul className="space-y-2">
                  {tokens.imagery.guidelines.dont.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-red-500 mt-0.5">✗</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-muted">No imagery guidelines available.</p>
          )}
        </section>

        {/* Voice & Tone Section */}
        <section id="voice" className="mb-20">
          <SectionHeader title="Voice & Tone" description="Brand voice, writing style, and examples" />

          {/* Core Message */}
          {tokens.voiceAndTone.coreMessage && (
            <div className="p-6 rounded-lg border-2 border-[var(--accent)] bg-[var(--accent)]/5 mb-8">
              <h3 className="text-sm font-semibold text-[var(--accent)] mb-2">Core Message</h3>
              <p className="text-lg">{tokens.voiceAndTone.coreMessage}</p>
            </div>
          )}

          {/* Writing Style */}
          <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] mb-8">
            <h3 className="text-sm font-semibold mb-2">Writing Style</h3>
            <p>{tokens.voiceAndTone.writingStyle}</p>
          </div>

          {/* Voice Attributes (v2) */}
          {tokens.voiceAndTone.attributes && Object.keys(tokens.voiceAndTone.attributes).length > 0 && (
            <>
              <h3 className="text-lg font-semibold mb-4">Voice Attributes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {Object.entries(tokens.voiceAndTone.attributes).map(([key, attr]) => (
                  <div key={key} className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
                    <h4 className="font-medium mb-1">{attr.name}</h4>
                    <p className="text-sm text-muted mb-2">{attr.description}</p>
                    <p className="text-sm italic border-l-2 border-[var(--accent)] pl-3">{attr.example}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Examples */}
          <h3 className="text-lg font-semibold mb-4">Copy Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
              <h4 className="text-sm font-semibold text-muted mb-3">Headlines</h4>
              <ul className="space-y-2">
                {tokens.voiceAndTone.examples.headlines.map((h, i) => (
                  <li key={i} className="text-sm">{h}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
              <h4 className="text-sm font-semibold text-muted mb-3">CTAs</h4>
              <ul className="space-y-2">
                {tokens.voiceAndTone.examples.cta.map((c, i) => (
                  <li key={i} className="text-sm">{c}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
              <h4 className="text-sm font-semibold text-muted mb-3">Descriptions</h4>
              <ul className="space-y-2">
                {tokens.voiceAndTone.examples.descriptions.map((d, i) => (
                  <li key={i} className="text-sm">{d}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Writing Guidelines (v2) */}
          {tokens.voiceAndTone.guidelines && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
                <h3 className="text-sm font-semibold mb-3 text-green-500">Do</h3>
                <ul className="space-y-2">
                  {tokens.voiceAndTone.guidelines.do.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                <h3 className="text-sm font-semibold mb-3 text-red-500">Don&apos;t</h3>
                <ul className="space-y-2">
                  {tokens.voiceAndTone.guidelines.dont.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-red-500 mt-0.5">✗</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>

        {/* Utilities Section */}
        <section id="utilities" className="mb-20">
          <SectionHeader title="Utilities" description="Z-index, breakpoints, borders, and shadows" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Z-Index (v2) */}
            {tokens.zIndex && (
              <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
                <h3 className="text-sm font-semibold mb-4">Z-Index Scale</h3>
                <dl className="space-y-2">
                  {Object.entries(tokens.zIndex).map(([name, value]) => (
                    <div key={name} className="flex justify-between items-center">
                      <dt className="text-muted capitalize">{name}</dt>
                      <dd className="font-mono">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Breakpoints (v2) */}
            {tokens.breakpoints && (
              <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
                <h3 className="text-sm font-semibold mb-4">Breakpoints</h3>
                <dl className="space-y-2">
                  {Object.entries(tokens.breakpoints).map(([name, value]) => (
                    <div key={name} className="flex justify-between items-center">
                      <dt className="text-muted">{name}</dt>
                      <dd className="font-mono">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Border Radius */}
            <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
              <h3 className="text-sm font-semibold mb-4">Border Radius</h3>
              <div className="flex flex-wrap gap-3">
                {Object.entries(tokens.borders.radius).map(([name, value]) => (
                  <div key={name} className="text-center">
                    <div
                      className="w-12 h-12 bg-[var(--accent)] mb-1"
                      style={{ borderRadius: value as string }}
                    />
                    <p className="text-xs text-muted">{name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shadows */}
            <div className="p-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]">
              <h3 className="text-sm font-semibold mb-4">Shadows</h3>
              <div className="space-y-4">
                {Object.entries(tokens.shadows).map(([name, value]) => (
                  <div key={name} className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md"
                      style={{ boxShadow: value }}
                    />
                    <div>
                      <p className="text-sm font-medium">{name}</p>
                      <p className="text-xs text-muted font-mono">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--card-border)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted">
          <p>
            Generated by{' '}
            <Link href="/" className="text-[var(--accent)] hover:underline">
              Nertia Brand Generator
            </Link>
          </p>
          {tokens.metadata?.generatedAt && (
            <p className="mt-1">
              {new Date(tokens.metadata.generatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}
