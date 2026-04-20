import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { POST } from "@/app/api/intake/emerge/route";
import type { ThemeVariant } from "@/lib/brandContext";

const ORIG_DEMO = process.env.USE_DEMO_MODE;

beforeAll(() => {
  process.env.USE_DEMO_MODE = "true";
});
afterAll(() => {
  if (ORIG_DEMO === undefined) delete process.env.USE_DEMO_MODE;
  else process.env.USE_DEMO_MODE = ORIG_DEMO;
});

const ctx = {
  purpose: "portfolio",
  audience: "editors",
  vibeWords: ["quiet"],
  adaptive: [],
};

describe("/api/intake/emerge (demo mode)", () => {
  it("round 1 returns exactly 3 distinct variants", async () => {
    const req = new Request("http://localhost/api/intake/emerge", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ brandContext: ctx, round: 1 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { variants: ThemeVariant[] };
    expect(body.variants).toHaveLength(3);
    const ids = new Set(body.variants.map((v) => v.id));
    expect(ids.size).toBe(3);
    // each variant is a valid ThemeVariant shape
    for (const v of body.variants) {
      expect(v.palette.bg).toMatch(/^#/);
      expect(v.palette.accent).toMatch(/^#/);
      expect(v.fontPair.heading.length).toBeGreaterThan(0);
    }
  });

  it("round 2 returns 3 near-neighbors of the picked variant", async () => {
    const req = new Request("http://localhost/api/intake/emerge", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        brandContext: ctx,
        round: 2,
        pickedVariantId: "void-dark",
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { variants: ThemeVariant[] };
    expect(body.variants).toHaveLength(3);
    // neighbors inherit the same bg/fg from void-dark (just accent varies)
    for (const v of body.variants) {
      expect(v.palette.bg).toBe("#0a0a0a");
      expect(v.palette.fg).toBe("#f5f5f5");
    }
  });

  it("rejects malformed body", async () => {
    const req = new Request("http://localhost/api/intake/emerge", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ round: 3 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
