'use client';

interface GitCommitSVGProps {
    width?: number;
    height?: number;
    className?: string;
}

export default function GitCommitSVG({
    width = 280,
    height = 320,
    className = ''
}: GitCommitSVGProps) {
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
                04 SHIP IT
            </text>

            {/* Divider */}
            <line x1="24" y1="48" x2="256" y2="48" stroke="var(--card-border)" strokeWidth="1" />

            {/* Terminal Section */}
            <text x="24" y="72" fill="var(--muted)" fontSize="9" fontFamily="monospace">
                Deploy
            </text>

            {/* Terminal window mockup */}
            <rect x="24" y="88" width="232" height="120" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="1" />

            {/* Terminal dots */}
            <circle cx="38" cy="100" r="4" fill="#ff5f56" />
            <circle cx="52" cy="100" r="4" fill="#ffbd2e" />
            <circle cx="66" cy="100" r="4" fill="#27ca40" />

            {/* Terminal content */}
            <text x="36" y="124" fill="var(--muted)" fontSize="9" fontFamily="monospace">$ git add .</text>
            <text x="36" y="142" fill="var(--muted)" fontSize="9" fontFamily="monospace">$ git commit -m</text>
            <text x="36" y="158" fill="var(--accent)" fontSize="9" fontFamily="monospace">&quot;update brand tokens&quot;</text>
            <text x="36" y="176" fill="var(--muted)" fontSize="9" fontFamily="monospace">$ git push origin main</text>
            <text x="36" y="196" fill="var(--accent)" fontSize="9" fontFamily="monospace">✓ Deployed to production</text>

            {/* Divider */}
            <line x1="24" y1="224" x2="256" y2="224" stroke="var(--card-border)" strokeWidth="1" />

            {/* Stack Section */}
            <text x="24" y="248" fill="var(--muted)" fontSize="9" fontFamily="monospace">
                Stack
            </text>

            {/* Tech badges */}
            <rect x="24" y="260" width="52" height="20" fill="none" stroke="var(--card-border)" strokeWidth="1" />
            <text x="32" y="274" fill="var(--foreground)" fontSize="8" fontFamily="monospace">Next.js</text>

            <rect x="84" y="260" width="44" height="20" fill="none" stroke="var(--card-border)" strokeWidth="1" />
            <text x="92" y="274" fill="var(--foreground)" fontSize="8" fontFamily="monospace">React</text>

            <rect x="136" y="260" width="56" height="20" fill="none" stroke="var(--card-border)" strokeWidth="1" />
            <text x="144" y="274" fill="var(--foreground)" fontSize="8" fontFamily="monospace">Tailwind</text>

            <rect x="200" y="260" width="48" height="20" fill="none" stroke="var(--card-border)" strokeWidth="1" />
            <text x="208" y="274" fill="var(--foreground)" fontSize="8" fontFamily="monospace">Turbo</text>

            {/* Bottom text */}
            <text x="24" y="304" fill="var(--accent)" fontSize="9" fontFamily="monospace">1 commit = global update</text>
        </svg>
    );
}
