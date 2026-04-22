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
