'use client';

import { useEffect, useState } from 'react';

interface Section {
    id: string;
    label: string;
}

interface ScrollSpyNavProps {
    sections: Section[];
}

export default function ScrollSpyNav({ sections }: ScrollSpyNavProps) {
    const [activeSection, setActiveSection] = useState(sections[0]?.id || '');

    useEffect(() => {
        const handleScroll = () => {
            // Header height is approximately 80px (including border)
            const headerHeight = 80;
            // Small tolerance to handle floating-point precision and smooth scroll positioning
            const tolerance = 1;

            // Find which section is currently visible below the header
            let currentSection = sections[0]?.id || '';

            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element) {
                    // Get the actual position relative to viewport
                    const rect = element.getBoundingClientRect();

                    // Section is active when its top is at or just below the header bottom
                    // Add tolerance to handle floating-point precision issues
                    if (rect.top <= headerHeight + tolerance) {
                        currentSection = section.id;
                    }
                }
            }

            setActiveSection(currentSection);
        };

        // Run on mount and scroll
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sections]);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            // Get the element's position and account for the PageContent wrapper padding
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            // Scroll so the section top aligns with header bottom (80px)
            window.scrollTo({ top: elementPosition - 80, behavior: 'smooth' });

            // Immediately set as active (will be confirmed by scroll handler)
            setActiveSection(id);
        }
    };

    return (
        <div className="hidden lg:block fixed left-12 top-24 z-40 w-48">
            <nav className="space-y-4 pt-24">
                {sections.map(({ id, label }) => (
                    <button
                        key={id}
                        onClick={() => scrollToSection(id)}
                        className={`block text-left text-xs tracking-[0.2em] uppercase transition-colors ${
                            activeSection === id
                                ? 'text-[var(--accent)]'
                                : 'text-muted hover:text-[var(--foreground)]'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </nav>
        </div>
    );
}
