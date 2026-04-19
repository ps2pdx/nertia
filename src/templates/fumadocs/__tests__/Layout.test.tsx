import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Layout } from "../Layout";
import type { Site } from "@/templates/types";

const fullCopy: Record<string, string> = {
  "hero.badge": "the React.js docs framework you love.",
  "hero.headlinePart1": "Build excellent",
  "hero.headlineAccent": "documentations",
  "hero.headlinePart2": "your way.",
  "hero.primaryCtaLabel": "Get started",
  "hero.primaryCtaHref": "https://example.com/start",
  "hero.secondaryCtaLabel": "View on CodeSandbox",
  "hero.secondaryCtaHref": "https://example.com/sandbox",
  "features.heading": "Why teams pick it",
  "feature.1.title": "Composable",
  "feature.1.body": "Use the parts you need, nothing more.",
  "feature.2.title": "Search built in",
  "feature.2.body": "Algolia, Orama, or your own.",
  "feature.3.title": "MDX-first",
  "feature.3.body": "Pages are just markdown with components.",
};

const fullSite: Site = { slug: "docs", templateId: "fumadocs", copy: fullCopy };

describe("fumadocs Layout", () => {
  it("renders the badge pill", () => {
    render(<Layout site={fullSite} />);
    expect(screen.getByText(/the react\.js docs framework/i)).toBeInTheDocument();
  });

  it("renders the headline with accent + parts", () => {
    render(<Layout site={fullSite} />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent?.toLowerCase()).toContain("build excellent");
    expect(h1.textContent?.toLowerCase()).toContain("documentations");
    expect(h1.textContent?.toLowerCase()).toContain("your way");
  });

  it("renders the primary CTA as a link with href", () => {
    render(<Layout site={fullSite} />);
    const link = screen.getByRole("link", { name: /get started/i }) as HTMLAnchorElement;
    expect(link).toHaveAttribute("href", "https://example.com/start");
  });

  it("renders the secondary CTA when both label + href present", () => {
    render(<Layout site={fullSite} />);
    const link = screen.getByRole("link", { name: /view on codesandbox/i }) as HTMLAnchorElement;
    expect(link).toHaveAttribute("href", "https://example.com/sandbox");
  });

  it("renders the features section heading and each feature card", () => {
    render(<Layout site={fullSite} />);
    expect(screen.getByRole("heading", { name: /why teams pick it/i })).toBeInTheDocument();
    expect(screen.getByText(/^composable$/i)).toBeInTheDocument();
    expect(screen.getByText(/^search built in$/i)).toBeInTheDocument();
    expect(screen.getByText(/^mdx-first$/i)).toBeInTheDocument();
    expect(screen.getByText(/use the parts you need/i)).toBeInTheDocument();
  });

  it("defaults the features heading to 'Features' when not provided", () => {
    const { "features.heading": _h, ...restCopy } = fullCopy;
    render(<Layout site={{ ...fullSite, copy: restCopy }} />);
    expect(screen.getByRole("heading", { name: /^features$/i })).toBeInTheDocument();
  });

  it("omits feature cards with no title", () => {
    const copy = { ...fullCopy };
    delete copy["feature.2.title"];
    render(<Layout site={{ ...fullSite, copy }} />);
    expect(screen.queryByText(/^search built in$/i)).not.toBeInTheDocument();
    expect(screen.getByText(/^composable$/i)).toBeInTheDocument();
  });

  it("omits the entire features section when no features have titles", () => {
    const minimal: Site = {
      slug: "min",
      templateId: "fumadocs",
      copy: {
        "hero.badge": "x",
        "hero.headlinePart1": "Build",
        "hero.headlineAccent": "fast",
        "hero.primaryCtaLabel": "Go",
        "hero.primaryCtaHref": "/",
      },
    };
    render(<Layout site={minimal} />);
    expect(screen.queryByRole("heading", { name: /features/i })).not.toBeInTheDocument();
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
