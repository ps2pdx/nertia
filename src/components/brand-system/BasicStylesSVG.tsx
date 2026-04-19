'use client';

interface BasicStylesSVGProps {
    width?: number;
    height?: number;
    className?: string;
}

export default function BasicStylesSVG({
    width = 280,
    height = 320,
    className = ''
}: BasicStylesSVGProps) {
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
                01 BASIC STYLES
            </text>

            {/* Divider */}
            <line x1="24" y1="48" x2="256" y2="48" stroke="var(--card-border)" strokeWidth="1" />

            {/* Logo Section */}
            <text x="24" y="72" fill="var(--muted)" fontSize="9" fontFamily="monospace">
                Logo
            </text>
            {/* Triangle Logo */}
            <polygon
                points="56,115 80,155 32,155"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2"
            />
            {/* Wordmark placeholder bars */}
            <rect x="100" y="120" width="80" height="8" fill="var(--foreground)" />
            <rect x="100" y="135" width="56" height="5" fill="var(--muted)" opacity="0.4" />

            {/* Divider */}
            <line x1="24" y1="175" x2="256" y2="175" stroke="var(--card-border)" strokeWidth="1" />

            {/* Colors Section */}
            <text x="24" y="199" fill="var(--muted)" fontSize="9" fontFamily="monospace">
                Colors
            </text>
            {/* Primary */}
            <rect x="24" y="212" width="48" height="48" fill="var(--foreground)" />
            {/* Accent */}
            <rect x="82" y="212" width="48" height="48" fill="var(--accent)" />
            {/* Muted */}
            <rect x="140" y="212" width="48" height="48" fill="var(--muted)" />
            {/* Surface */}
            <rect x="198" y="212" width="48" height="48" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="1" />

            {/* Divider */}
            <line x1="24" y1="276" x2="256" y2="276" stroke="var(--card-border)" strokeWidth="1" />

            {/* Typography Section */}
            <text x="24" y="300" fill="var(--muted)" fontSize="9" fontFamily="monospace">
                Typography
            </text>
            <text x="100" y="300" fill="var(--foreground)" fontSize="18" fontWeight="bold" fontFamily="system-ui">
                Aa
            </text>
            <text x="132" y="300" fill="var(--foreground)" fontSize="13" fontFamily="monospace">
                Aa
            </text>
            <text x="160" y="300" fill="var(--muted)" fontSize="9" fontFamily="monospace" letterSpacing="0.12em">
                LABEL
            </text>
        </svg>
    );
}
