// Shared helper used by hero slide canvas backgrounds. Reads the
// current `--fg` value off the document root and re-runs the supplied
// callback whenever the theme changes (via the data-theme attribute or
// the prefers-color-scheme media query). The returned function
// detaches all listeners.

export function attachThemeStrokeListener(
    cssVar: string,
    fallbackRgb: string,
    onChange: (rgb: string) => void,
): () => void {
    const read = () => {
        const raw = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
        onChange(hexOrColorToRgb(raw) ?? fallbackRgb);
    };

    read();

    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
    });

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onSchemeChange = () => read();
    mql.addEventListener('change', onSchemeChange);

    return () => {
        mo.disconnect();
        mql.removeEventListener('change', onSchemeChange);
    };
}

export function hexOrColorToRgb(input: string): string | null {
    const trimmed = input.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('#')) {
        const hex = trimmed.slice(1);
        const full = hex.length === 3
            ? hex.split('').map((c) => c + c).join('')
            : hex;
        const r = parseInt(full.slice(0, 2), 16);
        const g = parseInt(full.slice(2, 4), 16);
        const b = parseInt(full.slice(4, 6), 16);
        if ([r, g, b].every((n) => Number.isFinite(n))) return `${r}, ${g}, ${b}`;
        return null;
    }
    const m = trimmed.match(/rgba?\(([^)]+)\)/i);
    if (m) {
        const parts = m[1].split(',').slice(0, 3).map((s) => s.trim());
        return parts.join(', ');
    }
    return null;
}
