'use client';

interface MessagingSVGProps {
    width?: number;
    height?: number;
    className?: string;
}

export default function MessagingSVG({
    width = 280,
    height = 320,
    className = ''
}: MessagingSVGProps) {
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
                03 MESSAGING
            </text>

            {/* Divider */}
            <line x1="24" y1="48" x2="256" y2="48" stroke="var(--card-border)" strokeWidth="1" />

            {/* Positioning Section */}
            <text x="24" y="72" fill="var(--muted)" fontSize="9" fontFamily="monospace">
                Positioning
            </text>
            {/* Positioning statement */}
            <text x="24" y="100" fill="var(--foreground)" fontSize="12" fontFamily="system-ui">
                We help [audience]
            </text>
            <text x="24" y="118" fill="var(--accent)" fontSize="12" fontFamily="system-ui" fontWeight="bold">
                achieve [outcome]
            </text>
            <text x="24" y="136" fill="var(--foreground)" fontSize="12" fontFamily="system-ui">
                through [method].
            </text>

            {/* Divider */}
            <line x1="24" y1="156" x2="256" y2="156" stroke="var(--card-border)" strokeWidth="1" />

            {/* Value Props Section */}
            <text x="24" y="180" fill="var(--muted)" fontSize="9" fontFamily="monospace">
                Value Props
            </text>
            {/* Value prop lines */}
            <text x="24" y="204" fill="var(--accent)" fontSize="10" fontFamily="monospace">01</text>
            <rect x="48" y="196" width="80" height="5" fill="var(--foreground)" />
            <rect x="48" y="206" width="120" height="4" fill="var(--muted)" opacity="0.3" />

            <text x="24" y="232" fill="var(--accent)" fontSize="10" fontFamily="monospace">02</text>
            <rect x="48" y="224" width="72" height="5" fill="var(--foreground)" />
            <rect x="48" y="234" width="100" height="4" fill="var(--muted)" opacity="0.3" />

            <text x="24" y="260" fill="var(--accent)" fontSize="10" fontFamily="monospace">03</text>
            <rect x="48" y="252" width="88" height="5" fill="var(--foreground)" />
            <rect x="48" y="262" width="90" height="4" fill="var(--muted)" opacity="0.3" />

            {/* Divider */}
            <line x1="24" y1="280" x2="256" y2="280" stroke="var(--card-border)" strokeWidth="1" />

            {/* Voice Section */}
            <text x="24" y="304" fill="var(--muted)" fontSize="9" fontFamily="monospace">
                Voice
            </text>
            {/* Voice attributes */}
            <rect x="70" y="290" width="48" height="20" fill="none" stroke="var(--accent)" strokeWidth="1" />
            <text x="78" y="304" fill="var(--accent)" fontSize="8" fontFamily="monospace">Direct</text>

            <rect x="126" y="290" width="56" height="20" fill="none" stroke="var(--accent)" strokeWidth="1" />
            <text x="132" y="304" fill="var(--accent)" fontSize="8" fontFamily="monospace">Technical</text>

            <rect x="190" y="290" width="48" height="20" fill="none" stroke="var(--card-border)" strokeWidth="1" />
            <text x="200" y="304" fill="var(--muted)" fontSize="8" fontFamily="monospace">Clear</text>
        </svg>
    );
}
