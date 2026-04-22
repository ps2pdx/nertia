// src/app/api/admin/notepad/__tests__/polish.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth-admin", () => ({ verifyAdminToken: vi.fn() }));
vi.mock("@/lib/notepad-admin", () => ({ getPost: vi.fn() }));

const createMock = vi.fn();
vi.mock("@anthropic-ai/sdk", () => ({
  default: class {
    messages = { create: createMock };
  },
}));

import { POST } from "@/app/api/admin/notepad/[id]/polish/route";
import { verifyAdminToken } from "@/lib/auth-admin";
import { getPost } from "@/lib/notepad-admin";

const ok = () => vi.mocked(verifyAdminToken).mockResolvedValueOnce({ ok: true, email: "ps2pdx@gmail.com" });
const ctx = { params: Promise.resolve({ id: "abc" }) };

describe("POST /api/admin/notepad/[id]/polish", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns polished body from Anthropic response", async () => {
    ok();
    vi.mocked(getPost).mockResolvedValueOnce({ id: "abc", body: "raw", title: "T" } as never);
    createMock.mockResolvedValueOnce({
      content: [{ type: "text", text: "polished body" }],
    });
    const res = await POST(new Request("http://x", { method: "POST", body: "{}" }), ctx);
    const body = await res.json();
    expect(body.polished).toBe("polished body");
  });

  it("404 when post missing", async () => {
    ok();
    vi.mocked(getPost).mockResolvedValueOnce(null);
    const res = await POST(new Request("http://x", { method: "POST", body: "{}" }), ctx);
    expect(res.status).toBe(404);
  });
});
