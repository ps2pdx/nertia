import { describe, it, expect } from "vitest";
import { PostSchema, STATUSES, type Post } from "@/lib/notepad";

describe("PostSchema", () => {
  it("accepts a minimal valid draft", () => {
    const post = {
      id: "abc-123",
      title: "Hello",
      body: "body",
      excerpt: "",
      tags: [],
      date: "2026-04-22",
      status: "draft",
      source: "manual",
      authored: false,
      created_at: 1_000,
      updated_at: 1_000,
    };
    expect(() => PostSchema.parse(post)).not.toThrow();
  });

  it("rejects invalid status", () => {
    const bad = { status: "bogus" } as unknown as Post;
    expect(() => PostSchema.parse(bad)).toThrow();
  });

  it("exposes all status values", () => {
    expect(STATUSES).toEqual(["draft", "ready", "published", "merged", "archived"]);
  });
});
