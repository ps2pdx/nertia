'use client';

import Image from 'next/image';
import ScrollSpyNav from '@/components/ScrollSpyNav';

export default function About() {
    const sections = [
        { id: 'what-nertia-does', label: 'What Nertia Does' },
        { id: 'how-it-works', label: 'How It Works' },
        { id: 'what-you-receive', label: 'What You Receive' },
        { id: 'about-nertia', label: 'About Nertia' },
    ];

    return (
        <>
            <ScrollSpyNav sections={sections} />

            {/* SECTION 1: WHAT NERTIA DOES */}
            <section id="what-nertia-does" className="w-full border-t border-[var(--card-border)] min-h-[90vh]">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Left column - Empty for sidebar alignment */}
                    <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-[var(--card-border)] p-8 pt-24 lg:p-12 lg:pt-24">
                        <div className="lg:sticky lg:top-24">
                            <span className="text-xs tracking-[0.2em] uppercase text-muted lg:hidden">What Nertia Does</span>
                        </div>
                    </div>

                    {/* Right column - Content */}
                    <div className="lg:col-span-9 p-8 pt-24 lg:p-12 lg:pt-24">
                        <div className="max-w-2xl">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 leading-tight">
                                WHAT NERTIA DOES
                            </h1>
                            <div className="space-y-6 text-muted leading-relaxed text-base sm:text-lg">
                                <p>
                                    Nertia builds positioning, brand systems, and technical execution for companies moving fast.
                                </p>
                                <p>
                                    We start with products nobody fully understands yet (AI infrastructure, developer tooling, complex SaaS) and turn them into compelling narratives. We design the identity systems that carry those narratives. We ship the web infrastructure and interactive components that bring them to life.
                                </p>
                                <p>
                                    The outcome: positioning, brand, and code that all move together.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: HOW IT WORKS */}
            <section id="how-it-works" className="w-full border-t border-[var(--card-border)] min-h-[90vh]">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Left column - Empty for sidebar alignment */}
                    <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-[var(--card-border)] p-8 pt-24 lg:p-12 lg:pt-24">
                        <div className="lg:sticky lg:top-24">
                            <span className="text-xs tracking-[0.2em] uppercase text-muted lg:hidden">How It Works</span>
                        </div>
                    </div>

                    {/* Right column - Content */}
                    <div className="lg:col-span-9 p-8 pt-24 lg:p-12 lg:pt-24">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-12">
                                HOW IT WORKS
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Steps as cards - matching services layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Left column - Empty for alignment */}
                    <div className="hidden lg:block lg:col-span-3 lg:border-r border-[var(--card-border)]"></div>

                    {/* Right column - Steps list */}
                    <div className="lg:col-span-9">
                        {/* Step 1 */}
                        <div className="p-8 lg:p-12 flex flex-col sm:flex-row gap-6 sm:gap-8 group border-b border-[var(--card-border)]">
                            {/* Number */}
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center text-[var(--foreground)] transition-colors group-hover:border-green-500">
                                    <span className="text-2xl font-bold">1</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h3 className="text-xl sm:text-2xl font-bold mb-3 uppercase tracking-tight">
                                    Understand the story.
                                </h3>
                                <p className="text-muted leading-relaxed max-w-xl">
                                    We map your product architecture, interview your buyers, reverse-engineer your competitors. We find the insight that makes you different.
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="p-8 lg:p-12 flex flex-col sm:flex-row gap-6 sm:gap-8 group border-b border-[var(--card-border)]">
                            {/* Number */}
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center text-[var(--foreground)] transition-colors group-hover:border-green-500">
                                    <span className="text-2xl font-bold">2</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h3 className="text-xl sm:text-2xl font-bold mb-3 uppercase tracking-tight">
                                    Shape the narrative.
                                </h3>
                                <p className="text-muted leading-relaxed max-w-xl">
                                    We craft a positioning framework and messaging strategy that resonates across your entire stakeholder ladder, from developers shipping code to VCs evaluating risk to enterprise procurement teams.
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="p-8 lg:p-12 flex flex-col sm:flex-row gap-6 sm:gap-8 group border-b border-[var(--card-border)]">
                            {/* Number */}
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center text-[var(--foreground)] transition-colors group-hover:border-green-500">
                                    <span className="text-2xl font-bold">3</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h3 className="text-xl sm:text-2xl font-bold mb-3 uppercase tracking-tight">
                                    Design the system.
                                </h3>
                                <p className="text-muted leading-relaxed max-w-xl">
                                    We build modular brand frameworks. Visual languages that scale. Design tokens and component libraries. Everything integrates into how you actually work.
                                </p>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="p-8 lg:p-12 flex flex-col sm:flex-row gap-6 sm:gap-8 group">
                            {/* Number */}
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center text-[var(--foreground)] transition-colors group-hover:border-green-500">
                                    <span className="text-2xl font-bold">4</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h3 className="text-xl sm:text-2xl font-bold mb-3 uppercase tracking-tight">
                                    Ship it.
                                </h3>
                                <p className="text-muted leading-relaxed max-w-xl">
                                    We don&apos;t hand off wireframes and wait. We architect and build. Website infrastructure. Sales enablement. Dashboard components. Whatever moves the narrative forward.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: WHAT YOU RECEIVE */}
            <section id="what-you-receive" className="w-full border-t border-[var(--card-border)] min-h-[90vh]">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Left column - Empty for sidebar alignment */}
                    <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-[var(--card-border)] p-8 pt-24 lg:p-12 lg:pt-24">
                        <div className="lg:sticky lg:top-24">
                            <span className="text-xs tracking-[0.2em] uppercase text-muted lg:hidden">What You Receive</span>
                        </div>
                    </div>

                    {/* Right column - Content */}
                    <div className="lg:col-span-9 p-8 pt-24 lg:p-12 lg:pt-24">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-12">
                                WHAT YOU RECEIVE
                            </h2>

                            {/* Deliverables list */}
                            <div className="space-y-8">
                                {/* Item 1 */}
                                <div>
                                    <h3 className="text-xl font-bold mb-2">
                                        Positioning framework &amp; messaging strategy
                                    </h3>
                                    <p className="text-muted leading-relaxed">
                                        Core narrative, vertical messaging, competitive positioning
                                    </p>
                                </div>

                                {/* Item 2 */}
                                <div>
                                    <h3 className="text-xl font-bold mb-2">
                                        Brand system
                                    </h3>
                                    <p className="text-muted leading-relaxed">
                                        Identity guidelines, design tokens, visual language, tone of voice
                                    </p>
                                </div>

                                {/* Item 3 */}
                                <div>
                                    <h3 className="text-xl font-bold mb-2">
                                        Sales &amp; GTM enablement
                                    </h3>
                                    <p className="text-muted leading-relaxed">
                                        Technical one-pagers, competitive battlecards, pitch deck strategy
                                    </p>
                                </div>

                                {/* Item 4 */}
                                <div>
                                    <h3 className="text-xl font-bold mb-2">
                                        Web infrastructure
                                    </h3>
                                    <p className="text-muted leading-relaxed">
                                        High-performance site, design system components, documentation
                                    </p>
                                </div>

                                {/* Item 5 */}
                                <div>
                                    <h3 className="text-xl font-bold mb-2">
                                        Strategic advisory
                                    </h3>
                                    <p className="text-muted leading-relaxed">
                                        Ongoing narrative refinement, GTM feedback, product-market fit guidance
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4: ABOUT NERTIA */}
            <section id="about-nertia" className="w-full border-t border-[var(--card-border)] min-h-[90vh]">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Left column - Empty for sidebar alignment */}
                    <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-[var(--card-border)] p-8 pt-24 lg:p-12 lg:pt-24">
                        <div className="lg:sticky lg:top-24">
                            <span className="text-xs tracking-[0.2em] uppercase text-muted lg:hidden">About Nertia</span>
                        </div>
                    </div>

                    {/* Right column - Content */}
                    <div className="lg:col-span-9 p-8 pt-24 lg:p-12 lg:pt-24 pb-32">
                        <div className="max-w-2xl">
                            {/* Avatar */}
                            <div className="mb-10">
                                <div
                                    className="relative w-40 h-40 sm:w-48 sm:h-48 overflow-hidden border border-[var(--card-border)] transition-colors hover:border-green-500"
                                    style={{ borderRadius: '300px' }}
                                >
                                    <Image
                                        src="/scott-campbell.png"
                                        alt="Scott Campbell"
                                        fill
                                        className="object-cover grayscale"
                                        sizes="(max-width: 768px) 160px, 192px"
                                    />
                                </div>
                            </div>

                            {/* Headline */}
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 leading-tight">
                                About Nertia
                            </h2>

                            {/* Body */}
                            <div className="space-y-6 text-muted leading-relaxed text-base sm:text-lg mb-10">
                                <p>
                                    Founded and led by Scott Campbell, a technical product marketer and builder specializing in AI infrastructure, brand strategy, and web architecture.
                                </p>
                                <p>
                                    Scott brings 10+ years of experience translating complex technical products into compelling positioning and design systems. He&apos;s worked across HPC cloud infrastructure (Vantage Compute), developer tooling, and B2B SaaS, maintaining hands-on ownership of strategy, design, and code across every engagement.
                                </p>
                                <p>
                                    The studio model ensures quality consistency and direct decision-making. No account management layers. No design-to-development handoff delays. You work directly with the founder who architected your positioning, designed your brand system, and built your web infrastructure.
                                </p>
                                <p>
                                    Currently available for technical product marketing roles and brand system engagements.
                                </p>
                            </div>

                            {/* CTAs */}
                            <div className="flex flex-wrap gap-6">
                                <a
                                    href="https://linkedin.com/in/scottsuper"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm tracking-wide hover:text-[var(--accent)] transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                    LinkedIn
                                </a>
                                <span className="text-[var(--card-border)]">|</span>
                                <a
                                    href="mailto:ps2pdx@gmail.com"
                                    className="flex items-center gap-2 text-sm tracking-wide hover:text-[var(--accent)] transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Email
                                </a>
                                <span className="text-[var(--card-border)]">|</span>
                                <a
                                    href="/resume"
                                    className="flex items-center gap-2 text-sm tracking-wide hover:text-[var(--accent)] transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    Resume
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
