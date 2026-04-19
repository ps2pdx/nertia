import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Layout } from "../Layout";
import type { Site } from "@/templates/types";

const siteFixture: Site = {
  slug: "acme",
  templateId: "precedent",
  copy: {
    "hero.pill": "New · now in beta",
    "hero.headline": "Building blocks for your next idea",
    "hero.sub": "An opinionated starter for modern teams.",
    "hero.primaryCtaLabel": "Deploy",
    "hero.primaryCtaHref": "https://example.com/deploy",
    "hero.secondaryCtaLabel": "View on GitHub",
    "hero.secondaryCtaHref": "https://github.com/acme",
  },
};

describe("precedent Layout", () => {
  it("renders the headline as an h1", () => {
    render(<Layout site={siteFixture} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /building blocks/i,
    );
  });

  it("renders the optional pill when provided", () => {
    render(<Layout site={siteFixture} />);
    expect(screen.getByText(/now in beta/i)).toBeInTheDocument();
  });

  it("renders the sub copy", () => {
    render(<Layout site={siteFixture} />);
    expect(screen.getByText(/opinionated starter/i)).toBeInTheDocument();
  });

  it("renders primary CTA as a link with the correct href", () => {
    render(<Layout site={siteFixture} />);
    const link = screen.getByRole("link", { name: /deploy/i });
    expect(link).toHaveAttribute("href", "https://example.com/deploy");
  });

  it("renders optional secondary CTA when provided", () => {
    render(<Layout site={siteFixture} />);
    const link = screen.getByRole("link", { name: /view on github/i });
    expect(link).toHaveAttribute("href", "https://github.com/acme");
  });

  it("omits the pill when not provided", () => {
    const { "hero.pill": _, ...restCopy } = siteFixture.copy;
    const site: Site = { ...siteFixture, copy: restCopy };
    render(<Layout site={site} />);
    expect(screen.queryByText(/now in beta/i)).not.toBeInTheDocument();
  });

  it("omits the secondary CTA when not provided", () => {
    const copy = { ...siteFixture.copy };
    delete copy["hero.secondaryCtaLabel"];
    delete copy["hero.secondaryCtaHref"];
    const site: Site = { ...siteFixture, copy };
    render(<Layout site={site} />);
    expect(screen.queryByRole("link", { name: /view on github/i })).not.toBeInTheDocument();
  });

  it("degrades gracefully when only the headline is present", () => {
    const site: Site = {
      slug: "minimal",
      templateId: "precedent",
      copy: {
        "hero.headline": "Just a headline",
        "hero.primaryCtaLabel": "Start",
        "hero.primaryCtaHref": "/",
      },
    };
    render(<Layout site={site} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/just a headline/i);
  });
});
