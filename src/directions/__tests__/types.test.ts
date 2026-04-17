import { describe, it, expect } from "vitest";
import { SiteConfigSchema, type SiteConfig, type Direction } from "@/directions/types";

describe("SiteConfigSchema", () => {
  it("accepts a minimal valid config", () => {
    const config: SiteConfig = {
      slug: "acme",
      direction: "zero-point",
      palette: { bg: "#0a0a0a", fg: "#f5f5f5", accent: "#00d4ff", muted: "#888" },
      typography: { heading: "Inter Display", body: "Inter", scale: 1.25 },
      copy: {
        hero: { eyebrow: "ACME", headline: "We build things.", sub: "Small and true.", cta: "Get in touch" },
        sections: [],
      },
      motionConfig: { variant: "breath", intensity: "low", accent: "#00d4ff" },
      images: {},
      tier: "free",
    };
    expect(() => SiteConfigSchema.parse(config)).not.toThrow();
  });

  it("rejects a config with no slug", () => {
    const bad = { direction: "zero-point" };
    expect(() => SiteConfigSchema.parse(bad)).toThrow();
  });

  it("rejects invalid hex in palette", () => {
    const bad = {
      slug: "x",
      direction: "zero-point",
      palette: { bg: "not-a-color", fg: "#fff", accent: "#f00", muted: "#888" },
      typography: { heading: "A", body: "B", scale: 1 },
      copy: { hero: { eyebrow: "", headline: "H", sub: "S", cta: "C" }, sections: [] },
      motionConfig: { variant: "breath", intensity: "low", accent: "#f00" },
      images: {},
      tier: "free",
    };
    expect(() => SiteConfigSchema.parse(bad)).toThrow();
  });
});

describe("Direction", () => {
  it("has the required metadata shape", () => {
    const d: Direction = {
      name: "zero-point",
      displayName: "Zero-Point",
      tags: ["minimal"],
      paletteConstraints: { mode: "dark", accentCount: 1, backgroundBias: "near-black", saturation: "muted-to-vivid-accent" },
      slotSchema: { hero: { eyebrow: true, headline: true, sub: true, cta: true }, sections: { min: 0, max: 5, types: ["feature", "quote", "cta"] } },
      motion: { variant: "breath", intensity: "low-to-medium" },
      status: "stable",
    };
    expect(d.name).toBe("zero-point");
  });
});
