'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Project {
    id: string;
    title: string;
    subtitle: string;
    tags: string[];
    description: string;
    fullContent: React.ReactNode;
    ctaText?: string;
    ctaHref?: string;
    isExternal?: boolean;
}

const VantageFullContent = () => (
    <div className="space-y-8">
        <div>
            <h4 className="text-xl font-semibold mb-3">Context</h4>
            <p className="text-muted leading-relaxed">
                Series A HPC cloud provider offering GPU compute for AI/ML, simulation, and life sciences workloads. Needed to articulate a deeply technical platform in a way that resonated across the stakeholder ladder, and ship a web presence to support fundraising on a compressed timeline.
            </p>
        </div>

        <div>
            <h4 className="text-xl font-semibold mb-3">The Challenge</h4>
            <p className="text-muted leading-relaxed">
                Vantage had powerful infrastructure but no unified story. The platform capabilities—Slurm-native orchestration, multi-cloud GPU provisioning, enterprise compliance—needed to translate from engineering specs into buyer value. They also needed a site that could support Series A conversations within 3 months.
            </p>
        </div>

        <div>
            <h4 className="text-xl font-semibold mb-3">What I Did</h4>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="card">
                    <svg className="w-6 h-6 text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h5 className="font-semibold mb-3">Positioning & Messaging</h5>
                    <ul className="list-disc list-inside text-muted space-y-2">
                        <li>Architected core narrative: &quot;The Future Compute Layer for AI and HPC&quot;</li>
                        <li>Defined vertical-specific messaging for R&D, Simulation, Advanced Manufacturing, and Life Sciences</li>
                        <li>Translated infrastructure capabilities into buyer-centric value propositions</li>
                        <li>Created and trademarked &quot;Virtually Limitless™&quot; tagline</li>
                    </ul>
                </div>

                <div className="card">
                    <svg className="w-6 h-6 text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h5 className="font-semibold mb-3">Executive Advisory</h5>
                    <ul className="list-disc list-inside text-muted space-y-2">
                        <li>Strategic advisor to CEO on product roadmap articulation and GTM sequencing</li>
                        <li>Connective layer between engineering, sales, and leadership for narrative alignment</li>
                        <li>Supported Series A fundraising positioning</li>
                    </ul>
                </div>

                <div className="card">
                    <svg className="w-6 h-6 text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    <h5 className="font-semibold mb-3">Brand & Web</h5>
                    <ul className="list-disc list-inside text-muted space-y-2">
                        <li>Delivered site launch in 3 months to support fundraising</li>
                        <li>Led ground-up redesign and Webflow migration</li>
                        <li>Built scalable design system with component library</li>
                        <li>Created and trademarked &quot;Virtually Limitless™&quot; tagline</li>
                        <li>Developed brand voice guidelines and messaging framework</li>
                    </ul>
                </div>

                <div className="card">
                    <svg className="w-6 h-6 text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <h5 className="font-semibold mb-3">Technical Execution</h5>
                    <ul className="list-disc list-inside text-muted space-y-2">
                        <li>Built production-ready Grafana-style dashboard components (gauges, time series, bar charts)</li>
                        <li>Pixel-accurate, responsive, cross-browser tested—shipped as embeddable HTML</li>
                        <li>Created custom Lottie animations and infographics visualizing hybrid compute architectures</li>
                    </ul>
                </div>
            </div>
        </div>

        <div>
            <h4 className="text-xl font-semibold mb-3">The Outcome</h4>
            <p className="text-muted leading-relaxed">
                A unified technical and brand narrative that enabled sales to close enterprise accounts
                and supported successful Series A positioning.
            </p>
        </div>

        {/* Image Gallery - Chronological Story */}
        <div className="mt-8">
            <h4 className="text-xl font-semibold mb-12">Work Samples</h4>
            <div className="space-y-24">
                {/* Phase 1: Initial Brand Direction */}
                <div>
                    <div className="relative aspect-video border border-[var(--card-border)] overflow-hidden mb-8">
                        <Image
                            src="/Vantage 2.0.jpg"
                            alt="Vantage - High Performance Computing, Evolved"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex items-start gap-4">
                        <span className="text-xs tracking-[0.2em] uppercase text-muted flex-shrink-0">01</span>
                        <div>
                            <h5 className="font-semibold mb-1">Initial Brand Direction</h5>
                            <p className="text-sm text-muted">Early exploration establishing the teal accent and &quot;High Performance Computing, Evolved&quot; positioning. Set the visual foundation for the technical-yet-approachable brand direction.</p>
                        </div>
                    </div>
                </div>

                {/* Phase 2: Brand Refinement */}
                <div>
                    <div className="relative aspect-video border border-[var(--card-border)] overflow-hidden mb-8">
                        <Image
                            src="/Vantage 3.0.jpg"
                            alt="Vantage - Virtually Limitless branding"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex items-start gap-4">
                        <span className="text-xs tracking-[0.2em] uppercase text-muted flex-shrink-0">02</span>
                        <div>
                            <h5 className="font-semibold mb-1">Brand Refinement</h5>
                            <p className="text-sm text-muted">Introduction of &quot;Virtually Limitless™&quot; tagline and partner logo integration. The 3D geometric elements reinforce the compute-as-infrastructure narrative.</p>
                        </div>
                    </div>
                </div>

                {/* Phase 3: Final Launch */}
                <div>
                    <div className="relative aspect-video border border-[var(--card-border)] overflow-hidden mb-8">
                        <Image
                            src="/Vantage 4.0.jpg"
                            alt="Vantage - The Future Compute Layer dashboard UI"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex items-start gap-4">
                        <span className="text-xs tracking-[0.2em] uppercase text-muted flex-shrink-0">03</span>
                        <div>
                            <h5 className="font-semibold mb-1">Final Launch Design</h5>
                            <p className="text-sm text-muted">&quot;The Future Compute Layer&quot; hero with production dashboard UI. The dashboard components I built are showcased directly in the marketing site—bridging product and brand.</p>
                        </div>
                    </div>
                </div>

                {/* Phase 4: Technical Documentation */}
                <div>
                    <div className="relative aspect-video border border-[var(--card-border)] overflow-hidden mb-8">
                        <Image
                            src="/Vantage Case Study Image.jpg"
                            alt="Vantage platform architecture diagram"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex items-start gap-4">
                        <span className="text-xs tracking-[0.2em] uppercase text-muted flex-shrink-0">04</span>
                        <div>
                            <h5 className="font-semibold mb-1">Platform Architecture</h5>
                            <p className="text-sm text-muted">Technical architecture diagram showing the full stack—from NVIDIA hardware through IaaS, orchestration, and inference layers. Created to help enterprise buyers understand the platform depth.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const LillardFullContent = () => (
    <div className="space-y-8">
        <div>
            <h4 className="text-xl font-semibold mb-3">Context</h4>
            <p className="text-muted leading-relaxed">
                The Lillard Foundation empowers youth through sports, education, and community engagement programs. They needed a brand system that could scale across applications while maintaining consistency for various stakeholders and partners.
            </p>
        </div>

        <div>
            <h4 className="text-xl font-semibold mb-3">The Challenge</h4>
            <p className="text-muted leading-relaxed">
                The foundation&apos;s visual identity was inconsistent across touchpoints. They needed a comprehensive styleguide that internal teams and external partners could actually use—not a PDF that sits in a folder.
            </p>
        </div>

        <div>
            <h4 className="text-xl font-semibold mb-3">What I Delivered</h4>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="card">
                    <svg className="w-6 h-6 text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                    <h5 className="font-semibold mb-3">Design System</h5>
                    <ul className="list-disc list-inside text-muted space-y-2">
                        <li>Complete typography scale and usage guidelines</li>
                        <li>Color system with accessibility considerations</li>
                        <li>Component specifications for digital and print</li>
                        <li>Spacing and layout principles</li>
                    </ul>
                </div>

                <div className="card">
                    <svg className="w-6 h-6 text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h5 className="font-semibold mb-3">Brand Guidelines</h5>
                    <ul className="list-disc list-inside text-muted space-y-2">
                        <li>Logo usage and clear space rules</li>
                        <li>Photography and imagery direction</li>
                        <li>Voice and tone guidelines</li>
                        <li>Application examples across contexts</li>
                    </ul>
                </div>
            </div>
        </div>

        <div>
            <h4 className="text-xl font-semibold mb-3">The Outcome</h4>
            <p className="text-muted leading-relaxed">
                A living design system that enables consistent brand application across the foundation&apos;s programs and partnerships.
            </p>
        </div>
    </div>
);

const BattlezoneFullContent = () => (
    <div className="space-y-8">
        <div>
            <h4 className="text-xl font-semibold mb-3">Context</h4>
            <p className="text-muted leading-relaxed">
                A technical portfolio piece. Built to test what I could ship solo using modern web technologies—and because I wanted to rebuild a game I played in elementary school.
            </p>
        </div>

        <div>
            <h4 className="text-xl font-semibold mb-3">Technical Stack</h4>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="card">
                    <svg className="w-6 h-6 text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <h5 className="font-semibold mb-3">Frontend</h5>
                    <ul className="list-disc list-inside text-muted space-y-2">
                        <li>Three.js for 3D rendering and WebGL</li>
                        <li>Custom game loop and physics engine</li>
                        <li>Responsive canvas scaling</li>
                        <li>Keyboard and mouse input handling</li>
                    </ul>
                </div>

                <div className="card">
                    <svg className="w-6 h-6 text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                    <h5 className="font-semibold mb-3">Backend</h5>
                    <ul className="list-disc list-inside text-muted space-y-2">
                        <li>Firebase Realtime Database for multiplayer sync</li>
                        <li>Real-time player position updates</li>
                        <li>Score tracking and leaderboards</li>
                        <li>Player count and session management</li>
                    </ul>
                </div>
            </div>
        </div>

        <div>
            <h4 className="text-xl font-semibold mb-3">Why It Exists</h4>
            <p className="text-muted leading-relaxed">
                Most marketers talk about technical products. I wanted to prove I can build them. This is ~2,000 lines of JavaScript handling real-time state sync, collision detection, and 3D rendering—all running in a browser.
            </p>
        </div>

        {/* Screenshots */}
        <div>
            <h4 className="text-xl font-semibold mb-3">Screenshots</h4>
            <div className="grid gap-4 md:grid-cols-2">
                <div className="relative aspect-video border border-[var(--card-border)] overflow-hidden">
                    <Image
                        src="/Battlezone gameplay screenshot.png"
                        alt="Battlezone multiplayer gameplay with chat, minimap, and powerups"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="relative aspect-video border border-[var(--card-border)] overflow-hidden">
                    <Image
                        src="/Battlezone login screenshot.png"
                        alt="Battlezone login screen"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>
        </div>
    </div>
);

const projects: Project[] = [
    {
        id: 'vantage',
        title: 'Vantage Compute',
        subtitle: 'Technical Positioning & Brand System',
        tags: ['AI Infrastructure', 'GPU Cloud', 'Series A', 'Webflow'],
        description: 'Led positioning, brand strategy, and web development for a Series A HPC cloud provider. Translated complex GPU infrastructure—Slurm orchestration, NVIDIA lifecycles, hybrid cloud architecture—into narratives that landed with developers, enterprise buyers, and investors.',
        fullContent: <VantageFullContent />,
        ctaText: 'Visit Site',
        ctaHref: 'https://www.vantagecompute.ai',
        isExternal: true,
    },
    {
        id: 'lillard',
        title: 'The Lillard Foundation',
        subtitle: 'Brand Styleguide & Design System',
        tags: ['Nonprofit', 'Figma', 'Design System', 'Youth Sports'],
        description: 'Developed a comprehensive brand styleguide for a youth-focused nonprofit. Delivered a scalable design system with typography, color, and component specifications that works across digital and print.',
        fullContent: <LillardFullContent />,
        ctaText: 'View Styleguide',
        ctaHref: 'https://lillard.nertia.ai',
        isExternal: true,
    },
    {
        id: 'battlezone',
        title: 'Battlezone',
        subtitle: 'Multiplayer WebGL Game',
        tags: ['Three.js', 'Firebase', 'Real-time', 'WebGL'],
        description: 'A WebGL experiment in real-time multiplayer architecture. Some portfolio pieces prove you understand positioning. This one proves I can code.',
        fullContent: <BattlezoneFullContent />,
        ctaText: 'Play it',
        ctaHref: 'https://battlezone.app',
        isExternal: true,
    },
];

export default function Work() {
    const [activeTab, setActiveTab] = useState(projects[0].id);
    const activeProject = projects.find((p) => p.id === activeTab)!;

    return (
        <section id="work" className="w-full border-t border-[var(--card-border)] min-h-[90vh]">
            {/* Full-width grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12">

                {/* Left column - Section label & tabs */}
                <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-[var(--card-border)] p-8 lg:p-12">
                    <div className="lg:sticky lg:top-24">
                        <span className="text-xs tracking-[0.2em] uppercase text-muted">Work</span>
                        <h2 className="text-2xl sm:text-3xl font-bold mt-4 mb-4">
                            Selected Projects
                        </h2>
                        <p className="text-muted text-sm leading-relaxed mb-8">
                            Positioning, brand systems, and production code.
                        </p>

                        {/* Tabs - Vertical on desktop */}
                        <div className="flex flex-wrap lg:flex-col gap-2">
                            {projects.map((project) => (
                                <button
                                    key={project.id}
                                    onClick={() => setActiveTab(project.id)}
                                    className={`px-4 py-3 text-left text-sm font-medium transition-all duration-300 border ${activeTab === project.id
                                            ? 'border-[var(--accent)] text-[var(--accent)]'
                                            : 'bg-transparent border-[var(--card-border)] text-muted hover:text-[var(--foreground)] hover:border-[var(--foreground)]'
                                        }`}
                                >
                                    {project.title}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right column - Active project content */}
                <div className="lg:col-span-9">
                    {/* Project Header */}
                    <div className="p-8 lg:p-12 border-b border-[var(--card-border)]">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                            <div>
                                <h3 className="text-2xl sm:text-3xl font-bold mb-2">{activeProject.title}</h3>
                                <p className="text-lg text-muted mb-4">{activeProject.subtitle}</p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                    {activeProject.tags.map((tag) => (
                                        <span key={tag} className="text-xs tracking-wide px-3 py-1 border border-[var(--card-border)] text-muted">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* CTA */}
                            {activeProject.ctaText && activeProject.ctaHref && (
                                <a
                                    href={activeProject.ctaHref}
                                    target={activeProject.isExternal ? '_blank' : undefined}
                                    rel={activeProject.isExternal ? 'noopener noreferrer' : undefined}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-medium text-sm tracking-wide hover:bg-green-400 transition-colors flex-shrink-0"
                                >
                                    {activeProject.ctaText}
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d={activeProject.isExternal ? "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" : "M14 5l7 7m0 0l-7 7m7-7H3"}
                                        />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Project Description */}
                    <div className="p-8 lg:p-12 border-b border-[var(--card-border)]">
                        <p className="text-muted leading-relaxed max-w-2xl">{activeProject.description}</p>
                    </div>

                    {/* Full Content */}
                    <div className="p-8 lg:p-12">
                        {activeProject.fullContent}
                    </div>
                </div>
            </div>
        </section>
    );
}
