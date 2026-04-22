import { describe, it, expect } from "vitest";
import type { BrandContext } from "@/lib/brandContext";
import { compose } from "@/lib/compose";
import { pickPalette, emergeNeighbors, pickThreeForEmerge } from "@/lib/palette";
import { pickFontPair } from "@/lib/fontPair";
import { pickComposition } from "@/compositions";

const marketingCtx: BrandContext = {
    purpose: "A landing page for our SaaS product",
    audience: "Founders and engineering teams",
    vibeWords: ["clean", "technical"],
    adaptive: [],
};

const blogCtx: BrandContext = {
    purpose: "My writing and essays",
    audience: "Curious readers",
    vibeWords: ["warm", "editorial"],
    adaptive: [],
};

const linkinbioCtx: BrandContext = {
    purpose: "Link-in-bio for my music",
    audience: "Fans",
    vibeWords: ["minimal", "mobile"],
    adaptive: [],
};

const portfolioCtx: BrandContext = {
    purpose: "Scott Campbell's portfolio and resume",
    audience: "Founders considering hiring me",
    vibeWords: ["technical", "warm"],
    adaptive: [],
};

describe("pickComposition", () => {
    it("matches a blog brief to the blog composition", () => {
        expect(pickComposition(blogCtx).id).toBe("blog");
    });
    it("matches a link-in-bio brief to linkinbio", () => {
        expect(pickComposition(linkinbioCtx).id).toBe("linkinbio");
    });
    it("matches a portfolio brief to portfolio", () => {
        expect(pickComposition(portfolioCtx).id).toBe("portfolio");
    });
    it("is deterministic — same ctx returns same composition", () => {
        const a = pickComposition(marketingCtx).id;
        const b = pickComposition(marketingCtx).id;
        expect(a).toBe(b);
    });
});

describe("pickPalette", () => {
    it("picks a warm editorial palette for a writing brief", () => {
        const p = pickPalette(blogCtx);
        // warm palettes have light bg
        expect(p.bg.toLowerCase()).not.toBe("#0a0a0a");
    });
    it("picks a dark technical palette for a SaaS brief", () => {
        const p = pickPalette({
            purpose: "Developer tools for APIs",
            audience: "Engineers",
            vibeWords: ["dark", "technical"],
            adaptive: [],
        });
        // should be one of the dark palettes
        expect(["#0a0a0a", "#0f0f0f", "#0a0f0a", "#120c1f", "#0d1510", "#0b1220", "#1a0f08", "#140e1f"]).toContain(p.bg);
    });
    it("is deterministic", () => {
        const a = pickPalette(marketingCtx);
        const b = pickPalette(marketingCtx);
        expect(a).toEqual(b);
    });
});

describe("emergeNeighbors", () => {
    it("returns three palettes sharing bg + fg but differing in accent", () => {
        const base = pickPalette(marketingCtx);
        const neighbors = emergeNeighbors(base);
        expect(neighbors).toHaveLength(3);
        for (const n of neighbors) {
            expect(n.bg).toBe(base.bg);
            expect(n.fg).toBe(base.fg);
        }
        // The three accents are not all the same
        const accents = new Set(neighbors.map((n) => n.accent));
        expect(accents.size).toBeGreaterThan(1);
    });
    it("includes the original palette unchanged as the middle variant", () => {
        const base = pickPalette(marketingCtx);
        const neighbors = emergeNeighbors(base);
        expect(neighbors[1]).toEqual(base);
    });
});

describe("pickThreeForEmerge", () => {
    it("returns 3 palettes", () => {
        const three = pickThreeForEmerge(marketingCtx);
        expect(three).toHaveLength(3);
    });
    it("returns all distinct palettes", () => {
        const three = pickThreeForEmerge(marketingCtx);
        const bgs = new Set(three.map((p) => p.bg));
        expect(bgs.size).toBeGreaterThan(1);
    });
});

describe("pickFontPair", () => {
    it("is deterministic", () => {
        const a = pickFontPair(marketingCtx);
        const b = pickFontPair(marketingCtx);
        expect(a).toEqual(b);
    });
    it("returns a pair with both heading and body set", () => {
        const pair = pickFontPair(marketingCtx);
        expect(pair.heading).toBeTruthy();
        expect(pair.body).toBeTruthy();
    });
});

describe("compose", () => {
    it("returns a composition + tokens", () => {
        const out = compose(marketingCtx);
        expect(out.composition.id).toBeTruthy();
        expect(out.composition.sections.length).toBeGreaterThan(0);
        expect(out.tokens.palette.bg).toBeTruthy();
        expect(out.tokens.fontPair.heading).toBeTruthy();
    });
    it("is fully deterministic", () => {
        const a = compose(marketingCtx);
        const b = compose(marketingCtx);
        expect(a).toEqual(b);
    });
});
