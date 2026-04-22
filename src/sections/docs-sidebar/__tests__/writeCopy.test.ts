import { describe, it, expect } from "vitest";
import { writeCopy } from "@/sections/docs-sidebar/writeCopy";

describe("docs-sidebar writeCopy", () => {
    it("returns default title and content heading", () => {
        const copy = writeCopy({ purpose: "API reference for our SDK" });
        expect(copy.title).toBe("Docs");
        expect(copy.contentHeading).toBe("Getting started");
        expect(copy.contentBody).toBe("API reference for our SDK");
    });

    it("falls back to 'Welcome.' when purpose is blank", () => {
        const copy = writeCopy({});
        expect(copy.contentBody).toBe("Welcome.");
        expect(copy.navLabel1).toBe("");
    });
});
