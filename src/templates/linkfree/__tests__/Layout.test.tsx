import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Layout } from "../Layout";
import type { Site } from "@/templates/types";

const fullCopy: Record<string, string> = {
  "profile.name": "Sam Rivera",
  "profile.tagline": "designer / dev",
  "profile.avatarInitials": "SR",
  "profile.bio": "Independent designer and engineer building small useful things.",
  "link.1.label": "Personal site",
  "link.1.href": "https://example.com",
  "link.2.label": "Newsletter",
  "link.2.href": "https://example.com/newsletter",
  "link.3.label": "Now playing",
  "link.3.href": "https://example.com/now",
};

const fullSite: Site = { slug: "sam", templateId: "linkfree", copy: fullCopy };

describe("linkfree Layout", () => {
  it("renders the name as an h1", () => {
    render(<Layout site={fullSite} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/sam rivera/i);
  });

  it("renders the tagline", () => {
    render(<Layout site={fullSite} />);
    expect(screen.getByText(/designer \/ dev/i)).toBeInTheDocument();
  });

  it("renders the avatar initials", () => {
    render(<Layout site={fullSite} />);
    expect(screen.getByLabelText(/avatar/i)).toHaveTextContent("SR");
  });

  it("renders the bio when present", () => {
    render(<Layout site={fullSite} />);
    expect(screen.getByText(/building small useful things/i)).toBeInTheDocument();
  });

  it("renders each provided link as a link element with href", () => {
    render(<Layout site={fullSite} />);
    const a1 = screen.getByRole("link", { name: /personal site/i }) as HTMLAnchorElement;
    expect(a1).toHaveAttribute("href", "https://example.com");
    const a2 = screen.getByRole("link", { name: /newsletter/i }) as HTMLAnchorElement;
    expect(a2).toHaveAttribute("href", "https://example.com/newsletter");
    const a3 = screen.getByRole("link", { name: /now playing/i }) as HTMLAnchorElement;
    expect(a3).toHaveAttribute("href", "https://example.com/now");
  });

  it("omits a link slot when label or href is missing", () => {
    const copy = { ...fullCopy };
    delete copy["link.2.label"];
    delete copy["link.2.href"];
    render(<Layout site={{ ...fullSite, copy }} />);
    expect(screen.queryByRole("link", { name: /newsletter/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /personal site/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /now playing/i })).toBeInTheDocument();
  });

  it("omits the bio paragraph when bio is absent", () => {
    const { "profile.bio": _b, ...restCopy } = fullCopy;
    render(<Layout site={{ ...fullSite, copy: restCopy }} />);
    expect(screen.queryByText(/building small useful things/i)).not.toBeInTheDocument();
  });

  it("degrades gracefully with only required fields", () => {
    const minimal: Site = {
      slug: "min",
      templateId: "linkfree",
      copy: {
        "profile.name": "Jamie",
        "profile.tagline": "hello",
        "profile.avatarInitials": "J",
      },
    };
    render(<Layout site={minimal} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/jamie/i);
    expect(screen.queryAllByRole("link").length).toBe(0);
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
