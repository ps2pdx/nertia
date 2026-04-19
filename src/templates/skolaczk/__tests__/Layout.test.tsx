import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Layout } from "../Layout";
import type { Site } from "@/templates/types";

const fullCopy: Record<string, string> = {
  "nav.brand": "acme",
  "hero.accent": "Acme",
  "hero.headline": "starter template",
  "hero.sub": "An opinionated minimal starting point for the next thing.",
  "hero.primaryCtaLabel": "Get started",
  "hero.primaryCtaHref": "https://example.com/start",
  "hero.secondaryCtaLabel": "GitHub",
  "hero.secondaryCtaHref": "https://github.com/acme",
};

const fullSite: Site = { slug: "acme", templateId: "skolaczk", copy: fullCopy };

describe("skolaczk Layout", () => {
  it("renders the brand in the nav", () => {
    render(<Layout site={fullSite} />);
    expect(screen.getByText(/^acme$/)).toBeInTheDocument();
  });

  it("renders the accent word inside the h1", () => {
    render(<Layout site={fullSite} />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent?.toLowerCase()).toContain("acme");
    expect(h1.textContent?.toLowerCase()).toContain("starter template");
  });

  it("renders the sub copy", () => {
    render(<Layout site={fullSite} />);
    expect(screen.getByText(/opinionated minimal starting point/i)).toBeInTheDocument();
  });

  it("renders the primary CTA as a link with the right href", () => {
    render(<Layout site={fullSite} />);
    const link = screen.getByRole("link", { name: /get started/i }) as HTMLAnchorElement;
    expect(link).toHaveAttribute("href", "https://example.com/start");
  });

  it("renders the secondary CTA when both label + href present", () => {
    render(<Layout site={fullSite} />);
    const link = screen.getByRole("link", { name: /github/i }) as HTMLAnchorElement;
    expect(link).toHaveAttribute("href", "https://github.com/acme");
  });

  it("omits the secondary CTA when label or href missing", () => {
    const copy = { ...fullCopy };
    delete copy["hero.secondaryCtaHref"];
    render(<Layout site={{ ...fullSite, copy }} />);
    expect(screen.queryByRole("link", { name: /github/i })).not.toBeInTheDocument();
  });

  it("degrades gracefully with only required fields", () => {
    const minimal: Site = {
      slug: "min",
      templateId: "skolaczk",
      copy: {
        "nav.brand": "x",
        "hero.accent": "Hello",
        "hero.headline": "world",
        "hero.sub": "Tiny.",
        "hero.primaryCtaLabel": "Go",
        "hero.primaryCtaHref": "/",
      },
    };
    render(<Layout site={minimal} />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /go/i })).toBeInTheDocument();
  });

  it("contains no founder/hire-me copy", () => {
    const { container } = render(<Layout site={fullSite} />);
    const text = (container.textContent ?? "").toLowerCase();
    for (const phrase of [
      "hire me",
      "built by scott",
      "available for",
      "my portfolio",
      "contact me for",
      "freelance",
      "consulting",
      "resume",
    ]) {
      expect(text).not.toContain(phrase);
    }
  });
});
