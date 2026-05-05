/**
 * Brand mark + wordmark components.
 *
 * Source: design-system page §15 / LOGO. SF Mono Regular 12 rendered as inline
 * SVG using `currentColor` so the marks inherit text color from anywhere they
 * land (header in dark mode, footer in light mode, on-accent treatments, etc).
 *
 * Geometry locked to native size (mark 36×14, wordmark 64×14). Pass a `size`
 * prop to scale uniformly — height is `size`, width follows the viewBox ratio.
 */

interface BrandProps {
    size?: number;
    accentColor?: string;
    quietColor?: string;
    title?: string;
    style?: React.CSSProperties;
    className?: string;
}

const MONO_STACK = "ui-monospace, 'SF Mono', Menlo, 'Cascadia Mono', monospace";

export function BrandMark({
    size = 14,
    accentColor = 'var(--accent)',
    quietColor = 'var(--fg-quiet)',
    title = 'nertia',
    style,
    className,
}: BrandProps) {
    const ratio = 36 / 14;
    return (
        <svg
            width={size * ratio}
            height={size}
            viewBox="0 0 36 14"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label={title}
            style={style}
            className={className}
        >
            <title>{title}</title>
            <text x="0" y="11" fontFamily={MONO_STACK} fontSize="12" fontWeight="400" fill="currentColor">
                n
                <tspan fill={accentColor}>.</tspan>
                <tspan fill={quietColor}>[</tspan>
                n
                <tspan fill={quietColor}>]</tspan>
            </text>
        </svg>
    );
}

export function BrandWordmark({
    size = 14,
    accentColor = 'var(--accent)',
    quietColor = 'var(--fg-quiet)',
    title = 'nertia',
    style,
    className,
}: BrandProps) {
    const ratio = 64 / 14;
    return (
        <svg
            width={size * ratio}
            height={size}
            viewBox="0 0 64 14"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label={title}
            style={style}
            className={className}
        >
            <title>{title}</title>
            <text x="0" y="11" fontFamily={MONO_STACK} fontSize="12" fontWeight="400" fill="currentColor">
                n
                <tspan fill={accentColor}>.</tspan>
                <tspan fill={quietColor}>[</tspan>
                n
                <tspan fill={quietColor}>]</tspan>
                ertia
            </text>
        </svg>
    );
}
