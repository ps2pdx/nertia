export default function Services() {
    const services = [
        {
            id: 'product-positioning',
            title: 'Product Positioning & Messaging',
            description:
                'Technical narrative architecture that resonates across your stakeholder ladder. We map your product\'s unique story, from architecture to buyer pain points, and craft messaging frameworks that work for developers, prospects, and VCs alike.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            ),
        },
        {
            id: 'brand-systems',
            title: 'Brand Systems & Identity',
            description:
                'Modular brand frameworks that scale. Logo, visual language, design tokens, tone of voice, all architected as living systems that integrate into your actual workflows. Not static PDFs. Systems that ship.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                    />
                </svg>
            ),
        },
        {
            id: 'gtm-strategy',
            title: 'GTM Strategy & Sales Enablement',
            description:
                'Competitive intelligence, positioning battlecards, technical one-pagers, and pitch deck strategy. We arm your team with the narratives and assets needed to close deals and navigate complex buyer conversations.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                </svg>
            ),
        },
        {
            id: 'technical-content',
            title: 'Technical Content & Thought Leadership',
            description:
                'Whitepapers, technical case studies, blog strategy, and SEO/GEO content architecture. We translate your product\'s complexity into educational content that builds authority and captures demand.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                </svg>
            ),
        },
        {
            id: 'web-development',
            title: 'Web Development & Design Systems',
            description:
                'Production-ready Webflow builds, custom components, and design system documentation. Everything is responsive, cross-browser tested, and optimized for performance. We write the code ourselves.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                </svg>
            ),
        },
        {
            id: 'executive-advisory',
            title: 'Executive Advisory & Strategy',
            description:
                'Ongoing guidance on product positioning, GTM sequencing, and narrative alignment. From founder coaching to executive advisory, we act as a strategic sounding board for technical and go-to-market decisions.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                </svg>
            ),
        },
        {
            id: 'dashboard-development',
            title: 'Dashboard & Component Development',
            description:
                'Custom interactive visualizations, embedded components, and data-driven UI. Grafana-style dashboards, analytics interfaces, real-time monitoring tools built to specification and shipped production-ready.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                </svg>
            ),
        },
    ];

    return (
        <>
            {/* Services Grid */}
            <div className="w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Left column - Empty for alignment */}
                    <div className="hidden lg:block lg:col-span-3 lg:border-r border-[var(--card-border)]"></div>

                    {/* Right column - Services list */}
                    <div className="lg:col-span-9">
                        {services.map((service) => (
                            <section
                                key={service.id}
                                id={service.id}
                                className="p-8 lg:p-12 flex flex-col sm:flex-row gap-6 sm:gap-8 group border-t border-[var(--card-border)] min-h-[90vh]"
                            >
                                {/* Icon */}
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center text-[var(--foreground)] transition-colors group-hover:border-green-500">
                                        {service.icon}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className="text-xl sm:text-2xl font-bold mb-3 uppercase tracking-tight">
                                        {service.title}
                                    </h3>
                                    <p className="text-muted leading-relaxed max-w-xl">
                                        {service.description}
                                    </p>
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
