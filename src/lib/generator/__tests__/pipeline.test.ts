import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/generator/pickDirection", () => ({
  pickDirection: vi.fn(async () => ({ direction: "zero-point", reason: "test" })),
}));
vi.mock("@/lib/generator/generatePalette", () => ({
  generatePalette: vi.fn(async () => ({
    bg: "#0a0a0a",
    fg: "#f5f5f5",
    accent: "#00d4ff",
    muted: "#6b6b6b",
  })),
}));
vi.mock("@/lib/generator/writeCopy", () => ({
  writeCopy: vi.fn(async () => ({
    hero: { eyebrow: "X", headline: "We build.", sub: "Small.", cta: "Go" },
    sections: [],
  })),
}));
vi.mock("@/lib/generator/paramMotion", () => ({
  paramMotion: vi.fn(async () => ({ variant: "breath", intensity: "low", accent: "#00d4ff" })),
}));

import { generate } from "@/lib/generator/pipeline";

describe("generate", () => {
  it("produces a full SiteConfig", async () => {
    const out = await generate({
      slug: "acme",
      businessName: "Acme",
      oneLiner: "We build things",
      audience: "devs",
      vibe: "quiet confident tech",
      tone: "quiet",
      tier: "free",
    });
    expect(out.slug).toBe("acme");
    expect(out.direction).toBe("zero-point");
    expect(out.palette.bg).toBe("#0a0a0a");
    expect(out.copy.hero.headline).toBe("We build.");
    expect(out.tier).toBe("free");
  });
});
