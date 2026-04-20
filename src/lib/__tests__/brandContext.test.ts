import { describe, it, expect } from "vitest";
import {
  encodeTheme,
  decodeTheme,
  themeToCssVars,
  type ThemeVariant,
} from "@/lib/brandContext";

const sample: ThemeVariant = {
  id: "v1",
  label: "void + warm accent",
  palette: {
    bg: "#0a0a0a",
    fg: "#f5f5f5",
    muted: "#6b6b6b",
    accent: "#ff9a4d",
    headingStart: "#ffffff",
    headingEnd: "#a0a0a0",
  },
  fontPair: { heading: "'Fraunces', serif", body: "'Inter', sans-serif" },
};

describe("brandContext codec", () => {
  it("round-trips a valid ThemeVariant", () => {
    const token = encodeTheme(sample);
    expect(token.length).toBeGreaterThan(0);
    expect(token).not.toMatch(/[+/=]/); // URL-safe
    const back = decodeTheme(token);
    expect(back).toEqual(sample);
  });

  it("decodeTheme returns null on garbage input", () => {
    expect(decodeTheme("totally-not-base64-!!!")).toBeNull();
  });

  it("decodeTheme returns null on a malformed object", () => {
    const token = Buffer.from(JSON.stringify({ wrong: "shape" }), "utf-8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    expect(decodeTheme(token)).toBeNull();
  });

  it("decodeTheme returns null when palette fields are missing", () => {
    const broken = {
      ...sample,
      palette: { bg: "#000", fg: "#fff", muted: "#888", accent: "#00f" },
    };
    const token = Buffer.from(JSON.stringify(broken), "utf-8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    expect(decodeTheme(token)).toBeNull();
  });

  it("themeToCssVars produces the expected CSS custom-property string", () => {
    const css = themeToCssVars(sample);
    expect(css).toContain("--hero-bg:#0a0a0a;");
    expect(css).toContain("--hero-fg:#f5f5f5;");
    expect(css).toContain("--hero-muted:#6b6b6b;");
    expect(css).toContain("--hero-accent:#ff9a4d;");
    expect(css).toContain("--hero-heading:#ffffff;");
    expect(css).toContain("--hero-heading-end:#a0a0a0;");
    expect(css).toContain("--hero-font-heading:'Fraunces', serif;");
    expect(css).toContain("--hero-font-body:'Inter', sans-serif;");
  });
});
