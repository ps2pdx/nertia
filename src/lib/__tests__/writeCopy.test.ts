import { describe, it, expect } from "vitest";
import type { BrandContext } from "@/lib/brandContext";
import { writeCopy } from "@/lib/writeCopy";
import { compose } from "@/lib/compose";

const blogCtx: BrandContext = {
    purpose: "My writing and essays on product craft.",
    audience: "Curious readers and builders",
    vibeWords: ["warm", "editorial"],
    adaptive: [{ question: "what's the feel", answer: "slow and considered" }],
};

const portfolioCtx: BrandContext = {
    purpose: "Scott Campbell's portfolio and resume.",
    audience: "Founders considering hiring me",
    vibeWords: ["technical", "warm"],
    adaptive: [],
};

describe("writeCopy", () => {
    it("returns a copy map keyed by {instanceId}.{slotKey}", () => {
        const { composition } = compose(blogCtx);
        const copy = writeCopy(blogCtx, composition);
        // every produced key has the composition-instance prefix
        for (const key of Object.keys(copy)) {
            const hasInstance = composition.sections.some((s) =>
                key.startsWith(`${s.instanceId}.`),
            );
            expect(hasInstance).toBe(true);
        }
    });
    it("is deterministic — same ctx + composition returns same copy", () => {
        const { composition } = compose(blogCtx);
        const a = writeCopy(blogCtx, composition);
        const b = writeCopy(blogCtx, composition);
        expect(a).toEqual(b);
    });
    it("populates the hero headline with the purpose for a portfolio brief", () => {
        const { composition } = compose(portfolioCtx);
        const copy = writeCopy(portfolioCtx, composition);
        const heroKeys = Object.keys(copy).filter((k) => k.endsWith(".headline"));
        expect(heroKeys.length).toBeGreaterThan(0);
        const headline = copy[heroKeys[0]];
        expect(headline.toLowerCase()).toContain("scott");
    });
    it("writes post-list headline + description for a blog composition", () => {
        const { composition } = compose(blogCtx);
        expect(composition.id).toBe("blog");
        const copy = writeCopy(blogCtx, composition);
        const descKey = Object.keys(copy).find((k) => k.endsWith(".description"));
        expect(descKey).toBeTruthy();
        expect(copy[descKey!]).toBe(blogCtx.purpose);
    });
    it("skips empty-string slot values", () => {
        const ctx: BrandContext = {
            purpose: "",
            audience: "",
            vibeWords: [],
            adaptive: [],
        };
        const { composition } = compose(ctx);
        const copy = writeCopy(ctx, composition);
        for (const v of Object.values(copy)) {
            expect(v).not.toBe("");
        }
    });
});
