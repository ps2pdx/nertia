import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCreate = vi.fn();

vi.mock("@anthropic-ai/sdk", () => ({
  default: class Anthropic {
    messages = {
      create: mockCreate,
    };
  },
}));

const store = new Map<string, unknown>();
vi.mock("@/lib/siteStore", () => ({
  slugIsTaken: vi.fn(async (slug: string) => store.has(slug)),
  putSite: vi.fn(async (c: { slug: string }) => {
    store.set(c.slug, c);
    return c;
  }),
  getSite: vi.fn(async (slug: string) => store.get(slug) ?? null),
}));

import { POST } from "@/app/api/generate/route";

beforeEach(() => {
  store.clear();
  mockCreate.mockReset();
  // Mock the 4 pipeline calls in order (pickDirection, palette, copy, motion)
  mockCreate
    .mockResolvedValueOnce({
      content: [{ type: "text", text: '{"direction":"zero-point","reason":"test"}' }],
    })
    .mockResolvedValueOnce({
      content: [
        { type: "text", text: '{"bg":"#0a0a0a","fg":"#f5f5f5","accent":"#00d4ff","muted":"#6b6b6b"}' },
      ],
    })
    .mockResolvedValueOnce({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            hero: { eyebrow: "ACME", headline: "We build.", sub: "Small.", cta: "Go" },
            sections: [],
          }),
        },
      ],
    })
    .mockResolvedValueOnce({
      content: [{ type: "text", text: '{"variant":"breath","intensity":"low","accent":"#00d4ff"}' }],
    });
});

describe("smoke: full generation flow", () => {
  it("POST /api/generate produces a stored site", async () => {
    const req = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        businessName: "Acme Labs",
        oneLiner: "Research tools for small teams.",
        audience: "founders",
        vibe: "quiet confident",
        tone: "quiet",
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.slug).toMatch(/^acme-labs/);
    expect(body.direction).toBe("zero-point");
    expect(store.has(body.slug)).toBe(true);
  });
});
