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
