import { describe, it, expect, vi, beforeEach } from "vitest";

const refMock = {
  get: vi.fn(),
  set: vi.fn(),
  update: vi.fn(),
};
const dbMock = { ref: vi.fn(() => refMock) };

vi.mock("@/lib/firebaseAdmin", () => ({
  getAdminDb: () => dbMock,
}));

import { listPosts, getPost, putPost, patchPost } from "@/lib/notepad-admin";

describe("notepad-admin repository", () => {
  beforeEach(() => vi.clearAllMocks());

  it("listPosts returns sorted array by date desc", async () => {
    refMock.get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({
        a: { id: "a", title: "A", date: "2026-04-01", status: "draft", body: "", excerpt: "", tags: [], source: "manual", authored: false, created_at: 1, updated_at: 1 },
        b: { id: "b", title: "B", date: "2026-04-10", status: "draft", body: "", excerpt: "", tags: [], source: "manual", authored: false, created_at: 2, updated_at: 2 },
      }),
    });
    const out = await listPosts();
    expect(out.map((p) => p.id)).toEqual(["b", "a"]);
    expect(dbMock.ref).toHaveBeenCalledWith("notepad/posts");
  });

  it("getPost returns null when missing", async () => {
    refMock.get.mockResolvedValueOnce({ exists: () => false });
    expect(await getPost("nope")).toBeNull();
  });

  it("putPost writes to notepad/posts/{id}", async () => {
    const post = {
      id: "x", title: "X", body: "", excerpt: "", tags: [],
      date: "2026-04-22", status: "draft" as const,
      source: "manual" as const, authored: false,
      created_at: 1, updated_at: 1,
    };
    await putPost(post);
    expect(dbMock.ref).toHaveBeenCalledWith("notepad/posts/x");
    expect(refMock.set).toHaveBeenCalledWith(post);
  });

  it("patchPost bumps updated_at", async () => {
    const now = 123_456_789;
    vi.spyOn(Date, "now").mockReturnValue(now);
    await patchPost("x", { title: "New" });
    expect(refMock.update).toHaveBeenCalledWith({ title: "New", updated_at: now });
  });
});
