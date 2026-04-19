# Zero-Point MVP — Vertical Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Smallest testable slice of the Zero-Point Website Generator — a brief POSTed to `/api/generate` produces a Firebase site document that renders at `{slug}.nertia.ai` through subdomain middleware using the `zero-point` visual direction.

**Architecture:** One Next.js 15 app. Generator pipeline runs server-side (Haiku for classification/palette/motion, Sonnet for copy + programmatic humanize pass). Middleware inspects `Host` header and rewrites `{slug}.nertia.ai` → `/_sites/[slug]`. Site config lives in Firebase Realtime DB. ISR caches per slug. See `docs/superpowers/specs/2026-04-16-zero-point-generator-design.md` for the full design.

**Tech Stack:** Next.js 15 (Turbopack), React 19, TypeScript strict, Tailwind v4, Firebase (client SDK existing, adding admin SDK), Anthropic SDK, Vitest + React Testing Library (new), Zod (new, for schema validation).

**Out of scope for this plan:** intake form UI, landing-page refresh, admin queue, custom-domain registrar integration, additional directions (editorial/brutalist/organic), retire-old-thesis cleanup. Those get their own plans after this slice works end-to-end.

---

## File Structure

**Create:**
```
src/
  directions/
    types.ts                        Direction, SiteConfig, Palette, Copy interfaces
    index.ts                        directions registry (maps name → module)
    zero-point/
      README.md                     aesthetic rules + forbidden patterns
      direction.ts                  metadata (tags, palette constraints, slot schema)
      Layout.tsx                    React tree with slots
      motion.ts                     motion config for zero-point
      sample.json                   fixture for tests + renderer QA
  lib/
    humanize.ts                     programmatic humanize rules
    slug.ts                         generate + check collisions
    firebaseAdmin.ts                server-side Firebase admin SDK
    siteStore.ts                    read/write sites/{slug}
    generator/
      pickDirection.ts              step 1 of pipeline
      generatePalette.ts            step 2
      writeCopy.ts                  step 3
      paramMotion.ts                step 4
      pipeline.ts                   orchestrator
      prompts.ts                    system prompts (cached)
  app/
    _sites/[slug]/
      page.tsx                      site renderer
    api/
      generate/
        route.ts                    POST handler
middleware.ts                       subdomain routing
vitest.config.ts                    test runner config
vitest.setup.ts                     global test setup (mocks, env)
src/__tests__/                      unit tests (mirror src structure)
```

**Modify:**
- `package.json` — add test scripts, vitest + related deps
- `src/lib/firebase.ts` — no changes, existing client-side init stays

**Do NOT touch in this plan:**
- `src/app/generator/`, `src/app/admin/generations/`, `src/app/admin/golden-examples/`, `src/app/brand-system/`, `src/app/butterfly-test/`, `src/app/design-system/` — retired in a separate plan, leave them alone for now.
- `src/content/blog/` — blog stays as-is.

---

## Task 1: Add Vitest + Testing Infrastructure

**Files:**
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `src/__tests__/smoke.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Install vitest + related deps**

```bash
cd ~/code/nertia && npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom zod
```

- [ ] **Step 2: Write vitest.config.ts**

Create `/Users/scottcampbell/code/nertia/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    css: false,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
```

- [ ] **Step 3: Write vitest.setup.ts**

Create `/Users/scottcampbell/code/nertia/vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Default test env — individual tests may override
process.env.ANTHROPIC_API_KEY = "test-anthropic-key";
process.env.USE_DEMO_MODE = "true";

// Silence Firebase noise unless a test explicitly asserts on it
vi.mock("firebase/app", async () => {
  const actual = await vi.importActual<typeof import("firebase/app")>("firebase/app");
  return { ...actual };
});
```

- [ ] **Step 4: Add test scripts to package.json**

Edit `/Users/scottcampbell/code/nertia/package.json`. Change the `scripts` block to:

```json
"scripts": {
  "dev": "next dev --turbopack",
  "build": "next build --turbopack",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 5: Write smoke test**

Create `/Users/scottcampbell/code/nertia/src/__tests__/smoke.test.ts`:

```ts
import { describe, it, expect } from "vitest";

describe("vitest", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 6: Run tests — should pass**

```bash
cd ~/code/nertia && npm test
```

Expected: `1 passed`.

- [ ] **Step 7: Commit**

```bash
cd ~/code/nertia && git add package.json package-lock.json vitest.config.ts vitest.setup.ts src/__tests__/smoke.test.ts && git commit -m "chore: add vitest + testing infra"
```

---

## Task 2: Direction + Site Types

**Files:**
- Create: `src/directions/types.ts`
- Create: `src/directions/__tests__/types.test.ts`

- [ ] **Step 1: Write failing test**

Create `/Users/scottcampbell/code/nertia/src/directions/__tests__/types.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { SiteConfigSchema, type SiteConfig, type Direction } from "@/directions/types";

describe("SiteConfigSchema", () => {
  it("accepts a minimal valid config", () => {
    const config: SiteConfig = {
      slug: "acme",
      direction: "zero-point",
      palette: { bg: "#0a0a0a", fg: "#f5f5f5", accent: "#00d4ff", muted: "#888" },
      typography: { heading: "Inter Display", body: "Inter", scale: 1.25 },
      copy: {
        hero: { eyebrow: "ACME", headline: "We build things.", sub: "Small and true.", cta: "Get in touch" },
        sections: [],
      },
      motionConfig: { variant: "breath", intensity: "low", accent: "#00d4ff" },
      images: {},
      tier: "free",
    };
    expect(() => SiteConfigSchema.parse(config)).not.toThrow();
  });

  it("rejects a config with no slug", () => {
    const bad = { direction: "zero-point" };
    expect(() => SiteConfigSchema.parse(bad)).toThrow();
  });

  it("rejects invalid hex in palette", () => {
    const bad = {
      slug: "x",
      direction: "zero-point",
      palette: { bg: "not-a-color", fg: "#fff", accent: "#f00", muted: "#888" },
      typography: { heading: "A", body: "B", scale: 1 },
      copy: { hero: { eyebrow: "", headline: "H", sub: "S", cta: "C" }, sections: [] },
      motionConfig: { variant: "breath", intensity: "low", accent: "#f00" },
      images: {},
      tier: "free",
    };
    expect(() => SiteConfigSchema.parse(bad)).toThrow();
  });
});

describe("Direction", () => {
  it("has the required metadata shape", () => {
    const d: Direction = {
      name: "zero-point",
      displayName: "Zero-Point",
      tags: ["minimal"],
      paletteConstraints: { mode: "dark", accentCount: 1, backgroundBias: "near-black", saturation: "muted-to-vivid-accent" },
      slotSchema: { hero: { eyebrow: true, headline: true, sub: true, cta: true }, sections: { min: 0, max: 5, types: ["feature", "quote", "cta"] } },
      motion: { variant: "breath", intensity: "low-to-medium" },
      status: "stable",
    };
    expect(d.name).toBe("zero-point");
  });
});
```

- [ ] **Step 2: Run — should fail**

```bash
cd ~/code/nertia && npm test -- src/directions/__tests__/types.test.ts
```

Expected: FAIL with module not found.

- [ ] **Step 3: Implement types**

Create `/Users/scottcampbell/code/nertia/src/directions/types.ts`:

```ts
import { z } from "zod";

const Hex = z.string().regex(/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/, "must be a #rrggbb or #rgb hex");

export const PaletteSchema = z.object({
  bg: Hex,
  fg: Hex,
  accent: Hex,
  muted: Hex,
});
export type Palette = z.infer<typeof PaletteSchema>;

export const TypographySchema = z.object({
  heading: z.string().min(1),
  body: z.string().min(1),
  scale: z.number().min(1).max(2),
});
export type Typography = z.infer<typeof TypographySchema>;

export const HeroSchema = z.object({
  eyebrow: z.string(),
  headline: z.string().min(1),
  sub: z.string(),
  cta: z.string(),
});

export const SectionSchema = z.object({
  type: z.enum(["feature", "quote", "cta"]),
  headline: z.string().optional(),
  body: z.string().optional(),
  cta: z.string().optional(),
});

export const CopySchema = z.object({
  hero: HeroSchema,
  sections: z.array(SectionSchema),
});
export type Copy = z.infer<typeof CopySchema>;

export const MotionConfigSchema = z.object({
  variant: z.string(),
  intensity: z.enum(["low", "low-to-medium", "medium", "high"]),
  accent: Hex,
});
export type MotionConfig = z.infer<typeof MotionConfigSchema>;

export const ImagesSchema = z.object({
  hero: z.string().url().nullable().optional(),
  sections: z.array(z.string().url()).optional(),
});

export const SiteConfigSchema = z.object({
  slug: z.string().min(1),
  direction: z.string().min(1),
  palette: PaletteSchema,
  typography: TypographySchema,
  copy: CopySchema,
  motionConfig: MotionConfigSchema,
  images: ImagesSchema,
  owner: z.string().nullable().optional(),
  tier: z.enum(["free", "paid"]),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
});
export type SiteConfig = z.infer<typeof SiteConfigSchema>;

export type Direction = {
  name: string;
  displayName: string;
  tags: string[];
  paletteConstraints: {
    mode: "dark" | "light" | "adaptive";
    accentCount: number;
    backgroundBias: "near-black" | "near-white" | "warm" | "cool";
    saturation: "muted" | "muted-to-vivid-accent" | "vivid";
  };
  slotSchema: {
    hero: { eyebrow: boolean; headline: boolean; sub: boolean; cta: boolean };
    sections: { min: number; max: number; types: Array<"feature" | "quote" | "cta"> };
  };
  motion: { variant: string; intensity: "low" | "low-to-medium" | "medium" | "high" };
  status: "draft" | "stable";
};
```

- [ ] **Step 4: Run — should pass**

```bash
cd ~/code/nertia && npm test -- src/directions/__tests__/types.test.ts
```

Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
cd ~/code/nertia && git add src/directions/ && git commit -m "feat(directions): Direction + SiteConfig types with zod schemas"
```

---

## Task 3: Humanize Rules Library

**Files:**
- Create: `src/lib/humanize.ts`
- Create: `src/lib/__tests__/humanize.test.ts`

- [ ] **Step 1: Write failing test**

Create `/Users/scottcampbell/code/nertia/src/lib/__tests__/humanize.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { humanize, containsBannedPhrase, BANNED_PHRASES } from "@/lib/humanize";

describe("humanize()", () => {
  it("replaces em-dashes with commas or periods", () => {
    const out = humanize("We build things — carefully.");
    expect(out).not.toContain("—");
  });

  it("replaces en-dashes with hyphens", () => {
    const out = humanize("2024–2025");
    expect(out).not.toContain("–");
    expect(out).toContain("-");
  });

  it("strips common AI tells", () => {
    const out = humanize("In today's fast-paced world, we deliver solutions that truly make a difference.");
    expect(out.toLowerCase()).not.toContain("in today's fast-paced world");
    expect(out.toLowerCase()).not.toContain("truly make a difference");
  });

  it("normalizes smart quotes to straight quotes", () => {
    const out = humanize("\u201chello\u201d and \u2018world\u2019");
    expect(out).toBe('"hello" and \'world\'');
  });

  it("does not mangle normal text", () => {
    const input = "We build websites for small businesses.";
    expect(humanize(input)).toBe(input);
  });
});

describe("containsBannedPhrase()", () => {
  it("detects a banned phrase", () => {
    expect(containsBannedPhrase("unlock the real power of AI")).toBe(true);
  });
  it("ignores clean copy", () => {
    expect(containsBannedPhrase("We build websites.")).toBe(false);
  });
  it("is case-insensitive", () => {
    expect(containsBannedPhrase("THE REAL POWER")).toBe(true);
  });
});

describe("BANNED_PHRASES", () => {
  it("includes the usual suspects", () => {
    const set = new Set(BANNED_PHRASES.map((p) => p.toLowerCase()));
    expect(set.has("the real power")).toBe(true);
    expect(set.has("in today's fast-paced world")).toBe(true);
    expect(set.has("game-changing")).toBe(true);
  });
});
```

- [ ] **Step 2: Run — should fail**

```bash
cd ~/code/nertia && npm test -- src/lib/__tests__/humanize.test.ts
```

Expected: FAIL with module not found.

- [ ] **Step 3: Implement**

Create `/Users/scottcampbell/code/nertia/src/lib/humanize.ts`:

```ts
export const BANNED_PHRASES = [
  "the real power",
  "unlock the",
  "in today's fast-paced world",
  "truly make a difference",
  "game-changing",
  "at the end of the day",
  "cutting-edge",
  "take your business to the next level",
  "revolutionize",
  "leverage",
  "seamlessly integrate",
  "empower",
  "robust solution",
  "innovative solution",
  "unparalleled",
  "elevate your",
  "it's not just X, it's Y",
];

const SMART_QUOTES: Record<string, string> = {
  "\u201c": '"',
  "\u201d": '"',
  "\u2018": "'",
  "\u2019": "'",
};

export function containsBannedPhrase(text: string): boolean {
  const lower = text.toLowerCase();
  return BANNED_PHRASES.some((p) => lower.includes(p.toLowerCase()));
}

function stripBannedPhrases(text: string): string {
  let out = text;
  for (const phrase of BANNED_PHRASES) {
    const re = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    out = out.replace(re, "");
  }
  return out.replace(/\s{2,}/g, " ").replace(/\s+([,.!?])/g, "$1").trim();
}

function normalizeDashes(text: string): string {
  return text
    .replace(/\s*[\u2014]\s*/g, ". ")
    .replace(/[\u2013]/g, "-");
}

function normalizeQuotes(text: string): string {
  return text.replace(/[\u201c\u201d\u2018\u2019]/g, (ch) => SMART_QUOTES[ch] ?? ch);
}

export function humanize(text: string): string {
  let out = text;
  out = normalizeQuotes(out);
  out = normalizeDashes(out);
  out = stripBannedPhrases(out);
  return out;
}
```

- [ ] **Step 4: Run — should pass**

```bash
cd ~/code/nertia && npm test -- src/lib/__tests__/humanize.test.ts
```

Expected: all pass.

- [ ] **Step 5: Commit**

```bash
cd ~/code/nertia && git add src/lib/humanize.ts src/lib/__tests__/humanize.test.ts && git commit -m "feat(lib): humanize rules — banned phrases, dashes, smart quotes"
```

---

## Task 4: Slug Generator

**Files:**
- Create: `src/lib/slug.ts`
- Create: `src/lib/__tests__/slug.test.ts`

- [ ] **Step 1: Write failing test**

Create `/Users/scottcampbell/code/nertia/src/lib/__tests__/slug.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { slugify, uniqueSlug } from "@/lib/slug";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Acme Corp")).toBe("acme-corp");
  });
  it("strips punctuation", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
  });
  it("collapses repeated separators", () => {
    expect(slugify("  foo   bar  ")).toBe("foo-bar");
  });
  it("returns a fallback for empty input", () => {
    expect(slugify("").length).toBeGreaterThan(0);
  });
  it("caps length at 40", () => {
    const long = "x".repeat(100);
    expect(slugify(long).length).toBeLessThanOrEqual(40);
  });
});

describe("uniqueSlug", () => {
  it("returns the base slug when free", async () => {
    const check = async (_s: string) => false;
    expect(await uniqueSlug("acme", check)).toBe("acme");
  });
  it("appends a short hash on collision", async () => {
    const taken = new Set(["acme"]);
    const check = async (s: string) => taken.has(s);
    const out = await uniqueSlug("acme", check);
    expect(out).not.toBe("acme");
    expect(out).toMatch(/^acme-[a-z0-9]{4,6}$/);
  });
});
```

- [ ] **Step 2: Run — should fail**

```bash
cd ~/code/nertia && npm test -- src/lib/__tests__/slug.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement**

Create `/Users/scottcampbell/code/nertia/src/lib/slug.ts`:

```ts
const MAX_LEN = 40;

export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const trimmed = base.slice(0, MAX_LEN);
  return trimmed || randomSlug();
}

function randomSlug(): string {
  return "site-" + Math.random().toString(36).slice(2, 8);
}

function shortHash(): string {
  return Math.random().toString(36).slice(2, 8);
}

export async function uniqueSlug(
  base: string,
  isTaken: (slug: string) => Promise<boolean>,
  maxAttempts = 5,
): Promise<string> {
  const candidate = slugify(base);
  if (!(await isTaken(candidate))) return candidate;
  for (let i = 0; i < maxAttempts; i++) {
    const next = `${candidate}-${shortHash()}`.slice(0, MAX_LEN);
    if (!(await isTaken(next))) return next;
  }
  throw new Error("could not find a unique slug after retries");
}
```

- [ ] **Step 4: Run — should pass**

```bash
cd ~/code/nertia && npm test -- src/lib/__tests__/slug.test.ts
```

Expected: all pass.

- [ ] **Step 5: Commit**

```bash
cd ~/code/nertia && git add src/lib/slug.ts src/lib/__tests__/slug.test.ts && git commit -m "feat(lib): slug generator with collision handling"
```

---

## Task 5: Zero-Point Direction (static parts)

**Files:**
- Create: `src/directions/zero-point/direction.ts`
- Create: `src/directions/zero-point/motion.ts`
- Create: `src/directions/zero-point/sample.json`
- Create: `src/directions/zero-point/README.md`
- Create: `src/directions/index.ts`
- Create: `src/directions/__tests__/registry.test.ts`

- [ ] **Step 1: Write the README**

Create `/Users/scottcampbell/code/nertia/src/directions/zero-point/README.md`:

```md
# zero-point (flagship)

**Aesthetic:** Void / vacuum. Near-black canvas, one emergent accent color, minimalist scientific typography, single kinetic element. Coiled energy in emptiness.

**When to pick this:** Tech / AI / research / high-concept brand, or when the client leans "quiet and confident." Not for warm or friendly small-business personas.

**Forbidden:**
- full-canvas gradients
- multi-color palettes (only one accent)
- busy hero (one focal element max)
- rounded bubbles, playful type
- tech-bro clichés (neon terminals, Matrix code, robot mascots)

**Typography:** Inter or Söhne family. Heading display-weight at 200pt+, body 15-17px, generous tracking on uppercase eyebrows.

**Motion:** Single breath or pulse at low intensity. Never busy. Motion answers to the "latent potential" idea — suggestion, not performance.

**Reference starters:** `chatbot` (base dark theme), `motion-primitives` (pick one low-intensity primitive), `background-snippets` (monochrome noise/grid). See `docs/directions-starter-refs.md`.
```

- [ ] **Step 2: Write direction.ts**

Create `/Users/scottcampbell/code/nertia/src/directions/zero-point/direction.ts`:

```ts
import type { Direction } from "@/directions/types";

export const direction: Direction = {
  name: "zero-point",
  displayName: "Zero-Point",
  tags: ["minimal", "scientific", "dark", "kinetic", "tech", "concept"],
  paletteConstraints: {
    mode: "dark",
    accentCount: 1,
    backgroundBias: "near-black",
    saturation: "muted-to-vivid-accent",
  },
  slotSchema: {
    hero: { eyebrow: true, headline: true, sub: true, cta: true },
    sections: { min: 0, max: 5, types: ["feature", "quote", "cta"] },
  },
  motion: { variant: "breath", intensity: "low-to-medium" },
  status: "stable",
};
```

- [ ] **Step 3: Write motion.ts**

Create `/Users/scottcampbell/code/nertia/src/directions/zero-point/motion.ts`:

```ts
export const breath = {
  keyframes: [
    { opacity: 0.6, scale: 1 },
    { opacity: 0.9, scale: 1.015 },
    { opacity: 0.6, scale: 1 },
  ],
  options: {
    duration: 6,
    repeat: Infinity,
    ease: [0.4, 0, 0.6, 1] as [number, number, number, number],
  },
};
```

- [ ] **Step 4: Write sample.json**

Create `/Users/scottcampbell/code/nertia/src/directions/zero-point/sample.json`:

```json
{
  "slug": "sample-zero-point",
  "direction": "zero-point",
  "palette": { "bg": "#0a0a0a", "fg": "#f5f5f5", "accent": "#00d4ff", "muted": "#6b6b6b" },
  "typography": { "heading": "Inter Display", "body": "Inter", "scale": 1.35 },
  "copy": {
    "hero": {
      "eyebrow": "ZERO-POINT",
      "headline": "From vacuum, everything.",
      "sub": "A quiet surface where your idea emerges.",
      "cta": "Begin"
    },
    "sections": [
      { "type": "feature", "headline": "Latent", "body": "The blank state isn't empty. It's coiled." },
      { "type": "cta", "headline": "Start yours", "cta": "Begin" }
    ]
  },
  "motionConfig": { "variant": "breath", "intensity": "low", "accent": "#00d4ff" },
  "images": {},
  "tier": "free"
}
```

- [ ] **Step 5: Write directions registry**

Create `/Users/scottcampbell/code/nertia/src/directions/index.ts`:

```ts
import { direction as zeroPoint } from "./zero-point/direction";
import type { Direction } from "./types";

export const directions: Record<string, Direction> = {
  "zero-point": zeroPoint,
};

export function getDirection(name: string): Direction | null {
  return directions[name] ?? null;
}

export function listStableDirections(): Direction[] {
  return Object.values(directions).filter((d) => d.status === "stable");
}
```

- [ ] **Step 6: Test the registry**

Create `/Users/scottcampbell/code/nertia/src/directions/__tests__/registry.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { directions, getDirection, listStableDirections } from "@/directions";
import sample from "@/directions/zero-point/sample.json";
import { SiteConfigSchema } from "@/directions/types";

describe("directions registry", () => {
  it("includes zero-point", () => {
    expect(directions["zero-point"]).toBeDefined();
    expect(getDirection("zero-point")?.displayName).toBe("Zero-Point");
  });
  it("lists only stable directions", () => {
    const stable = listStableDirections();
    expect(stable.length).toBeGreaterThan(0);
    stable.forEach((d) => expect(d.status).toBe("stable"));
  });
  it("zero-point sample validates", () => {
    expect(() => SiteConfigSchema.parse(sample)).not.toThrow();
  });
});
```

- [ ] **Step 7: Run — should pass**

```bash
cd ~/code/nertia && npm test -- src/directions
```

Expected: 3 new tests pass plus the 3 type tests.

- [ ] **Step 8: Commit**

```bash
cd ~/code/nertia && git add src/directions/ && git commit -m "feat(directions): add zero-point direction (metadata, motion, sample)"
```

---

## Task 6: Zero-Point Layout Component

**Files:**
- Create: `src/directions/zero-point/Layout.tsx`
- Create: `src/directions/zero-point/__tests__/Layout.test.tsx`

- [ ] **Step 1: Write the test**

Create `/Users/scottcampbell/code/nertia/src/directions/zero-point/__tests__/Layout.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Layout } from "@/directions/zero-point/Layout";
import sample from "@/directions/zero-point/sample.json";
import type { SiteConfig } from "@/directions/types";

describe("zero-point Layout", () => {
  const site = sample as unknown as SiteConfig;

  it("renders the headline", () => {
    render(<Layout site={site} />);
    expect(screen.getByRole("heading", { name: /from vacuum, everything/i })).toBeInTheDocument();
  });

  it("renders the eyebrow", () => {
    render(<Layout site={site} />);
    expect(screen.getByText(/zero-point/i)).toBeInTheDocument();
  });

  it("renders the cta", () => {
    render(<Layout site={site} />);
    expect(screen.getByRole("button", { name: /begin/i })).toBeInTheDocument();
  });

  it("renders all sections", () => {
    render(<Layout site={site} />);
    expect(screen.getByText(/latent/i)).toBeInTheDocument();
  });

  it("applies palette as inline CSS variables", () => {
    const { container } = render(<Layout site={site} />);
    const root = container.firstChild as HTMLElement;
    expect(root.style.getPropertyValue("--bg")).toBe("#0a0a0a");
    expect(root.style.getPropertyValue("--accent")).toBe("#00d4ff");
  });
});
```

- [ ] **Step 2: Run — should fail**

```bash
cd ~/code/nertia && npm test -- src/directions/zero-point
```

Expected: FAIL with Layout not found.

- [ ] **Step 3: Implement Layout**

Create `/Users/scottcampbell/code/nertia/src/directions/zero-point/Layout.tsx`:

```tsx
import type { SiteConfig } from "@/directions/types";

export function Layout({ site }: { site: SiteConfig }) {
  const { palette, copy, typography } = site;
  const cssVars = {
    "--bg": palette.bg,
    "--fg": palette.fg,
    "--accent": palette.accent,
    "--muted": palette.muted,
    "--font-heading": typography.heading,
    "--font-body": typography.body,
  } as React.CSSProperties;

  return (
    <div
      style={cssVars}
      className="min-h-screen"
    >
      <div
        style={{
          backgroundColor: "var(--bg)",
          color: "var(--fg)",
          fontFamily: "var(--font-body), ui-sans-serif, system-ui",
          minHeight: "100vh",
        }}
      >
        <main className="mx-auto max-w-4xl px-6 py-24 md:py-40">
          {/* Hero */}
          <section className="space-y-8">
            {copy.hero.eyebrow && (
              <p
                className="text-xs uppercase tracking-[0.3em]"
                style={{ color: "var(--accent)" }}
              >
                {copy.hero.eyebrow}
              </p>
            )}
            <h1
              className="text-5xl md:text-7xl leading-[1.05] tracking-tight"
              style={{ fontFamily: "var(--font-heading), ui-sans-serif" }}
            >
              {copy.hero.headline}
            </h1>
            {copy.hero.sub && (
              <p className="max-w-xl text-lg md:text-xl" style={{ color: "var(--muted)" }}>
                {copy.hero.sub}
              </p>
            )}
            {copy.hero.cta && (
              <button
                type="button"
                className="mt-4 inline-flex items-center rounded-none border px-6 py-3 text-sm uppercase tracking-widest transition"
                style={{
                  borderColor: "var(--accent)",
                  color: "var(--accent)",
                }}
              >
                {copy.hero.cta}
              </button>
            )}
          </section>

          {/* Sections */}
          {copy.sections.length > 0 && (
            <div className="mt-32 space-y-24">
              {copy.sections.map((section, i) => (
                <section key={i} className="grid md:grid-cols-2 gap-8 items-start">
                  <div>
                    {section.headline && (
                      <h2
                        className="text-3xl md:text-4xl"
                        style={{ fontFamily: "var(--font-heading), ui-sans-serif" }}
                      >
                        {section.headline}
                      </h2>
                    )}
                  </div>
                  <div>
                    {section.body && (
                      <p className="text-base md:text-lg" style={{ color: "var(--muted)" }}>
                        {section.body}
                      </p>
                    )}
                    {section.cta && (
                      <button
                        type="button"
                        className="mt-6 inline-flex items-center px-6 py-3 text-sm uppercase tracking-widest transition"
                        style={{ borderColor: "var(--accent)", color: "var(--accent)", border: "1px solid" }}
                      >
                        {section.cta}
                      </button>
                    )}
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run — should pass**

```bash
cd ~/code/nertia && npm test -- src/directions/zero-point
```

Expected: 5 tests pass.

- [ ] **Step 5: Commit**

```bash
cd ~/code/nertia && git add src/directions/zero-point/Layout.tsx src/directions/zero-point/__tests__/ && git commit -m "feat(directions): zero-point Layout with slot-based rendering"
```

---

## Task 7: Firebase Admin SDK + siteStore

**Files:**
- Create: `src/lib/firebaseAdmin.ts`
- Create: `src/lib/siteStore.ts`
- Create: `src/lib/__tests__/siteStore.test.ts`
- Modify: `package.json` (add `firebase-admin`)
- Modify: `.env.example` (add admin creds)

- [ ] **Step 1: Install firebase-admin**

```bash
cd ~/code/nertia && npm install firebase-admin
```

- [ ] **Step 2: Write failing test**

Create `/Users/scottcampbell/code/nertia/src/lib/__tests__/siteStore.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGet = vi.fn();
const mockSet = vi.fn();
const mockRef = vi.fn(() => ({ get: mockGet, set: mockSet }));

vi.mock("@/lib/firebaseAdmin", () => ({
  getAdminDb: () => ({ ref: mockRef }),
}));

import { getSite, putSite, slugIsTaken } from "@/lib/siteStore";
import type { SiteConfig } from "@/directions/types";

beforeEach(() => {
  mockGet.mockReset();
  mockSet.mockReset();
  mockRef.mockClear();
});

const fixture: SiteConfig = {
  slug: "acme",
  direction: "zero-point",
  palette: { bg: "#0a0a0a", fg: "#fff", accent: "#0ff", muted: "#888" },
  typography: { heading: "Inter", body: "Inter", scale: 1.25 },
  copy: { hero: { eyebrow: "", headline: "H", sub: "S", cta: "C" }, sections: [] },
  motionConfig: { variant: "breath", intensity: "low", accent: "#0ff" },
  images: {},
  tier: "free",
};

describe("siteStore", () => {
  it("getSite returns parsed config when found", async () => {
    mockGet.mockResolvedValue({ exists: () => true, val: () => fixture });
    const out = await getSite("acme");
    expect(out?.slug).toBe("acme");
    expect(mockRef).toHaveBeenCalledWith("sites/acme");
  });

  it("getSite returns null when not found", async () => {
    mockGet.mockResolvedValue({ exists: () => false, val: () => null });
    expect(await getSite("nope")).toBeNull();
  });

  it("putSite writes to the right path with timestamps", async () => {
    mockSet.mockResolvedValue(undefined);
    const out = await putSite(fixture);
    expect(mockRef).toHaveBeenCalledWith("sites/acme");
    expect(mockSet).toHaveBeenCalled();
    const written = (mockSet.mock.calls[0] as [SiteConfig])[0];
    expect(written.createdAt).toBeTypeOf("number");
    expect(written.updatedAt).toBeTypeOf("number");
    expect(out.slug).toBe("acme");
  });

  it("slugIsTaken checks existence", async () => {
    mockGet.mockResolvedValue({ exists: () => true, val: () => fixture });
    expect(await slugIsTaken("acme")).toBe(true);
    mockGet.mockResolvedValue({ exists: () => false });
    expect(await slugIsTaken("free")).toBe(false);
  });
});
```

- [ ] **Step 3: Run — should fail**

```bash
cd ~/code/nertia && npm test -- src/lib/__tests__/siteStore.test.ts
```

Expected: FAIL.

- [ ] **Step 4: Implement firebaseAdmin**

Create `/Users/scottcampbell/code/nertia/src/lib/firebaseAdmin.ts`:

```ts
import { getApps, initializeApp, cert, applicationDefault, type App } from "firebase-admin/app";
import { getDatabase, type Database } from "firebase-admin/database";

let app: App | null = null;

function initAdmin(): App {
  if (app) return app;
  if (getApps().length > 0) {
    app = getApps()[0]!;
    return app;
  }
  const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
  if (!databaseURL) {
    throw new Error("NEXT_PUBLIC_FIREBASE_DATABASE_URL is required for firebase-admin");
  }

  const credJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (credJson) {
    app = initializeApp({
      credential: cert(JSON.parse(credJson)),
      databaseURL,
    });
  } else {
    // Fall back to ADC (works locally with `gcloud auth application-default login`)
    app = initializeApp({ credential: applicationDefault(), databaseURL });
  }
  return app;
}

export function getAdminDb(): Database {
  return getDatabase(initAdmin());
}
```

- [ ] **Step 5: Implement siteStore**

Create `/Users/scottcampbell/code/nertia/src/lib/siteStore.ts`:

```ts
import { getAdminDb } from "@/lib/firebaseAdmin";
import { SiteConfigSchema, type SiteConfig } from "@/directions/types";

export async function getSite(slug: string): Promise<SiteConfig | null> {
  const snap = await getAdminDb().ref(`sites/${slug}`).get();
  if (!snap.exists()) return null;
  const raw = snap.val();
  return SiteConfigSchema.parse(raw);
}

export async function putSite(config: SiteConfig): Promise<SiteConfig> {
  const now = Date.now();
  const next: SiteConfig = {
    ...config,
    createdAt: config.createdAt ?? now,
    updatedAt: now,
  };
  SiteConfigSchema.parse(next);
  await getAdminDb().ref(`sites/${next.slug}`).set(next);
  return next;
}

export async function slugIsTaken(slug: string): Promise<boolean> {
  const snap = await getAdminDb().ref(`sites/${slug}`).get();
  return snap.exists();
}
```

- [ ] **Step 6: Update .env.example**

Create or edit `/Users/scottcampbell/code/nertia/.env.example`:

```bash
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Server-only: JSON string of a Firebase service account
# (get from Firebase console → Project settings → Service accounts)
FIREBASE_SERVICE_ACCOUNT_JSON=

# Bypass real generation in tests / demo
USE_DEMO_MODE=false
```

- [ ] **Step 7: Run — should pass**

```bash
cd ~/code/nertia && npm test -- src/lib/__tests__/siteStore.test.ts
```

Expected: 4 tests pass.

- [ ] **Step 8: Commit**

```bash
cd ~/code/nertia && git add package.json package-lock.json src/lib/firebaseAdmin.ts src/lib/siteStore.ts src/lib/__tests__/siteStore.test.ts .env.example && git commit -m "feat(lib): firebase-admin + siteStore CRUD with schema validation"
```

---

## Task 8: Generator Pipeline — step 1: pickDirection

**Files:**
- Create: `src/lib/generator/prompts.ts`
- Create: `src/lib/generator/pickDirection.ts`
- Create: `src/lib/generator/__tests__/pickDirection.test.ts`

- [ ] **Step 1: Install Anthropic SDK if not present**

```bash
cd ~/code/nertia && node -e "console.log(require('./package.json').dependencies['@anthropic-ai/sdk'])"
```

Already present (0.71.2). Skip install.

- [ ] **Step 2: Write the test**

Create `/Users/scottcampbell/code/nertia/src/lib/generator/__tests__/pickDirection.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCreate = vi.fn();
vi.mock("@anthropic-ai/sdk", () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: { create: mockCreate },
  })),
}));

import { pickDirection } from "@/lib/generator/pickDirection";

beforeEach(() => mockCreate.mockReset());

describe("pickDirection", () => {
  it("returns the parsed direction name", async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: "text", text: '{"direction":"zero-point","reason":"tech/concept lean"}' }],
    });
    const out = await pickDirection({ briefSummary: "AI research lab", tone: "quiet" });
    expect(out.direction).toBe("zero-point");
    expect(mockCreate).toHaveBeenCalled();
  });

  it("falls back to zero-point if model returns unknown direction", async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: "text", text: '{"direction":"does-not-exist","reason":"x"}' }],
    });
    const out = await pickDirection({ briefSummary: "x", tone: "y" });
    expect(out.direction).toBe("zero-point");
  });

  it("falls back on invalid JSON", async () => {
    mockCreate.mockResolvedValue({ content: [{ type: "text", text: "nonsense" }] });
    const out = await pickDirection({ briefSummary: "x", tone: "y" });
    expect(out.direction).toBe("zero-point");
  });
});
```

- [ ] **Step 3: Run — should fail**

```bash
cd ~/code/nertia && npm test -- src/lib/generator/__tests__/pickDirection.test.ts
```

Expected: FAIL.

- [ ] **Step 4: Write prompts.ts**

Create `/Users/scottcampbell/code/nertia/src/lib/generator/prompts.ts`:

```ts
import { listStableDirections } from "@/directions";

export function directionLibraryManifest(): string {
  return listStableDirections()
    .map(
      (d) =>
        `- ${d.name} (${d.displayName}): ${d.tags.join(", ")}. mode=${d.paletteConstraints.mode}, motion=${d.motion.variant}`,
    )
    .join("\n");
}

export const SYSTEM_PICK_DIRECTION = `You are nertia's art director. Pick ONE direction from the library that best matches the brief.

Rules:
- Return strict JSON only: { "direction": "<name>", "reason": "<20 words max>" }
- "direction" MUST be one of the names in the library below.
- No preamble, no prose, no code fences.`;

export const SYSTEM_GENERATE_PALETTE = `You are nertia's art director. Given a direction and brief, return a palette as strict JSON.

Rules:
- Return JSON only: { "bg": "#rrggbb", "fg": "#rrggbb", "accent": "#rrggbb", "muted": "#rrggbb" }
- Respect the direction's palette constraints (mode, background bias, accent count).
- Colors must be valid #rrggbb hex.`;

export const SYSTEM_WRITE_COPY = `You are nertia's copywriter. Write the site copy in a human voice.

Rules:
- Return JSON only matching the schema provided.
- No AI tells. No em-dashes (use commas or periods). No smart quotes.
- Banned phrases: "the real power", "game-changing", "cutting-edge", "leverage", "revolutionize", "unlock", "seamlessly integrate", "empower", "in today's fast-paced world", "at the end of the day", "take your business to the next level", "truly make a difference".
- Short, specific, concrete. No abstractions.`;

export const SYSTEM_PARAM_MOTION = `You are nertia's motion designer. Parameterize one motion element for this site.

Rules:
- Return JSON only: { "variant": "<string>", "intensity": "low" | "low-to-medium" | "medium" | "high", "accent": "#rrggbb" }
- Intensity must match the direction's motion profile.`;
```

- [ ] **Step 5: Write pickDirection.ts**

Create `/Users/scottcampbell/code/nertia/src/lib/generator/pickDirection.ts`:

```ts
import Anthropic from "@anthropic-ai/sdk";
import { directions } from "@/directions";
import { SYSTEM_PICK_DIRECTION, directionLibraryManifest } from "./prompts";

export type PickDirectionInput = { briefSummary: string; tone: string };
export type PickDirectionOutput = { direction: string; reason: string };

const FALLBACK: PickDirectionOutput = { direction: "zero-point", reason: "fallback" };

export async function pickDirection(input: PickDirectionInput): Promise<PickDirectionOutput> {
  const client = new Anthropic();
  const library = directionLibraryManifest();

  const res = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 200,
    system: [
      { type: "text", text: SYSTEM_PICK_DIRECTION, cache_control: { type: "ephemeral" } },
      { type: "text", text: `Library:\n${library}`, cache_control: { type: "ephemeral" } },
    ],
    messages: [
      { role: "user", content: `Brief summary: ${input.briefSummary}\nTone: ${input.tone}` },
    ],
  });

  const text = res.content.find((c) => c.type === "text")?.type === "text"
    ? (res.content.find((c) => c.type === "text") as { type: "text"; text: string }).text
    : "";

  try {
    const parsed = JSON.parse(text) as PickDirectionOutput;
    if (!directions[parsed.direction]) return FALLBACK;
    return parsed;
  } catch {
    return FALLBACK;
  }
}
```

- [ ] **Step 6: Run — should pass**

```bash
cd ~/code/nertia && npm test -- src/lib/generator/__tests__/pickDirection.test.ts
```

Expected: 3 tests pass.

- [ ] **Step 7: Commit**

```bash
cd ~/code/nertia && git add src/lib/generator/ && git commit -m "feat(generator): step 1 — pickDirection via Haiku with cached manifest"
```

---

## Task 9: Generator Pipeline — steps 2-4 (palette, copy, motion)

**Files:**
- Create: `src/lib/generator/generatePalette.ts`
- Create: `src/lib/generator/writeCopy.ts`
- Create: `src/lib/generator/paramMotion.ts`
- Create: `src/lib/generator/__tests__/generatePalette.test.ts`
- Create: `src/lib/generator/__tests__/writeCopy.test.ts`
- Create: `src/lib/generator/__tests__/paramMotion.test.ts`

- [ ] **Step 1: Write tests for generatePalette**

Create `/Users/scottcampbell/code/nertia/src/lib/generator/__tests__/generatePalette.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCreate = vi.fn();
vi.mock("@anthropic-ai/sdk", () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: { create: mockCreate },
  })),
}));

import { generatePalette } from "@/lib/generator/generatePalette";

beforeEach(() => mockCreate.mockReset());

describe("generatePalette", () => {
  it("returns a valid palette", async () => {
    mockCreate.mockResolvedValue({
      content: [
        { type: "text", text: '{"bg":"#0a0a0a","fg":"#f5f5f5","accent":"#00d4ff","muted":"#6b6b6b"}' },
      ],
    });
    const out = await generatePalette({ direction: "zero-point", briefSummary: "AI lab" });
    expect(out.bg).toBe("#0a0a0a");
    expect(out.accent).toBe("#00d4ff");
  });

  it("falls back on invalid JSON", async () => {
    mockCreate.mockResolvedValue({ content: [{ type: "text", text: "bad" }] });
    const out = await generatePalette({ direction: "zero-point", briefSummary: "x" });
    expect(out.bg).toMatch(/^#/);
  });

  it("falls back on invalid hex", async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: "text", text: '{"bg":"not-a-hex","fg":"#fff","accent":"#0ff","muted":"#888"}' }],
    });
    const out = await generatePalette({ direction: "zero-point", briefSummary: "x" });
    expect(out.bg).toMatch(/^#[0-9a-fA-F]{6}$/);
  });
});
```

- [ ] **Step 2: Implement generatePalette**

Create `/Users/scottcampbell/code/nertia/src/lib/generator/generatePalette.ts`:

```ts
import Anthropic from "@anthropic-ai/sdk";
import { PaletteSchema, type Palette } from "@/directions/types";
import { getDirection } from "@/directions";
import { SYSTEM_GENERATE_PALETTE } from "./prompts";

export type GeneratePaletteInput = { direction: string; briefSummary: string };

const FALLBACKS: Record<string, Palette> = {
  "zero-point": { bg: "#0a0a0a", fg: "#f5f5f5", accent: "#00d4ff", muted: "#6b6b6b" },
};
const DEFAULT_FALLBACK: Palette = FALLBACKS["zero-point"];

export async function generatePalette(input: GeneratePaletteInput): Promise<Palette> {
  const client = new Anthropic();
  const dir = getDirection(input.direction);
  const constraints = dir
    ? `Direction: ${dir.name}. Constraints: mode=${dir.paletteConstraints.mode}, background=${dir.paletteConstraints.backgroundBias}, accentCount=${dir.paletteConstraints.accentCount}`
    : `Direction: ${input.direction}`;

  try {
    const res = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      system: [
        { type: "text", text: SYSTEM_GENERATE_PALETTE, cache_control: { type: "ephemeral" } },
        { type: "text", text: constraints, cache_control: { type: "ephemeral" } },
      ],
      messages: [{ role: "user", content: `Brief: ${input.briefSummary}` }],
    });
    const text = res.content.find((c) => c.type === "text");
    if (!text || text.type !== "text") return FALLBACKS[input.direction] ?? DEFAULT_FALLBACK;
    return PaletteSchema.parse(JSON.parse(text.text));
  } catch {
    return FALLBACKS[input.direction] ?? DEFAULT_FALLBACK;
  }
}
```

- [ ] **Step 3: Run — should pass**

```bash
cd ~/code/nertia && npm test -- src/lib/generator/__tests__/generatePalette.test.ts
```

Expected: 3 pass.

- [ ] **Step 4: Write tests for writeCopy**

Create `/Users/scottcampbell/code/nertia/src/lib/generator/__tests__/writeCopy.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCreate = vi.fn();
vi.mock("@anthropic-ai/sdk", () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: { create: mockCreate },
  })),
}));

import { writeCopy } from "@/lib/generator/writeCopy";

beforeEach(() => mockCreate.mockReset());

const goodResponse = JSON.stringify({
  hero: { eyebrow: "ACME", headline: "We build things.", sub: "Small and true.", cta: "Talk" },
  sections: [{ type: "feature", headline: "F", body: "B" }],
});

describe("writeCopy", () => {
  it("returns parsed copy", async () => {
    mockCreate.mockResolvedValue({ content: [{ type: "text", text: goodResponse }] });
    const out = await writeCopy({ direction: "zero-point", briefSummary: "acme", tone: "quiet" });
    expect(out.hero.headline).toBe("We build things.");
  });

  it("strips em-dashes via humanize pass", async () => {
    const withDash = JSON.stringify({
      hero: { eyebrow: "X", headline: "We build — carefully.", sub: "", cta: "Go" },
      sections: [],
    });
    mockCreate.mockResolvedValue({ content: [{ type: "text", text: withDash }] });
    const out = await writeCopy({ direction: "zero-point", briefSummary: "x", tone: "y" });
    expect(out.hero.headline).not.toContain("\u2014");
  });

  it("strips banned phrases", async () => {
    const banned = JSON.stringify({
      hero: { eyebrow: "X", headline: "Unlock the real power of AI.", sub: "", cta: "Go" },
      sections: [],
    });
    mockCreate.mockResolvedValue({ content: [{ type: "text", text: banned }] });
    const out = await writeCopy({ direction: "zero-point", briefSummary: "x", tone: "y" });
    expect(out.hero.headline.toLowerCase()).not.toContain("the real power");
  });
});
```

- [ ] **Step 5: Implement writeCopy**

Create `/Users/scottcampbell/code/nertia/src/lib/generator/writeCopy.ts`:

```ts
import Anthropic from "@anthropic-ai/sdk";
import { CopySchema, type Copy } from "@/directions/types";
import { humanize } from "@/lib/humanize";
import { SYSTEM_WRITE_COPY } from "./prompts";

export type WriteCopyInput = { direction: string; briefSummary: string; tone: string };

const FALLBACK: Copy = {
  hero: {
    eyebrow: "",
    headline: "Something worth building.",
    sub: "A quiet place for the idea.",
    cta: "Begin",
  },
  sections: [],
};

function humanizeCopy(c: Copy): Copy {
  const hero = {
    eyebrow: humanize(c.hero.eyebrow),
    headline: humanize(c.hero.headline),
    sub: humanize(c.hero.sub),
    cta: humanize(c.hero.cta),
  };
  const sections = c.sections.map((s) => ({
    ...s,
    headline: s.headline ? humanize(s.headline) : s.headline,
    body: s.body ? humanize(s.body) : s.body,
    cta: s.cta ? humanize(s.cta) : s.cta,
  }));
  return { hero, sections };
}

export async function writeCopy(input: WriteCopyInput): Promise<Copy> {
  const client = new Anthropic();
  try {
    const res = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
      system: [
        { type: "text", text: SYSTEM_WRITE_COPY, cache_control: { type: "ephemeral" } },
        {
          type: "text",
          text: `Schema: { "hero": { "eyebrow": str, "headline": str, "sub": str, "cta": str }, "sections": [ { "type": "feature"|"quote"|"cta", "headline"?: str, "body"?: str, "cta"?: str } ] }`,
          cache_control: { type: "ephemeral" },
        },
        { type: "text", text: `Direction: ${input.direction}` },
      ],
      messages: [{ role: "user", content: `Brief: ${input.briefSummary}\nTone: ${input.tone}` }],
    });
    const text = res.content.find((c) => c.type === "text");
    if (!text || text.type !== "text") return FALLBACK;
    const parsed = CopySchema.parse(JSON.parse(text.text));
    return humanizeCopy(parsed);
  } catch {
    return humanizeCopy(FALLBACK);
  }
}
```

- [ ] **Step 6: Run — should pass**

```bash
cd ~/code/nertia && npm test -- src/lib/generator/__tests__/writeCopy.test.ts
```

Expected: 3 pass.

- [ ] **Step 7: Write tests for paramMotion**

Create `/Users/scottcampbell/code/nertia/src/lib/generator/__tests__/paramMotion.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCreate = vi.fn();
vi.mock("@anthropic-ai/sdk", () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: { create: mockCreate },
  })),
}));

import { paramMotion } from "@/lib/generator/paramMotion";

beforeEach(() => mockCreate.mockReset());

describe("paramMotion", () => {
  it("returns parsed motion config", async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: "text", text: '{"variant":"breath","intensity":"low","accent":"#00d4ff"}' }],
    });
    const out = await paramMotion({ direction: "zero-point", accent: "#00d4ff" });
    expect(out.variant).toBe("breath");
  });

  it("falls back for invalid JSON", async () => {
    mockCreate.mockResolvedValue({ content: [{ type: "text", text: "bad" }] });
    const out = await paramMotion({ direction: "zero-point", accent: "#00d4ff" });
    expect(out.variant).toBeTypeOf("string");
    expect(out.accent).toBe("#00d4ff");
  });
});
```

- [ ] **Step 8: Implement paramMotion**

Create `/Users/scottcampbell/code/nertia/src/lib/generator/paramMotion.ts`:

```ts
import Anthropic from "@anthropic-ai/sdk";
import { MotionConfigSchema, type MotionConfig } from "@/directions/types";
import { getDirection } from "@/directions";
import { SYSTEM_PARAM_MOTION } from "./prompts";

export type ParamMotionInput = { direction: string; accent: string };

export async function paramMotion(input: ParamMotionInput): Promise<MotionConfig> {
  const client = new Anthropic();
  const dir = getDirection(input.direction);
  const fallback: MotionConfig = {
    variant: dir?.motion.variant ?? "breath",
    intensity: "low",
    accent: input.accent,
  };

  try {
    const res = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      system: [
        { type: "text", text: SYSTEM_PARAM_MOTION, cache_control: { type: "ephemeral" } },
      ],
      messages: [
        { role: "user", content: `Direction: ${input.direction}\nAccent: ${input.accent}` },
      ],
    });
    const text = res.content.find((c) => c.type === "text");
    if (!text || text.type !== "text") return fallback;
    return MotionConfigSchema.parse(JSON.parse(text.text));
  } catch {
    return fallback;
  }
}
```

- [ ] **Step 9: Run — should pass**

```bash
cd ~/code/nertia && npm test -- src/lib/generator
```

Expected: all generator tests pass.

- [ ] **Step 10: Commit**

```bash
cd ~/code/nertia && git add src/lib/generator/ && git commit -m "feat(generator): steps 2-4 — palette, copy (with humanize pass), motion"
```

---

## Task 10: Pipeline Orchestrator

**Files:**
- Create: `src/lib/generator/pipeline.ts`
- Create: `src/lib/generator/__tests__/pipeline.test.ts`

- [ ] **Step 1: Write the test**

Create `/Users/scottcampbell/code/nertia/src/lib/generator/__tests__/pipeline.test.ts`:

```ts
import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/generator/pickDirection", () => ({
  pickDirection: vi.fn(async () => ({ direction: "zero-point", reason: "test" })),
}));
vi.mock("@/lib/generator/generatePalette", () => ({
  generatePalette: vi.fn(async () => ({
    bg: "#0a0a0a",
    fg: "#f5f5f5",
    accent: "#00d4ff",
    muted: "#6b6b6b",
  })),
}));
vi.mock("@/lib/generator/writeCopy", () => ({
  writeCopy: vi.fn(async () => ({
    hero: { eyebrow: "X", headline: "We build.", sub: "Small.", cta: "Go" },
    sections: [],
  })),
}));
vi.mock("@/lib/generator/paramMotion", () => ({
  paramMotion: vi.fn(async () => ({ variant: "breath", intensity: "low", accent: "#00d4ff" })),
}));

import { generate } from "@/lib/generator/pipeline";

describe("generate", () => {
  it("produces a full SiteConfig", async () => {
    const out = await generate({
      slug: "acme",
      businessName: "Acme",
      oneLiner: "We build things",
      audience: "devs",
      vibe: "quiet confident tech",
      tone: "quiet",
      tier: "free",
    });
    expect(out.slug).toBe("acme");
    expect(out.direction).toBe("zero-point");
    expect(out.palette.bg).toBe("#0a0a0a");
    expect(out.copy.hero.headline).toBe("We build.");
    expect(out.tier).toBe("free");
  });
});
```

- [ ] **Step 2: Run — should fail**

```bash
cd ~/code/nertia && npm test -- src/lib/generator/__tests__/pipeline.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement pipeline**

Create `/Users/scottcampbell/code/nertia/src/lib/generator/pipeline.ts`:

```ts
import { pickDirection } from "./pickDirection";
import { generatePalette } from "./generatePalette";
import { writeCopy } from "./writeCopy";
import { paramMotion } from "./paramMotion";
import type { SiteConfig } from "@/directions/types";

export type BriefInput = {
  slug: string;
  businessName: string;
  oneLiner: string;
  audience: string;
  vibe: string;
  tone: string;
  tier: "free" | "paid";
  owner?: string | null;
};

export async function generate(input: BriefInput): Promise<SiteConfig> {
  const briefSummary = `${input.businessName} — ${input.oneLiner}. Audience: ${input.audience}. Vibe: ${input.vibe}.`;

  const pick = await pickDirection({ briefSummary, tone: input.tone });
  const palette = await generatePalette({ direction: pick.direction, briefSummary });
  const copy = await writeCopy({ direction: pick.direction, briefSummary, tone: input.tone });
  const motion = await paramMotion({ direction: pick.direction, accent: palette.accent });

  return {
    slug: input.slug,
    direction: pick.direction,
    palette,
    typography: { heading: "Inter Display", body: "Inter", scale: 1.3 },
    copy,
    motionConfig: motion,
    images: {},
    owner: input.owner ?? null,
    tier: input.tier,
  };
}
```

- [ ] **Step 4: Run — should pass**

```bash
cd ~/code/nertia && npm test -- src/lib/generator/__tests__/pipeline.test.ts
```

Expected: pass.

- [ ] **Step 5: Commit**

```bash
cd ~/code/nertia && git add src/lib/generator/pipeline.ts src/lib/generator/__tests__/pipeline.test.ts && git commit -m "feat(generator): pipeline orchestrator composes 4 steps into SiteConfig"
```

---

## Task 11: API Route — POST /api/generate

**Files:**
- Create: `src/app/api/generate/route.ts`
- Create: `src/app/api/generate/__tests__/route.test.ts`

- [ ] **Step 1: Write the test**

Create `/Users/scottcampbell/code/nertia/src/app/api/generate/__tests__/route.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/siteStore", () => ({
  slugIsTaken: vi.fn(async () => false),
  putSite: vi.fn(async (c) => c),
}));
vi.mock("@/lib/generator/pipeline", () => ({
  generate: vi.fn(async (input) => ({
    slug: input.slug,
    direction: "zero-point",
    palette: { bg: "#0a0a0a", fg: "#fff", accent: "#0ff", muted: "#888" },
    typography: { heading: "Inter", body: "Inter", scale: 1.25 },
    copy: { hero: { eyebrow: "", headline: "H", sub: "S", cta: "C" }, sections: [] },
    motionConfig: { variant: "breath", intensity: "low", accent: "#0ff" },
    images: {},
    owner: null,
    tier: input.tier,
  })),
}));

import { POST } from "@/app/api/generate/route";

beforeEach(() => vi.clearAllMocks());

function req(body: unknown) {
  return new Request("http://localhost/api/generate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/generate", () => {
  it("returns slug + url on valid input", async () => {
    const res = await POST(req({
      businessName: "Acme",
      oneLiner: "We build things.",
      audience: "devs",
      vibe: "quiet",
      tone: "quiet",
    }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.slug).toMatch(/^acme/);
    expect(json.url).toMatch(/nertia\.ai$/);
  });

  it("400s on invalid input", async () => {
    const res = await POST(req({ businessName: "" }));
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 2: Run — should fail**

```bash
cd ~/code/nertia && npm test -- src/app/api/generate
```

Expected: FAIL.

- [ ] **Step 3: Implement the route**

Create `/Users/scottcampbell/code/nertia/src/app/api/generate/route.ts`:

```ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { generate } from "@/lib/generator/pipeline";
import { putSite, slugIsTaken } from "@/lib/siteStore";
import { uniqueSlug, slugify } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BriefSchema = z.object({
  businessName: z.string().min(1).max(100),
  oneLiner: z.string().min(1).max(280),
  audience: z.string().min(1).max(200),
  vibe: z.string().min(1).max(100),
  tone: z.string().min(1).max(100),
  preferredSlug: z.string().optional(),
  email: z.string().email().optional(),
});

const BASE_DOMAIN = process.env.NEXT_PUBLIC_NERTIA_DOMAIN ?? "nertia.ai";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const parsed = BriefSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const input = parsed.data;
  const base = slugify(input.preferredSlug ?? input.businessName);
  const slug = await uniqueSlug(base, slugIsTaken);

  const config = await generate({
    slug,
    businessName: input.businessName,
    oneLiner: input.oneLiner,
    audience: input.audience,
    vibe: input.vibe,
    tone: input.tone,
    tier: "free",
    owner: null,
  });

  await putSite(config);

  return NextResponse.json({
    slug,
    url: `https://${slug}.${BASE_DOMAIN}`,
    direction: config.direction,
  });
}
```

- [ ] **Step 4: Run — should pass**

```bash
cd ~/code/nertia && npm test -- src/app/api/generate
```

Expected: 2 pass.

- [ ] **Step 5: Commit**

```bash
cd ~/code/nertia && git add src/app/api/generate/ && git commit -m "feat(api): POST /api/generate validates, generates, persists, returns url"
```

---

## Task 12: Subdomain Middleware

**Files:**
- Create: `middleware.ts` (at repo root)
- Create: `src/__tests__/middleware.test.ts`

- [ ] **Step 1: Write the test**

Create `/Users/scottcampbell/code/nertia/src/__tests__/middleware.test.ts`:

```ts
import { describe, it, expect, vi } from "vitest";

// Mock NextResponse.rewrite
const rewriteSpy = vi.fn((url: URL) => ({ rewritten: true, url: url.toString() }));
vi.mock("next/server", () => ({
  NextResponse: { rewrite: rewriteSpy, next: () => ({ passthrough: true }) },
}));

import { middleware } from "@/../middleware";

function req(host: string, path = "/") {
  return new Request(`https://${host}${path}`, { headers: { host } });
}

describe("middleware", () => {
  it("passes through apex host", () => {
    const out = middleware(req("nertia.ai"));
    expect(out).toEqual({ passthrough: true });
    expect(rewriteSpy).not.toHaveBeenCalled();
  });

  it("passes through localhost", () => {
    const out = middleware(req("localhost:3000"));
    expect(out).toEqual({ passthrough: true });
  });

  it("rewrites subdomain to /_sites/[slug]", () => {
    middleware(req("acme.nertia.ai", "/"));
    expect(rewriteSpy).toHaveBeenCalled();
    const url = rewriteSpy.mock.calls[0]![0] as URL;
    expect(url.pathname).toBe("/_sites/acme");
  });

  it("rewrites subdomain preserving path", () => {
    rewriteSpy.mockClear();
    middleware(req("acme.nertia.ai", "/about"));
    const url = rewriteSpy.mock.calls[0]![0] as URL;
    expect(url.pathname).toBe("/_sites/acme/about");
  });

  it("ignores www subdomain", () => {
    rewriteSpy.mockClear();
    const out = middleware(req("www.nertia.ai"));
    expect(out).toEqual({ passthrough: true });
  });
});
```

- [ ] **Step 2: Run — should fail**

```bash
cd ~/code/nertia && npm test -- src/__tests__/middleware.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement middleware**

Create `/Users/scottcampbell/code/nertia/middleware.ts`:

```ts
import { NextResponse, type NextRequest } from "next/server";

const APEX_DOMAIN = process.env.NEXT_PUBLIC_NERTIA_DOMAIN ?? "nertia.ai";
const RESERVED_SUBDOMAINS = new Set(["www", "api", "admin", "app", "mail", "blog"]);

export function middleware(req: NextRequest | Request) {
  const host = (req.headers.get("host") ?? "").toLowerCase().split(":")[0];
  if (!host) return NextResponse.next();

  // Local dev — pass through
  if (host === "localhost" || host.endsWith(".localhost")) {
    return NextResponse.next();
  }

  // Apex — pass through
  if (host === APEX_DOMAIN) {
    return NextResponse.next();
  }

  // Subdomain of apex
  if (host.endsWith(`.${APEX_DOMAIN}`)) {
    const slug = host.slice(0, -1 * (APEX_DOMAIN.length + 1));
    if (RESERVED_SUBDOMAINS.has(slug)) return NextResponse.next();

    const url = new URL((req as NextRequest).url ?? `https://${host}/`);
    const rewriteUrl = new URL(url.toString());
    rewriteUrl.pathname = `/_sites/${slug}${url.pathname === "/" ? "" : url.pathname}`;
    return NextResponse.rewrite(rewriteUrl);
  }

  // Custom domain — TODO in a later plan, for now pass through
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|icon.svg|robots.txt|sitemap.xml).*)"],
};
```

- [ ] **Step 4: Run — should pass**

```bash
cd ~/code/nertia && npm test -- src/__tests__/middleware.test.ts
```

Expected: 5 pass.

- [ ] **Step 5: Commit**

```bash
cd ~/code/nertia && git add middleware.ts src/__tests__/middleware.test.ts && git commit -m "feat(routing): middleware rewrites {slug}.nertia.ai to /_sites/[slug]"
```

---

## Task 13: Site Renderer — /_sites/[slug]/page.tsx

**Files:**
- Create: `src/app/_sites/[slug]/page.tsx`
- Create: `src/app/_sites/[slug]/__tests__/page.test.tsx`

- [ ] **Step 1: Write the test**

Create `/Users/scottcampbell/code/nertia/src/app/_sites/[slug]/__tests__/page.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/lib/siteStore", () => ({
  getSite: vi.fn(async (slug: string) => {
    if (slug === "acme") {
      return {
        slug: "acme",
        direction: "zero-point",
        palette: { bg: "#0a0a0a", fg: "#f5f5f5", accent: "#00d4ff", muted: "#6b6b6b" },
        typography: { heading: "Inter Display", body: "Inter", scale: 1.25 },
        copy: {
          hero: { eyebrow: "ACME", headline: "We build.", sub: "Small.", cta: "Go" },
          sections: [],
        },
        motionConfig: { variant: "breath", intensity: "low", accent: "#00d4ff" },
        images: {},
        tier: "free",
      };
    }
    return null;
  }),
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

import Page from "@/app/_sites/[slug]/page";

describe("/_sites/[slug]/page", () => {
  it("renders the site for a known slug", async () => {
    const ui = await Page({ params: Promise.resolve({ slug: "acme" }) });
    render(ui);
    expect(screen.getByRole("heading", { name: /we build/i })).toBeInTheDocument();
  });

  it("404s for unknown slug", async () => {
    await expect(Page({ params: Promise.resolve({ slug: "nope" }) })).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
```

- [ ] **Step 2: Run — should fail**

```bash
cd ~/code/nertia && npm test -- src/app/_sites
```

Expected: FAIL.

- [ ] **Step 3: Implement the page**

Create `/Users/scottcampbell/code/nertia/src/app/_sites/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { getSite } from "@/lib/siteStore";
import { Layout as ZeroPointLayout } from "@/directions/zero-point/Layout";
import type { SiteConfig } from "@/directions/types";

export const revalidate = 60;

function renderDirection(site: SiteConfig) {
  switch (site.direction) {
    case "zero-point":
      return <ZeroPointLayout site={site} />;
    default:
      return <ZeroPointLayout site={site} />; // fallback to flagship
  }
}

export default async function SitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = await getSite(slug);
  if (!site) notFound();
  return renderDirection(site);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = await getSite(slug);
  if (!site) return {};
  return {
    title: site.copy.hero.headline,
    description: site.copy.hero.sub,
  };
}
```

- [ ] **Step 4: Run — should pass**

```bash
cd ~/code/nertia && npm test -- src/app/_sites
```

Expected: 2 pass.

- [ ] **Step 5: Manual smoke check (dev server must be running)**

Seed a sample via curl once you have Firebase admin creds set locally. If creds aren't set yet, skip this step — the unit tests cover rendering.

Command to confirm the dev server picks up the new route (expect 404 because no seeded site yet):

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/_sites/nope
```

Expected: `404` (renderer wired up and routing works).

- [ ] **Step 6: Commit**

```bash
cd ~/code/nertia && git add src/app/_sites/ && git commit -m "feat(renderer): /_sites/[slug]/page.tsx resolves direction + renders Layout"
```

---

## Task 14: Full-Stack Smoke Test

**Files:**
- Create: `src/__tests__/smoke.integration.test.ts`

- [ ] **Step 1: Write the test (mocks Anthropic + Firebase, exercises the whole app route)**

Create `/Users/scottcampbell/code/nertia/src/__tests__/smoke.integration.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCreate = vi.fn();
vi.mock("@anthropic-ai/sdk", () => ({
  default: vi.fn().mockImplementation(() => ({ messages: { create: mockCreate } })),
}));

const store = new Map<string, unknown>();
vi.mock("@/lib/siteStore", () => ({
  slugIsTaken: vi.fn(async (slug: string) => store.has(slug)),
  putSite: vi.fn(async (c: { slug: string }) => {
    store.set(c.slug, c);
    return c;
  }),
  getSite: vi.fn(async (slug: string) => store.get(slug) ?? null),
}));

import { POST } from "@/app/api/generate/route";

beforeEach(() => {
  store.clear();
  mockCreate.mockReset();
  // Mock the 4 pipeline calls in order (pickDirection, palette, copy, motion)
  mockCreate
    .mockResolvedValueOnce({
      content: [{ type: "text", text: '{"direction":"zero-point","reason":"test"}' }],
    })
    .mockResolvedValueOnce({
      content: [
        { type: "text", text: '{"bg":"#0a0a0a","fg":"#f5f5f5","accent":"#00d4ff","muted":"#6b6b6b"}' },
      ],
    })
    .mockResolvedValueOnce({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            hero: { eyebrow: "ACME", headline: "We build.", sub: "Small.", cta: "Go" },
            sections: [],
          }),
        },
      ],
    })
    .mockResolvedValueOnce({
      content: [{ type: "text", text: '{"variant":"breath","intensity":"low","accent":"#00d4ff"}' }],
    });
});

describe("smoke: full generation flow", () => {
  it("POST /api/generate produces a stored site", async () => {
    const req = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        businessName: "Acme Labs",
        oneLiner: "Research tools for small teams.",
        audience: "founders",
        vibe: "quiet confident",
        tone: "quiet",
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.slug).toMatch(/^acme-labs/);
    expect(body.direction).toBe("zero-point");
    expect(store.has(body.slug)).toBe(true);
  });
});
```

- [ ] **Step 2: Run — should pass**

```bash
cd ~/code/nertia && npm test -- src/__tests__/smoke.integration.test.ts
```

Expected: 1 pass.

- [ ] **Step 3: Run the whole test suite to verify no regressions**

```bash
cd ~/code/nertia && npm test
```

Expected: all tests across all tasks pass.

- [ ] **Step 4: Commit**

```bash
cd ~/code/nertia && git add src/__tests__/smoke.integration.test.ts && git commit -m "test: full-stack smoke — generate → store → (implied render)"
```

---

## Task 15: Update Monitor Script + Final Verification

**Files:**
- Modify: `scripts/monitor.sh`

- [ ] **Step 1: Run full test suite one more time**

```bash
cd ~/code/nertia && npm test
```

Record the total pass/fail count.

- [ ] **Step 2: Type-check**

```bash
cd ~/code/nertia && npx tsc --noEmit
```

Fix any type errors before proceeding.

- [ ] **Step 3: Lint**

```bash
cd ~/code/nertia && npm run lint
```

Fix any lint errors before proceeding.

- [ ] **Step 4: Verify dev server still runs**

```bash
lsof -iTCP:3000 -sTCP:LISTEN -n -P
```

If not running:

```bash
cd ~/code/nertia && nohup npm run dev > /tmp/nertia-dev.log 2>&1 &
```

- [ ] **Step 5: Summary**

Write a one-paragraph summary to the branch commit log:

```bash
cd ~/code/nertia && git log --oneline feat/zero-point-pivot...main | wc -l
```

Record count. MVP slice is done. Next plan (separate document) covers: intake form UI, landing refresh, retire old routes, wildcard DNS, 3 more directions.

---

## Self-Review (post-plan)

Spec coverage check:

- **Generation pipeline (spec §Architecture):** Tasks 8, 9, 10 (pickDirection → palette → copy+humanize → motion → pipeline orchestrator). ✓
- **Firebase data model (spec §Data model):** Task 7 (siteStore CRUD with SiteConfigSchema). Only `sites/` path in this plan; `briefs/`, `generations/`, `domains/`, `consults/` are deferred to next plans. ✓ (scoped)
- **Subdomain routing (spec §Subdomain routing):** Task 12 (middleware). ✓
- **ISR (spec §Rendering):** Task 13 (`revalidate = 60` in page.tsx). `revalidateTag` on write deferred — simple time-based ISR is sufficient for MVP. ✓ (scoped)
- **Custom domains (spec §Custom domains):** Explicitly out of scope for this plan. ✓
- **Intake form (spec §Components §2):** Out of scope. Plan assumes form calls POST /api/generate, which is validated by integration test. ✓
- **Direction library (spec §Components §4):** Task 5 + 6 (zero-point only). Other 3 directions deferred. ✓ (scoped)
- **Admin queue (spec §Components §6):** Out of scope. ✓
- **Error handling (spec §Error Handling):** Fallbacks in each pipeline step; 400 on invalid input; notFound on unknown slug. ✓
- **Testing (spec §Testing):** Vitest unit + integration added. Playwright golden screenshots deferred to a polish plan. ✓ (scoped)
- **Humanize pass (spec §Generation pipeline):** Task 3 (lib) + called inside writeCopy in Task 9. ✓

No placeholders in any task. Type consistency verified (SiteConfig, Direction, Palette all match across tasks).

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-04-16-mvp-vertical-slice.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — Fresh subagent per task + two-stage review. Best for autonomous runs.

**2. Inline Execution** — Executes tasks in the current session with checkpoints.

Scott has Auto mode on and gave an hour of runway. Default to **Subagent-Driven**.
