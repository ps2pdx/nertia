'use client';

import { useState } from 'react';
import Image from 'next/image';
import Footer from '@/components/sections/Footer';
import PageContent from '@/components/PageContent';

export default function DesignSystemPage() {
    const [copiedToken, setCopiedToken] = useState<string | null>(null);

    const copyToClipboard = (text: string, tokenName: string) => {
        navigator.clipboard.writeText(text);
        setCopiedToken(tokenName);
        setTimeout(() => setCopiedToken(null), 2000);
    };

    const colors = [
        { name: 'Background', token: '--background', lightValue: '#ffffff', darkValue: '#0a0a0a' },
        { name: 'Foreground', token: '--foreground', lightValue: '#171717', darkValue: '#ededed' },
        { name: 'Muted', token: '--muted', lightValue: '#6b7280', darkValue: '#9ca3af' },
        { name: 'Accent', token: '--accent', lightValue: '#22c55e', darkValue: '#22c55e' },
        { name: 'Accent Hover', token: '--accent-hover', lightValue: '#16a34a', darkValue: '#4ade80' },
        { name: 'Card Background', token: '--card-bg', lightValue: '#f9fafb', darkValue: '#111111' },
        { name: 'Card Border', token: '--card-border', lightValue: '#e5e7eb', darkValue: '#262626' },
    ];

    const typography = [
        { name: 'Display', element: 'h1', classes: 'text-5xl lg:text-6xl font-bold', sample: 'Brand systems that move.' },
        { name: 'Heading 1', element: 'h1', classes: 'text-4xl sm:text-5xl font-bold', sample: 'Page Headline' },
        { name: 'Heading 2', element: 'h2', classes: 'text-2xl sm:text-3xl font-bold', sample: 'Section Title' },
        { name: 'Heading 3', element: 'h3', classes: 'text-xl font-semibold', sample: 'Subsection Title' },
        { name: 'Body', element: 'p', classes: 'text-base leading-relaxed', sample: 'Body text for paragraphs and general content. Uses Space Mono for a technical, precise feel.' },
        { name: 'Small / Label', element: 'span', classes: 'text-sm text-muted', sample: 'Labels and secondary text' },
        { name: 'Micro', element: 'span', classes: 'text-xs tracking-[0.2em] uppercase text-muted', sample: 'Section Label' },
    ];

    const spacing = [
        { name: 'Section Padding', value: 'p-8 lg:p-12', px: '32px / 48px' },
        { name: 'Card Padding', value: 'p-8 (2rem)', px: '32px' },
        { name: 'Component Gap', value: 'gap-6', px: '24px' },
        { name: 'Text Gap', value: 'space-y-4', px: '16px' },
        { name: 'Inline Gap', value: 'gap-2', px: '8px' },
    ];

    return (
        <main className="pb-24">
            <PageContent>
                {/* Colors */}
            <section id="colors" className="w-full border-t border-[var(--card-border)] min-h-[90vh]">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                    <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-[var(--card-border)] p-8 lg:p-12">
                        <div className="lg:sticky lg:top-24">
                            <span className="text-xs tracking-[0.2em] uppercase text-muted">01</span>
                        </div>
                    </div>
                    <div className="lg:col-span-9 p-8 lg:p-12">
                        <h2 className="text-xl font-bold mb-4">Colors</h2>
                        <p className="text-muted text-sm leading-relaxed mb-8">
                            Semantic color tokens that adapt to light and dark mode automatically.
                        </p>
                        <div className="grid gap-4">
                            {colors.map((color) => (
                                <div 
                                    key={color.token}
                                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-[var(--card-border)] group hover:border-[var(--accent)] transition-colors cursor-pointer"
                                    onClick={() => copyToClipboard(`var(${color.token})`, color.token)}
                                >
                                    <div 
                                        className="w-16 h-16 rounded border border-[var(--card-border)] flex-shrink-0"
                                        style={{ background: `var(${color.token})` }}
                                    />
                                    <div className="flex-1">
                                        <div className="font-semibold mb-1">{color.name}</div>
                                        <code className="text-sm text-muted">{color.token}</code>
                                    </div>
                                    <div className="text-sm text-muted">
                                        <div>Light: <code>{color.lightValue}</code></div>
                                        <div>Dark: <code>{color.darkValue}</code></div>
                                    </div>
                                    <div className="text-xs text-[var(--accent)]">
                                        {copiedToken === color.token ? 'Copied!' : 'Click to copy'}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Accent Color Showcase */}
                        <div className="mt-8 p-6 bg-[var(--accent)] text-white">
                            <h3 className="text-xl font-bold mb-2">Accent: Green 500</h3>
                            <p className="opacity-90">The primary accent color used for CTAs, active states, and interactive elements. Hex: #22c55e</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Typography */}
            <section id="typography" className="w-full border-t border-[var(--card-border)] min-h-[90vh]">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                    <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-[var(--card-border)] p-8 lg:p-12">
                        <div className="lg:sticky lg:top-24">
                            <span className="text-xs tracking-[0.2em] uppercase text-muted">02</span>
                        </div>
                    </div>
                    <div className="lg:col-span-9 p-8 lg:p-12">
                        <h2 className="text-xl font-bold mb-4">Typography</h2>
                        <p className="text-muted text-sm leading-relaxed mb-8">
                            Two font families: Helvetica Neue for headings, Space Mono for body text.
                        </p>
                        {/* Font Families */}
                        <div className="mb-12">
                            <h3 className="text-lg font-semibold mb-6">Font Families</h3>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="p-6 border border-[var(--card-border)]">
                                    <div className="text-xs tracking-[0.2em] uppercase text-muted mb-4">Headings</div>
                                    <div className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                                        Helvetica Neue
                                    </div>
                                    <code className="text-sm text-muted">--font-heading</code>
                                </div>
                                <div className="p-6 border border-[var(--card-border)]">
                                    <div className="text-xs tracking-[0.2em] uppercase text-muted mb-4">Body</div>
                                    <div className="text-2xl mb-2">
                                        Space Mono
                                    </div>
                                    <code className="text-sm text-muted">--font-body / --font-space-mono</code>
                                </div>
                            </div>
                        </div>

                        {/* Type Scale */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6">Type Scale</h3>
                            <div className="space-y-6">
                                {typography.map((type, index) => (
                                    <div key={index} className="border-t border-[var(--card-border)] pb-6 last:border-0">
                                        <div className="flex flex-wrap items-baseline gap-4 mb-2">
                                            <span className="text-xs tracking-[0.2em] uppercase text-muted">{type.name}</span>
                                            <code className="text-xs text-muted">{type.classes}</code>
                                        </div>
                                        <div className={type.classes}>
                                            {type.sample}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Components */}
            <section id="components" className="w-full border-t border-[var(--card-border)] min-h-[90vh]">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                    <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-[var(--card-border)] p-8 lg:p-12">
                        <div className="lg:sticky lg:top-24">
                            <span className="text-xs tracking-[0.2em] uppercase text-muted">03</span>
                        </div>
                    </div>
                    <div className="lg:col-span-9 p-8 lg:p-12 space-y-12">
                        <h2 className="text-xl font-bold mb-4">Components</h2>
                        <p className="text-muted text-sm leading-relaxed mb-8">
                            Reusable UI patterns used throughout the site.
                        </p>
                        {/* Buttons */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6">Buttons</h3>
                            <div className="flex flex-wrap gap-4 mb-6">
                                <button className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-medium text-sm tracking-wide hover:bg-green-400 transition-colors">
                                    Primary Button
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                                <button className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--card-border)] font-medium text-sm tracking-wide hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
                                    Secondary Button
                                </button>
                                <a href="#" className="flex items-center gap-2 text-sm tracking-wide hover:text-[var(--accent)] transition-colors">
                                    Text Link →
                                </a>
                            </div>
                            <div className="text-sm text-muted">
                                <p>Primary: <code>bg-green-500 text-white hover:bg-green-400</code></p>
                                <p>Secondary: <code>border border-[var(--card-border)] hover:border-[var(--accent)]</code></p>
                            </div>
                        </div>

                        {/* Cards */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6">Cards</h3>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="card">
                                    <svg className="w-6 h-6 text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
                                    </svg>
                                    <h4 className="font-semibold mb-2">Card Title</h4>
                                    <p className="text-muted text-sm">Card content with hover state that highlights the border in accent color.</p>
                                </div>
                                <div className="p-6 border border-[var(--card-border)] hover:border-[var(--accent)] transition-colors">
                                    <h4 className="font-semibold mb-2">Bordered Container</h4>
                                    <p className="text-muted text-sm">Simple bordered container without background fill.</p>
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6">Tags</h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="text-xs tracking-wide px-3 py-1 border border-[var(--card-border)] text-muted">
                                    AI Infrastructure
                                </span>
                                <span className="text-xs tracking-wide px-3 py-1 border border-[var(--card-border)] text-muted">
                                    GPU Cloud
                                </span>
                                <span className="text-xs tracking-wide px-3 py-1 border border-[var(--card-border)] text-muted">
                                    Series A
                                </span>
                                <span className="text-xs tracking-wide px-3 py-1 border border-[var(--card-border)] text-muted">
                                    Webflow
                                </span>
                            </div>
                            <p className="text-sm text-muted">
                                <code>text-xs tracking-wide px-3 py-1 border border-[var(--card-border)]</code>
                            </p>
                        </div>

                        {/* Navigation */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6">Navigation Tabs</h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <button className="px-4 py-3 text-sm font-medium border border-[var(--accent)] text-[var(--accent)]">
                                    Active Tab
                                </button>
                                <button className="px-4 py-3 text-sm font-medium border border-[var(--card-border)] text-muted hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors">
                                    Inactive Tab
                                </button>
                                <button className="px-4 py-3 text-sm font-medium border border-[var(--card-border)] text-muted hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors">
                                    Another Tab
                                </button>
                            </div>
                        </div>

                        {/* Form Elements */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6">Form Elements</h3>
                            <div className="max-w-md space-y-4">
                                <div>
                                    <label className="text-sm text-muted block mb-2">Text Input</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter text..."
                                        className="w-full px-4 py-3 bg-transparent border border-[var(--card-border)] text-[var(--foreground)] placeholder:text-muted focus:border-[var(--accent)] focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-muted block mb-2">Textarea</label>
                                    <textarea 
                                        placeholder="Enter message..."
                                        rows={3}
                                        className="w-full px-4 py-3 bg-transparent border border-[var(--card-border)] text-[var(--foreground)] placeholder:text-muted focus:border-[var(--accent)] focus:outline-none transition-colors resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Spacing */}
            <section id="spacing" className="w-full border-t border-[var(--card-border)] min-h-[90vh]">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                    <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-[var(--card-border)] p-8 lg:p-12">
                        <div className="lg:sticky lg:top-24">
                            <span className="text-xs tracking-[0.2em] uppercase text-muted">04</span>
                        </div>
                    </div>
                    <div className="lg:col-span-9 p-8 lg:p-12">
                        <h2 className="text-xl font-bold mb-4">Spacing</h2>
                        <p className="text-muted text-sm leading-relaxed mb-8">
                            Consistent spacing scale based on Tailwind defaults.
                        </p>
                        <div className="space-y-4">
                            {spacing.map((space, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 border border-[var(--card-border)]">
                                    <div className="w-32 text-sm font-medium">{space.name}</div>
                                    <div className="flex-1">
                                        <code className="text-sm text-muted">{space.value}</code>
                                    </div>
                                    <div className="text-sm text-muted">{space.px}</div>
                                </div>
                            ))}
                        </div>

                        {/* Visual Spacing Demo */}
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold mb-6">Visual Scale</h3>
                            <div className="space-y-2">
                                {[2, 4, 6, 8, 12, 16, 24, 32, 48].map((size) => (
                                    <div key={size} className="flex items-center gap-4">
                                        <div className="w-16 text-sm text-muted">{size}px</div>
                                        <div 
                                            className="h-4 bg-[var(--accent)]"
                                            style={{ width: `${size * 4}px` }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Logo */}
            <section id="logo" className="w-full border-t border-[var(--card-border)] min-h-[90vh]">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                    <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-[var(--card-border)] p-8 lg:p-12">
                        <div className="lg:sticky lg:top-24">
                            <span className="text-xs tracking-[0.2em] uppercase text-muted">05</span>
                        </div>
                    </div>
                    <div className="lg:col-span-9 p-8 lg:p-12">
                        <h2 className="text-xl font-bold mb-4">Logo</h2>
                        <p className="text-muted text-sm leading-relaxed mb-8">
                            Logo variants for different contexts and backgrounds.
                        </p>
                        <div className="grid gap-8 md:grid-cols-2">
                            {/* Hero Logo */}
                            <div className="p-8 border border-[var(--card-border)] flex flex-col items-center justify-center">
                                <div className="mb-4">
                                    <Image
                                        src="/logo-hero.svg"
                                        alt="Nertia Hero Logo"
                                        width={200}
                                        height={128}
                                    />
                                </div>
                                <div className="text-xs text-muted text-center">
                                    Hero Logo<br />
                                    <code>/logo-hero.svg</code>
                                </div>
                            </div>

                            {/* Light Logo (for dark backgrounds) */}
                            <div className="p-8 bg-[#0a0a0a] border border-[var(--card-border)] flex flex-col items-center justify-center">
                                <div className="mb-4">
                                    <Image
                                        src="/logo-light.svg"
                                        alt="Nertia Light Logo"
                                        width={80}
                                        height={51}
                                    />
                                </div>
                                <div className="text-xs text-[#9ca3af] text-center">
                                    Light Logo (dark bg)<br />
                                    <code>/logo-light.svg</code>
                                </div>
                            </div>

                            {/* Dark Logo (for light backgrounds) */}
                            <div className="p-8 bg-white border border-[var(--card-border)] flex flex-col items-center justify-center">
                                <div className="mb-4">
                                    <Image
                                        src="/logo-dark.svg"
                                        alt="Nertia Dark Logo"
                                        width={80}
                                        height={51}
                                    />
                                </div>
                                <div className="text-xs text-[#6b7280] text-center">
                                    Dark Logo (light bg)<br />
                                    <code>/logo-dark.svg</code>
                                </div>
                            </div>

                            {/* Wordmark */}
                            <div className="p-8 border border-[var(--card-border)] flex flex-col items-center justify-center">
                                <div className="mb-4">
                                    <Image
                                        src="/wordmark-light.svg"
                                        alt="Nertia Wordmark"
                                        width={120}
                                        height={24}
                                        className="hidden dark:block"
                                    />
                                    <Image
                                        src="/wordmark-dark.svg"
                                        alt="Nertia Wordmark"
                                        width={120}
                                        height={24}
                                        className="block dark:hidden"
                                    />
                                </div>
                                <div className="text-xs text-muted text-center">
                                    Wordmark<br />
                                    <code>/wordmark-[light|dark].svg</code>
                                </div>
                            </div>
                        </div>

                        {/* Clear Space */}
                        <div className="mt-8 p-6 border border-[var(--card-border)]">
                            <h3 className="text-lg font-semibold mb-4">Clear Space</h3>
                            <p className="text-muted text-sm leading-relaxed">
                                Maintain minimum clear space around the logo equal to the height of the &quot;n&quot; in the wordmark. This ensures the logo remains legible and impactful across all applications.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid System */}
            <section id="grid" className="w-full border-t border-[var(--card-border)] min-h-[90vh]">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                    <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-[var(--card-border)] p-8 lg:p-12">
                        <div className="lg:sticky lg:top-24">
                            <span className="text-xs tracking-[0.2em] uppercase text-muted">06</span>
                        </div>
                    </div>
                    <div className="lg:col-span-9 p-8 lg:p-12">
                        <h2 className="text-xl font-bold mb-4">Grid System</h2>
                        <p className="text-muted text-sm leading-relaxed mb-8">
                            12-column grid with 3/9 split for content sections.
                        </p>
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4">12-Column Grid</h3>
                            <div className="grid grid-cols-12 gap-2 mb-4">
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className="h-12 bg-[var(--accent)] opacity-20 flex items-center justify-center text-xs">
                                        {i + 1}
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-muted">
                                <code>grid grid-cols-12</code>
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Section Layout (3/9 Split)</h3>
                            <div className="grid grid-cols-12 gap-2 mb-4">
                                <div className="col-span-3 h-24 bg-[var(--accent)] opacity-40 flex items-center justify-center text-xs p-2 text-center">
                                    Sidebar<br />col-span-3
                                </div>
                                <div className="col-span-9 h-24 bg-[var(--accent)] opacity-20 flex items-center justify-center text-xs p-2 text-center">
                                    Content Area<br />col-span-9
                                </div>
                            </div>
                            <p className="text-sm text-muted">
                                Primary layout pattern used for all content sections. Sidebar contains section labels and navigation; content area contains the main content.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Voice & Tone */}
            <section id="voice" className="w-full min-h-[90vh]">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                    <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-[var(--card-border)] p-8 lg:p-12">
                        <div className="lg:sticky lg:top-24">
                            <span className="text-xs tracking-[0.2em] uppercase text-muted">07</span>
                        </div>
                    </div>
                    <div className="lg:col-span-9 p-8 lg:p-12">
                        <h2 className="text-xl font-bold mb-4">Voice & Tone</h2>
                        <p className="text-muted text-sm leading-relaxed mb-8">
                            Writing guidelines for consistent communication.
                        </p>
                        <div className="grid gap-6 md:grid-cols-2 mb-8">
                            <div className="p-6 border border-[var(--accent)]">
                                <h3 className="text-lg font-semibold mb-4 text-[var(--accent)]">Do</h3>
                                <ul className="space-y-3 text-sm text-muted">
                                    <li>• Direct, confident, no hedging</li>
                                    <li>• Builder-focused: emphasize what was shipped</li>
                                    <li>• Technical specificity: &quot;Grafana-style dashboard&quot;</li>
                                    <li>• First person where appropriate</li>
                                    <li>• Let the work speak for itself</li>
                                </ul>
                            </div>
                            <div className="p-6 border border-red-500/50">
                                <h3 className="text-lg font-semibold mb-4 text-red-400">Don&apos;t</h3>
                                <ul className="space-y-3 text-sm text-muted">
                                    <li>• Corporate fluff: &quot;leverage,&quot; &quot;synergy&quot;</li>
                                    <li>• Vague claims: &quot;cutting-edge solutions&quot;</li>
                                    <li>• Passive voice when active works</li>
                                    <li>• Overselling or exaggerating</li>
                                    <li>• Jargon without substance</li>
                                </ul>
                            </div>
                        </div>

                        <div className="p-6 border border-[var(--card-border)]">
                            <h3 className="text-lg font-semibold mb-4">Example</h3>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <div className="text-xs tracking-[0.2em] uppercase text-red-400 mb-2">Before</div>
                                    <p className="text-sm text-muted italic">&quot;Leveraging cutting-edge technologies to deliver world-class solutions that drive synergistic outcomes.&quot;</p>
                                </div>
                                <div>
                                    <div className="text-xs tracking-[0.2em] uppercase text-[var(--accent)] mb-2">After</div>
                                    <p className="text-sm text-muted">&quot;Built production-ready dashboard components. Shipped as embeddable HTML.&quot;</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

                <Footer />
            </PageContent>
        </main>
    );
}
