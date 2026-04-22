import { describe, it, expect } from "vitest";
import { ctxTokens, scoreTags } from "@/lib/brandContext";

describe("ctxTokens", () => {
    it("extracts lowercase hyphenated tokens from purpose + handle platforms", () => {
        const tokens = ctxTokens({
            purpose: "A landing page for SaaS",
            handles: [
                { platform: "twitter", handle: "scottsuper", url: "https://twitter.com/scottsuper" },
                { platform: "github", handle: "scottsuper", url: "https://github.com/scottsuper" },
            ],
        });
        expect(tokens.has("landing")).toBe(true);
        expect(tokens.has("saas")).toBe(true);
        expect(tokens.has("twitter")).toBe(true);
        expect(tokens.has("github")).toBe(true);
    });

    it("returns an empty set for an empty BrandContext", () => {
        expect(ctxTokens({}).size).toBe(0);
    });

    it("does not leak brandColor as a token", () => {
        const tokens = ctxTokens({ purpose: "blog", brandColor: "#22c55e" });
        expect(tokens.has("blog")).toBe(true);
        expect(tokens.has("#22c55e")).toBe(false);
    });
});

describe("scoreTags", () => {
    it("counts the overlap between tags and tokens", () => {
        const tokens = new Set(["warm", "editorial", "saas"]);
        expect(scoreTags(["warm", "editorial"], tokens)).toBe(2);
        expect(scoreTags(["cold", "minimal"], tokens)).toBe(0);
    });
});
