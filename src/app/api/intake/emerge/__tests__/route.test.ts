import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/intake/emerge/route";
import type { EmergeVariant } from "@/lib/emerge";

const sampleCtx = {
    purpose: "A photographer's portfolio",
    brandColor: "#22c55e",
    handles: [
        {
            platform: "instagram",
            handle: "sofiafilm",
            url: "https://instagram.com/sofiafilm",
        },
    ],
};

function makeRequest(body: unknown): Request {
    return new Request("http://localhost/api/intake/emerge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
    });
}

describe("/api/intake/emerge", () => {
    it("returns 3 variants with composition + brandColor + preview headline", async () => {
        const res = await POST(makeRequest({ brandContext: sampleCtx }));
        expect(res.status).toBe(200);
        const body = (await res.json()) as { variants: EmergeVariant[] };
        expect(body.variants).toHaveLength(3);
        for (const v of body.variants) {
            expect(v.id).toBeTruthy();
            expect(v.compositionId).toBeTruthy();
            expect(v.compositionLabel).toBeTruthy();
            expect(v.brandColor).toBe("#22c55e");
            expect(v.previewHeadline).toBeTruthy();
        }
    });

    it("variants vary in composition", async () => {
        const res = await POST(makeRequest({ brandContext: sampleCtx }));
        const { variants } = (await res.json()) as { variants: EmergeVariant[] };
        const compIds = new Set(variants.map((v) => v.compositionId));
        expect(compIds.size).toBeGreaterThan(1);
    });

    it("malformed body returns 400", async () => {
        const res = await POST(makeRequest({ bogus: true }));
        expect(res.status).toBe(400);
    });
});
