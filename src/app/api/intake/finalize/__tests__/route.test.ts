import { describe, it, expect, beforeAll, afterAll, vi, beforeEach } from "vitest";

const ORIG_DEMO = process.env.USE_DEMO_MODE;

beforeAll(() => {
  process.env.USE_DEMO_MODE = "true";
});
afterAll(() => {
  if (ORIG_DEMO === undefined) delete process.env.USE_DEMO_MODE;
  else process.env.USE_DEMO_MODE = ORIG_DEMO;
});

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
  id: "void-dark",
  label: "void / dark",
  palette: {
    bg: "#0a0a0a",
    fg: "#f5f5f5",
    muted: "#9ca3af",
    accent: "#00d4ff",
    headingStart: "#ffffff",
    headingEnd: "#7dd3fc",
  },
  fontPair: {
    heading: "'JetBrains Mono', monospace",
    body: "'Inter', sans-serif",
  },
};

const sampleBrandContext = {
  purpose: "Portfolio site",
  audience: "Designers",
  vibeWords: ["quiet", "rigorous"],
  adaptive: [{ question: "one feeling?", answer: "calm" }],
};

describe("/api/intake/finalize (demo mode)", () => {
  it("writes a site + brand, returns {slug,url}", async () => {
    const { POST } = await import("@/app/api/intake/finalize/route");
    const req = new Request("http://localhost/api/intake/finalize", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        templateId: "precedent",
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
    expect(body.url).toContain("nertia.ai");
    expect(mockPutSite).toHaveBeenCalledTimes(1);
    expect(mockPutSiteBrand).toHaveBeenCalledTimes(1);
    const siteArg = mockPutSite.mock.calls[0][0] as {
      slug: string;
      templateId: string;
      copy: Record<string, string>;
    };
    expect(siteArg.slug).toBe("test-finalize");
    expect(siteArg.templateId).toBe("precedent");
    expect(siteArg.copy["hero.headline"]).toBeDefined();
  });

  it("rejects unknown templateId", async () => {
    const { POST } = await import("@/app/api/intake/finalize/route");
    const req = new Request("http://localhost/api/intake/finalize", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        templateId: "does-not-exist",
        brandContext: sampleBrandContext,
        finalVariant: sampleVariant,
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
        templateId: "precedent",
        brandContext: sampleBrandContext,
        finalVariant: sampleVariant,
        slug: "taken-slug",
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(409);
  });
});
