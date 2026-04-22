import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/intake/imagine/route";

describe("/api/intake/imagine", () => {
    it("returns a fully-populated BrandContext with the new shape", async () => {
        const res = await POST();
        expect(res.status).toBe(200);
        const body = (await res.json()) as {
            brandContext: {
                purpose?: string;
                brandColor?: string;
                handles?: Array<{ platform: string; handle: string; url: string }>;
            };
        };
        const ctx = body.brandContext;
        expect(typeof ctx.purpose).toBe("string");
        expect((ctx.purpose ?? "").length).toBeGreaterThan(10);
        expect(typeof ctx.brandColor).toBe("string");
        expect(ctx.brandColor).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(Array.isArray(ctx.handles)).toBe(true);
        expect((ctx.handles ?? []).length).toBeGreaterThan(0);
        for (const h of ctx.handles ?? []) {
            expect(typeof h.platform).toBe("string");
            expect(typeof h.handle).toBe("string");
            expect(typeof h.url).toBe("string");
        }
    });

    it("returns varied presets across calls (at least 2 distinct over 10 tries)", async () => {
        const purposes = new Set<string>();
        for (let i = 0; i < 10; i++) {
            const res = await POST();
            const body = (await res.json()) as { brandContext: { purpose?: string } };
            if (body.brandContext.purpose) purposes.add(body.brandContext.purpose);
        }
        expect(purposes.size).toBeGreaterThan(1);
    });
});
