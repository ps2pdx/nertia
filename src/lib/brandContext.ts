/**
 * BrandContext + ThemeVariant shapes + URL-safe codec used by the Emerge POC.
 *
 * BrandContext is the rolling state of the intake conversation —
 * fixed answers (purpose/audience/vibeWords) + adaptive follow-ups.
 *
 * ThemeVariant is one of the three rendered choices shown per emerge round.
 * It encodes enough for the /preview/[templateId]?v=... page to inject
 * CSS variables into the template.
 */

export interface BrandContext {
  purpose?: string;
  audience?: string;
  vibeWords?: string[];
  adaptive: Array<{ question: string; answer: string }>;
}

export interface ThemePalette {
  bg: string;
  fg: string;
  muted: string;
  accent: string;
  headingStart: string;
  headingEnd: string;
}

export interface ThemeFontPair {
  heading: string;
  body: string;
}

export interface ThemeVariant {
  id: string;
  palette: ThemePalette;
  fontPair: ThemeFontPair;
  label: string;
}

/** URL-safe base64 encode of JSON-serialized variant. Short enough for query strings. */
export function encodeTheme(variant: ThemeVariant): string {
  const json = JSON.stringify(variant);
  const b64 = Buffer.from(json, "utf-8").toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Inverse of encodeTheme. Returns null on any error. */
export function decodeTheme(token: string): ThemeVariant | null {
  try {
    const normalized = token.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const json = Buffer.from(padded, "base64").toString("utf-8");
    const parsed = JSON.parse(json) as unknown;
    if (!isThemeVariant(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function isThemeVariant(x: unknown): x is ThemeVariant {
  if (typeof x !== "object" || x === null) return false;
  const v = x as Record<string, unknown>;
  if (typeof v.id !== "string" || typeof v.label !== "string") return false;
  const p = v.palette as Record<string, unknown> | undefined;
  if (!p) return false;
  const paletteKeys = ["bg", "fg", "muted", "accent", "headingStart", "headingEnd"];
  if (!paletteKeys.every((k) => typeof p[k] === "string")) return false;
  const f = v.fontPair as Record<string, unknown> | undefined;
  if (!f) return false;
  if (typeof f.heading !== "string" || typeof f.body !== "string") return false;
  return true;
}

/** Produce the CSS-var style block string for a variant. */
export function themeToCssVars(variant: ThemeVariant): string {
  const { palette: p, fontPair: f } = variant;
  return [
    `--hero-bg:${p.bg};`,
    `--hero-fg:${p.fg};`,
    `--hero-muted:${p.muted};`,
    `--hero-accent:${p.accent};`,
    `--hero-heading:${p.headingStart};`,
    `--hero-heading-end:${p.headingEnd};`,
    `--hero-font-heading:${f.heading};`,
    `--hero-font-body:${f.body};`,
  ].join("");
}
