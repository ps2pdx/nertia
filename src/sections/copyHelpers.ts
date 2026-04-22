/**
 * Shared string helpers for section writeCopy functions. Pure, deterministic.
 */

export function firstSentence(s: string): string {
    const trimmed = s.trim();
    if (!trimmed) return "";
    const match = trimmed.match(/^[^.!?]+[.!?]/);
    return (match ? match[0] : trimmed).trim();
}

export function firstWord(s: string): string {
    return s.trim().split(/\s+/)[0] ?? "";
}

export function initials(s: string): string {
    const words = s.trim().split(/\s+/).filter(Boolean);
    return words
        .slice(0, 3)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");
}

export function truncate(s: string, max: number): string {
    const trimmed = s.trim();
    if (trimmed.length <= max) return trimmed;
    const cut = trimmed.slice(0, max - 1);
    const lastSpace = cut.lastIndexOf(" ");
    const base = lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
    return base.trim() + "…";
}
