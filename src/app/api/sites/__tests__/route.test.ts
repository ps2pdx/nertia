import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockSlugIsTaken, mockPutSite, mockGetTemplate } = vi.hoisted(() => ({
  mockSlugIsTaken: vi.fn(),
  mockPutSite: vi.fn(),
  mockGetTemplate: vi.fn(),
}));

vi.mock("@/lib/siteStore", () => ({
  slugIsTaken: mockSlugIsTaken,
  putSite: mockPutSite,
}));

vi.mock("@/templates", () => ({
  getTemplate: mockGetTemplate,
}));

import { POST } from "@/app/api/sites/route";

beforeEach(() => {
  vi.clearAllMocks();
  mockSlugIsTaken.mockResolvedValue(false);
  mockPutSite.mockImplementation(async (site) => ({
    ...site,
    createdAt: 1000,
    updatedAt: 1000,
  }));
  mockGetTemplate.mockReturnValue({
    id: "vercel-portfolio",
    displayName: "Portfolio",
    description: "x",
    sourceUrl: "x",
    sourceAttribution: "x",
    license: "MIT",
    tags: [],
    copySchema: [],
    Layout: () => null,
  });
});

function req(body: unknown, opts: { contentType?: string } = {}) {
  const headers: Record<string, string> = {
    "content-type": opts.contentType ?? "application/json",
  };
  return new Request("http://localhost/api/sites", {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/sites", () => {
  it("returns 400 on invalid JSON body", async () => {
    const res = await POST(req("not json"));
    expect(res.status).toBe(400);
  });

  it("returns 400 when templateId is missing", async () => {
    const res = await POST(req({ copy: {} }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when copy is missing", async () => {
    const res = await POST(req({ templateId: "vercel-portfolio" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when templateId does not exist", async () => {
    mockGetTemplate.mockReturnValue(null);
    const res = await POST(req({ templateId: "nope", copy: { title: "Hi" } }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/template/i);
  });

  it("returns 409 when provided slug is taken", async () => {
    mockSlugIsTaken.mockResolvedValue(true);
    const res = await POST(req({
      templateId: "vercel-portfolio",
      copy: { title: "Hi" },
      slug: "taken",
    }));
    expect(res.status).toBe(409);
    expect(mockPutSite).not.toHaveBeenCalled();
  });

  it("uses provided slug when free", async () => {
    const res = await POST(req({
      templateId: "vercel-portfolio",
      copy: { title: "Hi" },
      slug: "my-site",
    }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.slug).toBe("my-site");
    expect(mockPutSite).toHaveBeenCalledTimes(1);
    const written = mockPutSite.mock.calls[0][0];
    expect(written.slug).toBe("my-site");
    expect(written.templateId).toBe("vercel-portfolio");
    expect(written.copy).toEqual({ title: "Hi" });
  });

  it("slugifies provided slug input", async () => {
    const res = await POST(req({
      templateId: "vercel-portfolio",
      copy: { title: "Hi" },
      slug: "My Site!",
    }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.slug).toBe("my-site");
  });

  it("auto-generates slug when not provided", async () => {
    const res = await POST(req({
      templateId: "vercel-portfolio",
      copy: { title: "Hi" },
    }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.slug).toMatch(/^[a-z0-9-]+$/);
    expect(body.slug.length).toBeGreaterThan(0);
  });

  it("returns url in response", async () => {
    const res = await POST(req({
      templateId: "vercel-portfolio",
      copy: { title: "Hi" },
      slug: "acme",
    }));
    const body = await res.json();
    expect(body.url).toBe("https://acme.nertia.ai");
  });

  it("returns 409 when no provided slug and unique generation fails", async () => {
    mockSlugIsTaken.mockResolvedValue(true);
    const res = await POST(req({
      templateId: "vercel-portfolio",
      copy: { title: "Hi" },
    }));
    expect(res.status).toBe(409);
  });
});
