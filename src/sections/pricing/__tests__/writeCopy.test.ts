import { describe, it, expect } from "vitest";
import { writeCopy } from "@/sections/pricing/writeCopy";

describe("pricing writeCopy", () => {
    it("returns deterministic default tier labels + blank fields", () => {
        const copy = writeCopy({ purpose: "A SaaS landing" });
        expect(copy.tier1Label).toBe("Starter");
        expect(copy.tier2Label).toBe("Pro");
        expect(copy.tier3Label).toBe("Enterprise");
        expect(copy.tier1Price).toBe("");
        expect(copy.tier2Desc).toBe("");
        expect(copy.tier3CtaLabel).toBe("");
    });

    it("returns a heading", () => {
        const copy = writeCopy({ purpose: "anything" });
        expect(copy.heading).toBe("Pricing");
    });
});
