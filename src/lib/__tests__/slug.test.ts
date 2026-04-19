import { describe, it, expect } from "vitest";
import { slugify, uniqueSlug } from "@/lib/slug";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Acme Corp")).toBe("acme-corp");
  });
  it("strips punctuation", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
  });
  it("collapses repeated separators", () => {
    expect(slugify("  foo   bar  ")).toBe("foo-bar");
  });
  it("returns a fallback for empty input", () => {
    expect(slugify("").length).toBeGreaterThan(0);
  });
  it("caps length at 40", () => {
    const long = "x".repeat(100);
    expect(slugify(long).length).toBeLessThanOrEqual(40);
  });
});

describe("uniqueSlug", () => {
  it("returns the base slug when free", async () => {
    const check = async (_s: string) => false;
    expect(await uniqueSlug("acme", check)).toBe("acme");
  });
  it("appends a short hash on collision", async () => {
    const taken = new Set(["acme"]);
    const check = async (s: string) => taken.has(s);
    const out = await uniqueSlug("acme", check);
    expect(out).not.toBe("acme");
    expect(out).toMatch(/^acme-[a-z0-9]{4,6}$/);
  });
});
