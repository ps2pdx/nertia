import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/intake/emerge/route";
import type { EmergeVariant } from "@/lib/emerge";

const sampleCtx = {
    purpose: "A photographer's portfolio",
    audience: "Art directors and couples",
    vibeWords: ["warm", "cinematic"],
    adaptive: [],
};

function makeRequest(body: unknown): Request {
    return new Request("http://localhost/api/intake/emerge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
    });
}

describe("/api/intake/emerge", () => {
    it("round 1 returns 3 variants with composition + tokens + preview headline", async () => {
        const res = await POST(
            makeRequest({ brandContext: sampleCtx, round: 1 }),
        );
        expect(res.status).toBe(200);
        const body = (await res.json()) as { variants: EmergeVariant[] };
        expect(body.variants).toHaveLength(3);
        for (const v of body.variants) {
            expect(v.id).toBeTruthy();
            expect(v.compositionId).toBeTruthy();
            expect(v.compositionLabel).toBeTruthy();
            expect(v.palette.bg).toBeTruthy();
            expect(v.palette.accent).toBeTruthy();
            expect(v.fontPair.heading).toBeTruthy();
            expect(v.previewHeadline).toBeTruthy();
        }
    });

    it("round 1 variants all use the same composition + fontPair (they vary only in palette)", async () => {
        const res = await POST(
            makeRequest({ brandContext: sampleCtx, round: 1 }),
        );
        const { variants } = (await res.json()) as { variants: EmergeVariant[] };
        const compIds = new Set(variants.map((v) => v.compositionId));
        expect(compIds.size).toBe(1);
        const headings = new Set(variants.map((v) => v.fontPair.heading));
        expect(headings.size).toBe(1);
    });

    it("round 2 returns 3 accent-neighbor variants of the picked round-1 option", async () => {
        const r1 = await POST(makeRequest({ brandContext: sampleCtx, round: 1 }));
        const r1Body = (await r1.json()) as { variants: EmergeVariant[] };
        const picked = r1Body.variants[0];

        const r2 = await POST(
            makeRequest({
                brandContext: sampleCtx,
                round: 2,
                pickedVariantId: picked.id,
                previous: r1Body.variants,
            }),
        );
        expect(r2.status).toBe(200);
        const r2Body = (await r2.json()) as { variants: EmergeVariant[] };
        expect(r2Body.variants).toHaveLength(3);
        for (const v of r2Body.variants) {
            expect(v.palette.bg).toBe(picked.palette.bg);
            expect(v.palette.fg).toBe(picked.palette.fg);
            expect(v.compositionId).toBe(picked.compositionId);
        }
    });

    it("round 2 without picked variant returns 400", async () => {
        const res = await POST(
            makeRequest({ brandContext: sampleCtx, round: 2 }),
        );
        expect(res.status).toBe(400);
    });

    it("malformed body returns 400", async () => {
        const res = await POST(makeRequest({ bogus: true }));
        expect(res.status).toBe(400);
    });
});
