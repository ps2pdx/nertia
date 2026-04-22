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
