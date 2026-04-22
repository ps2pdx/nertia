import { describe, it, expect } from "vitest";
import { writeCopy } from "@/sections/projects-grid/writeCopy";

describe("projects-grid writeCopy", () => {
    it("returns default heading", () => {
        const copy = writeCopy({ purpose: "My portfolio" });
        expect(copy.heading).toBe("Selected work");
    });

    it("returns empty strings for all project fields", () => {
        const copy = writeCopy({ purpose: "anything" });
        for (const n of [1, 2, 3, 4] as const) {
            expect(copy[`project${n}Title`]).toBe("");
            expect(copy[`project${n}Desc`]).toBe("");
            expect(copy[`project${n}ImageUrl`]).toBe("");
        }
    });
});
