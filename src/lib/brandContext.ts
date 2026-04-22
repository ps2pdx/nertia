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

export type Platform =
  | "twitter"
  | "instagram"
  | "linkedin"
  | "youtube"
  | "tiktok"
  | "bluesky"
  | "github"
  | "substack"
  | "mastodon"
  | "site"
  | "link";

export interface Handle {
  platform: Platform;
  handle: string;
  url: string;
}

export interface BrandContext {
  purpose?: string;
  vibes?: string[];
  handles?: Handle[];
}

/**
 * Tokenize a BrandContext into a lowercase set of keywords. Used by the
 * deterministic pickers (palette, font pair, composition) to score their
 * library entries against the user's input. Hyphenated words stay intact
 * ("link-in-bio" is one token).
 */
export function ctxTokens(ctx: BrandContext): Set<string> {
  const parts: string[] = [
    ctx.purpose ?? "",
    ...(ctx.vibes ?? []),
    ...(ctx.handles ?? []).map((h) => h.platform),
  ];
  const blob = parts.join(" ").toLowerCase();
  const tokens = blob.match(/[a-z][a-z-]{1,}/g) ?? [];
  return new Set(tokens);
}

/**
 * Score a library entry's tags against a ctx token set. Simple overlap count.
 * Ties broken by whichever entry appears first in the library.
 */
export function scoreTags(tags: string[], tokens: Set<string>): number {
  let score = 0;
  for (const t of tags) {
    if (tokens.has(t.toLowerCase())) score += 1;
  }
  return score;
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
