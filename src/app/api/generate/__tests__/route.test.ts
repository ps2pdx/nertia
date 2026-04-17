import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/siteStore", () => ({
  slugIsTaken: vi.fn(async () => false),
  putSite: vi.fn(async (c) => c),
}));
vi.mock("@/lib/generator/pipeline", () => ({
  generate: vi.fn(async (input) => ({
    slug: input.slug,
    direction: "zero-point",
    palette: { bg: "#0a0a0a", fg: "#ffffff", accent: "#00ffff", muted: "#888888" },
    typography: { heading: "Inter", body: "Inter", scale: 1.25 },
    copy: { hero: { eyebrow: "", headline: "H", sub: "S", cta: "C" }, sections: [] },
    motionConfig: { variant: "breath", intensity: "low", accent: "#00ffff" },
    images: {},
    owner: null,
    tier: input.tier,
  })),
}));

import { POST } from "@/app/api/generate/route";

beforeEach(() => vi.clearAllMocks());

function req(body: unknown) {
  return new Request("http://localhost/api/generate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/generate", () => {
  it("returns slug + url on valid input", async () => {
    const res = await POST(req({
      businessName: "Acme",
      oneLiner: "We build things.",
      audience: "devs",
      vibe: "quiet",
      tone: "quiet",
    }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.slug).toMatch(/^acme/);
    expect(json.url).toMatch(/nertia\.ai$/);
  });

  it("400s on invalid input", async () => {
    const res = await POST(req({ businessName: "" }));
    expect(res.status).toBe(400);
  });
});
