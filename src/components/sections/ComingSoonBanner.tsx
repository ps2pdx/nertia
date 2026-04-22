import { ReactNode } from 'react';

interface ComingSoonBannerProps {
    /** Optional override for the default "Coming soon" eyebrow label */
    label?: string;
    /** Main message explaining what's in development */
    message?: ReactNode;
}

export default function ComingSoonBanner({
    label = 'Coming soon',
    message = "nertia's website generator is still in development.",
}: ComingSoonBannerProps) {
    return (
        <div className="w-full border-b border-[var(--card-border)] bg-[var(--card-bg)]">
            <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap items-center justify-center gap-3 text-center">
                <span className="text-xs tracking-[0.2em] uppercase text-[var(--accent)]">
                    {label}
                </span>
                <span className="text-xs text-muted hidden sm:inline">·</span>
                <span className="text-sm text-muted">{message}</span>
            </div>
        </div>
    );
}
