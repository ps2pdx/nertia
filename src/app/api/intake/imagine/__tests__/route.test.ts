import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { POST } from "@/app/api/intake/imagine/route";

const ORIG_DEMO = process.env.USE_DEMO_MODE;

beforeAll(() => {
  process.env.USE_DEMO_MODE = "true";
});
afterAll(() => {
  if (ORIG_DEMO === undefined) delete process.env.USE_DEMO_MODE;
  else process.env.USE_DEMO_MODE = ORIG_DEMO;
});

describe("/api/intake/imagine (demo mode)", () => {
  it("returns a fully-populated BrandContext", async () => {
    const res = await POST();
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      brandContext: {
        purpose?: string;
        audience?: string;
        vibeWords?: string[];
        adaptive: Array<{ question: string; answer: string }>;
      };
    };
    const ctx = body.brandContext;
    expect(typeof ctx.purpose).toBe("string");
    expect((ctx.purpose ?? "").length).toBeGreaterThan(10);
    expect(typeof ctx.audience).toBe("string");
    expect(Array.isArray(ctx.vibeWords)).toBe(true);
    expect(ctx.vibeWords?.length).toBe(3);
    expect(ctx.adaptive).toHaveLength(2);
    expect(typeof ctx.adaptive[0].question).toBe("string");
    expect(typeof ctx.adaptive[0].answer).toBe("string");
  });

  it("returns varied brand concepts across calls (at least 2 distinct over 10 tries)", async () => {
    const purposes = new Set<string>();
    for (let i = 0; i < 10; i++) {
      const res = await POST();
      const body = (await res.json()) as { brandContext: { purpose?: string } };
      if (body.brandContext.purpose) purposes.add(body.brandContext.purpose);
    }
    expect(purposes.size).toBeGreaterThan(1);
  });
});
