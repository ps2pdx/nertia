/**
 * Tiny color utilities — just enough for the zero-point pickers.
 * No dependencies, pure functions.
 */

export function hexToRgb(hex: string): [number, number, number] {
    const clean = hex.replace("#", "").trim();
    if (clean.length !== 6) return [0, 0, 0];
    return [
        parseInt(clean.slice(0, 2), 16),
        parseInt(clean.slice(2, 4), 16),
        parseInt(clean.slice(4, 6), 16),
    ];
}

export function rgbToHex(r: number, g: number, b: number): string {
    const h = (n: number) =>
        Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
    return `#${h(r)}${h(g)}${h(b)}`;
}

/** Returns [h (0..360), s (0..1), l (0..1)]. */
export function hexToHsl(hex: string): [number, number, number] {
    let [r, g, b] = hexToRgb(hex);
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0;
    let s = 0;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h /= 6;
    }
    return [h * 360, s, l];
}

export function hslToHex(h: number, s: number, l: number): string {
    const hh = ((h % 360) + 360) % 360;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((hh / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;
    if (hh < 60) [r, g, b] = [c, x, 0];
    else if (hh < 120) [r, g, b] = [x, c, 0];
    else if (hh < 180) [r, g, b] = [0, c, x];
    else if (hh < 240) [r, g, b] = [0, x, c];
    else if (hh < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];
    return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

/** Rotate a hex color's hue by `degrees` while preserving saturation + lightness. */
export function rotateHue(hex: string, degrees: number): string {
    const [h, s, l] = hexToHsl(hex);
    return hslToHex(h + degrees, s, l);
}
