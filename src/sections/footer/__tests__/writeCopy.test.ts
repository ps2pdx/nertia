import { describe, it, expect } from "vitest";
import { writeCopy } from "@/sections/footer/writeCopy";
import type { Handle } from "@/lib/brandContext";

const h = (platform: Handle["platform"], handle: string, url: string): Handle => ({
    platform,
    handle,
    url,
});

describe("footer writeCopy", () => {
    it("populates wordmark from purpose", () => {
        const copy = writeCopy({
            purpose: "Acme photography studio",
        });
        expect(copy.wordmark).toBe("Acme");
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
