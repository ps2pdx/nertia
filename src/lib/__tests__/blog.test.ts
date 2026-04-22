import { describe, it, expect, vi, beforeEach } from "vitest";

const getMock = vi.fn();
vi.mock("@/lib/firebaseAdmin", () => ({
  getAdminDb: () => ({ ref: () => ({ get: getMock }) }),
}));

import { getAllPosts, getPostBySlug } from "@/lib/blog";

describe("getAllPosts", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns only published posts, newest first", async () => {
    getMock.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({
        a: { id: "a", slug: "old", title: "Old", body: "", excerpt: "", tags: [], date: "2026-01-01", status: "published", source: "manual", authored: true, created_at: 1, updated_at: 1 },
        b: { id: "b", slug: "new", title: "New", body: "", excerpt: "", tags: [], date: "2026-03-01", status: "published", source: "manual", authored: true, created_at: 2, updated_at: 2 },
        c: { id: "c", slug: null, title: "Draft", body: "", excerpt: "", tags: [], date: "2026-02-01", status: "draft", source: "manual", authored: true, created_at: 3, updated_at: 3 },
      }),
    });
    const posts = await getAllPosts();
    expect(posts.map((p) => p.slug)).toEqual(["new", "old"]);
  });
});

describe("getPostBySlug", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns null when not found", async () => {
    getMock.mockResolvedValueOnce({ exists: () => false });
    expect(await getPostBySlug("nope")).toBeNull();
  });
});
