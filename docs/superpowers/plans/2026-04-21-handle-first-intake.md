# Handle-First Intake Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 5-question sequential intake with a single structured form (handles + purpose + vibe chips) that produces composition-shaped sites via one emerge round. Zero scraping, zero LLM calls.

**Architecture:** Extend the existing deterministic pipeline (Phase 1–6 of the composable-sections rework). The pickers and renderers are unchanged. BrandContext gains `handles: Handle[]` and structured `vibes: string[]`. A pure-regex `detectPlatform()` runs client-side per handle input. The intake API loses its adaptive-question route and its emerge-round-2 path.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind v4, Vitest, Firebase Admin RTDB. All existing. No new deps.

**Spec:** `docs/superpowers/specs/2026-04-21-handle-first-intake-design.md`

---

## File Structure

```
src/
  lib/
    brandContext.ts            MODIFY — BrandContext shape, Handle/Platform types, ctxTokens update
    detectPlatform.ts          CREATE — pure regex-based platform+handle extractor
    __tests__/
      detectPlatform.test.ts   CREATE — per-pattern tests
      brandContext.test.ts     MODIFY — token tests for new handles path
    presetBrands.ts            REWRITE — all 10 presets to new BrandContext shape
    questionBank.ts            DELETE
    emerge.ts                  UNCHANGED
    compose.ts                 UNCHANGED

  compositions/
    index.ts                   MODIFY — pickComposition handle-count short-circuit
    __tests__/                 (compose.test.ts already covers pickComposition; extend in Task 4)

  sections/
    link-stack/
      writeCopy.ts             MODIFY — populate link{1..6}{Label,Href} from ctx.handles
    navbar/
      writeCopy.ts             MODIFY — handle fallback for wordmark
    footer/
      schema.ts                MODIFY — add link{1..3}{Label,Href} optional slots
      Component.tsx            MODIFY — render optional link row
      writeCopy.ts             MODIFY — populate link slots from ctx.handles

  app/
    api/intake/
      emerge/route.ts          SIMPLIFY — drop round/pickedVariantId/previous; one response shape
      emerge/__tests__/route.test.ts  REWRITE — remove round-2 tests
      next/                    DELETE ENTIRE FOLDER
      finalize/route.ts        MODIFY — BrandContextSchema loses adaptive/audience, gains handles/vibes
      finalize/__tests__/route.test.ts  MODIFY — sample brand ctx uses new shape
      imagine/route.ts         UNCHANGED (reads from presetBrands; preset shape changed upstream)
      imagine/__tests__/route.test.ts  MODIFY — expectations updated for new preset shape

    intake/zero-point/
      IntakeFlow.tsx           REWRITE — state machine collapses to "form" | "emerge" | "submitting"
      page.tsx                 UNCHANGED
```

---

## Task 1: Define Handle + Platform types and new BrandContext shape

**Files:**
- Modify: `src/lib/brandContext.ts`

This task lays the type foundation. Nothing references `Handle`/`Platform` yet; later tasks depend on them.

- [ ] **Step 1: Read the current file to locate the edit points**

Run: `cat src/lib/brandContext.ts | head -30`
Confirm `BrandContext` interface and `ctxTokens` function exist at the top.

- [ ] **Step 2: Add Platform type + Handle interface + update BrandContext**

Replace the `BrandContext` interface block with:

```ts
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
```

Delete the old `audience`, `vibeWords`, and `adaptive` fields from the interface.

- [ ] **Step 3: Update ctxTokens to consume the new shape**

Replace the body of `ctxTokens` with:

```ts
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
```

- [ ] **Step 4: Run typecheck to expose every call site that needs updating**

Run: `npx tsc --noEmit 2>&1 | head -40`
Expected: errors in files that read `ctx.audience`, `ctx.vibeWords`, `ctx.adaptive`. These will be fixed in downstream tasks (tests, writeCopy functions, presetBrands, routes). That's intentional — type safety is our guide.

Record the list. It should include at least:
- `src/app/api/intake/emerge/route.ts`
- `src/app/api/intake/finalize/route.ts`
- `src/app/api/intake/next/route.ts` (about to be deleted)
- `src/lib/presetBrands.ts`
- `src/lib/questionBank.ts` (about to be deleted)
- Several section `writeCopy.ts` files
- Some tests

**Do not fix them in this task.** The rest of the plan does that file by file. Do NOT commit yet — the working tree is broken.

- [ ] **Step 5: Mark checkpoint only (no commit)**

Leave uncommitted; later tasks bring the tree back to green. A clear git log is worth more than a temporarily-broken commit.

---

## Task 2: detectPlatform — pure regex extractor with tests

**Files:**
- Create: `src/lib/detectPlatform.ts`
- Create: `src/lib/__tests__/detectPlatform.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/__tests__/detectPlatform.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { detectPlatform } from "@/lib/detectPlatform";

describe("detectPlatform", () => {
    it("returns null for empty or whitespace-only input", () => {
        expect(detectPlatform("")).toBeNull();
        expect(detectPlatform("   ")).toBeNull();
    });

    it("recognizes bare @handle as twitter", () => {
        const h = detectPlatform("@scottsuper");
        expect(h).toEqual({
            platform: "twitter",
            handle: "scottsuper",
            url: "https://twitter.com/scottsuper",
        });
    });

    it("recognizes bare handle without @ as twitter when no dots", () => {
        const h = detectPlatform("scottsuper");
        expect(h?.platform).toBe("twitter");
        expect(h?.handle).toBe("scottsuper");
    });

    it("recognizes twitter.com urls", () => {
        expect(detectPlatform("https://twitter.com/scottsuper")?.platform).toBe("twitter");
        expect(detectPlatform("twitter.com/@scottsuper")?.platform).toBe("twitter");
    });

    it("recognizes x.com urls", () => {
        const h = detectPlatform("https://x.com/@scottsuper");
        expect(h?.platform).toBe("twitter");
        expect(h?.url).toContain("x.com");
    });

    it("recognizes instagram urls", () => {
        const h = detectPlatform("https://instagram.com/scottsuper/");
        expect(h).toEqual({
            platform: "instagram",
            handle: "scottsuper",
            url: "https://instagram.com/scottsuper",
        });
    });

    it("recognizes linkedin /in/ profile urls", () => {
        const h = detectPlatform("https://www.linkedin.com/in/scottsuper");
        expect(h?.platform).toBe("linkedin");
        expect(h?.handle).toBe("scottsuper");
    });

    it("recognizes youtube @ urls and /channel/ urls", () => {
        expect(detectPlatform("https://youtube.com/@scottsuper")?.platform).toBe("youtube");
        expect(detectPlatform("https://youtube.com/channel/UCxyz")?.platform).toBe("youtube");
    });

    it("recognizes tiktok urls", () => {
        expect(detectPlatform("https://tiktok.com/@scottsuper")?.platform).toBe("tiktok");
    });

    it("recognizes bluesky profile urls", () => {
        const h = detectPlatform("https://bsky.app/profile/scottsuper.bsky.social");
        expect(h?.platform).toBe("bluesky");
    });

    it("recognizes github urls", () => {
        const h = detectPlatform("https://github.com/scottsuper");
        expect(h?.platform).toBe("github");
        expect(h?.handle).toBe("scottsuper");
    });

    it("recognizes substack subdomain and @handle forms", () => {
        expect(detectPlatform("https://scottsuper.substack.com")?.platform).toBe("substack");
        expect(detectPlatform("https://substack.com/@scottsuper")?.platform).toBe("substack");
    });

    it("recognizes mastodon urls", () => {
        const h = detectPlatform("https://mastodon.social/@scottsuper");
        expect(h?.platform).toBe("mastodon");
        expect(h?.handle).toBe("scottsuper@mastodon.social");
    });

    it("classifies any other URL as site", () => {
        const h = detectPlatform("https://nertia.ai");
        expect(h?.platform).toBe("site");
        expect(h?.url).toBe("https://nertia.ai");
    });

    it("classifies ambiguous non-URL non-@ strings as link", () => {
        const h = detectPlatform("some random reference");
        expect(h?.platform).toBe("link");
    });

    it("trims leading/trailing whitespace", () => {
        const h = detectPlatform("  @scottsuper  ");
        expect(h?.handle).toBe("scottsuper");
    });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/__tests__/detectPlatform.test.ts 2>&1 | tail -10`
Expected: all tests FAIL with "Cannot find module" or "detectPlatform is not a function".

- [ ] **Step 3: Implement detectPlatform**

Create `src/lib/detectPlatform.ts`:

```ts
import type { Handle } from "./brandContext";

/**
 * Extract a Handle from free-form user input. Pure — no fetches.
 * Ordered pattern matching; first match wins.
 */
export function detectPlatform(raw: string): Handle | null {
    const input = raw.trim();
    if (!input) return null;

    // twitter (bare @handle or bare handle without dots)
    const atBareMatch = input.match(/^@([A-Za-z0-9_]{1,15})$/);
    if (atBareMatch) {
        return twitter(atBareMatch[1]);
    }

    // twitter.com / x.com
    const twitterMatch = input.match(/^https?:\/\/(?:www\.)?twitter\.com\/@?([A-Za-z0-9_]{1,15})\/?$/i);
    if (twitterMatch) return twitter(twitterMatch[1]);
    const xMatch = input.match(/^https?:\/\/(?:www\.)?x\.com\/@?([A-Za-z0-9_]{1,15})\/?$/i);
    if (xMatch) {
        return { platform: "twitter", handle: xMatch[1], url: `https://x.com/${xMatch[1]}` };
    }
    const twitterBareMatch = input.match(/^twitter\.com\/@?([A-Za-z0-9_]{1,15})\/?$/i);
    if (twitterBareMatch) return twitter(twitterBareMatch[1]);

    // instagram
    const instagramMatch = input.match(/^https?:\/\/(?:www\.)?instagram\.com\/([A-Za-z0-9_.]{1,30})\/?$/i);
    if (instagramMatch) {
        return {
            platform: "instagram",
            handle: instagramMatch[1],
            url: `https://instagram.com/${instagramMatch[1]}`,
        };
    }

    // linkedin
    const linkedinMatch = input.match(/^https?:\/\/(?:www\.)?linkedin\.com\/in\/([A-Za-z0-9-]{1,100})\/?$/i);
    if (linkedinMatch) {
        return {
            platform: "linkedin",
            handle: linkedinMatch[1],
            url: `https://www.linkedin.com/in/${linkedinMatch[1]}`,
        };
    }

    // youtube
    const youtubeAtMatch = input.match(/^https?:\/\/(?:www\.)?youtube\.com\/@([A-Za-z0-9_-]{1,100})\/?$/i);
    if (youtubeAtMatch) {
        return {
            platform: "youtube",
            handle: youtubeAtMatch[1],
            url: `https://youtube.com/@${youtubeAtMatch[1]}`,
        };
    }
    const youtubeChannelMatch = input.match(/^https?:\/\/(?:www\.)?youtube\.com\/channel\/([A-Za-z0-9_-]{1,100})\/?$/i);
    if (youtubeChannelMatch) {
        return {
            platform: "youtube",
            handle: youtubeChannelMatch[1],
            url: `https://youtube.com/channel/${youtubeChannelMatch[1]}`,
        };
    }

    // tiktok
    const tiktokMatch = input.match(/^https?:\/\/(?:www\.)?tiktok\.com\/@([A-Za-z0-9_.]{1,30})\/?$/i);
    if (tiktokMatch) {
        return {
            platform: "tiktok",
            handle: tiktokMatch[1],
            url: `https://tiktok.com/@${tiktokMatch[1]}`,
        };
    }

    // bluesky
    const blueskyMatch = input.match(/^https?:\/\/(?:www\.)?bsky\.app\/profile\/([A-Za-z0-9._-]{1,100})\/?$/i);
    if (blueskyMatch) {
        return {
            platform: "bluesky",
            handle: blueskyMatch[1],
            url: `https://bsky.app/profile/${blueskyMatch[1]}`,
        };
    }

    // github
    const githubMatch = input.match(/^https?:\/\/(?:www\.)?github\.com\/([A-Za-z0-9-]{1,100})\/?$/i);
    if (githubMatch) {
        return {
            platform: "github",
            handle: githubMatch[1],
            url: `https://github.com/${githubMatch[1]}`,
        };
    }

    // substack (subdomain OR @handle)
    const substackSubdomainMatch = input.match(/^https?:\/\/([A-Za-z0-9-]{1,63})\.substack\.com\/?$/i);
    if (substackSubdomainMatch) {
        return {
            platform: "substack",
            handle: substackSubdomainMatch[1],
            url: `https://${substackSubdomainMatch[1]}.substack.com`,
        };
    }
    const substackAtMatch = input.match(/^https?:\/\/substack\.com\/@([A-Za-z0-9_-]{1,100})\/?$/i);
    if (substackAtMatch) {
        return {
            platform: "substack",
            handle: substackAtMatch[1],
            url: `https://substack.com/@${substackAtMatch[1]}`,
        };
    }

    // mastodon (instance hostname in the URL)
    const mastodonMatch = input.match(/^https?:\/\/([A-Za-z0-9.-]+)\/@([A-Za-z0-9_]{1,100})\/?$/i);
    if (mastodonMatch) {
        return {
            platform: "mastodon",
            handle: `${mastodonMatch[2]}@${mastodonMatch[1]}`,
            url: `https://${mastodonMatch[1]}/@${mastodonMatch[2]}`,
        };
    }

    // generic http(s) URL — site
    if (/^https?:\/\/\S+/i.test(input)) {
        const clean = input.replace(/\/+$/, "");
        return { platform: "site", handle: stripProtocol(clean), url: clean };
    }

    // bare handle (no @ no dot) — treat as twitter by convention
    if (/^[A-Za-z0-9_]{1,15}$/.test(input)) {
        return twitter(input);
    }

    // anything else — link
    return { platform: "link", handle: input, url: input };
}

function twitter(handle: string): Handle {
    return {
        platform: "twitter",
        handle,
        url: `https://twitter.com/${handle}`,
    };
}

function stripProtocol(url: string): string {
    return url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/__tests__/detectPlatform.test.ts 2>&1 | tail -10`
Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/detectPlatform.ts src/lib/__tests__/detectPlatform.test.ts src/lib/brandContext.ts
git commit -m "feat(intake): Handle/Platform types + pure-regex detectPlatform"
```

Note: this commit includes the Task 1 type changes — bundling them makes the commit compile-clean (even though the rest of the tree is still broken, these two files compile together).

---

## Task 3: Update brandContext tests + ctxTokens coverage for handles

**Files:**
- Modify: `src/lib/__tests__/brandContext.test.ts` (inspect existing first; it may not exist — create if missing)

- [ ] **Step 1: Check if the file exists**

Run: `ls src/lib/__tests__/brandContext.test.ts 2>&1`
If it exists: read it and replace failing test cases in Step 2. If it doesn't: create it in Step 2.

- [ ] **Step 2: Write/update tests covering the new shape**

Write the file to match the new BrandContext + ctxTokens behavior:

```ts
import { describe, it, expect } from "vitest";
import { ctxTokens, scoreTags } from "@/lib/brandContext";

describe("ctxTokens", () => {
    it("extracts lowercase hyphenated tokens from purpose + vibes + handle platforms", () => {
        const tokens = ctxTokens({
            purpose: "A landing page for SaaS",
            vibes: ["technical", "minimal"],
            handles: [
                { platform: "twitter", handle: "scottsuper", url: "https://twitter.com/scottsuper" },
                { platform: "github", handle: "scottsuper", url: "https://github.com/scottsuper" },
            ],
        });
        expect(tokens.has("landing")).toBe(true);
        expect(tokens.has("saas")).toBe(true);
        expect(tokens.has("technical")).toBe(true);
        expect(tokens.has("minimal")).toBe(true);
        expect(tokens.has("twitter")).toBe(true);
        expect(tokens.has("github")).toBe(true);
    });

    it("returns an empty set for an empty BrandContext", () => {
        const tokens = ctxTokens({});
        expect(tokens.size).toBe(0);
    });

    it("handles missing handles gracefully", () => {
        const tokens = ctxTokens({ purpose: "blog", vibes: ["warm"] });
        expect(tokens.has("blog")).toBe(true);
        expect(tokens.has("warm")).toBe(true);
    });
});

describe("scoreTags", () => {
    it("counts the overlap between tags and tokens", () => {
        const tokens = new Set(["warm", "editorial", "saas"]);
        expect(scoreTags(["warm", "editorial"], tokens)).toBe(2);
        expect(scoreTags(["cold", "minimal"], tokens)).toBe(0);
        expect(scoreTags(["saas", "warm", "extra"], tokens)).toBe(2);
    });
});
```

- [ ] **Step 3: Run tests to verify they pass**

Run: `npx vitest run src/lib/__tests__/brandContext.test.ts 2>&1 | tail -10`
Expected: all tests PASS.

- [ ] **Step 4: Commit**

```bash
git add src/lib/__tests__/brandContext.test.ts
git commit -m "test(intake): ctxTokens + scoreTags cover new handles path"
```

---

## Task 4: pickComposition — handle-count short-circuit

**Files:**
- Modify: `src/compositions/index.ts`
- Modify: `src/lib/__tests__/compose.test.ts`

- [ ] **Step 1: Write the failing tests**

Append to `src/lib/__tests__/compose.test.ts`:

```ts
import type { Handle } from "@/lib/brandContext";

describe("pickComposition — handle-count short-circuit", () => {
    const h = (platform: Handle["platform"]): Handle => ({
        platform,
        handle: "x",
        url: `https://example.com/${platform}`,
    });

    it("forces linkinbio when ≥3 non-site handles and no site handle", () => {
        const ctx = {
            purpose: "Field notes on craft",
            handles: [h("twitter"), h("instagram"), h("tiktok")],
        };
        expect(pickComposition(ctx).id).toBe("linkinbio");
    });

    it("does NOT force linkinbio when any handle is a site", () => {
        const ctx = {
            purpose: "Field notes on craft",
            handles: [h("twitter"), h("instagram"), h("site")],
        };
        // blog-keyword in purpose should still let normal scoring run
        expect(pickComposition(ctx).id).toBe("blog");
    });

    it("does NOT force linkinbio when fewer than 3 handles", () => {
        const ctx = {
            purpose: "My portfolio",
            handles: [h("twitter"), h("instagram")],
        };
        expect(pickComposition(ctx).id).toBe("portfolio");
    });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/__tests__/compose.test.ts 2>&1 | tail -20`
Expected: the three new tests FAIL. Existing compose tests may also fail because of the BrandContext type change (no more `audience`/`adaptive` in test fixtures) — fix those fixtures inline by removing deleted fields. Re-run until only the new short-circuit tests are failing, then proceed.

- [ ] **Step 3: Implement the short-circuit**

Edit `src/compositions/index.ts` — replace the `pickComposition` function body:

```ts
export function pickComposition(ctx: BrandContext): CompositionDef {
    const handles = ctx.handles ?? [];
    const hasSite = handles.some((h) => h.platform === "site");
    if (handles.length >= 3 && !hasSite) {
        return linkinbio;
    }
    const tokens = ctxTokens(ctx);
    let best = marketing;
    let bestScore = -1;
    for (const entry of listCompositions()) {
        const score = scoreTags(entry.tags, tokens);
        if (score > bestScore) {
            bestScore = score;
            best = entry;
        }
    }
    return best;
}
```

- [ ] **Step 4: Run full test suite**

Run: `npx vitest run src/lib/__tests__/compose.test.ts 2>&1 | tail -10`
Expected: all compose tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/compositions/index.ts src/lib/__tests__/compose.test.ts
git commit -m "feat(intake): pickComposition short-circuits to linkinbio for ≥3 non-site handles"
```

---

## Task 5: link-stack section consumes ctx.handles

**Files:**
- Modify: `src/sections/link-stack/writeCopy.ts`
- Create: `src/sections/link-stack/__tests__/writeCopy.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/sections/link-stack/__tests__/writeCopy.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { writeCopy } from "@/sections/link-stack/writeCopy";
import type { Handle } from "@/lib/brandContext";

const h = (platform: Handle["platform"], handle: string, url: string): Handle => ({
    platform,
    handle,
    url,
});

describe("link-stack writeCopy", () => {
    it("maps handles into numbered link slots with platform labels", () => {
        const copy = writeCopy({
            purpose: "My links",
            handles: [
                h("twitter", "scottsuper", "https://twitter.com/scottsuper"),
                h("instagram", "scott.ig", "https://instagram.com/scott.ig"),
                h("github", "scottsuper", "https://github.com/scottsuper"),
            ],
        });
        expect(copy.link1Label).toBe("Twitter");
        expect(copy.link1Href).toBe("https://twitter.com/scottsuper");
        expect(copy.link2Label).toBe("Instagram");
        expect(copy.link2Href).toBe("https://instagram.com/scott.ig");
        expect(copy.link3Label).toBe("GitHub");
        expect(copy.link3Href).toBe("https://github.com/scottsuper");
    });

    it("caps at 6 handles", () => {
        const many = Array.from({ length: 10 }, (_, i) =>
            h("twitter", `user${i}`, `https://twitter.com/user${i}`),
        );
        const copy = writeCopy({ purpose: "links", handles: many });
        expect(copy.link6Label).toBeDefined();
        expect(copy.link7Label).toBeUndefined();
    });

    it("leaves link slots unset when no handles", () => {
        const copy = writeCopy({ purpose: "My portfolio" });
        expect(copy.link1Label).toBeUndefined();
        expect(copy.name).toBeTruthy();
    });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/sections/link-stack/__tests__/writeCopy.test.ts 2>&1 | tail -10`
Expected: tests FAIL (slots undefined).

- [ ] **Step 3: Update writeCopy**

Replace the contents of `src/sections/link-stack/writeCopy.ts`:

```ts
import type { SectionWriteCopy } from "../types";
import type { Platform } from "@/lib/brandContext";
import { firstSentence, initials, truncate } from "../copyHelpers";

const PLATFORM_LABELS: Record<Platform, string> = {
    twitter: "Twitter",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    youtube: "YouTube",
    tiktok: "TikTok",
    bluesky: "Bluesky",
    github: "GitHub",
    substack: "Substack",
    mastodon: "Mastodon",
    site: "Website",
    link: "Link",
};

export const writeCopy: SectionWriteCopy = (ctx) => {
    const nameSource =
        firstSentence(ctx.purpose ?? "") ||
        ctx.handles?.[0]?.handle ||
        "my links";
    const name = truncate(nameSource, 40);

    const out: Record<string, string> = {
        name,
        tagline: (ctx.vibes ?? [])[0] ?? "",
        bio: truncate(ctx.purpose ?? "", 200),
        avatarInitials: initials(name),
    };

    (ctx.handles ?? []).slice(0, 6).forEach((h, i) => {
        out[`link${i + 1}Label`] = PLATFORM_LABELS[h.platform] ?? "Link";
        out[`link${i + 1}Href`] = h.url;
    });

    return out;
};
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/sections/link-stack/__tests__/writeCopy.test.ts 2>&1 | tail -10`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add src/sections/link-stack/writeCopy.ts src/sections/link-stack/__tests__/writeCopy.test.ts
git commit -m "feat(sections): link-stack writeCopy consumes ctx.handles"
```

---

## Task 6: footer section gains link slots and consumes handles

**Files:**
- Modify: `src/sections/footer/schema.ts`
- Modify: `src/sections/footer/writeCopy.ts`
- Modify: `src/sections/footer/Component.tsx`
- Create: `src/sections/footer/__tests__/writeCopy.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/sections/footer/__tests__/writeCopy.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { writeCopy } from "@/sections/footer/writeCopy";
import type { Handle } from "@/lib/brandContext";

const h = (platform: Handle["platform"], handle: string, url: string): Handle => ({
    platform,
    handle,
    url,
});

describe("footer writeCopy", () => {
    it("populates wordmark + tagline from purpose/vibes", () => {
        const copy = writeCopy({
            purpose: "Acme photography studio",
            vibes: ["warm", "editorial"],
        });
        expect(copy.wordmark).toBe("Acme");
        expect(copy.tagline).toBe("warm");
    });

    it("renders first 3 handles as link1..link3", () => {
        const copy = writeCopy({
            purpose: "My site",
            handles: [
                h("twitter", "x", "https://twitter.com/x"),
                h("instagram", "y", "https://instagram.com/y"),
                h("github", "z", "https://github.com/z"),
                h("linkedin", "w", "https://www.linkedin.com/in/w"),
            ],
        });
        expect(copy.link1Label).toBe("Twitter");
        expect(copy.link1Href).toBe("https://twitter.com/x");
        expect(copy.link2Label).toBe("Instagram");
        expect(copy.link3Label).toBe("GitHub");
        expect(copy.link4Label).toBeUndefined();
    });

    it("leaves link slots empty when no handles", () => {
        const copy = writeCopy({ purpose: "My site" });
        expect(copy.link1Label).toBeUndefined();
    });
});
```

- [ ] **Step 2: Run tests — they will fail**

Run: `npx vitest run src/sections/footer/__tests__/writeCopy.test.ts 2>&1 | tail -10`
Expected: FAIL.

- [ ] **Step 3: Update footer schema**

Replace contents of `src/sections/footer/schema.ts`:

```ts
import type { SectionCopySchemaField } from "../types";

export const schema: SectionCopySchemaField[] = [
    {
        key: "wordmark",
        label: "Wordmark",
        type: "text",
        placeholder: "your name",
        required: false,
        maxLength: 40,
    },
    {
        key: "tagline",
        label: "Tagline",
        type: "text",
        placeholder: "the short thing",
        required: false,
        maxLength: 80,
    },
    { key: "link1Label", label: "Link 1 label", type: "text", maxLength: 40 },
    { key: "link1Href", label: "Link 1 href", type: "text" },
    { key: "link2Label", label: "Link 2 label", type: "text", maxLength: 40 },
    { key: "link2Href", label: "Link 2 href", type: "text" },
    { key: "link3Label", label: "Link 3 label", type: "text", maxLength: 40 },
    { key: "link3Href", label: "Link 3 href", type: "text" },
];
```

- [ ] **Step 4: Update footer writeCopy**

Replace contents of `src/sections/footer/writeCopy.ts`:

```ts
import type { SectionWriteCopy } from "../types";
import type { Platform } from "@/lib/brandContext";
import { firstWord } from "../copyHelpers";

const PLATFORM_LABELS: Record<Platform, string> = {
    twitter: "Twitter",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    youtube: "YouTube",
    tiktok: "TikTok",
    bluesky: "Bluesky",
    github: "GitHub",
    substack: "Substack",
    mastodon: "Mastodon",
    site: "Website",
    link: "Link",
};

export const writeCopy: SectionWriteCopy = (ctx) => {
    const firstVibe = (ctx.vibes ?? [])[0] ?? "";
    const out: Record<string, string> = {
        wordmark: firstWord(ctx.purpose ?? ""),
        tagline: firstVibe,
    };
    (ctx.handles ?? []).slice(0, 3).forEach((h, i) => {
        out[`link${i + 1}Label`] = PLATFORM_LABELS[h.platform] ?? "Link";
        out[`link${i + 1}Href`] = h.url;
    });
    return out;
};
```

- [ ] **Step 5: Update footer Component to render the optional link row**

Replace `src/sections/footer/Component.tsx`:

```tsx
import type { SectionProps } from "../types";

export function Component({ copy }: SectionProps) {
    const wordmark = copy.wordmark ?? "";
    const tagline = copy.tagline ?? "";
    const links = [1, 2, 3]
        .map((i) => ({ label: copy[`link${i}Label`], href: copy[`link${i}Href`] }))
        .filter((l) => l.label && l.href);

    return (
        <section
            className="px-6 py-12 bg-[var(--token-bg)] border-t"
            style={{ borderColor: "var(--token-muted)" }}
        >
            <div className="max-w-3xl mx-auto flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
                {wordmark && (
                    <p
                        className="text-lg"
                        style={{
                            fontFamily: "var(--token-font-heading)",
                            color: "var(--token-fg)",
                        }}
                    >
                        {wordmark}
                    </p>
                )}
                {tagline && (
                    <p
                        className="text-sm"
                        style={{
                            color: "var(--token-muted)",
                            fontFamily: "var(--token-font-body)",
                        }}
                    >
                        {tagline}
                    </p>
                )}
            </div>
            {links.length > 0 && (
                <div
                    className="max-w-3xl mx-auto mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm"
                    style={{ fontFamily: "var(--token-font-body)" }}
                >
                    {links.map((l, i) => (
                        <a
                            key={i}
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "var(--token-accent)" }}
                        >
                            {l.label} ↗
                        </a>
                    ))}
                </div>
            )}
        </section>
    );
}
```

- [ ] **Step 6: Run tests**

Run: `npx vitest run src/sections/footer/__tests__/writeCopy.test.ts 2>&1 | tail -10`
Expected: all PASS.

- [ ] **Step 7: Commit**

```bash
git add src/sections/footer/
git commit -m "feat(sections): footer gains 3 link slots populated from ctx.handles"
```

---

## Task 7: navbar wordmark falls back to first handle

**Files:**
- Modify: `src/sections/navbar/writeCopy.ts`
- Create: `src/sections/navbar/__tests__/writeCopy.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/sections/navbar/__tests__/writeCopy.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { writeCopy } from "@/sections/navbar/writeCopy";

describe("navbar writeCopy", () => {
    it("uses first word of purpose as wordmark", () => {
        expect(writeCopy({ purpose: "Acme Studio" }).wordmark).toBe("Acme");
    });

    it("falls back to first handle's handle string when purpose is empty", () => {
        const copy = writeCopy({
            handles: [
                {
                    platform: "twitter",
                    handle: "scottsuper",
                    url: "https://twitter.com/scottsuper",
                },
            ],
        });
        expect(copy.wordmark).toBe("scottsuper");
    });

    it("falls back to 'site' when neither purpose nor handles are present", () => {
        expect(writeCopy({}).wordmark).toBe("site");
    });
});
```

- [ ] **Step 2: Run tests — they will fail**

Run: `npx vitest run src/sections/navbar/__tests__/writeCopy.test.ts 2>&1 | tail -10`
Expected: the second test fails (current code returns "site" regardless of handles).

- [ ] **Step 3: Update navbar writeCopy**

Replace `src/sections/navbar/writeCopy.ts`:

```ts
import type { SectionWriteCopy } from "../types";
import { firstWord } from "../copyHelpers";

export const writeCopy: SectionWriteCopy = (ctx) => {
    const fromPurpose = firstWord(ctx.purpose ?? "");
    const fromHandle = ctx.handles?.[0]?.handle ?? "";
    return {
        wordmark: fromPurpose || fromHandle || "site",
    };
};
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/sections/navbar/__tests__/writeCopy.test.ts 2>&1 | tail -10`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add src/sections/navbar/
git commit -m "feat(sections): navbar wordmark falls back to first handle"
```

---

## Task 8: Rewrite presetBrands to new shape

**Files:**
- Modify: `src/lib/presetBrands.ts`

Design constraint: each preset must have `purpose`, 1–3 `vibes` from the fixed 12-word vocabulary, and 1–4 `handles` that plausibly exist. No `audience` or `adaptive`.

- [ ] **Step 1: Rewrite the file**

Replace contents of `src/lib/presetBrands.ts`:

```ts
/**
 * Curated library of BrandContext presets. Powers the "↯ imagine a brand to try"
 * button on the intake — the user can skip the form and drop into emerge with a
 * fully-populated example.
 *
 * No LLM, no randomness state that would make this non-deterministic across
 * restarts. The route picks one via Math.random per-request.
 */
import type { BrandContext } from "./brandContext";

export const presetBrands: BrandContext[] = [
    {
        purpose:
            "A film-wedding photographer's portfolio — book weddings in Oaxaca, Portugal, and Kyoto.",
        vibes: ["warm", "cinematic"],
        handles: [
            {
                platform: "instagram",
                handle: "sofiafilmwedding",
                url: "https://instagram.com/sofiafilmwedding",
            },
            {
                platform: "site",
                handle: "sofiafilm.com",
                url: "https://sofiafilm.com",
            },
        ],
    },
    {
        purpose:
            "An indie dev tool — a debugger that shows causality, not stack traces, for distributed systems.",
        vibes: ["technical", "quiet"],
        handles: [
            {
                platform: "github",
                handle: "causalproj",
                url: "https://github.com/causalproj",
            },
            {
                platform: "twitter",
                handle: "causalproj",
                url: "https://twitter.com/causalproj",
            },
        ],
    },
    {
        purpose:
            "A solo coach's landing page — somatic coaching for people rebuilding pace after burnout.",
        vibes: ["warm", "grounded"],
        handles: [
            {
                platform: "instagram",
                handle: "restedcoach",
                url: "https://instagram.com/restedcoach",
            },
            {
                platform: "substack",
                handle: "restedcoach",
                url: "https://restedcoach.substack.com",
            },
        ],
    },
    {
        purpose:
            "A 24-seat tasting-menu restaurant in Portland focused on fermented Pacific Northwest produce.",
        vibes: ["editorial", "minimal"],
        handles: [
            {
                platform: "instagram",
                handle: "feralferments",
                url: "https://instagram.com/feralferments",
            },
        ],
    },
    {
        purpose:
            "A two-person experimental game studio making deliberately unmarketable short games.",
        vibes: ["playful", "weird"],
        handles: [
            {
                platform: "twitter",
                handle: "antgames",
                url: "https://twitter.com/antgames",
            },
            {
                platform: "site",
                handle: "antgames.itch.io",
                url: "https://antgames.itch.io",
            },
        ],
    },
    {
        purpose: "Field notes from a one-person newsletter about product craft and technical writing.",
        vibes: ["editorial", "quiet"],
        handles: [
            {
                platform: "substack",
                handle: "fieldnotes",
                url: "https://fieldnotes.substack.com",
            },
            {
                platform: "twitter",
                handle: "fieldnoteswrite",
                url: "https://twitter.com/fieldnoteswrite",
            },
        ],
    },
    {
        purpose: "Link-in-bio for an electronic musician about to drop a first EP.",
        vibes: ["moody", "bold"],
        handles: [
            {
                platform: "instagram",
                handle: "orbit.sounds",
                url: "https://instagram.com/orbit.sounds",
            },
            {
                platform: "tiktok",
                handle: "orbit.sounds",
                url: "https://tiktok.com/@orbit.sounds",
            },
            {
                platform: "youtube",
                handle: "orbitsounds",
                url: "https://youtube.com/@orbitsounds",
            },
            {
                platform: "link",
                handle: "open.spotify.com/artist/orbit",
                url: "https://open.spotify.com/artist/orbit",
            },
        ],
    },
    {
        purpose:
            "A small open-source sustainability API — measure embedded carbon from supply-chain metadata.",
        vibes: ["technical", "grounded"],
        handles: [
            {
                platform: "github",
                handle: "carbonapi",
                url: "https://github.com/carbonapi",
            },
            {
                platform: "site",
                handle: "carbonapi.dev",
                url: "https://carbonapi.dev",
            },
        ],
    },
    {
        purpose: "Portfolio for a technical product marketing consultant and brand systems designer.",
        vibes: ["technical", "warm"],
        handles: [
            {
                platform: "twitter",
                handle: "scottsuper",
                url: "https://twitter.com/scottsuper",
            },
            {
                platform: "linkedin",
                handle: "scottsuper",
                url: "https://www.linkedin.com/in/scottsuper",
            },
        ],
    },
    {
        purpose:
            "An architecture studio's portfolio — residential interiors in the Pacific Northwest.",
        vibes: ["minimal", "clean"],
        handles: [
            {
                platform: "instagram",
                handle: "stoneandgrain",
                url: "https://instagram.com/stoneandgrain",
            },
        ],
    },
];

export function randomPreset(): BrandContext {
    return presetBrands[Math.floor(Math.random() * presetBrands.length)];
}
```

- [ ] **Step 2: Verify file compiles**

Run: `npx tsc --noEmit src/lib/presetBrands.ts 2>&1 | head -5`
Expected: no errors in this file (if errors, they're in Handle type imports — check imports match Task 1's types).

- [ ] **Step 3: Commit**

```bash
git add src/lib/presetBrands.ts
git commit -m "refactor(intake): preset brands use new BrandContext shape (handles + vibes)"
```

---

## Task 9: Delete /api/intake/next + questionBank

**Files:**
- Delete: `src/app/api/intake/next/` (entire folder including `route.ts` and `__tests__/`)
- Delete: `src/lib/questionBank.ts`

- [ ] **Step 1: Remove the files**

```bash
rm -rf src/app/api/intake/next
rm src/lib/questionBank.ts
```

- [ ] **Step 2: Verify nothing imports them**

Run: `grep -rn "questionBank\|api/intake/next" src 2>&1 | grep -v "\.bak" | head`
Expected: no matches. If the IntakeFlow or a test still references them, note the files — they'll be handled in later tasks (IntakeFlow rewrite).

- [ ] **Step 3: Commit**

```bash
git add -A src/app/api/intake/next src/lib/questionBank.ts
git commit -m "chore(intake): delete /api/intake/next and questionBank — no adaptive Qs"
```

---

## Task 10: Simplify /api/intake/emerge — drop rounds

**Files:**
- Modify: `src/app/api/intake/emerge/route.ts`
- Modify: `src/app/api/intake/emerge/__tests__/route.test.ts`

- [ ] **Step 1: Rewrite the emerge route**

Replace `src/app/api/intake/emerge/route.ts`:

```ts
import { NextResponse } from "next/server";
import { z } from "zod";
import type { BrandContext } from "@/lib/brandContext";
import { pickThreeForEmerge } from "@/lib/palette";
import { pickFontPair } from "@/lib/fontPair";
import { pickComposition } from "@/compositions";
import { getSection } from "@/sections";
import type { CompositionDef } from "@/compositions";
import { type EmergeVariant } from "@/lib/emerge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HandleSchema = z.object({
    platform: z.string(),
    handle: z.string(),
    url: z.string(),
});

const BrandContextSchema = z.object({
    purpose: z.string().optional(),
    vibes: z.array(z.string()).optional(),
    handles: z.array(HandleSchema).optional(),
});

const BodySchema = z.object({
    brandContext: BrandContextSchema,
});

/**
 * Single-round emerge — zero LLM. Returns 3 visually distinct palette variants
 * all bound to the composition + font pair picked for the brand context.
 */
export async function POST(req: Request): Promise<Response> {
    try {
        const body = (await req.json()) as unknown;
        const parsed = BodySchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "invalid input", details: parsed.error.flatten() },
                { status: 400 },
            );
        }
        const { brandContext } = parsed.data;

        const composition = pickComposition(brandContext as BrandContext);
        const fontPair = pickFontPair(brandContext as BrandContext);
        const previewHeadline = buildPreviewHeadline(brandContext as BrandContext, composition);
        const palettes = pickThreeForEmerge(brandContext as BrandContext);

        const variants: EmergeVariant[] = palettes.map((palette, i) => ({
            id: `emerge-${composition.id}-${i}`,
            label: `${composition.displayName} · variant ${i + 1}`,
            palette,
            fontPair,
            compositionId: composition.id,
            compositionLabel: composition.displayName,
            previewHeadline,
        }));

        return NextResponse.json({ variants });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[/api/intake/emerge] error:", message);
        return NextResponse.json(
            { error: "server error", detail: message },
            { status: 500 },
        );
    }
}

function buildPreviewHeadline(
    ctx: BrandContext,
    composition: CompositionDef,
): string {
    const heroInstance = composition.sections.find((s) => {
        const section = getSection(s.id);
        return section?.meta.family === "hero" || section?.meta.family === "links";
    });
    const target = heroInstance ?? composition.sections[0];
    if (!target) return "";
    const section = getSection(target.id);
    if (!section) return "";
    const copy = section.writeCopy(ctx);
    return copy.headline ?? copy.name ?? copy.heading ?? "";
}
```

- [ ] **Step 2: Rewrite the emerge test**

Replace `src/app/api/intake/emerge/__tests__/route.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/intake/emerge/route";
import type { EmergeVariant } from "@/lib/emerge";

const sampleCtx = {
    purpose: "A photographer's portfolio",
    vibes: ["warm", "cinematic"],
    handles: [
        {
            platform: "instagram",
            handle: "sofiafilm",
            url: "https://instagram.com/sofiafilm",
        },
    ],
};

function makeRequest(body: unknown): Request {
    return new Request("http://localhost/api/intake/emerge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
    });
}

describe("/api/intake/emerge", () => {
    it("returns 3 variants with composition + tokens + preview headline", async () => {
        const res = await POST(makeRequest({ brandContext: sampleCtx }));
        expect(res.status).toBe(200);
        const body = (await res.json()) as { variants: EmergeVariant[] };
        expect(body.variants).toHaveLength(3);
        for (const v of body.variants) {
            expect(v.id).toBeTruthy();
            expect(v.compositionId).toBeTruthy();
            expect(v.compositionLabel).toBeTruthy();
            expect(v.palette.bg).toBeTruthy();
            expect(v.fontPair.heading).toBeTruthy();
            expect(v.previewHeadline).toBeTruthy();
        }
    });

    it("all variants share composition + fontPair (palette is what varies)", async () => {
        const res = await POST(makeRequest({ brandContext: sampleCtx }));
        const { variants } = (await res.json()) as { variants: EmergeVariant[] };
        const compIds = new Set(variants.map((v) => v.compositionId));
        expect(compIds.size).toBe(1);
        const headings = new Set(variants.map((v) => v.fontPair.heading));
        expect(headings.size).toBe(1);
    });

    it("malformed body returns 400", async () => {
        const res = await POST(makeRequest({ bogus: true }));
        expect(res.status).toBe(400);
    });
});
```

- [ ] **Step 3: Run tests**

Run: `npx vitest run src/app/api/intake/emerge/__tests__/route.test.ts 2>&1 | tail -10`
Expected: all PASS.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/intake/emerge/
git commit -m "feat(intake): simplify emerge to single round (no round/picked/previous)"
```

---

## Task 11: Update /api/intake/finalize BodySchema for new BrandContext

**Files:**
- Modify: `src/app/api/intake/finalize/route.ts`
- Modify: `src/app/api/intake/finalize/__tests__/route.test.ts`

- [ ] **Step 1: Update BodySchema in the route**

In `src/app/api/intake/finalize/route.ts`, replace the `BrandContextSchema` definition with:

```ts
const HandleSchema = z.object({
    platform: z.string(),
    handle: z.string(),
    url: z.string(),
});

const BrandContextSchema = z.object({
    purpose: z.string().optional(),
    vibes: z.array(z.string()).optional(),
    handles: z.array(HandleSchema).optional(),
});
```

The rest of the route (composition lookup, slug handling, putSite, putSiteBrand) is unchanged — `writeCopy` handles the new BrandContext through the sections.

- [ ] **Step 2: Update the test fixture**

In `src/app/api/intake/finalize/__tests__/route.test.ts`, replace `sampleBrandContext`:

```ts
const sampleBrandContext = {
    purpose: "A landing page for a SaaS product.",
    vibes: ["technical", "clean"],
    handles: [
        {
            platform: "twitter",
            handle: "saasco",
            url: "https://twitter.com/saasco",
        },
    ],
};
```

- [ ] **Step 3: Run finalize tests**

Run: `npx vitest run src/app/api/intake/finalize/__tests__/route.test.ts 2>&1 | tail -10`
Expected: all PASS.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/intake/finalize/
git commit -m "feat(intake): finalize BodySchema accepts new BrandContext (handles + vibes)"
```

---

## Task 12: Update /api/intake/imagine test for new preset shape

**Files:**
- Modify: `src/app/api/intake/imagine/__tests__/route.test.ts`

The route itself (`src/app/api/intake/imagine/route.ts`) doesn't need changes — it delegates to `randomPreset()`. But its test asserts the OLD shape (checks `ctx.adaptive` and `vibeWords`). Update the assertions.

- [ ] **Step 1: Update the test**

Replace contents of `src/app/api/intake/imagine/__tests__/route.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/intake/imagine/route";

describe("/api/intake/imagine", () => {
    it("returns a fully-populated BrandContext with the new shape", async () => {
        const res = await POST();
        expect(res.status).toBe(200);
        const body = (await res.json()) as {
            brandContext: {
                purpose?: string;
                vibes?: string[];
                handles?: Array<{ platform: string; handle: string; url: string }>;
            };
        };
        const ctx = body.brandContext;
        expect(typeof ctx.purpose).toBe("string");
        expect((ctx.purpose ?? "").length).toBeGreaterThan(10);
        expect(Array.isArray(ctx.vibes)).toBe(true);
        expect((ctx.vibes ?? []).length).toBeGreaterThan(0);
        expect(Array.isArray(ctx.handles)).toBe(true);
        expect((ctx.handles ?? []).length).toBeGreaterThan(0);
        for (const h of ctx.handles ?? []) {
            expect(typeof h.platform).toBe("string");
            expect(typeof h.handle).toBe("string");
            expect(typeof h.url).toBe("string");
        }
    });

    it("returns varied presets across calls (at least 2 distinct over 10 tries)", async () => {
        const purposes = new Set<string>();
        for (let i = 0; i < 10; i++) {
            const res = await POST();
            const body = (await res.json()) as { brandContext: { purpose?: string } };
            if (body.brandContext.purpose) purposes.add(body.brandContext.purpose);
        }
        expect(purposes.size).toBeGreaterThan(1);
    });
});
```

- [ ] **Step 2: Run tests**

Run: `npx vitest run src/app/api/intake/imagine/__tests__/route.test.ts 2>&1 | tail -10`
Expected: all PASS.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/intake/imagine/__tests__/route.test.ts
git commit -m "test(intake): imagine test asserts new BrandContext shape"
```

---

## Task 13: Rewrite IntakeFlow — form → emerge state machine

**Files:**
- Modify: `src/app/intake/zero-point/IntakeFlow.tsx` (full rewrite)

This is the largest single change in the plan. No unit test — it's a UI integration piece and the route-level tests (Tasks 10, 11, 12) cover the contracts it hits.

- [ ] **Step 1: Replace the file with the new form-based flow**

Replace contents of `src/app/intake/zero-point/IntakeFlow.tsx`:

```tsx
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { BrandContext, Handle } from "@/lib/brandContext";
import type { EmergeVariant } from "@/lib/emerge";
import { detectPlatform } from "@/lib/detectPlatform";

type Step = "form" | "emerge" | "submitting";

const VIBE_CHOICES = [
    "warm",
    "technical",
    "editorial",
    "minimal",
    "moody",
    "playful",
    "cinematic",
    "clean",
    "grounded",
    "bold",
    "quiet",
    "weird",
] as const;

type HandleRow = { raw: string; detected: Handle | null };

function emptyRow(): HandleRow {
    return { raw: "", detected: null };
}

export function IntakeFlow() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("form");
    const [handleRows, setHandleRows] = useState<HandleRow[]>([emptyRow(), emptyRow()]);
    const [purpose, setPurpose] = useState("");
    const [vibes, setVibes] = useState<Set<string>>(new Set());
    const [variants, setVariants] = useState<EmergeVariant[] | null>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function buildCtx(): BrandContext {
        const handles = handleRows
            .map((r) => r.detected)
            .filter((h): h is Handle => h !== null);
        return {
            purpose: purpose.trim() || undefined,
            vibes: Array.from(vibes),
            handles: handles.length > 0 ? handles : undefined,
        };
    }

    function updateHandleRow(idx: number, raw: string) {
        setHandleRows((prev) => {
            const next = [...prev];
            next[idx] = { raw, detected: detectPlatform(raw) };
            return next;
        });
    }

    function addHandleRow() {
        setHandleRows((prev) => [...prev, emptyRow()]);
    }

    function removeHandleRow(idx: number) {
        setHandleRows((prev) => prev.filter((_, i) => i !== idx));
    }

    function toggleVibe(v: string) {
        setVibes((prev) => {
            const next = new Set(prev);
            if (next.has(v)) {
                next.delete(v);
            } else if (next.size < 3) {
                next.add(v);
            }
            return next;
        });
    }

    async function submitForm(e: FormEvent) {
        e.preventDefault();
        if (!purpose.trim()) {
            setError("Tell me what this site is for.");
            return;
        }
        setBusy(true);
        setError(null);
        try {
            const res = await fetch("/api/intake/emerge", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ brandContext: buildCtx() }),
            });
            if (!res.ok) throw new Error("emerge failed");
            const data = (await res.json()) as { variants: EmergeVariant[] };
            setVariants(data.variants);
            setStep("emerge");
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setBusy(false);
        }
    }

    async function imagine() {
        setBusy(true);
        setError(null);
        try {
            const res = await fetch("/api/intake/imagine", { method: "POST" });
            if (!res.ok) throw new Error("imagine failed");
            const data = (await res.json()) as { brandContext: BrandContext };
            const ctx = data.brandContext;
            setPurpose(ctx.purpose ?? "");
            setVibes(new Set(ctx.vibes ?? []));
            setHandleRows(
                (ctx.handles ?? []).length > 0
                    ? (ctx.handles ?? []).map((h) => ({ raw: h.url, detected: h }))
                    : [emptyRow(), emptyRow()],
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setBusy(false);
        }
    }

    async function pickVariant(variant: EmergeVariant) {
        setStep("submitting");
        setError(null);
        try {
            const res = await fetch("/api/intake/finalize", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ brandContext: buildCtx(), finalVariant: variant }),
            });
            if (!res.ok) {
                const payload = (await res.json().catch(() => ({}))) as { error?: string };
                throw new Error(payload.error ?? "failed to finalize");
            }
            const data = (await res.json()) as { slug: string; url: string };
            router.push(data.url);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setStep("emerge");
        }
    }

    return (
        <div className="min-h-[calc(100svh-var(--header-height))]">
            <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
                {error && (
                    <div
                        role="alert"
                        className="mb-8 text-sm border px-4 py-3 border-red-500 text-red-600 dark:text-red-300"
                    >
                        {error}
                    </div>
                )}

                {step === "form" && (
                    <form onSubmit={submitForm} className="flex flex-col gap-10">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold mb-2">
                                Tell me about this.
                            </h1>
                        </div>

                        <HandleRepeater
                            rows={handleRows}
                            onChange={updateHandleRow}
                            onAdd={addHandleRow}
                            onRemove={removeHandleRow}
                        />

                        <PurposeField value={purpose} onChange={setPurpose} />

                        <VibeChips selected={vibes} onToggle={toggleVibe} />

                        <div className="flex items-center gap-4 flex-wrap">
                            <button
                                type="submit"
                                disabled={!purpose.trim() || busy}
                                className="inline-flex items-center border px-6 py-3 text-sm uppercase tracking-widest transition-colors hover:bg-[var(--accent)]/10 disabled:opacity-40"
                                style={{
                                    borderColor: "var(--accent)",
                                    color: "var(--accent)",
                                }}
                            >
                                {busy ? "thinking…" : "Emerge →"}
                            </button>
                            <button
                                type="button"
                                onClick={imagine}
                                disabled={busy}
                                className="text-xs uppercase tracking-[0.2em] border-b transition-colors hover:opacity-80 disabled:opacity-40"
                                style={{
                                    color: "var(--muted)",
                                    borderColor: "var(--card-border)",
                                    paddingBottom: 2,
                                }}
                            >
                                ↯ imagine something to try
                            </button>
                        </div>
                    </form>
                )}

                {step === "emerge" && variants && (
                    <EmergeChoice
                        variants={variants}
                        onPick={pickVariant}
                        busy={busy}
                    />
                )}

                {step === "submitting" && (
                    <div className="py-24 text-center">
                        <div
                            className="inline-block text-xs uppercase tracking-[0.3em]"
                            style={{
                                color: "var(--accent)",
                                animation: "pulse 1.4s ease-in-out infinite",
                            }}
                        >
                            deploying your site…
                        </div>
                        <style>{`
                            @keyframes pulse {
                                0%,100% { opacity: 0.5; }
                                50% { opacity: 1; }
                            }
                        `}</style>
                    </div>
                )}
            </div>
        </div>
    );
}

function HandleRepeater({
    rows,
    onChange,
    onAdd,
    onRemove,
}: {
    rows: HandleRow[];
    onChange: (idx: number, raw: string) => void;
    onAdd: () => void;
    onRemove: (idx: number) => void;
}) {
    return (
        <section className="flex flex-col gap-3">
            <label className="text-xs uppercase tracking-[0.3em] text-muted">
                Where are you online? <span className="opacity-60">(optional)</span>
            </label>
            {rows.map((row, idx) => (
                <div key={idx} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={row.raw}
                        onChange={(e) => onChange(idx, e.target.value)}
                        placeholder="@handle or URL"
                        className="flex-1 bg-transparent border px-4 py-3 text-base focus:outline-none"
                        style={{
                            borderColor: "var(--card-border)",
                            color: "var(--foreground)",
                        }}
                    />
                    <span
                        className="text-xs tracking-wide uppercase min-w-[80px]"
                        style={{
                            color: row.detected
                                ? "var(--accent)"
                                : "var(--muted)",
                        }}
                    >
                        {row.detected ? `✓ ${row.detected.platform}` : ""}
                    </span>
                    {rows.length > 1 && (
                        <button
                            type="button"
                            onClick={() => onRemove(idx)}
                            className="text-xs text-muted hover:text-[var(--foreground)]"
                            aria-label="Remove handle"
                        >
                            ×
                        </button>
                    )}
                </div>
            ))}
            <button
                type="button"
                onClick={onAdd}
                className="text-xs uppercase tracking-[0.2em] text-muted hover:text-[var(--foreground)] self-start"
            >
                + add another
            </button>
        </section>
    );
}

function PurposeField({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <section className="flex flex-col gap-3">
            <label className="text-xs uppercase tracking-[0.3em] text-muted">
                What's this site for?
            </label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="e.g. A film-wedding photographer's portfolio."
                rows={3}
                className="bg-transparent border px-4 py-3 text-base focus:outline-none"
                style={{
                    borderColor: "var(--card-border)",
                    color: "var(--foreground)",
                }}
            />
        </section>
    );
}

function VibeChips({
    selected,
    onToggle,
}: {
    selected: Set<string>;
    onToggle: (v: string) => void;
}) {
    return (
        <section className="flex flex-col gap-3">
            <label className="text-xs uppercase tracking-[0.3em] text-muted">
                How should it feel? <span className="opacity-60">(pick 1–3)</span>
            </label>
            <div className="flex flex-wrap gap-2">
                {VIBE_CHOICES.map((v) => {
                    const isActive = selected.has(v);
                    return (
                        <button
                            key={v}
                            type="button"
                            onClick={() => onToggle(v)}
                            className="text-sm px-4 py-2 border rounded-full transition-colors"
                            style={{
                                borderColor: isActive
                                    ? "var(--accent)"
                                    : "var(--card-border)",
                                color: isActive
                                    ? "var(--accent)"
                                    : "var(--muted)",
                                backgroundColor: isActive
                                    ? "var(--accent)/10"
                                    : "transparent",
                            }}
                        >
                            {v}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

function EmergeChoice({
    variants,
    onPick,
    busy,
}: {
    variants: EmergeVariant[];
    onPick: (v: EmergeVariant) => void;
    busy: boolean;
}) {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <p
                    className="text-xs uppercase tracking-[0.3em] mb-4"
                    style={{ color: "var(--accent)" }}
                >
                    Pick a direction
                </p>
                <h1
                    className="text-3xl md:text-5xl tracking-tight max-w-2xl"
                    style={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: 500,
                        letterSpacing: "-0.015em",
                        lineHeight: 1.15,
                    }}
                >
                    Which feels right?
                </h1>
            </div>

            <div className="grid gap-4 md:gap-6 md:grid-cols-3">
                {variants.map((v) => (
                    <button
                        key={v.id}
                        type="button"
                        onClick={() => !busy && onPick(v)}
                        disabled={busy}
                        className="group flex flex-col text-left transition-colors disabled:opacity-50"
                        style={{
                            backgroundColor: v.palette.bg,
                            color: v.palette.fg,
                            border: "1px solid var(--card-border)",
                        }}
                    >
                        <div
                            className="p-6 pb-4 min-h-[160px] flex items-end"
                            style={{
                                backgroundColor: v.palette.bg,
                                color: v.palette.fg,
                            }}
                        >
                            <p
                                className="text-lg leading-tight"
                                style={{
                                    fontFamily: v.fontPair.heading,
                                    color: v.palette.headingStart,
                                    fontWeight: 600,
                                    letterSpacing: "-0.01em",
                                }}
                            >
                                {v.previewHeadline || v.compositionLabel}
                            </p>
                        </div>
                        <div
                            className="px-6 py-4 border-t flex items-center justify-between"
                            style={{
                                borderColor: v.palette.muted,
                                backgroundColor: v.palette.bg,
                            }}
                        >
                            <p
                                className="text-[10px] uppercase tracking-[0.2em]"
                                style={{
                                    color: v.palette.muted,
                                    fontFamily: v.fontPair.body,
                                }}
                            >
                                {v.compositionLabel}
                            </p>
                            <div className="flex gap-1">
                                {[v.palette.bg, v.palette.accent, v.palette.headingEnd].map(
                                    (c, i) => (
                                        <span
                                            key={i}
                                            className="w-3 h-3"
                                            style={{
                                                backgroundColor: c,
                                                border: `1px solid ${v.palette.muted}`,
                                            }}
                                        />
                                    ),
                                )}
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {busy && (
                <p
                    className="text-xs uppercase tracking-[0.2em]"
                    style={{ color: "var(--accent)" }}
                >
                    emerging…
                </p>
            )}
        </div>
    );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -15`
Expected: all routes build; `/api/intake/next` is absent from the route map; `/intake/zero-point` appears as static.

- [ ] **Step 3: Verify full test suite still green**

Run: `npm test 2>&1 | tail -5`
Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/app/intake/zero-point/IntakeFlow.tsx
git commit -m "feat(intake): IntakeFlow rewritten as form → single emerge"
```

---

## Task 14: End-to-end dev smoke + cleanup

**Files:**
- No file changes unless the smoke surfaces issues; then per-issue.

- [ ] **Step 1: Full lint pass**

Run: `npm run lint 2>&1 | tail -5`
Expected: 0 errors. Only pre-existing warnings, matching the count from before this plan started (currently 11).

- [ ] **Step 2: Full test suite**

Run: `npm test 2>&1 | tail -5`
Expected: all tests pass. Count should be higher than the pre-plan baseline of 157 (new tests added in Tasks 2, 3, 4, 5, 6, 7; old ones replaced in Tasks 10, 11, 12).

- [ ] **Step 3: Production build**

Run: `npm run build 2>&1 | tail -10`
Expected: 32 routes (one fewer than before — `/api/intake/next` is gone). `/intake/zero-point` static. No errors.

- [ ] **Step 4: Dev smoke walk**

If the dev server isn't running, start it: `npm run dev` in a separate terminal.

In a browser, visit `http://localhost:3000/intake/zero-point`:
- Confirm the form shows: handle rows (2 empty), purpose textarea, vibe chips (12).
- Type `@scottsuper` in a handle row — confirm "✓ twitter" appears.
- Type `https://instagram.com/sofiafilm` in the second row — confirm "✓ instagram".
- Type a purpose. Click 2 vibe chips.
- Click **Emerge →**. Confirm 3 variant cards render, each with a distinct palette and the same composition label.
- Click a card. Confirm redirect to `/hosted/{slug}` which renders a composition-shaped site with handles visible as footer links (for `marketing`/`portfolio`/`blog`/`docs`) or as the main link stack (for `linkinbio`).
- Go back, click **↯ imagine something to try**. Confirm form pre-fills with a preset's purpose + vibes + handle rows.
- Submit again. Confirm it works.

Record any visible bugs; fix each as a follow-up commit with message `fix(intake): …`.

- [ ] **Step 5: Legacy sanity check**

Visit `http://localhost:3000/hosted/precedent` (one of the existing legacy template sites). Confirm it still renders via `LegacyTemplateRenderer`. No regressions to pre-existing sites.

- [ ] **Step 6: Final commit + push**

If any follow-up fixes landed in Step 4, they have their own commits. Otherwise, no commit needed for this task — the verification IS the task.

```bash
git log --oneline -15   # review what this plan produced
git push
```

---

## Self-Review Checklist (completed during plan writing)

**Spec coverage:**

- [x] §UX — one screen, three fields → Task 13 (IntakeFlow rewrite with HandleRepeater/PurposeField/VibeChips)
- [x] §Data model → Task 1 (types), Task 3 (ctxTokens)
- [x] §Platform detection (pure regex) → Task 2 (detectPlatform + tests)
- [x] §Emerge single round → Task 10 (route simplification + tests)
- [x] §Composition biasing from handles → Task 4 (pickComposition short-circuit + tests)
- [x] §writeCopy changes — link-stack → Task 5
- [x] §writeCopy changes — navbar → Task 7
- [x] §writeCopy changes — footer → Task 6 (schema, Component, writeCopy)
- [x] §Routes — emerge simplified → Task 10
- [x] §Routes — finalize BodySchema → Task 11
- [x] §Routes — imagine test updated → Task 12
- [x] §Routes — next deleted → Task 9
- [x] §presetBrands rewrite → Task 8
- [x] §IntakeFlow rewrite → Task 13
- [x] §Verification → Task 14

**Placeholder scan:** none. Every step has complete code or an exact command.

**Type consistency:** `Handle` / `Platform` defined once in Task 1, imported everywhere. `BrandContext` has `purpose`, `vibes`, `handles` consistently across all tasks. `EmergeVariant` unchanged throughout. `ctx.handles`, `ctx.vibes`, `ctx.purpose` accessed consistently.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-21-handle-first-intake.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
