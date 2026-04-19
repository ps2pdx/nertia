'use client';

interface ComponentsSVGProps {
    width?: number;
    height?: number;
    className?: string;
}

export default function ComponentsSVG({
    width = 280,
    height = 320,
    className = ''
}: ComponentsSVGProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 280 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Border */}
            <rect x="0.5" y="0.5" width="279" height="319" stroke="var(--card-border)" strokeWidth="1" fill="var(--background)" />

            {/* Header Label */}
            <text x="24" y="32" fill="var(--muted)" fontSize="10" fontFamily="monospace" letterSpacing="0.2em">
                02 COMPONENTS
            </text>

            {/* Divider */}
            <line x1="24" y1="48" x2="256" y2="48" stroke="var(--card-border)" strokeWidth="1" />

            {/* Buttons Section */}
            <text x="24" y="72" fill="var(--muted)" fontSize="9" fontFamily="monospace">
                Buttons
            </text>
            {/* Primary Button */}
            <rect x="24" y="88" width="72" height="28" fill="var(--accent)" />
            <text x="40" y="106" fill="white" fontSize="9" fontFamily="monospace">Primary</text>
            {/* Secondary Button */}
            <rect x="104" y="88" width="72" height="28" fill="none" stroke="var(--card-border)" strokeWidth="1" />
            <text x="112" y="106" fill="var(--foreground)" fontSize="9" fontFamily="monospace">Secondary</text>
            {/* Text Link */}
            <text x="188" y="106" fill="var(--muted)" fontSize="9" fontFamily="monospace">Link →</text>

            {/* Divider */}
            <line x1="24" y1="132" x2="256" y2="132" stroke="var(--card-border)" strokeWidth="1" />

            {/* Cards Section */}
            <text x="24" y="156" fill="var(--muted)" fontSize="9" fontFamily="monospace">
                Cards
            </text>
            {/* Card */}
            <rect x="24" y="172" width="160" height="64" fill="none" stroke="var(--card-border)" strokeWidth="1" />
            {/* Icon placeholder */}
            <rect x="36" y="184" width="20" height="20" fill="none" stroke="var(--card-border)" strokeWidth="1" />
            <rect x="42" y="190" width="8" height="8" fill="var(--muted)" />
            {/* Title bar */}
            <rect x="68" y="186" width="64" height="6" fill="var(--foreground)" />
            {/* Description bars */}
            <rect x="68" y="198" width="100" height="4" fill="var(--muted)" opacity="0.3" />
            <rect x="68" y="206" width="80" height="4" fill="var(--muted)" opacity="0.3" />

            {/* Divider */}
            <line x1="24" y1="252" x2="256" y2="252" stroke="var(--card-border)" strokeWidth="1" />

            {/* Forms Section */}
            <text x="24" y="276" fill="var(--muted)" fontSize="9" fontFamily="monospace">
                Forms
            </text>
            {/* Input */}
            <rect x="24" y="288" width="120" height="24" fill="none" stroke="var(--card-border)" strokeWidth="1" />
            <text x="32" y="304" fill="var(--muted)" fontSize="8" fontFamily="monospace">Input...</text>
            {/* Tags */}
            <rect x="156" y="288" width="32" height="18" fill="none" stroke="var(--card-border)" strokeWidth="1" />
            <text x="163" y="300" fill="var(--muted)" fontSize="7" fontFamily="monospace">Tag</text>
            <rect x="194" y="288" width="40" height="18" fill="none" stroke="var(--accent)" strokeWidth="1" />
            <text x="200" y="300" fill="var(--accent)" fontSize="7" fontFamily="monospace">Active</text>
        </svg>
    );
}
