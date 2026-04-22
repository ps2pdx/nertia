// src/app/api/admin/notepad/__tests__/list.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth-admin", () => ({ verifyAdminToken: vi.fn() }));
vi.mock("@/lib/notepad-admin", () => ({ listPosts: vi.fn() }));

import { GET } from "@/app/api/admin/notepad/list/route";
import { verifyAdminToken } from "@/lib/auth-admin";
import { listPosts } from "@/lib/notepad-admin";

const sampleDraft = { id: "a", title: "A", body: "", excerpt: "", tags: [], date: "2026-04-01", status: "draft", source: "manual", authored: false, created_at: 1, updated_at: 1 };
const samplePublished = { ...sampleDraft, id: "b", status: "published" };

function reqWith(auth = "Bearer tok", url = "http://x/api/admin/notepad/list") {
  return new Request(url, { headers: { authorization: auth } });
}

describe("GET /api/admin/notepad/list", () => {
  beforeEach(() => vi.clearAllMocks());

  it("401 without bearer token", async () => {
    vi.mocked(verifyAdminToken).mockResolvedValueOnce({ ok: false, status: 401, message: "x" });
    const res = await GET(reqWith(""));
    expect(res.status).toBe(401);
  });

  it("returns all posts when no filter", async () => {
    vi.mocked(verifyAdminToken).mockResolvedValueOnce({ ok: true, email: "ps2pdx@gmail.com" });
    vi.mocked(listPosts).mockResolvedValueOnce([sampleDraft, samplePublished] as never);
    const res = await GET(reqWith());
    const body = await res.json();
    expect(body.posts).toHaveLength(2);
  });

  it("filters by ?status=draft", async () => {
    vi.mocked(verifyAdminToken).mockResolvedValueOnce({ ok: true, email: "ps2pdx@gmail.com" });
    vi.mocked(listPosts).mockResolvedValueOnce([sampleDraft, samplePublished] as never);
    const res = await GET(reqWith("Bearer tok", "http://x/api/admin/notepad/list?status=draft"));
    const body = await res.json();
    expect(body.posts.map((p: { id: string }) => p.id)).toEqual(["a"]);
  });
});
