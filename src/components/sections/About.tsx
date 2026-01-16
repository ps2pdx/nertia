'use client';

import Image from 'next/image';
import PageSidebar, { SidebarSection } from '@/components/PageSidebar';
import BrandSystemFlow from '@/components/brand-system/BrandSystemFlow';
import ConveyorBelt from '@/components/brand-system/ConveyorBelt';
import { Caterpillar, FormingChrysalis, Chrysalis, ButterflyEmerging } from '@/components/brand-system/MetamorphosisIllustrations';
import Alert from '@/components/ui/Alert';

const sections: SidebarSection[] = [
    { id: 'what-nertia-does', label: 'What Nertia Does' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'what-you-receive', label: 'What You Receive' },
    { id: 'about-nertia', label: 'About Nertia' },
];

export default function About() {
    return (
        <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Sidebar */}
                <PageSidebar
                    sections={sections}
                    title="About"
                    description="Who we are and how we work."
                />

                {/* Content */}
                <div className="lg:col-span-9">
                    {/* SECTION 1: WHAT NERTIA DOES */}
                    <section id="what-nertia-does" className="p-8 lg:p-12 border-t border-[var(--card-border)]">
                        <div className="max-w-2xl">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 leading-tight">
                                WHAT NERTIA DOES
                            </h1>
                            <div className="space-y-6 text-muted leading-relaxed text-base sm:text-lg mb-10">
                                <p>
                                    Nertia builds positioning, brand systems, and technical execution for companies moving fast.
                                </p>
                                <p>
                                    We start with products nobody fully understands yet (AI infrastructure, developer tooling, complex SaaS) and turn them into compelling narratives. We design the identity systems that carry those narratives. We ship the web infrastructure and interactive components that bring them to life.
                                </p>
                            </div>

                            <Alert variant="accent" title="The Outcome">
                                <p className="mb-4">
                                    Positioning, brand, and code that all move together.
                                </p>
                                <a
                                    href="#"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white text-xs font-medium tracking-wide hover:bg-[var(--accent-hover)] transition-colors"
                                >
                                    Schedule a Call
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </a>
                            </Alert>
                        </div>

                        {/* Conveyor Belt Animation */}
                        <div className="-mx-8 lg:-mx-12 my-10">
                            <ConveyorBelt />
                        </div>
                    </section>

                    {/* SECTION 2: HOW IT WORKS */}
                    <section id="how-it-works" className="border-t border-[var(--card-border)] min-h-[90vh]">
                        <div className="p-8 lg:p-12">
                            <div className="max-w-2xl">
                                <h2 className="text-3xl sm:text-4xl font-bold mb-12">
                                    HOW IT WORKS
                                </h2>
                            </div>
                        </div>

                        {/* Steps */}
                        <div className="divide-y divide-[var(--card-border)]">
                            {/* Step 1 */}
                            <div className="p-8 lg:p-12 flex flex-col sm:flex-row gap-6 sm:gap-8 group">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 flex items-center justify-center text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                                        <Caterpillar className="w-16 h-16" />
                                    </div>
                                </div>
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
                            <div className="p-8 lg:p-12 flex flex-col sm:flex-row gap-6 sm:gap-8 group">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 flex items-center justify-center text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                                        <FormingChrysalis className="w-16 h-16" />
                                    </div>
                                </div>
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
                            <div className="p-8 lg:p-12 flex flex-col sm:flex-row gap-6 sm:gap-8 group">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 flex items-center justify-center text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                                        <Chrysalis className="w-16 h-16" />
                                    </div>
                                </div>
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
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 flex items-center justify-center text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                                        <ButterflyEmerging className="w-16 h-16" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl sm:text-2xl font-bold mb-3 uppercase tracking-tight">
                                        Ship it.
                                    </h3>
                                    <p className="text-muted leading-relaxed max-w-xl">
                                        We don&apos;t hand off wireframes and wait. We architect and build with React, Next.js, and Tailwind. Design tokens live in code. Brand updates are git commits, not dozens of file edits across disconnected tools.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 3: WHAT YOU RECEIVE */}
                    <section id="what-you-receive" className="p-8 lg:p-12 border-t border-[var(--card-border)] min-h-[90vh]">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-12">
                                WHAT YOU RECEIVE
                            </h2>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">
                                        Positioning framework &amp; messaging strategy
                                    </h3>
                                    <p className="text-muted leading-relaxed">
                                        Core narrative, vertical messaging, competitive positioning
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold mb-2">
                                        Brand system
                                    </h3>
                                    <p className="text-muted leading-relaxed mb-8">
                                        Identity guidelines, design tokens, visual language, tone of voice
                                    </p>
                                    <div className="-mx-8 lg:-mx-12">
                                        <BrandSystemFlow />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold mb-2">
                                        Web infrastructure
                                    </h3>
                                    <p className="text-muted leading-relaxed">
                                        High-performance site, design system components, documentation
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold mb-2">
                                        Sales &amp; GTM enablement
                                    </h3>
                                    <p className="text-muted leading-relaxed">
                                        Technical one-pagers, competitive battlecards, pitch deck strategy
                                    </p>
                                </div>

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
                    </section>

                    {/* SECTION 4: ABOUT NERTIA */}
                    <section id="about-nertia" className="p-8 lg:p-12 pb-32 border-t border-[var(--card-border)] min-h-[90vh]">
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

                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 leading-tight">
                                About Nertia
                            </h2>

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
                    </section>
                </div>
            </div>
        </div>
    );
}
