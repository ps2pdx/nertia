// src/app/api/admin/notepad/__tests__/item.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth-admin", () => ({ verifyAdminToken: vi.fn() }));
vi.mock("@/lib/notepad-admin", () => ({
  getPost: vi.fn(),
  patchPost: vi.fn(),
  deletePost: vi.fn(),
}));

import { GET, PATCH, DELETE } from "@/app/api/admin/notepad/[id]/route";
import { verifyAdminToken } from "@/lib/auth-admin";
import { getPost, patchPost, deletePost } from "@/lib/notepad-admin";

const ctx = { params: Promise.resolve({ id: "abc" }) };
const ok = () => vi.mocked(verifyAdminToken).mockResolvedValueOnce({ ok: true, email: "ps2pdx@gmail.com" });

describe("GET /api/admin/notepad/[id]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("404 when missing", async () => {
    ok();
    vi.mocked(getPost).mockResolvedValueOnce(null);
    const res = await GET(new Request("http://x"), ctx);
    expect(res.status).toBe(404);
  });

  it("returns post when found", async () => {
    ok();
    vi.mocked(getPost).mockResolvedValueOnce({ id: "abc", title: "A" } as never);
    const res = await GET(new Request("http://x"), ctx);
    const body = await res.json();
    expect(body.post.id).toBe("abc");
  });
});

describe("PATCH /api/admin/notepad/[id]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("422 when body has unknown fields", async () => {
    ok();
    const res = await PATCH(new Request("http://x", { method: "PATCH", body: JSON.stringify({ bogus: 1 }) }), ctx);
    expect(res.status).toBe(422);
  });

  it("422 when status transition is illegal (merged → draft)", async () => {
    ok();
    vi.mocked(getPost).mockResolvedValueOnce({ id: "abc", status: "merged" } as never);
    const res = await PATCH(
      new Request("http://x", { method: "PATCH", body: JSON.stringify({ status: "draft" }) }),
      ctx,
    );
    expect(res.status).toBe(422);
  });

  it("patches allowed fields", async () => {
    ok();
    vi.mocked(getPost).mockResolvedValueOnce({ id: "abc", status: "draft" } as never);
    const res = await PATCH(
      new Request("http://x", { method: "PATCH", body: JSON.stringify({ title: "New" }) }),
      ctx,
    );
    expect(res.status).toBe(200);
    expect(patchPost).toHaveBeenCalledWith("abc", expect.objectContaining({ title: "New" }));
  });
});

describe("DELETE /api/admin/notepad/[id]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("deletes", async () => {
    ok();
    const res = await DELETE(new Request("http://x"), ctx);
    expect(res.status).toBe(200);
    expect(deletePost).toHaveBeenCalledWith("abc");
  });
});
