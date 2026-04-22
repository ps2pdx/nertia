import { describe, it, expect } from "vitest";
import { PostSchema, STATUSES, canTransition, concatCompose, mergeTags, type Post } from "@/lib/notepad";

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

describe("canTransition", () => {
  it("allows draft → ready", () => {
    expect(canTransition("draft", "ready")).toBe(true);
  });
  it("allows ready → published", () => {
    expect(canTransition("ready", "published")).toBe(true);
  });
  it("allows draft → published (skip ready)", () => {
    expect(canTransition("draft", "published")).toBe(true);
  });
  it("allows published → ready (unpublish)", () => {
    expect(canTransition("published", "ready")).toBe(true);
  });
  it("allows any → archived", () => {
    expect(canTransition("draft", "archived")).toBe(true);
    expect(canTransition("published", "archived")).toBe(true);
  });
  it("blocks merged → anything but archived", () => {
    expect(canTransition("merged", "draft")).toBe(false);
    expect(canTransition("merged", "archived")).toBe(true);
  });
});

describe("concatCompose", () => {
  it("joins bodies with h2 subheadings from source titles", () => {
    const sources = [
      { title: "First", body: "A body" },
      { title: "Second", body: "B body" },
    ];
    const out = concatCompose(sources);
    expect(out).toBe("## First\n\nA body\n\n## Second\n\nB body");
  });
  it("returns empty string for empty input", () => {
    expect(concatCompose([])).toBe("");
  });
});

describe("mergeTags", () => {
  it("dedupes case-insensitively, preserves first-seen casing", () => {
    const sources = [{ tags: ["Nertia", "product"] }, { tags: ["nertia", "gtm"] }];
    expect(mergeTags(sources)).toEqual(["Nertia", "product", "gtm"]);
  });
});
