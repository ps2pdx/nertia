import { describe, it, expect } from "vitest";
import type { BrandContext, Handle } from "@/lib/brandContext";
import { compose } from "@/lib/compose";
import { pickComposition, pickTopCompositions } from "@/compositions";

const marketingCtx: BrandContext = {
    purpose: "A landing page for our SaaS product",
    brandColor: "#3b82f6",
};

const blogCtx: BrandContext = {
    purpose: "My writing and essays",
    brandColor: "#f97316",
};

const portfolioCtx: BrandContext = {
    purpose: "Scott Campbell's portfolio and resume",
};

describe("pickComposition", () => {
    it("matches a blog brief to the blog composition", () => {
        expect(pickComposition(blogCtx).id).toBe("blog");
    });
    it("matches a portfolio brief to portfolio", () => {
        expect(pickComposition(portfolioCtx).id).toBe("portfolio");
    });
    it("is deterministic", () => {
        expect(pickComposition(marketingCtx).id).toBe(pickComposition(marketingCtx).id);
    });
});

describe("pickComposition — handle-count short-circuit", () => {
    const h = (platform: Handle["platform"]): Handle => ({
        platform,
        handle: "x",
        url: `https://example.com/${platform}`,
    });

    it("forces linkinbio when ≥3 non-site handles and no site handle", () => {
        const ctx: BrandContext = {
            purpose: "Field notes on craft",
            handles: [h("twitter"), h("instagram"), h("tiktok")],
        };
        expect(pickComposition(ctx).id).toBe("linkinbio");
    });

    it("does NOT force linkinbio when any handle is a site", () => {
        const ctx: BrandContext = {
            purpose: "My writing and essays, a newsletter",
            handles: [h("twitter"), h("instagram"), h("site")],
        };
        expect(pickComposition(ctx).id).toBe("blog");
    });
});

describe("pickTopCompositions", () => {
    it("returns up to n compositions", () => {
        expect(pickTopCompositions(marketingCtx, 3)).toHaveLength(3);
    });
    it("first result equals pickComposition", () => {
        const top = pickTopCompositions(blogCtx, 3);
        expect(top[0].id).toBe(pickComposition(blogCtx).id);
    });
    it("returns linkinbio first when ≥3 non-site handles", () => {
        const h = (platform: Handle["platform"]): Handle => ({
            platform,
            handle: "x",
            url: `https://example.com/${platform}`,
        });
        const top = pickTopCompositions(
            { purpose: "My links", handles: [h("twitter"), h("instagram"), h("tiktok")] },
            3,
        );
        expect(top[0].id).toBe("linkinbio");
    });
});

describe("compose", () => {
    it("returns { composition, brandColor }", () => {
        const out = compose(marketingCtx);
        expect(out.composition.id).toBeTruthy();
        expect(out.composition.sections.length).toBeGreaterThan(0);
        expect(out.brandColor).toBe("#3b82f6");
    });

    it("uses default brand color when ctx omits it", () => {
        expect(compose({ purpose: "X" }).brandColor).toBe("#22c55e");
    });

    it("is deterministic", () => {
        const a = compose(marketingCtx);
        const b = compose(marketingCtx);
        expect(a).toEqual(b);
    });
});
