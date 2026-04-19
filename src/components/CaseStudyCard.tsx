'use client';

import { useState } from 'react';

interface CaseStudyCardProps {
    title: string;
    subtitle: string;
    tags: string[];
    description: string;
    fullContent?: React.ReactNode;
    ctaText?: string;
    ctaHref?: string;
    isExternal?: boolean;
}

export default function CaseStudyCard({
    title,
    subtitle,
    tags,
    description,
    fullContent,
    ctaText,
    ctaHref,
    isExternal = false,
}: CaseStudyCardProps) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="card">
            {/* Header */}
            <div className="mb-4">
                <h3 className="text-2xl font-bold mb-1">{title}</h3>
                <p className="text-muted">{subtitle}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag) => (
                    <span key={tag} className="tag">
                        {tag}
                    </span>
                ))}
            </div>

            {/* Description */}
            <p className="text-muted mb-4 leading-relaxed">{description}</p>

            {/* Expandable Content */}
            {fullContent && (
                <>
                    <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${expanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                    >
                        <div className="pt-4 border-t border-[var(--card-border)]">
                            {fullContent}
                        </div>
                    </div>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="mt-4 text-[var(--accent)] hover:underline font-medium"
                    >
                        {expanded ? 'Show Less' : 'Read More'}
                    </button>
                </>
            )}

            {/* CTA */}
            {ctaText && ctaHref && (
                <div className="mt-6">
                    <a
                        href={ctaHref}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className="btn-secondary"
                    >
                        {ctaText}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                        </svg>
                    </a>
                </div>
            )}
        </div>
    );
}
