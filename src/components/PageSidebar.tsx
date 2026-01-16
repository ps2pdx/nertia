'use client';

import { useEffect, useState } from 'react';

export interface SidebarSection {
    id: string;
    label: string;
}

interface PageSidebarProps {
    sections: SidebarSection[];
    title?: string;
    description?: string;
}

export default function PageSidebar({ sections, title, description }: PageSidebarProps) {
    const [activeSection, setActiveSection] = useState(sections[0]?.id || '');
    const [showMobileNav, setShowMobileNav] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const headerHeight = 80;
            const tolerance = 1;

            let currentSection = sections[0]?.id || '';

            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= headerHeight + tolerance) {
                        currentSection = section.id;
                    }
                }
            }

            setActiveSection(currentSection);

            // Show mobile nav after scrolling past 200px
            setShowMobileNav(window.scrollY > 200);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sections]);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: elementPosition - 80, behavior: 'smooth' });
            setActiveSection(id);
        }
    };

    return (
        <>
            {/* Sticky mobile nav */}
            <div
                className={`fixed top-16 left-0 right-0 z-40 bg-[var(--background)] border-b border-[var(--card-border)] lg:hidden transition-transform duration-300 ${
                    showMobileNav ? 'translate-y-0' : '-translate-y-full'
                }`}
            >
                <nav className="flex overflow-x-auto gap-1 px-4 py-2 scrollbar-hide">
                    {sections.map((section, index) => (
                        <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 text-xs font-medium transition-all duration-300 border ${
                                activeSection === section.id
                                    ? 'border-[var(--accent)] text-[var(--accent)]'
                                    : 'bg-transparent border-[var(--card-border)] text-muted'
                            }`}
                        >
                            <span className="tracking-[0.1em] uppercase">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="whitespace-nowrap">{section.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Original sidebar */}
            <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-[var(--card-border)] p-8 lg:p-12">
                <div className="lg:sticky lg:top-24">
                    {title && (
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                            {title}
                        </h2>
                    )}
                    {description && (
                        <p className="text-muted text-sm leading-relaxed mb-8">
                            {description}
                        </p>
                    )}

                    {/* Navigation links */}
                    <nav className="flex flex-wrap lg:flex-col gap-2">
                        {sections.map((section, index) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`flex items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-all duration-300 border ${
                                    activeSection === section.id
                                        ? 'border-[var(--accent)] text-[var(--accent)]'
                                        : 'bg-transparent border-[var(--card-border)] text-muted hover:text-[var(--foreground)] hover:border-[var(--foreground)]'
                                }`}
                            >
                                <span className="text-xs tracking-[0.2em] uppercase">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <span>{section.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
        </>
    );
}
