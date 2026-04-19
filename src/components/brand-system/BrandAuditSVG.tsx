export default function BrandAuditSVG() {
    return (
        <svg
            viewBox="0 0 200 240"
            className="w-full h-auto"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Container */}
            <rect
                x="1"
                y="1"
                width="198"
                height="238"
                fill="var(--background)"
                stroke="var(--card-border)"
                strokeWidth="1"
            />

            {/* Header */}
            <text
                x="16"
                y="28"
                fill="var(--muted)"
                fontSize="9"
                fontFamily="monospace"
                letterSpacing="0.15em"
            >
                BRAND AUDIT
            </text>
            <line x1="16" y1="40" x2="184" y2="40" stroke="var(--card-border)" strokeWidth="1" />

            {/* Checklist items */}
            {/* Item 1 - Logo: exists but needs work */}
            <rect x="16" y="52" width="12" height="12" fill="none" stroke="var(--accent)" strokeWidth="1" />
            <path d="M19 58 L22 61 L27 54" stroke="var(--accent)" strokeWidth="1.5" fill="none" />
            <text x="34" y="62" fill="var(--foreground)" fontSize="9" fontFamily="monospace">Logo</text>
            <text x="100" y="62" fill="var(--accent)" fontSize="8" fontFamily="monospace">exists</text>

            {/* Item 2 - Colors: partial */}
            <rect x="16" y="72" width="12" height="12" fill="none" stroke="var(--muted)" strokeWidth="1" />
            <line x1="19" y1="78" x2="25" y2="78" stroke="var(--muted)" strokeWidth="1.5" />
            <text x="34" y="82" fill="var(--foreground)" fontSize="9" fontFamily="monospace">Colors</text>
            <text x="100" y="82" fill="var(--muted)" fontSize="8" fontFamily="monospace">partial</text>

            {/* Item 3 - Typography: missing */}
            <rect x="16" y="92" width="12" height="12" fill="none" stroke="var(--card-border)" strokeWidth="1" />
            <text x="34" y="102" fill="var(--foreground)" fontSize="9" fontFamily="monospace">Typography</text>
            <text x="100" y="102" fill="var(--card-border)" fontSize="8" fontFamily="monospace">missing</text>

            {/* Item 4 - Components: missing */}
            <rect x="16" y="112" width="12" height="12" fill="none" stroke="var(--card-border)" strokeWidth="1" />
            <text x="34" y="122" fill="var(--foreground)" fontSize="9" fontFamily="monospace">Components</text>
            <text x="100" y="122" fill="var(--card-border)" fontSize="8" fontFamily="monospace">missing</text>

            {/* Item 5 - Messaging: needs work */}
            <rect x="16" y="132" width="12" height="12" fill="none" stroke="var(--muted)" strokeWidth="1" />
            <line x1="19" y1="138" x2="25" y2="138" stroke="var(--muted)" strokeWidth="1.5" />
            <text x="34" y="142" fill="var(--foreground)" fontSize="9" fontFamily="monospace">Messaging</text>
            <text x="100" y="142" fill="var(--muted)" fontSize="8" fontFamily="monospace">unclear</text>

            {/* Item 6 - Voice: missing */}
            <rect x="16" y="152" width="12" height="12" fill="none" stroke="var(--card-border)" strokeWidth="1" />
            <text x="34" y="162" fill="var(--foreground)" fontSize="9" fontFamily="monospace">Voice</text>
            <text x="100" y="162" fill="var(--card-border)" fontSize="8" fontFamily="monospace">missing</text>

            {/* Divider */}
            <line x1="16" y1="178" x2="184" y2="178" stroke="var(--card-border)" strokeWidth="1" />

            {/* Summary */}
            <text x="16" y="196" fill="var(--muted)" fontSize="8" fontFamily="monospace">STATUS</text>

            {/* Progress bar */}
            <rect x="16" y="206" width="168" height="8" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="1" />
            <rect x="17" y="207" width="40" height="6" fill="var(--accent)" />

            <text x="16" y="228" fill="var(--foreground)" fontSize="9" fontFamily="monospace">2/6 complete</text>
            <text x="120" y="228" fill="var(--accent)" fontSize="9" fontFamily="monospace">→ gaps identified</text>
        </svg>
    );
}
