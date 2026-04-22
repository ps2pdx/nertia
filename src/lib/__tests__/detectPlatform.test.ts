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
