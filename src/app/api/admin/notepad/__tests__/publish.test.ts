// src/app/api/admin/notepad/__tests__/publish.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth-admin", () => ({ verifyAdminToken: vi.fn() }));
vi.mock("@/lib/notepad-admin", () => ({
  getPost: vi.fn(),
  patchPost: vi.fn(),
  listPosts: vi.fn(),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { POST } from "@/app/api/admin/notepad/[id]/publish/route";
import { verifyAdminToken } from "@/lib/auth-admin";
import { getPost, patchPost, listPosts } from "@/lib/notepad-admin";
import { revalidatePath } from "next/cache";

const ok = () => vi.mocked(verifyAdminToken).mockResolvedValueOnce({ ok: true, email: "ps2pdx@gmail.com" });
const ctx = { params: Promise.resolve({ id: "abc" }) };

describe("POST /api/admin/notepad/[id]/publish", () => {
  beforeEach(() => vi.clearAllMocks());

  it("422 when slug collides with another published post", async () => {
    ok();
    vi.mocked(getPost).mockResolvedValueOnce({ id: "abc", title: "T", status: "ready" } as never);
    vi.mocked(listPosts).mockResolvedValueOnce([{ id: "other", slug: "foo", status: "published" }] as never);
    const res = await POST(
      new Request("http://x", { method: "POST", body: JSON.stringify({ slug: "foo" }) }),
      ctx,
    );
    expect(res.status).toBe(422);
  });

  it("publishes with slug + revalidates /blog", async () => {
    ok();
    vi.mocked(getPost).mockResolvedValueOnce({ id: "abc", title: "T", status: "ready" } as never);
    vi.mocked(listPosts).mockResolvedValueOnce([]);
    const res = await POST(
      new Request("http://x", { method: "POST", body: JSON.stringify({ slug: "my-post" }) }),
      ctx,
    );
    expect(res.status).toBe(200);
    expect(patchPost).toHaveBeenCalledWith(
      "abc",
      expect.objectContaining({ status: "published", slug: "my-post" }),
    );
    expect(revalidatePath).toHaveBeenCalledWith("/blog");
    expect(revalidatePath).toHaveBeenCalledWith("/blog/my-post");
  });
});
