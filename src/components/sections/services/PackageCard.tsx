import Link from 'next/link';

export type AccentTone = 'default' | 'highlight';

export interface PackageCardProps {
    name: string;
    price: string;
    audience: string;
    timeline: string;
    deliverables: string[];
    eventSlug: 'particle' | 'wave' | 'entanglement';
    ctaLabel: string;
    accentTone?: AccentTone;
}

export default function PackageCard({
    name,
    price,
    audience,
    timeline,
    deliverables,
    eventSlug,
    ctaLabel,
    accentTone = 'default',
}: PackageCardProps) {
    const isHighlight = accentTone === 'highlight';
    return (
        <div
            className={`flex flex-col gap-6 p-8 bg-[var(--card-bg)] border rounded-2xl transition-colors ${
                isHighlight
                    ? 'border-[var(--accent)]'
                    : 'border-[var(--card-border)] hover:border-[var(--accent)]'
            }`}
        >
            <div className="flex items-baseline justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">
                    {name}
                </p>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted border border-[var(--card-border)] px-2 py-1 rounded-full">
                    {timeline}
                </span>
            </div>

            <p
                className="text-4xl font-bold"
                style={{
                    fontFamily: 'var(--font-heading)',
                }}
            >
                {price}
            </p>

            <p className="text-sm text-muted leading-relaxed italic">
                &ldquo;{audience}&rdquo;
            </p>

            <ul className="flex flex-col gap-2 flex-1">
                {deliverables.map((item) => (
                    <li
                        key={item}
                        className="flex items-start gap-3 text-sm leading-relaxed"
                    >
                        <span
                            className="mt-1.5 w-1 h-1 rounded-full bg-[var(--accent)] flex-shrink-0"
                            aria-hidden
                        />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>

            <Link
                href={`/book?event=${eventSlug}`}
                className="mt-auto inline-flex items-center justify-center gap-2 border border-[var(--accent)] text-[var(--accent)] px-4 py-3 text-xs uppercase tracking-[0.2em] hover:bg-[var(--accent)] hover:text-white transition-colors"
            >
                {ctaLabel}
                <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                </svg>
            </Link>
        </div>
    );
}
