import type { Direction } from "@/directions/types";

export const direction: Direction = {
  name: "zero-point",
  displayName: "Zero-Point",
  tags: ["minimal", "scientific", "dark", "kinetic", "tech", "concept"],
  paletteConstraints: {
    mode: "dark",
    accentCount: 1,
    backgroundBias: "near-black",
    saturation: "muted-to-vivid-accent",
  },
  slotSchema: {
    hero: { eyebrow: true, headline: true, sub: true, cta: true },
    sections: { min: 0, max: 5, types: ["feature", "quote", "cta"] },
  },
  motion: { variant: "breath", intensity: "low-to-medium" },
  status: "stable",
};
