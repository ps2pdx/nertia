import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Layout } from "../Layout";
import type { Site } from "@/templates/types";

const fullCopy: Record<string, string> = {
  "hero.accentPrimary": "Acme",
  "hero.headline": "landing page for",
  "hero.accentSecondary": "small teams",
  "hero.headlineSuffix": "shipping fast",
  "hero.sub": "An opinionated marketing surface that adapts to your copy.",
  "hero.primaryCtaLabel": "Start free",
  "hero.primaryCtaHref": "https://example.com/start",
  "hero.secondaryCtaLabel": "View on GitHub",
  "hero.secondaryCtaHref": "https://github.com/acme",
};

const fullSite: Site = { slug: "acme", templateId: "shadcn-landing-page", copy: fullCopy };

describe("shadcn-landing-page Layout", () => {
  it("renders the primary accent word", () => {
    render(<Layout site={fullSite} />);
    expect(screen.getByText(/acme/i)).toBeInTheDocument();
  });

  it("renders the headline mid-text", () => {
    render(<Layout site={fullSite} />);
    expect(screen.getByText(/landing page for/i)).toBeInTheDocument();
  });

  it("renders the secondary accent word when provided", () => {
    render(<Layout site={fullSite} />);
    expect(screen.getByText(/small teams/i)).toBeInTheDocument();
  });

  it("renders the trailing headline suffix when provided", () => {
    render(<Layout site={fullSite} />);
    expect(screen.getByText(/shipping fast/i)).toBeInTheDocument();
  });

  it("renders the sub copy", () => {
    render(<Layout site={fullSite} />);
    expect(screen.getByText(/opinionated marketing surface/i)).toBeInTheDocument();
  });

  it("renders the primary CTA as a link with the correct href", () => {
    render(<Layout site={fullSite} />);
    const link = screen.getByRole("link", { name: /start free/i }) as HTMLAnchorElement;
    expect(link).toHaveAttribute("href", "https://example.com/start");
  });

  it("renders the secondary CTA when both label + href are present", () => {
    render(<Layout site={fullSite} />);
    const link = screen.getByRole("link", { name: /view on github/i }) as HTMLAnchorElement;
    expect(link).toHaveAttribute("href", "https://github.com/acme");
  });

  it("omits the secondary accent when not provided", () => {
    const { "hero.accentSecondary": _a, ...restCopy } = fullCopy;
    render(<Layout site={{ ...fullSite, copy: restCopy }} />);
    expect(screen.queryByText(/small teams/i)).not.toBeInTheDocument();
  });

  it("omits the headline suffix when not provided", () => {
    const { "hero.headlineSuffix": _s, ...restCopy } = fullCopy;
    render(<Layout site={{ ...fullSite, copy: restCopy }} />);
    expect(screen.queryByText(/shipping fast/i)).not.toBeInTheDocument();
  });

  it("omits the secondary CTA when label or href missing", () => {
    const copy = { ...fullCopy };
    delete copy["hero.secondaryCtaLabel"];
    delete copy["hero.secondaryCtaHref"];
    render(<Layout site={{ ...fullSite, copy }} />);
    expect(screen.queryByRole("link", { name: /view on github/i })).not.toBeInTheDocument();
  });

  it("degrades gracefully with minimal required copy only", () => {
    const minimal: Site = {
      slug: "min",
      templateId: "shadcn-landing-page",
      copy: {
        "hero.accentPrimary": "Just",
        "hero.headline": "the basics",
        "hero.sub": "Tiny.",
        "hero.primaryCtaLabel": "Go",
        "hero.primaryCtaHref": "/",
      },
    };
    render(<Layout site={minimal} />);
    expect(screen.getByText(/just/i)).toBeInTheDocument();
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
