import { describe, it, expect } from "vitest";
import { humanize, containsBannedPhrase, BANNED_PHRASES } from "@/lib/humanize";

describe("humanize()", () => {
  it("replaces em-dashes with commas or periods", () => {
    const out = humanize("We build things — carefully.");
    expect(out).not.toContain("—");
  });

  it("replaces en-dashes with hyphens", () => {
    const out = humanize("2024–2025");
    expect(out).not.toContain("–");
    expect(out).toContain("-");
  });

  it("strips common AI tells", () => {
    const out = humanize("In today's fast-paced world, we deliver solutions that truly make a difference.");
    expect(out.toLowerCase()).not.toContain("in today's fast-paced world");
    expect(out.toLowerCase()).not.toContain("truly make a difference");
  });

  it("normalizes smart quotes to straight quotes", () => {
    const out = humanize("\u201chello\u201d and \u2018world\u2019");
    expect(out).toBe('"hello" and \'world\'');
  });

  it("does not mangle normal text", () => {
    const input = "We build websites for small businesses.";
    expect(humanize(input)).toBe(input);
  });
});

describe("containsBannedPhrase()", () => {
  it("detects a banned phrase", () => {
    expect(containsBannedPhrase("unlock the real power of AI")).toBe(true);
  });
  it("ignores clean copy", () => {
    expect(containsBannedPhrase("We build websites.")).toBe(false);
  });
  it("is case-insensitive", () => {
    expect(containsBannedPhrase("THE REAL POWER")).toBe(true);
  });
});

describe("BANNED_PHRASES", () => {
  it("includes the usual suspects", () => {
    const set = new Set(BANNED_PHRASES.map((p) => p.toLowerCase()));
    expect(set.has("the real power")).toBe(true);
    expect(set.has("in today's fast-paced world")).toBe(true);
    expect(set.has("game-changing")).toBe(true);
  });
});
