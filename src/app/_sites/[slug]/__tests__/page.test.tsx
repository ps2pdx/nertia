import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/lib/siteStore", () => ({
  getSite: vi.fn(async (slug: string) => {
    if (slug === "acme") {
      return {
        slug: "acme",
        direction: "zero-point",
        palette: { bg: "#0a0a0a", fg: "#f5f5f5", accent: "#00d4ff", muted: "#6b6b6b" },
        typography: { heading: "Inter Display", body: "Inter", scale: 1.25 },
        copy: {
          hero: { eyebrow: "ACME", headline: "We build.", sub: "Small.", cta: "Go" },
          sections: [],
        },
        motionConfig: { variant: "breath", intensity: "low", accent: "#00d4ff" },
        images: {},
        tier: "free",
      };
    }
    return null;
  }),
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

import Page from "@/app/_sites/[slug]/page";

describe("/_sites/[slug]/page", () => {
  it("renders the site for a known slug", async () => {
    const ui = await Page({ params: Promise.resolve({ slug: "acme" }) });
    render(ui);
    expect(screen.getByRole("heading", { name: /we build/i })).toBeInTheDocument();
  });

  it("404s for unknown slug", async () => {
    await expect(Page({ params: Promise.resolve({ slug: "nope" }) })).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
