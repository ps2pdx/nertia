import { describe, it, expect, vi, beforeEach } from "vitest";
import type { CompositionSite } from "@/lib/siteShapes";

const mockPutSite = vi.fn();
const mockPutSiteBrand = vi.fn();
const mockSlugIsTaken = vi.fn();

vi.mock("@/lib/siteStore", () => ({
    putSite: (site: unknown) => mockPutSite(site),
    putSiteBrand: (slug: string, data: unknown) => mockPutSiteBrand(slug, data),
    slugIsTaken: (slug: string) => mockSlugIsTaken(slug),
}));

beforeEach(() => {
    mockPutSite.mockReset();
    mockPutSiteBrand.mockReset();
    mockSlugIsTaken.mockReset();
    mockPutSite.mockResolvedValue(undefined);
    mockPutSiteBrand.mockResolvedValue(undefined);
    mockSlugIsTaken.mockResolvedValue(false);
});

const sampleVariant = {
    id: "emerge-marketing-0",
    label: "Marketing",
    compositionId: "marketing",
    compositionLabel: "Marketing",
    brandColor: "#22c55e",
    previewHeadline: "A landing page.",
};

const sampleBrandContext = {
    purpose: "A landing page for a SaaS product.",
    brandColor: "#22c55e",
    handles: [
        {
            platform: "twitter",
            handle: "saasco",
            url: "https://twitter.com/saasco",
        },
    ],
};

describe("/api/intake/finalize", () => {
    it("writes a composition-shaped site and returns {slug, url}", async () => {
        const { POST } = await import("@/app/api/intake/finalize/route");
        const req = new Request("http://localhost/api/intake/finalize", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                brandContext: sampleBrandContext,
                finalVariant: sampleVariant,
                slug: "test-finalize",
            }),
        });
        const res = await POST(req);
        expect(res.status).toBe(200);
        const body = (await res.json()) as { slug: string; url: string };
        expect(body.slug).toBe("test-finalize");
        expect(body.url).toContain("test-finalize");
        expect(mockPutSite).toHaveBeenCalledTimes(1);
        const siteArg = mockPutSite.mock.calls[0][0] as CompositionSite;
        expect(siteArg.slug).toBe("test-finalize");
        expect(siteArg.composition.id).toBe("marketing");
        expect(siteArg.composition.sections.length).toBeGreaterThan(0);
        expect(siteArg.brandColor).toBe("#22c55e");
        const headlineKeys = Object.keys(siteArg.copy).filter((k) =>
            k.endsWith(".headline"),
        );
        expect(headlineKeys.length).toBeGreaterThan(0);
    });

    it("rejects an unknown composition id", async () => {
        const { POST } = await import("@/app/api/intake/finalize/route");
        const req = new Request("http://localhost/api/intake/finalize", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                brandContext: sampleBrandContext,
                finalVariant: { ...sampleVariant, compositionId: "does-not-exist" },
            }),
        });
        const res = await POST(req);
        expect(res.status).toBe(400);
    });

    it("returns 409 when a requested slug is taken", async () => {
        mockSlugIsTaken.mockResolvedValueOnce(true);
        const { POST } = await import("@/app/api/intake/finalize/route");
        const req = new Request("http://localhost/api/intake/finalize", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                brandContext: sampleBrandContext,
                finalVariant: sampleVariant,
                slug: "taken-slug",
            }),
        });
        const res = await POST(req);
        expect(res.status).toBe(409);
    });
});
