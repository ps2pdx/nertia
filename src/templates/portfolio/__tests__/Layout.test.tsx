import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Layout } from "../Layout";
import type { Site } from "@/templates/types";

const siteFixture: Site = {
  slug: "jane",
  templateId: "portfolio",
  copy: {
    "hero.greeting": "Hi, I'm",
    "hero.name": "Jane",
    "hero.description": "Designer and developer based in Portland.",
    "hero.avatarInitials": "JH",
    "about.heading": "About",
    "about.body":
      "I make things that feel good — websites, brand identities, and the occasional animated loop. Based in Portland, available from April.",
  },
};

describe("portfolio Layout", () => {
  it("renders greeting and name in the hero", () => {
    render(<Layout site={siteFixture} />);
    expect(screen.getByText(/hi, i'm/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/jane/i);
  });

  it("renders hero description", () => {
    render(<Layout site={siteFixture} />);
    expect(screen.getByText(/designer and developer based in portland/i)).toBeInTheDocument();
  });

  it("renders avatar initials", () => {
    render(<Layout site={siteFixture} />);
    expect(screen.getByText("JH")).toBeInTheDocument();
  });

  it("renders about section heading", () => {
    render(<Layout site={siteFixture} />);
    expect(screen.getByRole("heading", { name: /about/i })).toBeInTheDocument();
  });

  it("renders about body", () => {
    render(<Layout site={siteFixture} />);
    expect(screen.getByText(/i make things that feel good/i)).toBeInTheDocument();
  });

  it("degrades gracefully when about is missing", () => {
    const minimal: Site = {
      slug: "bare",
      templateId: "portfolio",
      copy: {
        "hero.greeting": "Hi, I'm",
        "hero.name": "Min",
        "hero.description": "Short description.",
        "hero.avatarInitials": "M",
      },
    };
    render(<Layout site={minimal} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/min/i);
    expect(screen.queryByRole("heading", { name: /about/i })).not.toBeInTheDocument();
  });

  it("uses default about heading 'About' when not provided", () => {
    const copy = { ...siteFixture.copy };
    delete copy["about.heading"];
    const site: Site = { ...siteFixture, copy };
    render(<Layout site={site} />);
    expect(screen.getByRole("heading", { name: /^about$/i })).toBeInTheDocument();
  });
});
