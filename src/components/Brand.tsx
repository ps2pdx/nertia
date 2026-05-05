/**
 * Brand mark + wordmark.
 *
 * The mark is a stylized trending-up arrow whose dip-and-peak silhouette
 * reads as the "n" in "nertia". The wordmark is `nertia.ai` set in SF Mono
 * Regular with the period rendered in the seafoam accent.
 *
 * Source spec: nertia-logo handoff (claude.ai/design 5ZVAyULVJXznvToyk0tbYA).
 *
 * Strokes use `currentColor` so the mark inherits text color from anywhere
 * it lands. The accent dot defaults to `var(--accent)` and can be overridden.
 *
 * Three compositions:
 * - <BrandIcon>     — just the arrow. For favicons, tight horizontal slots.
 * - <BrandWordmark> — inline `↗ nertia.ai`. Default for headers + topbars.
 * - <BrandStack>    — arrow above wordmark. For hero / marketing.
 */

interface BrandProps {
    size?: number;
    accentColor?: string;
    title?: string;
    style?: React.CSSProperties;
    className?: string;
}

const MONO_STACK = "ui-monospace, 'SF Mono', Menlo, 'Cascadia Mono', monospace";

/** Trending-up arrow geometry shared across all compositions. */
const ARROW_PATH = "M0.6,9.4 L2.5,5.6 L4.0,7.2 L6.6,3.0 L4.6,3.0 M6.6,3.0 L6.6,5.0";

interface ArrowProps {
    /** stroke width in path units (the arrow lives in a 7.2 × 12 cell) */
    weight?: number;
}

function Arrow({ weight = 1 }: ArrowProps) {
    return (
        <path
            d={ARROW_PATH}
            fill="none"
            stroke="currentColor"
            strokeWidth={weight}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    );
}

export function BrandIcon({
    size = 14,
    title = 'nertia',
    style,
    className,
}: BrandProps) {
    // square, just the arrow. arrow lives in 7.2 × 12 — wrap with 1.5u of
    // padding so the strokes don't kiss the bbox.
    const ratio = 1; // square
    return (
        <svg
            width={size * ratio}
            height={size}
            viewBox="-2.4 -1.5 12 15"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label={title}
            style={style}
            className={className}
        >
            <title>{title}</title>
            <Arrow weight={1.1} />
        </svg>
    );
}

export function BrandWordmark({
    size = 14,
    accentColor = 'var(--accent)',
    title = 'nertia.ai',
    style,
    className,
}: BrandProps) {
    // inline `↗ nertia.ai` — the canonical horizontal lockup.
    // Coord units: SF Mono cell (7.2 wide × 12 tall).
    //   arrow:    x = 0.6 .. 6.6   (centered in a 7.2 cell)
    //   gap:      4.0 units
    //   wordmark: x = 11.2 onward, font-size 9.6, baseline y = 9.4
    //   "nertia.ai" = 9 glyphs × ~5.76 advance ≈ 51.84 wide
    // Total ≈ 63 wide. Pad to 76 so Menlo / Cascadia fallbacks don't clip.
    const W = 76;
    const H = 12;
    const ratio = W / H;
    return (
        <svg
            width={size * ratio}
            height={size}
            viewBox={`0 0 ${W} ${H}`}
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label={title}
            style={style}
            className={className}
            overflow="visible"
        >
            <title>{title}</title>
            <Arrow weight={1.1} />
            <text
                x="11.2"
                y="9.4"
                fontFamily={MONO_STACK}
                fontSize="9.6"
                fontWeight="400"
                fill="currentColor"
            >
                nertia<tspan fill={accentColor}>.</tspan>ai
            </text>
        </svg>
    );
}

export function BrandStack({
    size = 32,
    accentColor = 'var(--accent)',
    title = 'nertia.ai',
    style,
    className,
}: BrandProps) {
    // Stacked lockup from the handoff spec — arrow above, wordmark below,
    // both centered on x=0 so SF Mono / Menlo fallbacks self-center cleanly.
    // viewBox `-40 0 80 28`:
    //   row 1 (mark)    : y = 3 .. 9.4   (arrow shifted to center on x=0)
    //   row 2 (wordmark): y = 26 baseline, font-size 9.6, anchor=middle
    const W = 80;
    const H = 28;
    const ratio = W / H;
    return (
        <svg
            width={size * ratio}
            height={size}
            viewBox={`-40 0 ${W} ${H}`}
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label={title}
            style={style}
            className={className}
            overflow="visible"
        >
            <title>{title}</title>
            <g transform="translate(-3.6, 0)">
                <Arrow weight={1.0} />
            </g>
            <text
                x="0"
                y="26"
                textAnchor="middle"
                fontFamily={MONO_STACK}
                fontSize="9.6"
                fontWeight="400"
                fill="currentColor"
            >
                nertia<tspan fill={accentColor}>.</tspan>ai
            </text>
        </svg>
    );
}

/* Legacy alias — earlier code referenced BrandMark; keep as the icon-only
   composition so old imports keep working. */
export const BrandMark = BrandIcon;
