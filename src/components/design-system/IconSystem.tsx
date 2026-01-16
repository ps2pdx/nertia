'use client';

import { useState } from 'react';

// Icon component that renders all icons
const Icon = ({ name, className = '' }: { name: string; className?: string }) => {
    const baseClass = `w-6 h-6 ${className}`;

    const icons: Record<string, JSX.Element> = {
        // Brand Input Icons (from ConveyorBelt)
        logo: (
            <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="12,4 22,20 2,20" />
            </svg>
        ),
        colors: (
            <svg className={baseClass} viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" opacity="0.6" />
                <rect x="3" y="14" width="7" height="7" rx="1" opacity="0.4" />
                <rect x="14" y="14" width="7" height="7" rx="1" opacity="0.2" />
            </svg>
        ),
        typography: (
            <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 18L8 6h2l4 12" />
                <path d="M5 14h6" />
                <path d="M15 18l2.5-6h1l2.5 6" />
                <path d="M15.5 15h4" />
            </svg>
        ),
        voice: (
            <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 4v16" />
                <path d="M8 8v8" />
                <path d="M16 8v8" />
                <path d="M4 10v4" />
                <path d="M20 10v4" />
            </svg>
        ),

        // Navigation & UI
        arrowRight: (
            <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
        ),
        arrowLeft: (
            <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        ),
        arrowUp: (
            <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
        ),
        arrowDown: (
            <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
        ),
        menu: (
            <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        ),
        close: (
            <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 6l12 12M6 18L18 6" />
            </svg>
        ),
        check: (
            <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12l5 5L20 7" />
            </svg>
        ),
        plus: (
            <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 5v14M5 12h14" />
            </svg>
        ),

        // Content & Documents
        document: (
            <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        code: (
            <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
            </svg>
        ),
        grid: (
            <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
        ),
        layers: (
            <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
            </svg>
        ),

        // Communication
        mail: (
            <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
        calendar: (
            <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
        ),
        link: (
            <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
        ),
        external: (
            <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
        ),

        // Status & Feedback
        info: (
            <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
            </svg>
        ),
        warning: (
            <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
        ),
        success: (
            <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M9 12l2 2 4-4" />
            </svg>
        ),
        error: (
            <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M15 9l-6 6M9 9l6 6" />
            </svg>
        ),
    };

    return icons[name] || null;
};

// Export the Icon component for use elsewhere
export { Icon };

// All available icon names
const iconCategories = [
    {
        name: 'Brand Inputs',
        icons: ['logo', 'colors', 'typography', 'voice'],
    },
    {
        name: 'Navigation',
        icons: ['arrowRight', 'arrowLeft', 'arrowUp', 'arrowDown', 'menu', 'close', 'check', 'plus'],
    },
    {
        name: 'Content',
        icons: ['document', 'code', 'grid', 'layers'],
    },
    {
        name: 'Communication',
        icons: ['mail', 'calendar', 'link', 'external'],
    },
    {
        name: 'Status',
        icons: ['info', 'warning', 'success', 'error'],
    },
];

export default function IconSystem() {
    const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

    const copyToClipboard = (iconName: string) => {
        navigator.clipboard.writeText(`<Icon name="${iconName}" />`);
        setCopiedIcon(iconName);
        setTimeout(() => setCopiedIcon(null), 2000);
    };

    return (
        <div className="space-y-8">
            {iconCategories.map((category) => (
                <div key={category.name}>
                    <h4 className="text-sm font-medium text-muted mb-4">{category.name}</h4>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                        {category.icons.map((iconName) => (
                            <button
                                key={iconName}
                                onClick={() => copyToClipboard(iconName)}
                                className="group relative border border-[var(--card-border)] p-4 flex flex-col items-center gap-2 hover:border-[var(--accent)] transition-colors"
                                title={`Click to copy: ${iconName}`}
                            >
                                <Icon name={iconName} className="text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors" />
                                <span className="text-[10px] text-muted truncate w-full text-center">
                                    {copiedIcon === iconName ? 'Copied!' : iconName}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            <div className="mt-6 p-4 border border-[var(--card-border)] bg-[var(--card-bg)]">
                <p className="text-sm text-muted mb-2">Usage:</p>
                <code className="text-xs text-[var(--accent)]">
                    {`import { Icon } from '@/components/design-system/IconSystem';`}
                    <br />
                    {`<Icon name="logo" className="w-6 h-6" />`}
                </code>
            </div>
        </div>
    );
}
