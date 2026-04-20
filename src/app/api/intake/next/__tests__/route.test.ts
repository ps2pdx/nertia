import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { POST } from "@/app/api/intake/next/route";

const ORIG_DEMO = process.env.USE_DEMO_MODE;

beforeAll(() => {
  process.env.USE_DEMO_MODE = "true";
});
afterAll(() => {
  if (ORIG_DEMO === undefined) delete process.env.USE_DEMO_MODE;
  else process.env.USE_DEMO_MODE = ORIG_DEMO;
});

describe("/api/intake/next (demo mode)", () => {
  it("returns two adaptive questions", async () => {
    const req = new Request("http://localhost/api/intake/next", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        brandContext: {
          purpose: "A site for my photography portfolio.",
          audience: "Art directors and couples planning weddings.",
          vibeWords: ["cinematic", "quiet", "warm"],
          adaptive: [],
        },
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { questions: string[] };
    expect(body.questions).toHaveLength(2);
    expect(typeof body.questions[0]).toBe("string");
    expect(body.questions[0].length).toBeGreaterThan(10);
  });

  it("rejects malformed body", async () => {
    const req = new Request("http://localhost/api/intake/next", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ nope: true }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
