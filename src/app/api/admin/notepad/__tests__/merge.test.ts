// src/app/api/admin/notepad/__tests__/merge.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth-admin", () => ({ verifyAdminToken: vi.fn() }));
vi.mock("@/lib/notepad-admin", () => ({
  getPost: vi.fn(),
  putPost: vi.fn(),
  patchPost: vi.fn(),
}));
const createMock = vi.fn();
vi.mock("@anthropic-ai/sdk", () => ({
  default: class { messages = { create: createMock }; },
}));

import { POST } from "@/app/api/admin/notepad/merge/route";
import { verifyAdminToken } from "@/lib/auth-admin";
import { getPost, putPost, patchPost } from "@/lib/notepad-admin";

const ok = () => vi.mocked(verifyAdminToken).mockResolvedValueOnce({ ok: true, email: "ps2pdx@gmail.com" });

describe("POST /api/admin/notepad/merge", () => {
  beforeEach(() => vi.clearAllMocks());

  it("422 when fewer than 2 sources", async () => {
    ok();
    const res = await POST(
      new Request("http://x", { method: "POST", body: JSON.stringify({ sourceIds: ["a"], composeMethod: "concat" }) }),
    );
    expect(res.status).toBe(422);
  });

  it("concat path: creates new post + flips sources to merged", async () => {
    ok();
    const s1 = { id: "a", title: "A", body: "body a", tags: ["x"], status: "draft" };
    const s2 = { id: "b", title: "B", body: "body b", tags: ["y"], status: "draft" };
    vi.mocked(getPost).mockImplementation(async (id) => (id === "a" ? (s1 as never) : (s2 as never)));

    const res = await POST(
      new Request("http://x", {
        method: "POST",
        body: JSON.stringify({ sourceIds: ["a", "b"], composeMethod: "concat" }),
      }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.post.body).toContain("## A");
    expect(body.post.body).toContain("## B");
    expect(body.post.merged_from).toEqual(["a", "b"]);
    expect(patchPost).toHaveBeenCalledWith("a", expect.objectContaining({ status: "merged", merged_into: body.post.id }));
    expect(patchPost).toHaveBeenCalledWith("b", expect.objectContaining({ status: "merged", merged_into: body.post.id }));
    expect(putPost).toHaveBeenCalled();
  });

  it("ai path: uses Anthropic output for body", async () => {
    ok();
    vi.mocked(getPost).mockImplementation(async (id) => ({ id, title: id.toUpperCase(), body: `b${id}`, tags: [], status: "draft" } as never));
    createMock.mockResolvedValueOnce({ content: [{ type: "text", text: "woven body" }] });
    const res = await POST(
      new Request("http://x", {
        method: "POST",
        body: JSON.stringify({ sourceIds: ["a", "b"], composeMethod: "ai" }),
      }),
    );
    const body = await res.json();
    expect(body.post.body).toBe("woven body");
  });
});
