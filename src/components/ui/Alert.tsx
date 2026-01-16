'use client';

import { ReactNode } from 'react';

type AlertVariant = 'default' | 'accent' | 'muted';

interface AlertProps {
    children: ReactNode;
    variant?: AlertVariant;
    title?: string;
    className?: string;
}

const variantStyles: Record<AlertVariant, { border: string; title: string }> = {
    default: {
        border: 'border-l-[var(--foreground)]',
        title: 'text-[var(--foreground)]',
    },
    accent: {
        border: 'border-l-[var(--accent)]',
        title: 'text-[var(--accent)]',
    },
    muted: {
        border: 'border-l-[var(--muted)]',
        title: 'text-muted',
    },
};

export default function Alert({
    children,
    variant = 'default',
    title,
    className = '',
}: AlertProps) {
    const styles = variantStyles[variant];

    return (
        <div
            className={`border border-[var(--card-border)] border-l-2 ${styles.border} p-6 ${className}`}
        >
            {title && (
                <div className={`text-xs tracking-[0.2em] uppercase mb-3 ${styles.title}`}>
                    {title}
                </div>
            )}
            <div className="text-muted leading-relaxed text-sm">
                {children}
            </div>
        </div>
    );
}
