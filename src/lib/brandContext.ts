/**
 * BrandContext shape + tokenizer used by the intake + deterministic pickers.
 *
 * BrandContext is the rolling state of the intake conversation —
 * purpose + brand color + social handles. No vibe chips; aesthetics
 * cascade from nertia's globals.css, brand color is the only aesthetic
 * knob the user turns.
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
  /** Hex like "#22c55e". Injected as --accent at the hosted site wrapper. */
  brandColor?: string;
  handles?: Handle[];
}

/**
 * Tokenize a BrandContext into a lowercase set of keywords. Used by the
 * deterministic composition picker to score library entries against the
 * user's input. Hyphenated words stay intact ("link-in-bio" is one token).
 *
 * Excludes brandColor — that's a rendering input, not a semantic one.
 */
export function ctxTokens(ctx: BrandContext): Set<string> {
  const parts: string[] = [
    ctx.purpose ?? "",
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
