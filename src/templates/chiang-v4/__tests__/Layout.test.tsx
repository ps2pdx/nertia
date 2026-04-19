import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Layout } from "../Layout";
import type { Site } from "@/templates/types";

const fullCopy: Record<string, string> = {
  "hero.eyebrow": "Hi, my name is",
  "hero.name": "Sam Rivera.",
  "hero.tagline": "I build things for the web.",
  "hero.bio":
    "I'm a software engineer specializing in building accessible, human-centered products. Currently focused on systems work for small teams.",
  "hero.ctaLabel": "Get in touch",
  "hero.ctaHref": "mailto:hello@example.com",
};

const fullSite: Site = { slug: "sam", templateId: "chiang-v4", copy: fullCopy };

describe("chiang-v4 Layout", () => {
  it("renders the eyebrow", () => {
    render(<Layout site={fullSite} />);
    expect(screen.getByText(/hi, my name is/i)).toBeInTheDocument();
  });

  it("renders the name as h1", () => {
    render(<Layout site={fullSite} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/sam rivera/i);
  });

  it("renders the tagline as h2", () => {
    render(<Layout site={fullSite} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/i build things for the web/i);
  });

  it("renders the bio paragraph", () => {
    render(<Layout site={fullSite} />);
    expect(screen.getByText(/accessible, human-centered/i)).toBeInTheDocument();
  });

  it("renders the CTA as a link with the correct href", () => {
    render(<Layout site={fullSite} />);
    const link = screen.getByRole("link", { name: /get in touch/i }) as HTMLAnchorElement;
    expect(link).toHaveAttribute("href", "mailto:hello@example.com");
  });

  it("uses the dark navy + teal palette inline (signature visual)", () => {
    const { container } = render(<Layout site={fullSite} />);
    const root = container.firstChild as HTMLElement;
    // jsdom normalizes hex to rgb(); #0a192f → rgb(10, 25, 47)
    expect(root.style.backgroundColor).toBe("rgb(10, 25, 47)");
  });

  it("degrades gracefully with only required fields", () => {
    const minimal: Site = {
      slug: "min",
      templateId: "chiang-v4",
      copy: {
        "hero.eyebrow": "Hi",
        "hero.name": "Pat",
        "hero.tagline": "I build software",
        "hero.bio": "Small bio.",
        "hero.ctaLabel": "Email",
        "hero.ctaHref": "mailto:x@y.z",
      },
    };
    render(<Layout site={minimal} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/pat/i);
    expect(screen.getByRole("link", { name: /email/i })).toBeInTheDocument();
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
