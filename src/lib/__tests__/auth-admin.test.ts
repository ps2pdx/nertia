import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("firebase-admin/auth", () => ({
  getAuth: () => ({
    verifyIdToken: vi.fn(async (t: string) => {
      if (t === "valid-admin") return { email: "ps2pdx@gmail.com" };
      if (t === "valid-other") return { email: "stranger@example.com" };
      throw new Error("bad token");
    }),
  }),
}));

vi.mock("firebase-admin/app", () => ({
  getApps: () => [{}],
  initializeApp: vi.fn(),
}));

import { verifyAdminToken } from "@/lib/auth-admin";

function mockReq(auth?: string) {
  return { headers: { get: (k: string) => (k === "authorization" ? auth : null) } } as unknown as Request;
}

describe("verifyAdminToken", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns email on valid admin token", async () => {
    const r = await verifyAdminToken(mockReq("Bearer valid-admin"));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.email).toBe("ps2pdx@gmail.com");
  });

  it("returns 401 on missing header", async () => {
    const r = await verifyAdminToken(mockReq());
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.status).toBe(401);
  });

  it("returns 403 on non-admin email", async () => {
    const r = await verifyAdminToken(mockReq("Bearer valid-other"));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.status).toBe(403);
  });

  it("returns 401 on invalid token", async () => {
    const r = await verifyAdminToken(mockReq("Bearer nope"));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.status).toBe(401);
  });
});
