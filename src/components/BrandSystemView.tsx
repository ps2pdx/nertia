'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BrandSystem, DiscoveryInputs, ColorValue } from '@/types/brand-system';
import { ExportOptions } from './ExportOptions';

interface BrandSystemViewProps {
  tokens: BrandSystem;
  inputs?: DiscoveryInputs;
}

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'colors', label: 'Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'spacing', label: 'Spacing & Grid' },
  { id: 'components', label: 'Components' },
  { id: 'motion', label: 'Motion' },
  { id: 'imagery', label: 'Imagery' },
  { id: 'voice', label: 'Voice & Tone' },
  { id: 'utilities', label: 'Utilities' },
];

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

  useEffect(() => {
    const handleScroll = () => {
      const sections = SECTIONS.map((s) => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
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
